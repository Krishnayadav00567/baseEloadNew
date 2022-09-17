
import React, { useState, useEffect, Fragment } from 'react';
import { DataTableContainer } from '../../../data-table/index';
import AuditSearchFilter from './AuditSearchFilter';
import {AUDIT_VIEW as DataTableHeaders} from './util/DataTableHeader';
import _ from 'lodash';
import AuditMoreInfo from './AuditMoreInfo'


function ViewAudit(props) {

  const [modal, setModal] = useState(0)
  const [filterParams, setfilterParams] = useState({})
  const [viewResponse, setViewResponse] = useState('') 
  const [actionParamId, setActionParamId] = useState()
  const FORM_MODAL = props.globalConstants && props.globalConstants.FORM_MODAL;


  // View and Edit Modal

  const toggleAction = (type, rowId,dataLst) => {
    if (type === FORM_MODAL.SearchFilter) {
      setModal(FORM_MODAL.SearchFilter)
    } else {
      if(type===FORM_MODAL.View){
        const dataMap =_.mapKeys(dataLst, "transactionId");
        setViewResponse(dataMap[rowId]);
        setActionParamId(rowId)
        setModal(type)
        // setAction("AuditMoreInfo");
      }
      else {
        setModal(type)
        // setAction("Audit-View")
      }
  
    }
    // else {
    //   if(props.toggleTabIcons)
    //     props.toggleTabIcons(type,rowId,dataLst)
    //   else
    //     setModal(type)  
    // }
    
  }
  
  // Search Filter
  const renderSearchFilter = searchFilterProps => <AuditSearchFilter
    ajaxUtil={props.ajaxUtil}
    // Urls={props.Urls}
    onCancel={() => searchFilterProps.togglePopup(0, null)}
    onSubmitClick={handleSearchFilterSubmit(searchFilterProps.onSearch)}
    {...filterParams}
  />

  const handleSearchFilterSubmit = onSearchFn => data => {
    setfilterParams(data || {})
    onSearchFn(data);
  }
  if (modal === FORM_MODAL.View) {
    return <AuditMoreInfo
      {...props}
      propsForAuditInfoTable ={props.propsForAuditInfoTable}
      data={viewResponse}
      onCancel={() => setModal(0)}
      auditIndex={actionParamId}
    />
  }

    return (
      <div className="custom-container">
        <DataTableContainer
            {...props.propsForAuditTable
            }
            tableHeaderLabels={props.propsForAuditTable&&props.propsForAuditTable.tableHeaderLabels?props.propsForAuditTable.tableHeaderLabels:DataTableHeaders.AuditHeaderLabels}
            filterLabelList={props.propsForAuditTable&&props.propsForAuditTable.filterLabelList?props.propsForAuditTable.filterLabelList: false}
            tableSearchFilters={props.propsForAuditTable&&props.propsForAuditTable.tableSearchFilters?props.propsForAuditTable.tableSearchFilters:[]}
            hasExport={props.propsForAuditTable.hasExport || false}
            rowIdParam={props.propsForAuditTable&&props.propsForAuditTable.rowIdParam?props.propsForAuditTable.rowIdParam:'index'}
            togglePopup= {toggleAction}
            renderSearchFilter= {renderSearchFilter}
        />
            
    </div>
    )
  }

export default ViewAudit

