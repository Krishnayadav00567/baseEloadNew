import React, { Component, useState, useEffect } from "react";
import { Row, Col, InputGroup, InputGroupAddon, Input, Button } from "reactstrap";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import { CHANGE_PSWD_GET_OTP, FORGET_PSWD_VALIDATE_OTP, CHANGE_PSWD_URL, COUNTRY_CODE, ENCYPT_KEY } from '../../util/Constants';
import { ajaxUtil, setHeaderUtil, saveCurrentStateUtil, setNotification, setModalPopupUtil, setLoadingUtil, isComplexTab } from '../home/Utils';
import { setLoading, logOut } from '../../actions';
import { store } from '../../index';
import { encryptAuth } from "../ajax/elements/util/Utils";
import uuidv4 from 'uuid/v4';
import moment from 'moment';
let webNotTimer;
var id2;
function ChangePswd(props) {
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passShow, setPassShow] = useState('');
  const [confPassShow, setConfPassShow] = useState('');
  const [newPassShow, setNewPassShow] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isShow, setIsShow] = useState({ password: false, newPass: false, confPass: false });

  // OTP Imports start
  const [msisdn, setMsisdn] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpPage, setIsOtpPage] = useState(false);
  const [isresendOtp, setIsresendOtp] = useState(false);
  const [message, setMessage] = useState("");
  const [loadLoginPage, setLoadLoginPage] = useState(false);
  const [passwordPage, setPaswordPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationToken, setValidationToken] = useState(false);
  const [expiryTime, setExpiryTime] = useState("")
  const [timer, setTimer] = useState("")

  //OTP Import ends

  useEffect(() => {
    const userId = props.login.userDetails.userId;
    return () => {
      if (webNotTimer) clearInterval(webNotTimer);
    };
  }, [])
  const handlePassworChange = (name, val) => {
    if (name === "password") {
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
        setPassShow(str);
        setPassword(value);
      } else {
        setPassShow('');
        setPassword('');
      }
    }
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
        setConfirmPassword(value);
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
        setNewPassword(value);
      } else {
        setNewPassShow('');
        setNewPassword('');
      }
    }
  }

  function setShow(name) {
    const isShowTmp = { ...isShow };
    if (name === "password") {
      isShowTmp.password = !isShowTmp.password;
    }
    if (name === "newPass") {
      isShowTmp.newPass = !isShowTmp.newPass;
    }
    if (name === "confPass") {
      isShowTmp.confPass = !isShowTmp.confPass;
    }
    setIsShow(isShowTmp);
  }
  const getErrorMsg = () => {
    if (error || message) {
      return (
        <div className={_.isEmpty(error) ? 'successMsg_login' : 'errorMsg_login'}>
          {error || message}
        </div>
      );
    }
  }

  const onSubmitClick = (e) => {
    e.preventDefault();
    // if (!password) {
    //   setError("Please enter your current password !");
    //   return false;
    // }
    if (!newPassword) {
      setError("Please enter your new password !");
      return false;
    }
    if (!confirmPassword) {
      setError("Please confirm your new password !");
      return false;
    }
    if (confirmPassword != newPassword) {
      setError("New Password and Confirm password must be same !");
      return false;
    }
    setError("");
    const userValidationToken=`${props.login.userDetails.userId}|${uuidv4()}|${moment(new Date()).format("DDMMYYYYhhmmssSSS")}`  
    const req = {
      userId: props.login.userDetails.userId,
      //password: newPassword,
      password: encryptAuth(newPassword, ENCYPT_KEY),
      validationToken: validationToken,
      userValidationToken:encryptAuth(userValidationToken,ENCYPT_KEY)
    }

    ajaxUtil.sendRequest(CHANGE_PSWD_URL, req, (response, hasError) => {
      if (!hasError) {
        store.dispatch(logOut(response?.responseMessage || "Password Updated Successfullly"));
        setLoadLoginPage(true);
      } else if (response && response.responseMessage) {
        setError(response.responseMessage);
      } else {
        setError("Oops! Something went wrong Please try again ");
      }
    }, props.loadingFunction, { isShowSuccess: true, isProceedOnError: true, isShowFailure: false });
  }

  //OTP code starts

  //displaying resend OTP Button
  // function showResendOtp(rsntOtpSec) {
  //   webNotTimer = setTimeout(function () {
  //     setIsresendOtp(true);
  //   }, rsntOtpSec)
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
  const handleMsisdn = (msisdn) => {
    setMsisdn(msisdn);
  }

  const handleGetOtp = (e) => {
    e.preventDefault();
    // var reg = /^[0-9]{8,8}$/;
    // var msisdn_reg = /^[0-9' -]*$/;
    // if (!props.login.userDetails.userId) {
    //     setError("Please Enter UserID !");
    //     return false;
    // }
    // if (!msisdn) {
    //     setError("Please Enter Msisdn !");
    //     return false;
    // }
    // if(!msisdn_reg.test(msisdn)) {
    //   setError("Please enter a valid Mobile Number");
    //   return false;
    // }

    resendOtp("getotp");
  };
  function maskMsisdn(number) {
    return number.substring(0, 2) + number.substring(1, number.length - 2).replace(/\d/g, "x") + number.substring(number.length - 2);
  }
  const handleSubmitOtp = (e) => {
    setMessage('');
    e.preventDefault();
    if (!props.login.userDetails.userId) {
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
      "serviceId": 104,
      "userId": props.login.userDetails.userId
    };

    setIsLoading(true);
    ajaxUtil.sendRequest(FORGET_PSWD_VALIDATE_OTP, req, (response, hasError) => {

      setIsLoading(false)
      if (!hasError) {
        setPaswordPage(true);
        setValidationToken(response.validationToken)
      } else if (response && response.responseMessage) {
        setError(response.responseMessage);
      } else {
        setError("Oops! Something went wrong Please try again ");
      }
    }, setLoadingUtil, { isShowSuccess: false, isShowFailure: false });
  };

  const resendOtp = (fromresend = "resend") => {
    if (id2) clearInterval(id2);
    setError('');
    setIsresendOtp(false);
    /* const req = {
      "receiverMsisdn": props.login.userDetails.msisdn,
      "receiverUserId": props.login.userDetails.userId,
      "senderMsisdn": props.login.userDetails.msisdn,
      "senderUserId": props.login.userDetails.userId,
      "serviceId": 104,
      "validatorUserId": props.login.userDetails.userId
    } */

    setIsLoading(true);
    ajaxUtil.sendRequest(CHANGE_PSWD_GET_OTP,{}, (response, hasError) => {
      setIsLoading(false)
      if (!hasError) {
        setIsOtpPage(true);
        // showResendOtp((response.expiryMinutes)*1000);
        // resendOTPfn(response.expiryMinutes)
        showResendOtp()
        startTimer((response.expiryMinutes) * 60)
        if (fromresend === "getotp")
          setMessage("OTP sent to your MDN:" + msisdn);
        else
          setMessage("OTP has Resent to your MDN:" + msisdn);
      } else if (response && response.responseMessage) {
        setError(response.responseMessage);
      } else {
        setError("Oops! Something went wrong Please try again ");
      }
    }, setLoadingUtil, { isShowSuccess: false, isShowFailure: false });
  }


  //OTP Code end

  return (
    <div className="custom-container">
      <div className="form-Brick">
        <div className="form-Brick-Head" />
        <div id="sampleChar" style={{ display: 'none' }}>&#183;</div>
        <div className="login-form">
          <Row className="mx-0 justify-content-center">{getErrorMsg()}</Row>
          {!passwordPage ?
            <>
              <Row className="mx-0 justify-content-center">
                <Col md="12">
                  <div class="custom-field form-group required">
                    <span className="form-control-label required">Username</span>
                    <Input value={props.login.userDetails.username} autoComplete="userid" disabled className="pad-left"/>
                    <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }}></InputGroupAddon>
                  </div>
                </Col>
              </Row>
              <Row className="mx-0 justify-content-center">
                {isOtpPage ?
                  <Col md="12" className="mb-2">
                    <InputGroup>
                      <Input style={{ fontWeight: 600 }} onChange={(event) => setOtp(event.target.value)} maxLength={6} value={otp} />
                      <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }} ></InputGroupAddon>
                      <span className="floating-label">OTP</span>
                    </InputGroup>
                    <span style={{ color: 'gray' }}>{timer}</span>
                  </Col>
                  :
                  props?.login?.userDetails?.user ? ''
                    : <Col md="12">
                      <div class="custom-field form-group required">
                        <span className="form-control-label required">MDN</span>
                        <Input value={maskMsisdn(props.login.userDetails.msisdn)} disabled className="pad-left"/>
                        <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }}></InputGroupAddon>
                      </div>
                    </Col>
                }
              </Row>
              <Row className="mx-0 justify-content-center">
                {
                  isLoading ?
                    <div className="change_pwd col-md-12">
                      <Button className="w-100 login-button primary-background" disabled>
                        <i className="fa fa-spinner fa-spin"></i><span> authenticating...</span>
                      </Button>
                    </div>
                    :
                    isOtpPage ?
                      <div className="change_pwd col-md-12">
                        <Button className="w-100 login-button c-pointer primary-background " onClick={handleSubmitOtp}>Submit</Button>
                      </div>
                      :
                      props?.login?.userDetails?.user ?
                        <div className="change_pwd">
                          <Button className="w-100 login-button c-pointer primary-background" onClick={() => { setPaswordPage(true) }}>Next</Button>
                        </div>
                        :
                        <div className="change_pwd col-md-12">
                          <Button className="w-100 login-button c-pointer primary-background" onClick={handleGetOtp}>Send OTP</Button>
                        </div>
                }
              </Row>
              {
                !passwordPage && isOtpPage && isresendOtp &&
                <div className="change_pwd col-md-12">
                  <Button className="w-100 login-button c-pointer primary-background mt-2" onClick={resendOtp}>Resend OTP</Button>
                </div>
                // :
                // expiryTime? <span className="pl-3 otpExpiryTime mt-1">{expiryTime}</span>:""
              }
            </>
            : <>
              <Row className="mx-0">
                <Col className="">
                  <InputGroup>
                    <Input onChange={(event) => handlePassworChange("newPass", event.target.value)}
                      value={isShow.newPass ? newPassword : newPassShow}
                      maxLength={30} //05-11-2021- changed pswd length on clients demand
                    />
                    <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }}><i className="fa fa-eye" style={{ width: '21px' }} onClick={() => setShow("newPass")}></i></InputGroupAddon>
                    <span className="floating-label">New password</span>
                  </InputGroup>
                </Col>
              </Row>
              <Row className="mx-0">
                <Col className="">
                  <InputGroup>
                    <Input onChange={(event) => handlePassworChange("confPass", event.target.value)}
                      value={isShow.confPass ? confirmPassword : confPassShow}
                      maxLength={30} //05-11-2021- changed pswd length on clients demand
                    />
                    <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }}><i className="fa fa-eye" style={{ width: '21px' }} onClick={() => setShow("confPass")}></i></InputGroupAddon>
                    <span className="floating-label">Confirm new password</span>
                  </InputGroup>
                </Col>
              </Row>
              <div className="col mt-3 change_pwd">
                <Button className="w-100 login-button c-pointer primary-background mt-3" onClick={onSubmitClick}>Update Password</Button>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}
export default withRouter(ChangePswd);