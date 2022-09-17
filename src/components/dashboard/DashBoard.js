import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';
import { encryptAuth } from '../ajax/elements/util/Utils';
import { ENCYPT_KEY } from '../../util/Constants';

function Dashboard(props) {
  useEffect(() => {
    props.setHeader("Dashboard");
  }, []);

  return (
    
    !props.loggedInUser.user?<Redirect to={`/${encryptAuth("myProfile", ENCYPT_KEY)}`}/>:
    <div className="custom-container dashborad">
      <Container fluid>
        <Row>
          <Col>
            <div className="d-flex flex-row pt-2 pb-3" >
              <div  className="card profile">
                <i  className="fa fa-user userImage" />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#33495F' }}>Hi {props.loggedInUser.name},</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#33495F' }}>{props.loggedInUser.designation}</div>
                <div style={{ fontSize: '12px', color: '#7E91A4' }}>Welcome to Smartfren Sales And Distribution Management System !</div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )

}
export default Dashboard;
