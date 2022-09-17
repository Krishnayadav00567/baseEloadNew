import React, { useState, useEffect, Fragment } from 'react';
import Avatar from 'react-avatar';
import AuditApproval from '../../eload/Audit/components/AuditApproval';
import _ from 'lodash';


function AuditMoreInfo(props) {
    const{data} = props;
    //const [approversDetails, setApproversDetails] = useState([])
    const [featureData, setFeatureData] = useState([])
    const [fieldData, setFieldData] = useState([])

    useEffect(()=>{
        if(data&&data.auditDetails.length){
            let featureArr = data.auditDetails.filter(i=>i.fieldName === 'Feature') 
            let fieldArr = data.auditDetails.filter(i=>i.fieldName != 'Feature') 
           
            if(fieldArr.length){
                setFieldData(fieldArr)
            }
            let groupedData = _.chain(featureArr).groupBy("moduleName").map((value, key) => ({ moduleName: key, modules: value })).value()
            if(groupedData.length){
                setFeatureData(groupedData)
            }
        }

        /* if(data?.approvalId){
            props.ajaxUtil.sendRequest(`approval/manageApprovals/approverDetails/${data.approvalId}`, {}, (response, hasError) => {
                if (!hasError && response && response.response&&response.response.approverHistory.length) {
                    setApproversDetails(response.response.approverHistory)
                }
    
            }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isProceedOnError: false, isShowFailure: false });    
        } */
       
    },[]) 
    return <div className='audit-more-info-container'>
        <span className='audit-close-icon' onClick={props.closeHandler}><i className="fa fa-times" aria-hidden="true"></i></span>
        <div className='audit-breadcrumbs'>
            <span className='breadcrumbs-t1' onClick={props.closeHandler}>Audit</span>
            <span className='breadcrumbs-arrow'><i class="fa fa-angle-right" aria-hidden="true"></i></span>
            <span className='breadcrumbs-t2'>Details</span>
        </div>  
        <div className='audit-info-body'>
            <span className='audit-info-title'>Info</span>
            <div className='audit-more-details'>
                <span className='audit-more-details-cell'>
                    <span className='audit-more-details-lbl'>Role: </span>
                    <span className='audit-more-details-value'>{data?.roleName}</span>
                </span>
                <span className='audit-more-details-cell'>
                    <span className='audit-more-details-lbl'>Updated by: </span>
                    <span className='audit-more-details-value'>{data?.updatedBy}</span>
                </span>
                <span className='audit-more-details-cell'>
                    <span className='audit-more-details-lbl'>Activity: </span>
                    <span className='audit-more-details-value'>{data?.activity}</span>
                </span>
                <span className='audit-more-details-cell'>
                    <span className='audit-more-details-lbl'>Time: </span>
                    <span className='audit-more-details-value'>{data?.date}</span>
                    <span className='audit-more-details-value'>{data?.time}</span>
                </span>
            </div>
        </div>
        {fieldData.length?<div className='audit-details-container'>
            <div className="audit-details-head-container">
                <span className="audit-details-head1">Field Name</span>
                <span className="audit-details-head1">Pre Update</span>
                <span className="audit-details-head3">Post Update</span>
            </div>
            {fieldData.map((item)=>{
                    return <div className="audit-details-value-container">
                                <span className="audit-details-value">{item.fieldName==="Feature"?item?.moduleName:item?.fieldName}</span>
                                <span className="audit-details-value">{item.preUpdate}</span>
                                <span className="audit-details-value" style={{width:'40%'}}>{item.postUpdate}</span>
                            </div>
            })}
        </div>:null}

        {featureData.length?<div className='audit-details-container'>
            <div className="audit-details-head-container">
                <span className="audit-details-head1">Module Name</span>
                <span className="audit-details-head1">Added Privileges</span>
                <span className="audit-details-head3">Removed Privileges</span>
            </div>
            {featureData.map((item)=>{
                    return <div className="audit-details-value-container">
                                <span className="audit-details-value">{item?.moduleName}</span>
                                <span className="audit-details-value">{item.modules&&item.modules.length?item.modules.map((itm,index)=>{
                                    return itm.activityType===0?<span>{itm.postUpdate}<br/></span>:null
                                }):null}</span>

                                <span className="audit-details-value">{item.modules&&item.modules.length?item.modules.map((itm)=>{
                                    return itm.activityType===2?<span>{itm.preUpdate}<br/></span>:null
                                }):null}</span>
                            </div>
            })}
        </div>:null}
        {data?.approvalId?<AuditApproval 
        {...props}
        approvalId={data?.approvalId}
        />:null}
    </div>
}

export default AuditMoreInfo
