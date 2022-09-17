import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from 'reactstrap';
import { CONSTANTS,ENCYPT_KEY } from '../../util/Constants';
import { ajaxUtil, setHeaderUtil, saveCurrentStateUtil, setNotification, setModalPopupUtil, setLoadingUtil, isComplexTab } from '../home/Utils';
import { connect } from 'react-redux';
import { setLoading, logOut } from '../../actions';
import { useHistory } from 'react-router-dom';
import { store } from '../../index';
import { encryptAuth } from '../ajax/elements/util/Utils';
import uuidv4 from 'uuid/v4';
import moment from 'moment';

function ForcePasswordChg(props) {

  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passShow, setPassShow] = useState('');
  const [confPassShow, setConfPassShow] = useState('');
  const [newPassShow, setNewPassShow] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isShow, setIsShow] = useState({ password: false, newPass: false, confPass: false });
  const history = useHistory();


  const height = useWindowHeight();
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
  const handleLoginSubmit = (e) => {
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

    let userId;
    if (props.login)
      userId = props.login.userDetails && props.login.userDetails.userId
    const userValidationToken=`${userId}|${uuidv4()}|${moment(new Date()).format("DDMMYYYYhhmmssSSS")}`  
    const req = {
      userId: userId,
      // password: password,
      password: encryptAuth(newPassword,ENCYPT_KEY),
      // newPassword: encrypt(this.state.newPwd),
      // newPassword: newPassword,
      // newPassword: encryptAuth(newPassword,ENCYPT_KEY),
      // confirmPassword: encrypt(this.state.confirmPwd)
      // confirmPassword: confirmPassword
      // confirmPassword: encryptAuth(confirmPassword,ENCYPT_KEY),
      userValidationToken:encryptAuth(userValidationToken,ENCYPT_KEY)
    }
    setError("");
    ajaxUtil.sendRequest(CONSTANTS.CHANGE_PSWD.CHANGE_PSWD_URL, req, (response, hasError) => {
      if (!hasError) {
        store.dispatch(logOut(response.responseMessage || "Password Reset Successfullly"));
      } else if (response && response.responseMessage) {
        setError(response.responseMessage);
      } else {
        setError("Oops! Something went wrong Please try again ");
      }
    }, setLoadingUtil, { isShowSuccess: false });
  };
  const formContainerRef = useRef(null);
  let formHeight = 414;
  useEffect(() => {
    formHeight = formContainerRef?.current?.offsetHeight;
    console.log("clear cookiee");
    document.cookie = "X-Auth-Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }, []);
  const getErrorMsg = () => {
    if (error || props.message) {
      return (
        <div className="errorMsg_login">
          {error || props.message}
        </div>
      );
    }
  }
  return (
    props.login && !props.login.isLoggedIn ?
      <Redirect to={`/${encryptAuth("login", ENCYPT_KEY)}`} /> :
      <Container fluid>
        <Row>
          <Col xs={6} lg={8} style={{ height: `${height}px` }} className="bg-secondary login-container"></Col>
          <Col xs={6} lg={4} className="primary-background">
            <div>
              <div>
                <div className="logo-container position-relative" style={{ height: `${(height - formHeight) / 2}px` }}>
                  <img src={`${process.env.PUBLIC_URL}/images/logo/logoWhite.png`} alt="Smartfren,Indonesia" />
                </div>

                {/* login form starts here */}
                <div id="sampleChar" style={{ display: 'none' }}>&#183;</div>
                <div className="login-form-container bg-white" ref={formContainerRef} style={{ marginLeft: '-232.5px' }}>
                  <form onSubmit={handleLoginSubmit} className="login-form">
                    {getErrorMsg()}
                    <div className="pt-1" style={{ color: '#495057', cursor: 'pointer' }}>
                      {/* <InputGroup>
                        <Input onChange={(event) => handlePassworChange("password", event.target.value)}
                          value={isShow.password ? password : passShow}
                        />
                        <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }}><i className="fa fa-eye" style={{ width: '21px' }} onClick={() => setShow("password")}></i></InputGroupAddon>
                        <span className="floating-label">Old password</span>
                      </InputGroup> */}
                    </div>
                    <div className="pt-1" style={{ color: '#495057', cursor: 'pointer' }}>
                      <InputGroup>
                        <Input onChange={(event) => handlePassworChange("newPass", event.target.value)}
                            maxLength={30}  //05-11-2021- changed pswd length on clients demand
                          value={isShow.newPass ? newPassword : newPassShow}
                        />
                        <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }}><i className="fa fa-eye" style={{ width: '21px' }} onClick={() => setShow("newPass")}></i></InputGroupAddon>
                        <span className="floating-label">New password</span>
                      </InputGroup>
                    </div>
                    <div className="pt-1" style={{ color: '#495057', cursor: 'pointer' }}>
                      <InputGroup>
                        <Input onChange={(event) => handlePassworChange("confPass", event.target.value)}
                          value={isShow.confPass ? confirmPassword : confPassShow}
                          maxLength={30}  //05-11-2021- changed pswd length on clients demand
                        />
                        <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }}><i className="fa fa-eye" style={{ width: '21px' }} onClick={() => setShow("confPass")}></i></InputGroupAddon>
                        <span className="floating-label">Confirm new password</span>
                      </InputGroup>
                    </div>

                    {
                      props.isLoading
                        ? <Button className="w-100 login-button primary-background" disabled>
                          <i className="fa fa-spinner fa-spin"></i><span> authenticating...</span>
                        </Button>
                        : <Button className="w-100 login-button c-pointer primary-background">Submit</Button>}
                    <div className="login-form-footer">

                    </div>
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

function mapStateToProps({ login }) {
  return { login };
}

const mapDispatchToProps = dispatch => {
  return {
    setLoading: (...obj) => dispatch(setLoading(...obj)),
    setLoginMessage: (msg) => dispatch(logOut())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ForcePasswordChg);