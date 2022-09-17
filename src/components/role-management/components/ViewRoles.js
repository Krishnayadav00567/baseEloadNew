import React, { Component, Fragment } from "react";
import { Switch, Redirect } from "react-router-dom";
import _ from "lodash";
import { Popup, POPUP_ALIGN } from '@6d-ui/popup';
import SearchFilter from "./SearchFilter";
import RoleDetails from "./RoleDetails";
import { ROLES as DataTableHeader } from './util/DataTableHeader';
import { DataTableContainer } from "../../data-table";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Col,
} from 'reactstrap';
import classNames from 'classnames';
import RoleAudits from './RoleAudits';
import { EditRole } from "..";
import { encryptAuth } from "../../ajax/elements/util/Utils";
import { ENCYPT_KEY } from "../../../util/Constants";

const modules = [];
const tabs = [
  {
    id: 1,
    title: 'Info'
  },
]

export default class View extends Component {
  constructor(props) {
    super(props);
    this.FORM_MODAL = props.globalConstants.FORM_MODAL;

    if (!props.previousState) {
      this.state = {
        filterParams: {},
        activeTab: 1,
      };
    } else {
      this.state = {
        roleId: "",
        roleName: "",
        permissions: "",
        type: null,
        ajaxUtil: props.previousState.ajaxUtil,
        filterParams: props.previousState.filterParams,
        activeTab: 1,
      };
    }

    this.toggleAction = this.toggleAction.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    props.setHeader("Roles");
  }

  componentDidMount() {
    if (this.props.privilages.some(p => p == this.props.menuPrivilages.VIEW_AUDIT) && !tabs.some(d => d.id == 2))
      tabs.push({
        id: 2,
        title: 'Audit'
      })
  }

  deleteRow(obj, message, callback) {
    this.props.setModalPopup({
      'rowId': obj,
      'isOpen': true,
      'onConfirmCallBack': this.onConfirmCallBack.bind(this, callback),
      'title': "Confirm Delete",
      'content': message,
      'CancelBtnLabel': "No",
      'confirmBtnLabel': "Yes"
    });
  }

  onConfirmCallBack(callback, rowId) {
    this.props.ajaxUtil.sendRequest(this.props.url_Roles.DELETE_URL + rowId, {}, callback, this.props.loadingFunction,
      { method: 'GET', isShowSuccess: true });
  }

  toggleAction(type, id, dataList) {
    if (type === this.FORM_MODAL.View) {
      const dataMap = _.mapKeys(dataList, "roleId");
      const txnType = dataMap[id].type
      this.props.ajaxUtil.sendRequest(`${this.props.url_Roles.GET_FEATURES}/filter?type=${txnType},2`,
        {},
        (response, hasError) => {
          if (!hasError) {
            _.pullAll(modules, modules);
            response && response.response.forEach((module, index) => {
              modules.push(module);
            });

            this.props.ajaxUtil.sendRequest(`${this.props.url_Roles.SEARCH_URL}/${id}`, {},
              response => {

                this.viewDataCallBack(response)

              },
              this.props.loadingFunction,
              { method: 'GET', isShowSuccess: false });
          }
        },
        this.props.loadingFunction,
        { method: "GET", isShowSuccess: false });
      return false;
    } else {
      if (type === this.FORM_MODAL.Edit) {
        const dataMap = _.mapKeys(dataList, "roleId");
        const txnType = dataMap[id].type
        const roleId = dataMap[id].roleId
        this.setState({ modal: type, actionParamId: roleId, txnType: txnType });
      }
      else
        this.setState({ modal: type, actionParamId: id });
    }
  }

  viewDataCallBack(response) {
    if (!response) {
      this.props.setNotification({
        message: "Failed to load Role Details",
        hasError: true,
        timestamp: new Date().getTime()
      });
    } else {
      // const roleDetails = response.roleMaster;
      const roleDetails = response;
      const roleFeatures = roleDetails.featureList;
      const currentFeatures = [];
      roleFeatures && roleFeatures.forEach((features, index) => {
        currentFeatures.push(features.featureId);
      });
      const permissions = {};

      modules.forEach((module, index) => {
        permissions[module.id] = this.getCurrentPermissions(
          module.featureMaster,
          currentFeatures
        );
      });
      this.setState({
        isLoading: false,
        roleId: roleDetails.roleId,
        roleName: roleDetails.roleName,
        type: roleDetails.type && roleDetails.type == 1 ? 'Transactional' : 'Non Transactional',
        // roleDesc: roleDetails.roleDesc,
        // createdUser: roleDetails.createdUser,
        updatedDate: roleDetails.updatedDate,
        createdDate: roleDetails.createdDate,
        permissions: permissions,
        modules: modules,
        modal: 4,
        isWebLoginEnabled: roleDetails.hasOwnProperty('isWebLoginEnabled') ? roleDetails.isWebLoginEnabled : true,
        allowedChannels: roleDetails.hasOwnProperty('allowedChannelsDetails')
          && roleDetails?.allowedChannelsDetails?.length ? roleDetails.allowedChannelsDetails.map((d, i) => {
            if (i == 0)
              return d.channelName
            else return ` ,${d.channelName}`
          }) : ''
      });
    }
  }
  getCurrentPermissions(permissions, currentFeatures) {

    const permissionList = [];
    _.forEach(permissions, function (feature) {
      if (_.indexOf(currentFeatures, feature.featureId) >= 0) {
        const temp = {
          value: feature.featureId,
          label: feature.featureName
        };

        permissionList.push(temp);
      }
    });

    return permissionList;
  }

