import React, { useState, useEffect, Fragment } from 'react';
import { DataTableContainer } from '../../data-table/index';
import { Popup, POPUP_ALIGN } from '@6d-ui/popup';
import { ELOAD_USERS as DataTableHeader } from './util/DataTableHeader';
import CreateEloadUser from './CreateEloadUser';
import SearchFilterUser from './SearchFilterUser';
import _, { set } from 'lodash';
import EloadUserInfo from './EloadUserInfo';

function ViewEloadUsers(props) {
  const [modal, setModal] = useState(0)
  const [viewResponse, setViewResponse] = useState('')
  const [filterParams, setFilterParams] = useState({})
  const FORM_MODAL = props.globalConstants && props.globalConstants.FORM_MODAL;
  const { channelId, channelName, regionId, regionName, clusterId, clusterName } = props.loggedInUser

  props.setHeader("Users");
  const [selectedId, setSelectedId] = useState('')
  let goBack = () => {
    setModal(0)
  }

  // View and Edit Modal

  const toggleAction = (type, rowId, dataList) => {

    if (type === FORM_MODAL.View) {
      //const dataMap = _.mapKeys(dataList, "userId");
      props.ajaxUtil.sendRequest(`${props.URLS.GET_USER_INFO}${rowId}`, {}, (response, hasError) => {
        if (!hasError) {
          setViewResponse(response)
          setModal(type)
          setSelectedId(rowId)
        }
      }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isProceedOnError: false });
    }
    else if (type === FORM_MODAL.Edit) {
      //const dataMap = _.mapKeys(dataList, "userId");
      props.ajaxUtil.sendRequest(`${props.URLS.GET_USER_INFO}${rowId}`, {}, (response, hasError) => {
        if (!hasError) {
          setViewResponse(response)
          setModal(type)
        }
      }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isProceedOnError: false });
    }
    else
      setModal(type)

  }

  // Delete


  const deleteRow = (obj, message, callback, dataList) => {
    props.setModalPopup({
      'rowId': obj,
      'isOpen': true,
      'onConfirmCallBack': () => onConfirmCallBack(callback, obj, dataList),
      'title': "Confirm Delete",
      'content': message,
      'CancelBtnLabel': "Cancel",
      'confirmBtnLabel': "Delete"
    });
  }

  const onConfirmCallBack = (callback, rowId, dataList) => {
    //const dataMap = _.mapKeys(dataList, "userId");
    props.ajaxUtil.sendRequest(`${props.URLS.DELETE_USER}${rowId}`, {}, callback, props.loadingFunction, { method: 'DELETE', isProceedOnError: false });
  }

  // Search Filter
  const renderSearchFilter = searchFilterProps => <SearchFilterUser
    ajaxUtil={props.ajaxUtil}
    onCancel={() => searchFilterProps.togglePopup(0, null)}
    URLS={props.URLS}
    onSubmitClick={handleSearchFilterSubmit(searchFilterProps.onSearch)}
    {...filterParams}
    setFilterParams={setFilterParams}
    loggedInUser={props.loggedInUser}
  />

  const handleSearchFilterSubmit = onSearchFn => data => {
    setFilterParams(data || {})
    onSearchFn(data);
  }
  let listUrl = props.URLS.GET_USERS
  if (channelId && channelName && channelId != 1)
    listUrl += `&channelId=${channelId}`
  if (regionId && regionName && channelId != 1)
    listUrl += `&regionId=${regionId}`
  if (clusterId && clusterName && channelId != 1)
    listUrl += `&clusterId=${clusterId}`

  console.log({ listUrl });
  const propsForDataTable = {
    privilages: props.privilages,
    menuPrivilages: props.menuPrivilages,
    ajaxUtil: props.ajaxUtil,
    listUrl: listUrl,
    previousState: props.previousState,
    apiVersion: 3,
    defaultRowCount: props.globalConstants.INITIAL_ROW_COUNT,
    rowIdParam: 'userId',
    tableHeaderLabels: DataTableHeader.tableHeaderLabels,
    loadingFunction: props.loadingFunction,
    filterLabelList: true,
    header: "Users",
    togglePopup: toggleAction,
    tableSearchFilters: DataTableHeader.SEARCH_FILTERS,
    renderSearchFilter: renderSearchFilter,
    deleteRow: deleteRow,
    deleteMessage: 'Do you want to delete',
    deleteMessageParam: ['firstName', 'lastName'],
    saveState: state => props.saveCurrentState({ [props.previousStateKey]: state }),
    tabPriv: { info: true, edit: false }
  }
  return (
    <div className="custom-container">
      <DataTableContainer
        {...propsForDataTable}
      >
        {childProps =>
          <Fragment>
            <Popup
              type={POPUP_ALIGN.RIGHT}
              title="Create"
              isOpen={modal === FORM_MODAL.Create}
              close={() => toggleAction(0)}
              minWidth="85%"
              component={
                <CreateEloadUser
                  {...props}
                  goBack={goBack}
                  onSuccess={() => childProps.loadDataTable(false, null, false)}
                />
              }
            />
            <Popup
              type={POPUP_ALIGN.RIGHT}
              title="View"
              isOpen={modal === FORM_MODAL.View}
              close={() => toggleAction(0)}
              minWidth="85%"
              component={
                <EloadUserInfo
                  {...props}
                  goBack={goBack}
                  userDetails={viewResponse}
                  onSuccess={() => childProps.loadDataTable(false, null, false)}
                  setEdit={() => toggleAction(FORM_MODAL.Edit, selectedId)}
                />
              }
            />
            <Popup
              type={POPUP_ALIGN.RIGHT}
              title="Edit"
              isOpen={modal === FORM_MODAL.Edit}
              close={() => toggleAction(0)}
              minWidth="85%"
              component={
                <CreateEloadUser
                  {...props}
                  goBack={goBack}
                  isEdit={true}
                  userDetails={viewResponse}
                  onSuccess={() => childProps.loadDataTable(false, null, false)}
                />
              }
            />
          </Fragment>

        }
      </DataTableContainer>

    </div>
  )
}

export default ViewEloadUsers
