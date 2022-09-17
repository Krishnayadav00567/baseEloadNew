import React, { Component } from "react";
import { Col, Row, Container, Input, Label, ModalBody } from "reactstrap";
import _ from "lodash";
import { Switch } from '@6d-ui/form';
import { FieldItem, FIELD_TYPES } from '@6d-ui/fields';


const modules = [];
export default class RoleDetails extends Component {
  constructor(props) {
    super(props);
    this.getAllPermissions = this.getAllPermissions.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = {
      isLoading: true,
      roleId: "",
      roleName: "",
      isSuccess: false,
      permissions: "",
      windowHeight: 0,
      searchText: '',
      filteredModules: []
    };
  }

  componentDidMount() {
    this.getAllPermissions();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ windowHeight: window.innerHeight });
  }

  getAllPermissions() {
    const permissionList = [];
    for (var key in this.props.permissions) {
      if (this.props.permissions.hasOwnProperty) {
        var arr = this.props.permissions[key];
        arr.map(data => permissionList.push(data.value, data.label));
      }
    }
    return permissionList;
  }

  clearSearch = () => {
    this.setState({ searchText: '' });
  }

  searchHandleChange = (value, obj) => {
    const { isTouched } = obj || { isTouched: false };
    if (isTouched) return;
    if (!isTouched) {
      this.setState({
        searchText: value
      }, () => {
        if (this.state.searchText != null && this.props.modules) {
          let tmp = this.props.modules.filter((item) => (item.moduleName.toLowerCase()).indexOf(this.state.searchText.toLowerCase()) > -1);
          this.setState({
            filteredModules: tmp
          })
        }
      })
    }
  }

  render() {
    const getPermissions = permissions => {
      const permissionList = [];
      _.forEach(permissions, function (feature) {
        const temp = {
          value: feature.featureId,
          label: customiseOptions(feature.featureName, feature.featureId)
        };
        permissionList.push(temp);
      });
      return permissionList;
    };

    const customiseOptions = (featureName, key) => {
      return (
        <Container>
          {/* <Input
            id={featureName + "_" + key}
            type="checkbox"
            onClick={() => {
              return false;
            }}
          /> */}
          {/* <span
            style={
              {
                color: 'black'
              }
            }
          > */}
          <Label for={featureName + "_" + key}>{featureName}</Label>
          {/* </span> */}
        </Container>
      );
    };

    const getModuleList = modules => {
      return _.orderBy(modules, ['moduleName'], ['asc']).map((item, index) => viewList(item, index));
    };

    const viewList = (item, index) => {
      return (
        <Row
          key={index}
          style={{
            paddingBottom: "0.3rem",
            paddingTop: "0.3rem"
          }}
        >
          <Col md="3">{item.moduleName}</Col>
          <Col md="3">
            <Switch
              moduleId={item.id}
              handleChange={() => {
                return null;
              }}
              checked={!_.isEmpty(this.props.permissions[item.id])}
            />
          </Col>
          <Col md="6" style={{ paddingLeft: "0rem" }}>
            <Row>
              <Col md="9">
                <FieldItem
                  values={getPermissions(item.featureMaster)}
                  value={this.props.permissions[item.id]}
                  type={FIELD_TYPES.MUTLI_SELECT}
                  width="xs"
                  onChange={() => {
                    return false;
                  }}
                  placeholder={selectText}
                  disabled={false}
                  touched={false}
                  error=""
                />
              </Col>
            </Row>
          </Col>
        </Row>
      );
    };

    const selectText = "No Permissions Assigned";
    const height = {
      height: this.state.windowHeight - 68
    };
    return (
      <ModalBody>
        <div
          className="custom-container overlay_position scrollbar"
          style={height}
        >
          <div className="form-Brick">
            <div className="form-Brick-Head">
              <span>Role Details</span>
            </div>
            <div className="form-Brick-body">
              <Row className="mx-0">
                <Container>
                  <Row className="form-data">
                    <Col xs="6">
                      <Row>
                        <Col className="form-data-label" xs="3">
                          Role Id
                        </Col>
                        <Col className="form-data-value" xs="6">
                          {this.props.roleId}
                        </Col>
                      </Row>
                    </Col>
                    <Col xs="6">
                      <Row>
                        <Col className="form-data-label" xs="3">
                          Role Name
                        </Col>
                        <Col className="form-data-value" xs="6">
                          {this.props.roleName}
                        </Col>
                      </Row>
                    </Col>
                    <Col xs="6" className="pt-2">
                      <Row>
                        <Col className="form-data-label" xs="3">
                          Type
                        </Col>
                        <Col className="form-data-value" xs="6">
                          {this.props.type || '-'}
                        </Col>
                      </Row>
                    </Col>
                    <Col xs="6" className="pt-2">
                      <Row>
                        <Col className="form-data-label" xs="3">
                          Web login
                        </Col>
                        <Col className="form-data-value" xs="6">
                          {this.props.isWebLoginEnabled ? 'True' : "False"}
                        </Col>
                      </Row>
                    </Col>
                    <Col xs="6" className="pt-2">
                      <Row>
                        <Col className="form-data-label" xs="3">
                          Allowed Channel For Transaction
                        </Col>
                        <Col className="form-data-value" xs="6">
                          {this.props.allowedChannels}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Container>
              </Row>
            </div>
          </div>

          <div className="form-Brick">
            <div className="form-Brick-Head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
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
            </div>
            <div className="form-Brick-body form-card">
              <Row className="mx-0">
                <Container>
                  <Row className="form-card-header">
                    <Col md="3">Modules</Col>
                    <Col md="3" />
                    <Col md="6">Permissions</Col>
                  </Row>
                </Container>
                <Container>{getModuleList(this.state.searchText ? this.state.filteredModules : this.props.modules)}</Container>
              </Row>
            </div>
          </div>
        </div>
      </ModalBody>
    );
  }
}
