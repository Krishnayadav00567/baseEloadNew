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
import { LOGIN_WITH_OTP, FORGET_PSWD_GET_OTP } from '../../util/Constants';
import { ajaxUtil, setLoadingUtil } from '../home/Utils';
import { store } from '../../index';
import { clearErrorMsg } from '../../actions';
let webNotTimer;
var id2;
export default function LoginWithOtp(props) {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isresendOtp, setIsresendOtp] = useState(false);
    const [message, setMessage] = useState("");
    const [loadLoginPage, setLoadLoginPage] = useState(false);
    // const { userName: userName, serviceId, password } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');
    const [isOTPbtnDisabled, setIsOTPbtnDisabled] = useState(true)
    const [user, setUser] = useState(false)
    const [expiryTime,setExpiryTime] = useState("")
    const [timer,setTimer] = useState("")
    
    useEffect(() => {
        showResendOtp()
    }, []);

    useEffect(() => {
        return () => {
			if (webNotTimer) clearInterval(webNotTimer);
        };
        
    }, []);
    useEffect(() => {
        
        formHeight = formContainerRef.current.offsetHeight;
    }, []);

    function showResendOtp() {
		webNotTimer = setTimeout(function () {
			setIsresendOtp(true);
		}, 10000);
	}
	function startTimer(duration) {
		var timer = duration, minutes, seconds;
		// setRandom(Math.floor(100000000000 + Math.random() * 900000000000));
		id2=setInterval(function () {
			minutes = parseInt(timer / 60, 10)
			seconds = parseInt(timer % 60, 10);
	
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
	
			setTimer("Your OTP will expire in " +minutes + ":" + seconds);
	
			if (--timer < 0) {
				clearInterval(id2);
				setTimer("");
			}
		}, 1000);
	}
    const height = useWindowHeight();
    
    // const handleSubmitOtp = (e) => {
    //     setMessage('');
    //     e.preventDefault();
    //     if (!USER_NAME) {
    //         setError("Please Enter Username !");
    //         return false;
    //     }
    //     if (!otp) {
    //         setError("Please Enter OTP !");
    //         return false;
    //     }
    //     setError('');
    //     const req = {
    //         "otp": otp,
    //         serviceId,
    //         "userId": USER_NAME
    //     };

    //     setIsLoading(true);
    //     ajaxUtil.sendRequest(LOGIN_WITH_OTP, req, (response, hasError) => {
    //         setIsLoading(false);
    //         if (!hasError) {
    //             setToken(response.validationToken)
    //         } else if (response && response.responseMessage) {
    //             setError(response.responseMessage);
    //         } else {
    //             setError("Oops! Something went wrong Please try again ");
    //         }
    //     }, setLoadingUtil, { isShowSuccess: false });
    // };

    const resendOtp = (fromresend = "resend") => {
        if(id2) clearInterval(id2);
        setError('');
        setIsresendOtp(false);
        const req = {
            //"receiverUserId": props.userName,
            // "senderMsisdn": msisdn,
            //"senderUserId": props.userName,
            "serviceId" :  props.serviceId,
            //"validatorUserId": props.userName,
            "userId":props.userName
        }
        setIsLoading(true);
        ajaxUtil.sendRequest(FORGET_PSWD_GET_OTP, req, (response, hasError) => {
            setIsLoading(false)
            if (!hasError) {
                // showResendOtp((response.expiryMinutes)*1000);
				// resendOTPfn(response.expiryMinutes)
                showResendOtp()
                startTimer((response.expiryMinutes)*60)
                if (fromresend === "getotp")
                    setMessage("OTP send to your MDN/EMAIL");
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
    
   const loginotp = (e) => {
        e.preventDefault();
        if (!otp) {
                setError("Please Enter OTP !");
                return false;
            }

        props.logInWithOtp(props.userName, props.password,otp,props.captcha,props.captchaTotal)
    }

    const getErrorMsg = () => {
        if (error || props.message) {
            return (
                <div className={_.isEmpty(error) && _.isEmpty(props.login.error) ? 'successMsg_login' : 'errorMsg_login'}>
                    {error || props.message}
                </div>
            );
        }
    }
    const formContainerRef = useRef(null);
    let formHeight = 414;
    useEffect(() => {
        formHeight = formContainerRef.current.offsetHeight;
    }, []);
    

    const enterOTP = (val) => {
        val = val.replace(/\s/g, "")
        var reg = /^[0-9]{0,20}$/;
        store.dispatch(clearErrorMsg());
        if (reg.test(val)) {
            setOtp(val)
        }
    }
    // if (loadLoginPage)
    //     return <Redirect to={{ pathname: "/login", state: { USER_NAME: props.userName } }} />
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
                                        <i className="fa fa-arrow-left" onClick={props.goBack} style={{ cursor: "pointer" }}></i>&nbsp; &nbsp;<span className="fw-600">Login</span>
                                    </div>
                                    <form className="login-form" onSubmit={loginotp} autoComplete="off">
                                        {getErrorMsg()}
                                        <div style={{ color: '#495057', cursor: 'pointer' }}>
                                            <InputGroup>
                                                <Input className="login-form-input" style={{ fontWeight: 600, background: '#EBEBEB', paddingLeft: "15px", caretColor: "transparent", marginTop: "5px" }}
                                                    value={props.userName} autoComplete="off"   name='login-pass-form-username'
                                                    id='login-pass-form-username_id' onChange={()=>{}}
                                                />
                                                <InputGroupAddon addonType="append" style={{ lineHeight: '38px', background: '#EBEBEB', marginTop: "5px", cursor: "default" }}><i className="fa fa-user-o" style={{ width: '21px' }} ></i></InputGroupAddon>
                                                <span className="floating-label">Username</span>
                                            </InputGroup>
                                        </div>
                                                        
                                        <div className="pt-1" style={{ color: '#495057', cursor: 'pointer' }}>
                                            <InputGroup>
                                                <Input style={{ fontWeight: 600 }} onChange={(event) => enterOTP(event.target.value)} value={otp} maxLength="6" 
                                                name='login-pass-form-otp'
                                                id='login-pass-form-otp_id'
                                                />
                                                <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }} ></InputGroupAddon>
                                                <span className="floating-label">OTP</span>
                                            </InputGroup>
                                            <p className="mb-2" style={{ color: 'gray'}}>{timer}</p>
                                        </div>
                                        <div className="login-form-footer row">
                                            <div className="d-flex justify-content-center col" style={{ paddingBottom: "20px" }}>
                                                { isresendOtp ?<span style={{ paddingLeft: '20px', textDecoration: 'underline', cursor: 'pointer', color: '#33495F' }}
                                                    onClick={resendOtp}>Resend OTP</span> 
                                                    // :expiryTime? <span className="otpExpiryTime mt-1">{expiryTime}</span>
                                                   :"" }
                                            </div>
                                        </div>
                                                        
                                                        
                                        {
                                            props.isLoading||isLoading
                                                ? <Button className="w-100 login-button primary-background" disabled>
                                                    <i className="fa fa-spinner fa-spin"></i><span> authenticating...</span>
                                                </Button>
                                                :
                                                <Button className="w-100 login-button c-pointer primary-background" >Submit</Button>
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
// function mapStateToProps({ loader }) {
//     return { isLoading: loader.isLoading };
// }
// export default connect(mapStateToProps, { setLoading, logInWithOtp })(LoginWithOtp);
