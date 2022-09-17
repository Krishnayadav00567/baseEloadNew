import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import Permissions from './Permissions';
import {
  CustomButton,
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_SIZE,
  COLOR
} from '@6d-ui/buttons';
import { FieldItem, validateForm } from '@6d-ui/fields';
import { ROLES as FormElements } from './util/FormElements';
import { FIELD_TYPES } from '@6d-ui/fields';
import { encryptAuth } from '../../ajax/elements/util/Utils';
import { ENCYPT_KEY } from '../../../util/Constants';


export default class CreateRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: '',
      modules: [],
      filteredModules: [],
      isSuccess: false,
      fields: {},
      searchText: "",
      enableWebLogin: true,
      channelOpts: []
    };
    this.getRequest = this.getRequest.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.getPermissions = this.getPermissions.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.getChannelValues = this.getChannelValues.bind(this);
    this.props.setHeader("Roles");
  }

  componentDidMount() {
    // this.props.ajaxUtil.sendRequest(this.props.url_Roles.GET_FEATURES,

    //   {}, (response) => {
    //     this.setState({
    //       modules: response && response.response

    //     });
    //   }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
    this.getChannelValues()
  }

  getChannelValues = () => {
    this.props.ajaxUtil.sendRequest(this.props.url_Roles.GET_CHANNELS,
      {}, (response) => {
        if (response?.length)
          this.setState({
            channelOpts: response.map(d => ({ value: d.channelId, label: d.channelName }))
          });
      }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
  }

  getModules = (type) => {
    this.props.ajaxUtil.sendRequest(`${this.props.url_Roles.GET_FEATURES}/filter?type=${type},2`,
      {}, (response) => {
        this.setState({
          modules: response && response.response

        });
      }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
  }

  getDefaultPermissions(permissions) {
    const permissionList = [];
    _.forEach(permissions, function (feature) {
      if (_.parseInt(feature.isDefault) === 1) {
        const temp = {
          'value': feature.featureId,
          'label': feature.featureName
        }
        permissionList.push(temp);
      }
    });
    return permissionList;
  }
  searchHandleChange = (value, obj) => {
    const { modules } = this.state;
    const { isTouched } = obj || { isTouched: false };
    if (isTouched) return;
    this.setState({
      searchText: value
    }, () => {
      if (this.state.searchText !== null) {
        let tmp = modules.filter((item) => (item.moduleName.toLowerCase()).indexOf(this.state.searchText.toLowerCase()) > -1);
        this.setState({
          filteredModules: tmp
        })
      }
    })
  }
  clearSearch = () => {
    this.setState({ searchText: '' });
  }
  handleChange(name, value, obj) {
    const { isTouched } = obj || { isTouched: false };
    if (isTouched) {
      value = this.state[name];
    }
    else if (name == 'type' && value?.value)
      this.getModules(value.value)

    const fields = this.state.fields;
    const validate = validateForm(name, value, FormElements[name], null, null);
    if (validate) {
      fields[name] = validate;
    } else {
      fields[name] = { hasError: false, errorMsg: '' };
    }
    this.setState({ [name]: value, fields });

  }

  createCheck(response, hasError) {
    if (!hasError) {
      this.setState({ isSuccess: true });
    }
  }

  onSubmitClick() {
    const preValidate = (name, value, field) => {
      if (name === 'roleId')
        return { hasError: false, errorMsg: '' };
    }
    let hasError = false;
    const fields = this.state.fields;
    const that = this;
    _.forEach(FormElements, function (value, name) {
      const validate = validateForm(name, that.state[name], FormElements[name], preValidate, null);
      if (validate) {
        if (hasError === false) hasError = validate.hasError;
        fields[name] = validate;
      } else {
        fields[name] = { hasError: false, errorMsg: '' };
      }
    });
    this.setState({ fields });
    if (hasError === true) {
      this.props.setNotification({
        message: this.props.messagesUtil.EMPTY_FIELD_MSG,
        hasError: true,
        timestamp: new Date().getTime()
      });
      return false;
    }
    const request = this.getRequest();
    this.props.ajaxUtil.sendRequest(this.props.url_Roles.CREATE_URL, request, this.createCheck.bind(this), this.props.loadingFunction, { isProceedOnError: false });
  }

  getRequest() {
    const featureList = []
    const reqPermissions = this.state.permissions;

    Object.keys(reqPermissions).forEach(function (key) {
      if (!_.isEmpty(reqPermissions[key]))
        reqPermissions[key].forEach((feature, index) => {
          featureList.push({ featureId: feature.value });
        });
    }
    );

    return {
      roleName: this.state.roleName,
      type: this.state?.type?.value && this.state.type.value == '1' ? 1 : 0,
      featureList: featureList,
      isWebLoginEnabled: this.state.enableWebLogin.label ? this.state.enableWebLogin.value : this.state.enableWebLogin,
      allowedChannels: this.state?.allowedChannels?.length ? (this.state.allowedChannels).map(v => v.value) : null
      // "roleName": this.state.roleName,
      // "createdUser": "1",
      // "featureIds": featureList
    }
  }

  handleDropDownChange(name, selectedOption, obj) {
    const { isTouched } = obj || { isTouched: false };
    if (!isTouched && selectedOption) {
      if (selectedOption.length > 0)
        this.setState({
          permissions: {
            ...this.state.permissions,
            [name]: selectedOption
          }
        });
      else
        this.setState({
          permissions: {
            ...this.state.permissions,
            [name]: ''
          }
        });
    }
  }

  handleSwitch(data, e) {
    const resetState = this.getDefaultPermissions(data.features);
    if (e.target.checked) {
      this.setState({
        permissions: {
          ...this.state.permissions,
          [data.moduleId]: resetState
        }
      });
    } else {
      this.setState({
        permissions: {
          ...this.state.permissions,
          [data.moduleId]: ''
        }
      });
    }
  }
  onCancel() {
    this.setState({ isSuccess: true });
  }
  getPermissions(permissions) {
    const permissionList = [];
    _.forEach(permissions, function (feature) {
      const temp = {
        'value': feature.featureId,
        'label': feature.featureName
      }
      permissionList.push(temp);
    });
    return permissionList;
  }

  render() {
    if (this.state.isSuccess) {
      return <Redirect to={`/${encryptAuth("Roles", ENCYPT_KEY)}`} />;
    }
    return (
      <div className="custom-container">
        <div className="form-Brick">
          <div className="form-Brick-Head">
            <span>Role Details</span>
          </div>
          <div className="form-Brick-body">
            <Row className="mx-0">
              <FieldItem
                {...FormElements.roleName}
                value={this.state.roleName}
                onChange={this.handleChange.bind(this, FormElements.roleName.name)}
                touched={this.state.fields.roleName && this.state.fields.roleName.hasError}
                error={this.state.fields.roleName && this.state.fields.roleName.errorMsg} />
              <FieldItem
                {...FormElements.type}
                value={this.state.type}
                onChange={this.handleChange.bind(this, FormElements.type.name)}
                touched={this.state.fields.type && this.state.fields.type.hasError}
                error={this.state.fields.type && this.state.fields.type.errorMsg} />
              <FieldItem
                {...FormElements.enableWebLogin}
                value={this.state.enableWebLogin}
                onChange={this.handleChange.bind(this, FormElements.enableWebLogin.name)}
                touched={this.state.fields.enableWebLogin && this.state.fields.enableWebLogin.hasError}
                error={this.state.fields.enableWebLogin && this.state.fields.enableWebLogin.errorMsg} />
              <FieldItem
                {...FormElements.allowedChannels}
                value={this.state.allowedChannels}
                values={this.state.channelOpts}
                onChange={this.handleChange.bind(this, FormElements.allowedChannels.name)}
                touched={this.state.fields.allowedChannels && this.state.fields.allowedChannels.hasError}
                error={this.state.fields.allowedChannels && this.state.fields.allowedChannels.errorMsg} />
            </Row>
          </div>
        </div>

        <div className="form-Brick">
          <div className="form-Brick-Head permissions-container">
            <span>Permissions</span>
            <div class="custom-field form-group" style={{ marginBottom: "5px" }}>
              <div className="input-group search-group-fields" style={{ maxWidth: "200px", maxHeight: "50px" }}>
                <input
                  value={this.state.searchText}
                  placeholder="Search"
                  onChange={(e) => this.searchHandleChange(e.target.value)}
                  className="form-control"
                  type="text"
                />
                {
                  this.state.searchText &&
                  <div className="input-group-append pointer" onClick={this.clearSearch}>
                    <i className="fa fa-close" style={{ marginTop: "13px", marginRight: "5px" }}></i>
                  </div>
                }
              </div>
            </div>
            {/* <FieldItem
                  name= "search"
                placeholder= "Search"
                type= {FIELD_TYPES.TEXT}
                style={{marginTop: "10px"}}
                value={this.state.searchText}
                onChange={(...e)=>this.searchHandleChange(...e)}
                /> */}
          </div>
          <div className="form-Brick-body">
            <Row className="mx-0">
              <Container>
                <Row className="form-card-header">
                  <Col md="3">Modules</Col>
                  <Col md="3"></Col>
                  <Col md="6">Permissions</Col>
                </Row>
              </Container>
              <Permissions
                modules={this.state.searchText ? this.state.filteredModules : this.state.modules}
                handleDropDownChange={this.handleDropDownChange}
                getPermissions={this.getPermissions}
                handleSwitch={this.handleSwitch}
                permissions={this.state.permissions} />
            </Row>
          </div>
        </div>
        <div className="container-fluid">
          <CustomButton
            style={BUTTON_STYLE.BRICK}
            type={BUTTON_TYPE.PRIMARY}
            size={BUTTON_SIZE.LARGE}
            align="right"
            label="Create"
            isButtonGroup={true}
            onClick={this.onSubmitClick.bind(this)}
          />
          <CustomButton
            style={BUTTON_STYLE.BRICK}
            type={BUTTON_TYPE.SECONDARY}
            size={BUTTON_SIZE.LARGE}
            color={COLOR.PRIMARY}
            align="right"
            label="Cancel"
            isButtonGroup={true}
            onClick={this.onCancel.bind(this)}
          />
        </div>
        <div style={{ height: "100px" }}></div>
      </div>
    );
  }

}
