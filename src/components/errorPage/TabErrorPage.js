import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from 'reactstrap';
export const TabErrorPage = () => {
  let formHeight = 414;
  const height = useWindowHeight();
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
              <div className="login-form-container bg-white"  style={{ marginLeft: '-232.5px' }}>
                <div className="login-form-header">
                  <span className="fw-600">S&amp;D Management System</span>
                </div>
                <form className="login-form">
                  <div className="tab-error-msg">
                  Sorry! You can only have this application opened in one tab
                  </div>
                </form>
              </div>

              <div className="logo-container position-relative footer-text">
                <span style={{ left: "20px" }}>Smartfren ©2021. All rights reserved</span>
              </div>

            </div>
          </div>
        </Col>
      </Row>

    </Container>
  );
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