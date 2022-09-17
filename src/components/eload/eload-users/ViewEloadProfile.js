import React, { useState, useEffect, Fragment } from 'react';
import _ from 'lodash';
import EloadUserInfo from './EloadUserInfo';
import { FormElements as FIELDS } from './util/DataTableHeader';

function ViewEloadProfile(props) {
  const [viewResponse, setViewResponse] = useState()
  props.setHeader("My Profile");
const parsResponse=(userDetails)=>{
          return{ 
             userId:userDetails.userId||'',
            userName:userDetails.userName||'',
            firstName:userDetails.firstName||'',
            lastName:userDetails.lastName||'',
            email:userDetails.email||'',
            language:userDetails.language||'',
            role:userDetails.role||'',
            territory:userDetails.territory||'',
            timeZone:userDetails.timeZoneName||'',
            securityLock:userDetails.securityLock||'',
            suspended:userDetails.suspend||'',
            createdBy:userDetails.createdBy||'',
            createdOn:userDetails.createdDate||'',
            lastModifiedBy:userDetails.lastModifiedBy||'',
            lastModifiedOn:userDetails.updatedDate||'',
            status:userDetails.status||'',
            channelId:userDetails.channelName||'',
            regionId:userDetails.regionName||'',
            clusterId:userDetails.clusterName||'',
            msisdn:userDetails.msisdn,
            prevBlockState:userDetails.prevState,
            prevBlockCodeChangeReason:userDetails.stateChangeReason
        }
}
  useEffect(() => {
    const {userId}=props
    props.ajaxUtil.sendRequest(`${props.URLS.GET_USER_PROFILE}`, {}, (response, hasError) => {
      if(!hasError){
        setViewResponse(parsResponse(response))
      }else
      setViewResponse({}) 
    }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isProceedOnError: true });
  }, [props.userId])

   return ( 
      <div className="custom-container">
                        {viewResponse?!_.isEmpty(viewResponse)?<div className='eloadProfile-more-details row mx-0'>
                            { Object.keys(FIELDS).map(k => {
                                return <div className='col-md-3'>
                                <p className='audit-more-details-lbl'>{FIELDS[k].label} </p>
                                <p className='audit-more-details-value'>{viewResponse[FIELDS[k].name]||'-'}</p>
                            </div> 
                            })
                          }
                </div>
                        /* !_.isEmpty(viewResponse)?<EloadUserInfo
                            {...props}
                            userDetails={viewResponse}
                            fromProfile={true}
                        /> */
                        :<div className="container-fluid"><div className="dataTable_notFound text-center">Not Found !!</div></div>
                        :<div className="container-fluid"><div className="dataTable_notFound text-center">Loading...</div></div>
                      }
      </div>
    )
  }

export default ViewEloadProfile
