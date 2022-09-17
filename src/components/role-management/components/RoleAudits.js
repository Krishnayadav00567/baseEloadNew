import React, { useState } from 'react';
import Audit from '../../eload/Audit/components/ViewAudit';
import { AUDIT_INFO as AuditInfoHeader } from './util/DataTableHeader';
import _ from 'lodash';
import { AUDIT_VIEW } from '../../eload/Audit/components/util/DataTableHeader';

function RoleAudits(props) {
    const [viewResponse, setViewResponse] = useState('')
    const [showMoreInfo, setShowMoreInfo] = useState(false)
    const [auditDetails, setAuditDetails] = useState({})
    const FORM_MODAL = props.globalConstants && props.globalConstants.FORM_MODAL;

    const toggleAction = (type, id, data) => {
        if (type === FORM_MODAL.View) {
            const dataMap = _.mapKeys(data, "requestId");
            setAuditDetails(dataMap[id])
            setShowMoreInfo(true)
        } else {
            setShowMoreInfo(false)
        }
    }
    const propsForDataTable = {
        privilages: props.privilages,
        menuPrivilages: props.menuPrivilages,
        ajaxUtil: props.ajaxUtil,
        listUrl: props.url_Roles.GET_ROLE_AUDIT_DATA,
        previousState: props.previousState,
        apiVersion: 3,
        defaultRowCount: props.globalConstants.INITIAL_ROW_COUNT,
        rowIdParam: 'transactionId',
        tableHeaderLabels: AUDIT_VIEW.AuditHeaderLabels,
        loadingFunction: props.loadingFunction,
        header: "Audits",
        togglePopup: toggleAction,
        saveState: state => props.saveCurrentState({ [props.previousStateKey]: state }),
        tabPriv: { info: true, delete: false, create: false, edit: false },
        filterLabelList: true,
        tableSearchFilters: AUDIT_VIEW.SEARCH_FILTERS,
        hasExport: true,
        exportTypes: [
            {
                label: "Excel",
                url: props.url_Roles.EXPORT_ROLE_AUDIT_DATA_EXCEL,
                type: 'xls'
            }, {
                label: "CSV",
                url: props.url_Roles.EXPORT_ROLE_AUDIT_DATA_CSV,
                type: 'csv'
            }],
        exportResponseHandler: props.exportResponseHandler,
        setNotification: props.setNotification,
        exportFileName: "Role Audit"
    }
    const propsForAuditInfoTable = {
        privilages: props.privilages,
        menuPrivilages: props.menuPrivilages,
        ajaxUtil: props.ajaxUtil,
        listUrl: `${props.AUDIT_DETAILS && props.AUDIT_DETAILS.AUDIT_DETAILS}`,
        apiVersion: 3,
        defaultRowCount: props.globalConstants.INITIAL_ROW_COUNT,
        rowIdParam: 'id',
        tableHeaderLabels: AuditInfoHeader.AuditHeaderLabels,
        loadingFunction: props.loadingFunction,
        filterLabelList: false,
        header: "fields",
        tabPriv: { info: false, edit: false, delete: false, create: false },
    }
    /* if(!showMoreInfo){
        return (
            <DataTableContainer
                {...propsForDataTable}
                
            >
            </DataTableContainer>
    )
    }
    if(showMoreInfo){
        return <AuditMoreInfo {...props} data={auditDetails} closeHandler={()=>toggleAction(0,null)}/>
    } */
    return <Audit
        {...props}
        propsForAuditTable={propsForDataTable}
        propsForAuditInfoTable={propsForAuditInfoTable}

    />

}

export default RoleAudits