  handleSearchFilterSubmit = onSearchFn => data => {

    this.setState({ filterParams: data || {} });
    onSearchFn(data);
  }

  renderSearchFilter = searchFilterProps => <SearchFilter
    {...this.state}
    ajaxUtil={this.props.ajaxUtil}
    onCancel={() => searchFilterProps.togglePopup(0, null)}
    onSubmitClick={this.handleSearchFilterSubmit(searchFilterProps.onSearch)}
    {...this.state.filterParams}
    clearFilters={() => this.setState({ filterParams: {} })}
  />



  render() {
    const propsForDataTable = {
      privilages: this.props.privilages,
      menuPrivilages: this.props.menuPrivilages,
      ajaxUtil: this.props.ajaxUtil,
      listUrl: this.props.url_Roles.SEARCH_URL,
      previousState: this.props.previousState,
      apiVersion: 3,
      defaultRowCount: this.props.globalConstants.INITIAL_ROW_COUNT,
      rowIdParam: 'roleId',
      tableHeaderLabels: DataTableHeader.LABEL_LIST,
      loadingFunction: this.props.loadingFunction,
      header: "Roles",
      togglePopup: this.toggleAction,
      deleteRow: this.deleteRow,
      deleteMessage: ['Are you sure you want to delete the', 'role'],
      deleteMessageParam: ['roleName'],
      saveState: state => this.props.saveCurrentState({ [this.props.previousStateKey]: state }),
      // orderByCol: "roleId",
      tabPriv: { info: true },
      renderSearchFilter: this.renderSearchFilter,
      filterLabelList: DataTableHeader.SEARCH_FIELDS,
      tableSearchFilters: DataTableHeader.SEARCH_FILTERS,

    }

    if (this.state.modal === 2) {
      return (
        <Switch>
          {/* <Redirect to="/Roles/create" push /> */}
          <Redirect to={`/${encryptAuth("Roles/create", ENCYPT_KEY)}`} push />
        </Switch>
      );
    }
    // if (this.state.modal === 3) {
    //   const editUrl = `/Roles/edit/${this.state.actionParamId}/${this.state.txnType}`;
    //   return (
    //     <Switch>
    //       <Redirect to={editUrl} />
    //     </Switch>
    //   );
    // }
    if (this.state.modal === 3) {
      return (

        <EditRole
          {...this.state}
          {...this.props}
          actionParamId={this.state.actionParamId}
          // txnType = {txnType}
          ajaxUtil={this.props.ajaxUtil}
          onCancel={() => this.toggleAction(0, null)}
        />
      )
    }
    return (
      <div className="custom-container">
        <Col>
          <div className="custom-tabs">
            <Nav tabs>
              {
                tabs.map(tab => <NavItem key={tab.id}>
                  <NavLink
                    className={classNames({ active: this.state.activeTab === tab.id }, "c-pointer")}
                    onClick={() => this.setState({ activeTab: tab.id })}
                  >
                    {tab.title}
                  </NavLink>
                </NavItem>)
              }
            </Nav>
          </div>
          <TabContent activeTab={this.state.activeTab} className="pt-3">
            <TabPane tabId={1}>
              <DataTableContainer
                {...propsForDataTable}
              >
              </DataTableContainer>

              <Popup
                type={POPUP_ALIGN.RIGHT}
                title="View"
                isOpen={this.state.modal === 4}
                close={this.toggleAction}
                minWidth="85%"
                component={
                  <RoleDetails
                    {...this.state}
                    ajaxUtil={this.props.ajaxUtil}
                    onCancel={() => this.toggleAction(0, null)}
                  />
                }
              />
              {/* <Popup
                type={POPUP_ALIGN.RIGHT}
                title="Edit"
                isOpen={this.state.modal === 3}
                close={this.toggleAction}
                minWidth="85%"
                component={
                  <EditRole
                    {...this.state}
                    {...this.props}
                    actionParamId = {this.state.actionParamId}
                    // txnType = {txnType}
                    ajaxUtil={this.props.ajaxUtil}
                    onCancel={() => this.toggleAction(0, null)}
                  />
                }
              /> */}
            </TabPane>
            <TabPane tabId={2}>
              {this.state.activeTab === 2 && <RoleAudits {...this.props} />}
            </TabPane>
          </TabContent>
        </Col>

      </div>
    );
  }
}


