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


export default function LoginForm(props) {

  const [newPassword, setNewPassword] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState();

  const height = useWindowHeight();
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your current password !");
      return false;
    }
    if (!newPassword) {
      setPassword("Please enter your new password !");
      return false;
    }
    if (!confirmPassword) {
      setPassword("Please confirm your new password !");
      return false;
    }

    
    
  };
  const formContainerRef = useRef(null);
  let formHeight = 414;
  useEffect(() => {
    formHeight = formContainerRef.current.offsetHeight;
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
    <Container fluid>
      <Row>
        <Col xs={6} lg={8} style={{ height: `${height}px` }} className="bg-secondary login-container"></Col>
        <Col xs={6} lg={4} className="primary-background">
          <div>
            <div>
              <div className="logo-container position-relative" style={{ height: `${(height - formHeight) / 2}px` }}>
                <img src={`${process.env.PUBLIC_URL}/images/logo/logoWhite.png`} alt="Smartfren,Indonesia" />
              </div>

              <div className="login-form-container bg-white" ref={formContainerRef} style={{ marginLeft: '-232.5px' }}>
                <form onSubmit={handleLoginSubmit} className="login-form">
                  {getErrorMsg()}
                  <div>
                    <InputGroup>
                      <Input onChange={(event) => setPassword(event.target.value)}
                        value={password}
                        maxLength={30} //05-11-2021- changed pswd length on clients demand
                        type="password" />
                      <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }}><i className="fa fa-user-o" style={{ width: '21px' }} ></i></InputGroupAddon>
                      <span className="floating-label">Old password</span>
                    </InputGroup>
                  </div>
                  <div className="pt-1">
                    <InputGroup>
                      <Input onChange={(event) => setNewPassword(event.target.value)}
                        value={newPassword}
                        maxLength={30} //05-11-2021- changed pswd length on clients demand
                        type="password" />
                      <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }}><i className="fa fa-key" style={{ width: '21px' }} ></i></InputGroupAddon>
                      <span className="floating-label">New password</span>
                    </InputGroup>
                  </div>
                  <div className="pt-1">
                    <InputGroup>
                      <Input onChange={(event) => setConfirmPassword(event.target.value)}
                        value={confirmPassword}
                        maxLength="30" //05-11-2021- changed pswd length on clients demand
                        type="password" />
                      <InputGroupAddon addonType="append" style={{ lineHeight: '38px' }}><i className="fa fa-key" style={{ width: '21px' }} ></i></InputGroupAddon>
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