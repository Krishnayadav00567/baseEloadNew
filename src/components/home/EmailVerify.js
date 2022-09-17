import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from 'reactstrap';
import { VERIFY_EMAIL } from '../../util/Constants';
import { ajaxUtil, setLoadingUtil } from './Utils';
export const EmailVerify = (props) => {
  let formHeight = 414;
  const height = useWindowHeight();
  const {code} = useParams();
  const [respMsg, setRespMsg] = useState("")
  console.log("cod",code);
  useEffect(() => {
    ajaxUtil.sendRequest(`${VERIFY_EMAIL}${code}`, {}, (response, hasError) => {
      if(!hasError&&response){
          setRespMsg(Response.responseMessage||'')
      }else{
        if(response){
          setRespMsg(Response.responseMessage||'')
        }
      }
    },setLoadingUtil, { method: 'GET', isShowSuccess: false, isLogout: false });
  }, [])
  return (
    <Container fluid>
        <div className="primary-background" style={{height:70}}> 
        </div>
        <div style={{marginLeft: '16%',marginRight: '16%',padding: 40}}>
            <div className="text-center">
                <span style={{color: '#28a745'}}>Your Mail has been verified successfully</span>
            </div>
        </div>
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