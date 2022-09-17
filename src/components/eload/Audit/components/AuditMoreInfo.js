import React, { useEffect, useState } from 'react';
// import { AuditFileds } from './util/FormElements';
import { getUserDetails } from '../../Audit/components/util/DataTableHeader';
import _ from 'lodash';
import { DataTableContainer } from '../../../data-table';
import AuditApproval from '../../Audit/components/AuditApproval';

function AuditMoreInfo(props) {
  const {data}=props;

  return(
    <div className='audit-more-info-container'>
      <span className='audit-close-icon' onClick={props.onCancel}><i className="fa fa-times" aria-hidden="true"></i></span>
        <div className='audit-breadcrumbs'>
            <span className='breadcrumbs-t1' onClick={props.onCancel}>Audit</span>
            <span className='breadcrumbs-arrow'><i class="fa fa-angle-right" aria-hidden="true"></i></span>
            <span className='breadcrumbs-t2'>{data?.primaryName}</span>
        </div>
        <div className='audit-info-body'>
            <span className='audit-info-title'>Info</span>
            <div className='audit-more-details row mx-0'>
                <div className='col-md-3'>
                    <p className='audit-more-details-lbl'>Transaction Id: </p>
                    <p className='audit-more-details-value'>{data?.transactionId}</p>
                </div>
                <div className='col-md-3'>
                    <p className='audit-more-details-lbl'>Updated by: </p>
                    <p className='audit-more-details-value'>{getUserDetails(data && data['updatedByUserId'], data && data['updatedBy'])}</p>

                </div>
                <div className='col-md-3'>
                    <p className='audit-more-details-lbl'>Activity: </p>
                    <p className='audit-more-details-value'>{getUserDetails(data && data['activity'], data && data['primaryName'])}</p>
                </div>
                <div className='col-md-3'>
                    <p className='audit-more-details-lbl'>Time: </p>
                    <p className='audit-more-details-value'>{data?.date}</p>
                </div>
            </div>
        </div>  
        <div className='audit-details-container'>
            <DataTableContainer
                {...props.propsForAuditInfoTable}
                listUrl={`${props.propsForAuditInfoTable.listUrl}${props.auditIndex}`}
                ></DataTableContainer> 
        </div>
        {data&&data.approvalId?<AuditApproval
        {...props}
        approvalId={data.approvalId}
        />
        :null}
    </div>
  )

}

export default AuditMoreInfo