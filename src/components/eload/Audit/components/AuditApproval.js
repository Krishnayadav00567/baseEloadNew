import React, { useState, useEffect, Fragment } from 'react';
import Avatar from 'react-avatar';
import { CONSTANTS } from '../../../../util/Constants';
import { formatDateTimeStamp } from '../../../../util/Util';
function AuditApproval(props) {
    const { approvalId } = props;
    const [approversDetails, setApproversDetails] = useState([]);
    const [requestDate, setRequestDate] = useState([])
    useEffect(() => {
        if (approvalId) {
            props.ajaxUtil.sendRequest(`${CONSTANTS.AUDIT_APPROVAL_VIEW}${approvalId}`, {}, (response, hasError) => {
                if (!hasError && response && response.response && response.response.approverHistory.length) {
                    setApproversDetails(response.response.approverHistory)
                    setRequestDate(response.response)
                }
            }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isProceedOnError: false, isShowFailure: false });
        }
    }, [approvalId])
    console.log("requestDate:",requestDate)
    return <div className='audit-approval-details-container'>
        {approversDetails && approversDetails.length > 0 ? <div className='audit-approval-details-title'>Approval Details</div> : ""}
        <div style={{ display: "flex" }}>
            {approversDetails.map((item) => {
                return item.approvers.map((app) => {
                    console.log("app :", app);
                    return <div className="audit-approval-body">
                        <Avatar size="50" name={app.approverDetails && app.approverDetails.name} className="avatar image" src='' />
                        <div style={{ marginLeft: '11px' }}>
                            <div><span className='audit-approval-label'>Name- </span><span className='audit-approval-details-value'>{app.approverDetails && app.approverDetails.name}</span></div>
                            <div><span className='audit-approval-label'>Position Id- </span><span className='audit-approval-details-value'>{app.approverDetails && app.approverDetails.positionId}</span></div>
                            <div><span className='audit-approval-label'>Level- </span><span className='audit-approval-details-value'>{app.approverDetails && app.approverDetails.levelName}</span></div>
                            {/* <div><span className='audit-approval-label'>{app.statusId?`Approved on-`:`Rejected on-`}</span><span className='audit-approval-details-value'>{app.actionDate}</span></div> */}
                            <div><span className='audit-approval-label'>{app.statusId == 1 ? `Approved on- ` : app.statusId == 0 ? `Rejected on- ` : `Requested on- `}</span><span className='audit-approval-details-value'>{app.statusId == 2 ?requestDate.requestedDate : app.actionDate}</span></div>
                            <div><span className='audit-approval-label'>Status- </span><span className='audit-approval-details-value'>{app.status}</span></div>
                        </div>
                    </div>
                })
            })
            }
        </div>
    </div>
}

export default AuditApproval;