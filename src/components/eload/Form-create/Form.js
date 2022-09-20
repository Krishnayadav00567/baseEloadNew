import React from "react";
import { Container, Row, Col } from "reactstrap";
import { FieldItem, useFieldItem, FIELD_TYPES } from "@6d-ui/fields";
import {
  CustomButton,
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_SIZE,
  BUTTON_ALIGN,
  COLOR,
} from "@6d-ui/buttons";

const Form = (props) => {
  return (
    <>
      <div className="custom-container">
        <CustomButton
          style={BUTTON_STYLE.BRICK}
          type={BUTTON_TYPE.PRIMARY}
          size={BUTTON_SIZE.MEDIUM_LARGE}
          align="right"
          label="Add"
          isButtonGroup={true}
        />
         <CustomButton
          style={BUTTON_STYLE.BRICK}
          type={BUTTON_TYPE.SECONDARY}
          size={BUTTON_SIZE.MEDIUM_LARGE}
          align="right"
          label="Cancel"
          isButtonGroup={true}
        />
        <div className="form-Brick-body h-70">
          <Row>
            <Col md="3" className="channel-type">
              <FieldItem label="Title" type={FIELD_TYPES.DROP_DOWN} />
            </Col>

            <Col md="3" className="channel-type">
              <FieldItem label="First Name" type={FIELD_TYPES.TEXT} />
            </Col>
            <Col md="3" className="channel-type">
              <FieldItem label="Last Name" type={FIELD_TYPES.TEXT} />
            </Col>
            <Col md="3" className="channel-type">
              <FieldItem label="Department" type={FIELD_TYPES.TEXT} />
            </Col>
            <Col md="4" className="channel-type">
              <span className="prefix" style={{ zIndex: 1 }}>
                +62
              </span>
              <FieldItem
                label="Contact Person Mobile Number"
                type={FIELD_TYPES.TEXT}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Form;
