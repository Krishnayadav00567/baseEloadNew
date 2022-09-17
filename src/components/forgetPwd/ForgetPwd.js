import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Row,
    Col,
    InputGroup,
    InputGroupAddon,
    Input,
    Button
} from 'reactstrap';
import _ from "lodash";
import { FORGET_PSWD_GET_OTP, FORGET_PSWD_VALIDATE_OTP, COUNTRY_CODE, FORGET_PSWD_URL, SET_PSWD_URL, ENCYPT_KEY } from '../../util/Constants';
import { ajaxUtil, setHeaderUtil, saveCurrentStateUtil, setNotification, setModalPopupUtil, setLoadingUtil, isComplexTab } from '../home/Utils';
import { setLoading, logOut } from '../../actions';
import { store } from '../../index';
import { Redirect, useParams } from 'react-router-dom';
import { encryptAuth } from '../ajax/elements/util/Utils';
let webNotTimer;
var id2;
export default function ForgetPwd(props) {
    const { userName: USER_NAME, serviceId, isUser, otpRequired } = props;
    const [msisdn, setMsisdn] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isOtpPage, setIsOtpPage] = useState(false);
    const [isresendOtp, setIsresendOtp] = useState(false);
    const [message, setMessage] = useState("");
    const [loadLoginPage, setLoadLoginPage] = useState(false);
    // const { userName: USER_NAME, serviceId, isUser } = useParams();
    const [isShow, setIsShow] = useState({ password: false, newPass: false, confPass: false });
    const [confPassShow, setConfPassShow] = useState('');
    const [newPassShow, setNewPassShow] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordPage, setPaswordPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');
    const [isOTPbtnDisabled, setIsOTPbtnDisabled] = useState(false)
    const [user, setUser] = useState(false)
    const [showPrefix, setShowPrefix] = useState(false)
    const [expiryTime, setExpiryTime] = useState("")
    const [timer, setTimer] = useState("")

    /* useEffect(() => {//OTP required in forgot password and FirstPassword
        console.log("otpRequired :", otpRequired);
        if (otpRequired == false) {
            console.log("otpRequired 1:", otpRequired);

            setPaswordPage(true)
        }
    }, [otpRequired]) */

    useEffect(() => {
        if (isUser == 'true') {
            setUser(true)
        }
    }, [user]);

    useEffect(() => {
        return () => {
            if (webNotTimer) clearInterval(webNotTimer);
        };
    }, []);
    console.log("passwordPage :", passwordPage);
    // function showResendOtp(rsntOtpSec) {
    //     setTimeout(function () {
    //         setIsresendOtp(true);
    //     }, rsntOtpSec)
    // };

    // function resendOTPfn(rsntOtpSec) {
    // 	var id1;
    // 	var count = rsntOtpSec; 
    // 	id1 = setInterval(function() {
    // 		count--;
    // 		if(count < 0){
    // 			clearInterval(id1);
    // 			setExpiryTime("")
    // 		}else{
    // 			setExpiryTime("Resend OTP? Try again after "+ count + " seconds.")
    // 		}
    // 	},1000);
    // }
    function showResendOtp() {
        webNotTimer = setTimeout(function () {
            setIsresendOtp(true);
        }, 10000);
    }
    function startTimer(duration) {
        var timer = duration, minutes, seconds;
        // setRandom(Math.floor(100000000000 + Math.random() * 900000000000));
        id2 = setInterval(function () {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            setTimer("Your OTP will expire in " + minutes + ":" + seconds);

            if (--timer < 0) {
                clearInterval(id2);
                setTimer("");
            }
        }, 1000);
    }
    const height = useWindowHeight();
    const handleMsisdn = (msisdn) => {
        msisdn = msisdn.replace(/\s/g, "")
        var reg = /^[0-9]{10,15}$/;
        if (!reg.test(msisdn)) {
            setError("Please enter valid number !");
            setIsOTPbtnDisabled(true)
        }
        else {
            setError("")
            if (msisdn.length >= 10) setIsOTPbtnDisabled(false)
        }
        setMsisdn(msisdn);
    }
    const handleGetOtp = (e) => {
        e.preventDefault();

        if (!USER_NAME) {
            setError("Please Enter Username !");
            return false;
        }
        // if (!msisdn) {
        //     setError("Please enter valid number !");
        //     return false;
        // }

        // if (!reg.test(msisdn)) {
        //     setError("Please enter a valid Mobile Number of length 8 digits.");
        //     return false;
        // }
        resendOtp("getotp");
    };

    const handleSubmitOtp = (e) => {
        setMessage('');
        e.preventDefault();
        if (!USER_NAME) {
            setError("Please Enter Username !");
            return false;
        }
        if (!otp) {
            setError("Please Enter OTP !");
            return false;
        }
        setError('');
        const req = {
            "otp": otp,
            serviceId,
            "userId": USER_NAME
        };

        setIsLoading(true);
        ajaxUtil.sendRequest(FORGET_PSWD_VALIDATE_OTP, req, (response, hasError) => {
            setIsLoading(false);
            if (!hasError) {
                setPaswordPage(true);
                setToken(response.validationToken)
            } else if (response && response.responseMessage) {
                setError(response.responseMessage);
            } else {
                setError("Oops! Something went wrong Please try again ");
            }
        }, setLoadingUtil, { isShowSuccess: false });
    };

    const resendOtp = (fromresend = "resend") => {
        if (id2) clearInterval(id2);
        setError('');
        setIsresendOtp(false);
        const req = {
            //"receiverUserId": USER_NAME,
            // "senderMsisdn": msisdn,
            //"senderUserId": USER_NAME,
            serviceId,
            //"validatorUserId": USER_NAME,
            userId: USER_NAME
        }

        setIsLoading(true);
        ajaxUtil.sendRequest(FORGET_PSWD_GET_OTP, req, (response, hasError) => {
            setIsLoading(false)
            if (!hasError) {
                setIsOtpPage(true);
                // showResendOtp((response.expiryMinutes)*1000);
                // resendOTPfn(response.expiryMinutes)
                showResendOtp()
                startTimer((response.expiryMinutes) * 60)
                if (fromresend === "getotp")
                    setMessage("OTP send to your MDN/EMAIL:" + msisdn);
                else
                    // setMessage("OTP has Resend to your msisdn:" + msisdn);
                    setMessage("An OTP has been sent to your registered number")
            } else if (response && response.responseMessage) {
                setError(response.responseMessage);
            } else {
                setError("Oops! Something went wrong Please try again ");
            }
        }, setLoadingUtil, { isShowSuccess: false });
    }
    const handlePassworChange = (name, val) => {
        if (name === "confPass") {
            if (val && val.length > 0) {
                let str = '';
                const elem = document.getElementById('sampleChar');
                let value = confirmPassword;
                for (var i = 0; i < val.length; i++) {
                    // str += '*';
                    // str += String.fromCharCode(parseInt('U+000B7', 16));
                    str += elem.textContent;
                    if (val.length < confirmPassword.length) {
                        value = value.substring(0, val.length)
                    } else if (i == val.length - 1) {
                        value += val[i];
                    }

                }
                setConfPassShow(str);
                setConfirmPassword(isShow.confPass ? val : value);
            } else {
                setConfPassShow('');
                setConfirmPassword('');
            }
        }
        if (name === "newPass") {
            if (val && val.length > 0) {
                let str = '';
                const elem = document.getElementById('sampleChar');
                let value = newPassword;
                for (var i = 0; i < val.length; i++) {
                    // str += '*';
                    // str += String.fromCharCode(parseInt('U+000B7', 16));
                    str += elem.textContent;
                    if (val.length < newPassword.length) {
                        value = value.substring(0, val.length)
                    } else if (i == val.length - 1) {
                        value += val[i];
                    }

                }
                setNewPassShow(str);
                setNewPassword(isShow.newPass ? val : value);
            } else {
                setNewPassShow('');
                setNewPassword('');
            }
        }
    }
    function setShow(name) {
        const isShowTmp = { ...isShow };
        if (name === "newPass") {
            isShowTmp.newPass = !isShowTmp.newPass;
        }
        if (name === "confPass") {
            isShowTmp.confPass = !isShowTmp.confPass;
        }
        setIsShow(isShowTmp);
    }

    const handleSavePass = (e) => {
        e.preventDefault();
        if (!newPassword) {
            setError("Please enter your password !");
            return false;
        }
        if (!confirmPassword) {
            setError("Please enter confirm password !");
            return false;
        }
        if (newPassword.length < 5) {
            setError("Password must have at-least  5 Characters");
            return false;
        }
        if (confirmPassword != newPassword) {
            setError("Password and Confirm password must be same !");
            return false;
        }
        setError("");
        const req = {
            //password: newPassword,
            password: encryptAuth(newPassword, ENCYPT_KEY),
            userName: USER_NAME,
            otp,
            validationToken: token,

        }
        const URL = serviceId == 102 ? SET_PSWD_URL : FORGET_PSWD_URL;
        setIsLoading(true);
        ajaxUtil.sendRequest(URL, req, (response, hasError) => {
            setIsLoading(false);
            if (!hasError) {
                store.dispatch(logOut(response?.responseMessage || "Password Reset Successfullly"));
                //setLoadLoginPage(true);
                props.goBack(true);
            } else if (response && response.responseMessage) {
                setError(response.responseMessage);
            } else {
                setError("Oops! Something went wrong Please try again ");
            }
        }, setLoadingUtil, { isShowSuccess: false });
    }

    const formContainerRef = useRef(null);
    let formHeight = 414;
    useEffect(() => {
        formHeight = formContainerRef.current.offsetHeight;
    }, []);
    const getErrorMsg = () => {
        if (error || message) {
            return (
                <div className={_.isEmpty(error) ? 'successMsg_login' : 'errorMsg_login'}>
                    {error || message}
                </div>
            );
        }
    }

    const enterOTP = (val) => {
        val = val.replace(/\s/g, "")
        var reg = /^[0-9]{0,20}$/;
        if (reg.test(val)) {
            setOtp(val)
        }

    }

    const setPrefix = () => {
        if (!showPrefix)
            setShowPrefix(true)
    }

    // if (loadLoginPage)
    //     return <Redirect to={{ pathname: "/login", state: { text: "forgetpass", USER_NAME: USER_NAME, serviceId: serviceId } }} />
    // else
    return (
        <Container fluid>
            <Row>
                <Col xs={6} lg={8} style={{ height: `${height}px` }} className="bg-secondary login-container"></Col>
                <Col xs={6} lg={4} className="primary-background">
                    <div>
                        <div>
                            <div className="logo-container position-relative" style={{ height: `${(height - formHeight) / 2}px` }}>
                                <img src={`${process.env.PUBLIC_URL}/images/logo/logoWhite.png`} alt="Smartfren" />
                            </div>
                            <div id="sampleChar" style={{ display: 'none' }}>&#183;</div>
                            {/* login form starts here */}
                            <div className="login-form-container bg-white" ref={formContainerRef} style={{ marginLeft: '-232.5px' }}>
                                <div className="login-form-header forgetPassHeader">
                                    <i class="fa fa-arrow-left" onClick={props.goBack} style={{ cursor: "pointer" }}></i>&nbsp; &nbsp;<span className="fw-600">{serviceId == 102 ? 'Set Password' : 'Forgot password'}</span>
                                </div>
                                <form className="login-form">
                                    {getErrorMsg()}
                                    {
                                        !passwordPage ?
                                            <>
                                                <div style={{ color: '#495057', cursor: 'pointer' }}>
                                                    <InputGroup>
                                                        <Input className="login-form-input" style={{ fontWeight: 600, background: '#EBEBEB', paddingLeft: "15px", caretColor: "transparent", marginTop: "5px" }}
                                                            value={USER_NAME} autoComplete="new-username"
                                                        />
                                                        <InputGroupAddon addonType="append" style={{ lineHeight: '38px', background: '#EBEBEB', marginTop: "5px", cursor: "default" }}><i className="fa fa-user-o" style={{ width: '21px' }} ></i></InputGroupAddon>
                                                        <span className="floating-label">Username</span>
                                                    </InputGroup>
                                                </div>
                                                {isOtpPage ?
                                                    <>
                                                        <div className="pt-1" style={{ color: '#495057', cursor: 'pointer' }}>
                                                            <InputGroup>
                                                                <Input style={{ fontWeight: 600 }} onChange={(event) => enterOTP(event.target.value)} value={otp} maxLength="6" />
                                                                <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }} ></InputGroupAddon>
                                                                <span className="floating-label">OTP</span>
                                                            </InputGroup>
                                                            <p className="mb-2" style={{ color: 'gray' }}>{timer}</p>
                                                        </div>
                                                        <div className="login-form-footer row">
                                                            <div className="d-flex justify-content-center col" style={{ paddingBottom: "20px" }}>
                                                                {!passwordPage && isOtpPage && isresendOtp ? <span style={{ paddingLeft: '20px', textDecoration: 'underline', cursor: 'pointer', color: '#33495F' }}
                                                                    onClick={resendOtp}>Resend OTP</span>
                                                                    // :expiryTime? <span className="otpExpiryTime mt-1">{expiryTime}</span>
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </>
                                                    : <div className="pt-1" style={{ color: '#495057', cursor: 'pointer' }}>
                                                        {/* <InputGroup>
                                                                {showPrefix ? <span className="input-group-addon" style={{ zIndex: 1, fontSize: '13px' }}>{COUNTRY_CODE}</span> : ''}
                                                                <Input maxLength={15} style={{ fontWeight: 600 }} onChange={(event) => handleMsisdn(event.target.value)} value={msisdn} onClick={() => setPrefix()} />
                                                                <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }} ></InputGroupAddon>
                                                                <span className="floating-label">Smartfren Number</span>
                                                            </InputGroup> */}
                                                        <div style={{ fontSize: '12px', display: 'block', textAlign: 'center', marginBottom: '10px' }}>By clicking on Send OTP button, you will get otp to the registered MDN and Email.</div>
                                                    </div>
                                                }

                                                {
                                                    isLoading
                                                        ? <Button className="w-100 login-button primary-background" disabled>
                                                            <i className="fa fa-spinner fa-spin"></i><span> authenticating...</span>
                                                        </Button>
                                                        // : isOtpPage && !user ?
                                                        : isOtpPage ?
                                                            <Button className="w-100 login-button c-pointer primary-background" onClick={handleSubmitOtp}>Submit</Button>
                                                            : <Button className="w-100 login-button c-pointer primary-background" disabled={isOTPbtnDisabled} onClick={handleGetOtp}>Send OTP</Button>
                                                    // : user ? '' : <Button className="w-100 login-button c-pointer primary-background" disabled={isOTPbtnDisabled} onClick={handleGetOtp}>Send OTP</Button>

                                                }
                                            </>
                                            : <>
                                                <div style={{ color: '#495057', cursor: 'pointer' }}>
                                                    <InputGroup>
                                                        {/* 05-11-2021- changed pswd length on clients demand */}
                                                        <Input maxLength={30} onChange={(event) => handlePassworChange("newPass", event.target.value)}
                                                            value={isShow.newPass ? newPassword : newPassShow}
                                                        />
                                                        <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }}><i className="fa fa-eye" style={{ width: '21px' }} onClick={() => setShow("newPass")}></i></InputGroupAddon>
                                                        <span className="floating-label">Password</span>
                                                    </InputGroup>
                                                </div>
                                                <div style={{ color: '#495057', cursor: 'pointer' }}>
                                                    <InputGroup>
                                                        <Input maxLength={30} onChange={(event) => handlePassworChange("confPass", event.target.value)}
                                                            value={isShow.confPass ? confirmPassword : confPassShow}
                                                        />
                                                        <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }}><i className="fa fa-eye" style={{ width: '21px' }} onClick={() => setShow("confPass")}></i></InputGroupAddon>
                                                        <span className="floating-label">Confirm Password</span>
                                                    </InputGroup>
                                                </div>

                                                {
                                                    isLoading
                                                        ? <Button className="w-100 login-button primary-background" disabled>
                                                            <i className="fa fa-spinner fa-spin"></i><span> authenticating...</span>
                                                        </Button>
                                                        :
                                                        <Button className="w-100 login-button c-pointer primary-background" onClick={handleSavePass}>Save Password</Button>
                                                }
                                            </>
                                    }

                                </form>
                            </div>

                            <div className="logo-container position-relative footer-text">
                                <span style={{ left: "20px" }}>Smartfren ©2021. All Rights Reserved</span>
                            </div>

                        </div>
                    </div>
                </Col>
            </Row>

        </Container>
    )
}


function useWindowHeight() {
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return height;
}
