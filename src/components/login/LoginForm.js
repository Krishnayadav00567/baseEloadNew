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
import _, { floor } from "lodash";
import { generatePath, Link, Redirect } from 'react-router-dom';
import { ajaxUtil, setHeaderUtil, saveCurrentStateUtil, setNotification, setModalPopupUtil, setLoadingUtil, isComplexTab } from '../home/Utils';
import { LOGIN_URL, FIRST_LOGIN_URL, VALIDATE_OTP_URL, ENCYPT_KEY } from '../../util/Constants';
import { clearErrorMsg } from '../../actions';
import { store } from '../..';
import LoginWithOtp from '../loginWithOtp/LoginWithOtp';
import { encryptAuth } from '../ajax/elements/util/Utils';
import ForgetPwd from '../forgetPwd/ForgetPwd';
import TextToImage from './TextToImage';
import { getCaptchaValue } from '../../util/Util';



export default function LoginForm(props) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState('');
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [frgtOrChangePswd, setFrgtOrChangePswd] = useState(false);
    const [serviceId, setServiceId] = useState();
    // const [name, setName] = useState()
    const [captcha, setCaptcha] = useState('');
    const [captchaTotal, setCaptchaTotal] = useState('');
    const [isUser, setIsUser] = useState(false)
    const [otpRequired, setOtpRequired] = useState(false)
    const [loginOtpRedirect, setLoginOtpRedirect] = useState(false)

    useEffect(() => {
        createCaptcha();
    }, [])

    useEffect(() => {
        if (!_.isEmpty(props.login.error) && props.login.resetOtp)
            createCaptcha();
    }, [props.login.error])
    const goBack = (saveMsg = false) => {
        setShowPass(false)
        setLoginOtpRedirect(false)
        setPassword("")
        setShow("")
        createCaptcha()
        if (!saveMsg)
            store.dispatch(clearErrorMsg());
    }
    const handlePassworChange = val => {
        val = val.replace(/\s/g, "")
        setError('');
        store.dispatch(clearErrorMsg());
        if (val && val.length > 0) {
            let str = '';
            const elem = document.getElementById('sampleChar');
            let value = password;
            for (var i = 0; i < val.length; i++) {
                // str += '*';
                // str += String.fromCharCode(parseInt('U+000B7', 16));
                str += elem.textContent;
                if (val.length < password.length) {
                    value = value.substring(0, val.length)
                } else if (i == val.length - 1) {
                    value += val[i];
                }

            }
            setShow(str);
            setPassword(isShow ? val : value);
        } else {
            setShow('');
            setPassword('');
        }
    };

    const height = useWindowHeight();
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (!userName) {
            setError("Please enter valid Username!");
            return false;
        }
        if (!password) {
            setError("Please enter password !");
            createCaptcha();
            return false;
        }
        /*  if (password.length < 5) {
             setError("Password must have at-least  5 Characters");
             return false;
         } */
        if (!captcha) {
            setError("Please enter captcha");
            createCaptcha()
            return false;
        }
        if (captcha != captchaTotal) {
            setError("Invalid Captcha");
            createCaptcha();
            return false;
        }
        setError('');
        if (!otpRequired) {
            props.onSubmit(userName, password, captcha, captchaTotal);
        } else
            validateLoginOtp(userName, password)
    };

    const validateLoginOtp = (userName, password) => {
        const req = {
            userName: userName,
            //password
            password: encryptAuth(password, ENCYPT_KEY),
            captcha,
            loginToken: encryptAuth(getCaptchaValue(userName, captchaTotal), ENCYPT_KEY)

        }
        ajaxUtil.sendRequest(LOGIN_URL, req, (response, hasError) => {
            if (!hasError)
                setLoginOtpRedirect(true)
            else {
                setError(response.responseMessage);
                createCaptcha()
            }
        }, setLoadingUtil, { method: 'POST', isShowSuccess: false, isLogout: false })
    }

    const formContainerRef = useRef(null);
    let formHeight = 414;
    useEffect(() => {
        if (props.text && props.text.text == "forgetpass") {
            validateAndSetUsername(props.text && props.text.USER_NAME, false)
            /* setShowPass(true)
            validateAndSetUsername(props.text && props.text.USER_NAME)
        }
        else{
            setShowPass(false) */
        }
        formHeight = formContainerRef.current.offsetHeight;
    }, []);
    const getErrorMsg = () => {
        if (error || props.message) {
            return (
                <div className={_.isEmpty(error) && _.isEmpty(props.login.error) ? 'successMsg_login' : 'errorMsg_login'}>
                    {error || props.message}
                </div>
            );
        }
    }
    const validateUser = (e) => {
        e.preventDefault();
        setError("");
        if (!userName) {
            setError("Please enter valid Username !");
            return false;
        }
        const req = {
            userName: userName
        }
        ajaxUtil.sendRequest(FIRST_LOGIN_URL, req, (response, hasError) => {
            console.log("FIRST LOGIN RESPONSE :", response);
            if (!hasError && response) {
                //NUSFID-41336
                if (response.firstTime) {//if first time login and operator user otp check will be false
                    if (response.user)
                        setOtpRequired(false)
                    else {
                        setOtpRequired(response.otpRequired)
                        setServiceId(102);
                        setFrgtOrChangePswd(true)
                    }
                } else {
                    setOtpRequired(response.otpRequired)
                }
                if (response.user) {
                    setIsUser(response.user)
                }
                setShowPass(true)

            }

            else if (response && response.responseMessage) {
                setError(response.responseMessage);
            } else {
                setError("Oops! Something went wrong Please try again ");
            }

        }, setLoadingUtil, { method: 'GET', isShowSuccess: false, isLogout: false });
    }

    const validateAndSetUsername = (val, isClearMsg = true) => {
        val = val.replace(/\s/g, "")
        var reg = /^[A-Za-z0-9&()_.-]{0,30}$/;
        if (isClearMsg)
            store.dispatch(clearErrorMsg());
        if (reg.test(val)) {
            setUserName(val)
            setError("")
        } else {
            setUserName("");
        }
    }

    const editUserName = () => {
        setShow("");
        setPassword("")
        setError("")
        setShowPass(false)
        createCaptcha();
        store.dispatch(clearErrorMsg());
    }
    const handleCaptchaChange = val => {
        setCaptcha(val);
    }

    const createCaptcha = () => {
        /* const num1=floor((1+Math.random())*10);
        const num2=floor((1+Math.random())*10);
        setCaptchaTotal(num1+num2);
        setShowCaptcha(`${num1} + ${num2}`);
        setCaptcha(); */
        const textCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const numerCharacters = "0123456789";
        const splCharacters = "!@#";
        let result = '';
        for (let i = 1; i < 6; i++) {
            if (i % 2 == 0)
                result += numerCharacters.charAt(Math.floor(Math.random() * numerCharacters.length));
            else
                result += textCharacters.charAt(Math.floor(Math.random() * textCharacters.length));

        }
        result += splCharacters.charAt(Math.floor(Math.random() * splCharacters.length));
        setCaptchaTotal(result.trim());
        setCaptcha("")
    }

    if (frgtOrChangePswd)
        // return <Redirect to={`/forgetPassword/${userName}/${serviceId}/${isUser}`} push />
        return (
            <ForgetPwd
                {...props}
                userName={userName}
                serviceId={serviceId}
                isUser={isUser}
                goBack={(e) => { goBack(e); setFrgtOrChangePswd(false) }}
                otpRequired={otpRequired}
            />
        )


    if (loginOtpRedirect)
        // return <Redirect to={{pathname: "/loginWithOtp" , state: {text: "login",userName:userName, serviceId: serviceId, password: password }}} />
        return (
            <LoginWithOtp
                {...props}
                userName={userName}
                serviceId={101}
                password={password}
                goBack={goBack}
                captchaTotal={captchaTotal}
                captcha={captcha}
            />
        )
    return (
        <Container fluid>
            <Row style={{ height: `${height}px` }}>
                <Col xs={6} lg={8} className="bg-secondary login-container"></Col>
                <Col xs={6} lg={4} className="primary-background right-panel">
                    <div>
                        <div>
                            <div className="logo-container position-relative" style={{ height: `${(height - formHeight) / 2}px` }}>
                                <img src={`${process.env.PUBLIC_URL}/images/logo/logoWhite.png`} alt="Smartfren" />
                            </div>
                            <div id="sampleChar" style={{ display: 'none' }}>&#183;</div>
                            {/* login form starts here */}
                            <div className="login-form-container bg-white" ref={formContainerRef} style={{ marginLeft: '-232.5px' }}>
                                <div className="login-form-header">
                                    <span className="fw-600">S&amp;D Management System</span>
                                </div>
                                <form onSubmit={showPass ? handleLoginSubmit : validateUser} className="login-form">
                                    {getErrorMsg()}
                                    <div style={{ color: '#495057', cursor: 'pointer' }}>
                                        <InputGroup style={{ borderBottom: !showPass ? "" : "none" }}>
                                            <Input onChange={!showPass ? (event) => validateAndSetUsername(event.target.value) : () => { }}
                                                className={`${!showPass ? "" : "login-form-input"}`} value={userName} autoComplete="off" style={{ caretColor: !showPass ? "" : "transparent", backgroundColor: !showPass ? "" : "#EBEBEB", paddingLeft: !showPass ? "" : "15px", marginTop: "5px" }}
                                                maxLength="30"
                                                name='login-form-username'
                                                id='login-form-username_id'
                                            />
                                            {!showPass ? "" : <InputGroupAddon addonType="append" style={{ lineHeight: '38px', backgroundColor: !showPass ? "" : "#EBEBEB", marginTop: "5px" }}><i className="fa fa-pencil" style={{ width: '21px' }} onClick={editUserName}></i></InputGroupAddon>}
                                            {!showPass ? <InputGroupAddon addonType="append" style={{ lineHeight: '38px', backgroundColor: !showPass ? "" : "#EBEBEB", marginTop: "5px", cursor: "default" }}><i className="fa fa-user-o" style={{ width: '21px' }} ></i></InputGroupAddon> : <></>}
                                            <span className="floating-label">Username</span>
                                        </InputGroup>
                                    </div>
                                    {showPass && <> <div style={{ color: '#495057', cursor: 'pointer' }}>
                                        <InputGroup>
                                            <Input onPaste={(e) => e.preventDefault()} style={{ fontWeight: 600 }} onChange={(event) => handlePassworChange(event.target.value)} value={isShow ? password : show} maxLength="30" //05-11-2021- changed pswd length on clients demand
                                                name='login-form-password'
                                                id='login-form-password_id'
                                            />
                                            <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }} onClick={() => setIsShow(!isShow)}><i className={`${isShow ? "fa fa-eye" : "fa fa-eye-slash"}`} style={{ width: '21px' }} ></i></InputGroupAddon>
                                            <span className="floating-label">Password</span>
                                        </InputGroup>
                                        {/* <InputGroup>
                                            <Input onPaste={(e)=>e.preventDefault()} style={{ fontWeight: 600 }} onChange={(event) => handleCaptchaChange(event.target.value)} value={captcha}  maxLength="20"/>
                                            <InputGroupAddon addonType="append" style={{ lineHeight: '38px'}} ><i className={`fa fa-refresh`} style={{ width: '21px' }} ></i></InputGroupAddon>
                                            <span className="floating-label">10+3=?</span>
                                        </InputGroup> */}
                                    </div>
                                        <div className="captcha-div" style={{ color: '#495057', cursor: 'pointer' }}>
                                            <i className={`fa fa-refresh`} style={{ width: '21px' }} onClick={createCaptcha}></i>
                                            <TextToImage key={captchaTotal} name={captchaTotal} x="3" y="18" />
                                            <span className="captcha-span-padding"></span>
                                            <span><Input id="captchaInputId" className="captcha-input" onPaste={(e) => e.preventDefault()} style={{ fontWeight: 600 }} onChange={(event) => handleCaptchaChange(event.target.value)} value={captcha || ''} maxLength="6"
                                                name='login-form-captcha'
                                            />
                                            </span>
                                        </div>
                                    </>}
                                    {
                                        props.isLoading
                                            ? <Button className="w-100 login-button primary-background" disabled>
                                                <i className="fa fa-spinner fa-spin"></i><span> authenticating...</span>
                                            </Button>
                                            : showPass ?
                                                <Button className="w-100 login-button c-pointer primary-background">Login</Button>
                                                :
                                                <Button className="w-100 login-button c-pointer primary-background" disabled={!userName ? true : null}>Next</Button>}
                                    <div className="login-form-footer row">
                                        {showPass && !props.isLoading && <>
                                            {/* <div className="d-flex justify-content-left col" style={{paddingBottom:"20px"}}>
                                                <a href="#" onClick={() => setShowPass(false)}>Login Page</a>
                                            </div> */}
                                            {!props.isLoading && <div className="d-flex justify-content-end col" >
                                                <p className="fgt-pass" onClick={() => {
                                                    setServiceId(103)
                                                    setFrgtOrChangePswd(true)
                                                }}>Forgot Password?</p>
                                            </div>}
                                        </>
                                        }
                                    </div>
                                </form>
                            </div>

                            <div className="logo-container position-relative footer-text" >
                                <span style={{ left: "20px" }}>Smartfren ©2021. All rights reserved</span>
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