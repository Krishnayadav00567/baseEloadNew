import React, { Component } from "react";
import { Row, ModalBody, ModalFooter } from "reactstrap";
import {
  CustomButton,
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_SIZE,
  COLOR
} from '@6d-ui/buttons';
import { FieldItem } from '@6d-ui/fields';

class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleId: props.roleId,
      roleName: props.roleName,
      type: props.type && props.type == 1 ? {
        value: '1',
        label: 'Transactional'
      } :
        {
          value: '0',
          label: 'Non Transactional'
        }
    };
  }

  onSearch() {
    const data = {
      "roleName": this.state.roleName,
      "roleId": this.state.roleId,
      "type": this.state?.type?.value 
    };
    this.props.onSubmitClick(data);
  }

  handleChange(name, value, obj) {
    const { isTouched } = obj || { isTouched: false };
    if (!isTouched) {
      this.setState({ [name]: value });
    }
  }

  onClearClick() {
    const data = {
      "roleName": '',
      "roleId": '',
      'type': null
    };
    this.props.onSubmitClick(data);
    this.props.onCancel();
  }
  render() {
    return (
      <>
        <ModalBody>
          <Row className="mx-0 dataTableFormgroup">
            <FieldItem
              name="roleId"
              placeholder="Role Id"
              label="Role Id"
              width="md"
              value={this.state.roleId}
              onChange={this.handleChange.bind(this, "roleId")}
              touched={false}
              error=""
            />
            <FieldItem
              name="roleName"
              value={this.state.roleName}
              placeholder="Role Name"
              label="Role Name"
              width="md"
              onChange={this.handleChange.bind(this, "roleName")}
              touched={false}
              error=""
            />
            <FieldItem
              name="type"
              value={this.state.type}
              placeholder="Select"
              label="Type"
              width="md"
              onChange={this.handleChange.bind(this, "type")}
              touched={false}
              error=""
              type = "1"
              values={[
                {
                  value: '1',
                  label: 'Transactional'
                },
                {
                  value: '0',
                  label: 'Non Transactional'
                }
              ]}
            />

          </Row>

          <ModalFooter>
            <CustomButton
              style={BUTTON_STYLE.BRICK}
              type={BUTTON_TYPE.SECONDARY}
              size={BUTTON_SIZE.LARGE}
              color={COLOR.PRIMARY}
              align="right"
              label="Clear"
              isButtonGroup={true}
              onClick={this.onClearClick.bind(this)}
            />
            <CustomButton
              style={BUTTON_STYLE.BRICK}
              type={BUTTON_TYPE.PRIMARY}
              size={BUTTON_SIZE.LARGE}
              align="right"
              label="Search"
              isButtonGroup={true}
              onClick={() => {
                this.onSearch();
                this.props.onCancel();
              }}
            />

          </ModalFooter>
        </ModalBody>
      </>
    );
  }
}

export default SearchFilter;
