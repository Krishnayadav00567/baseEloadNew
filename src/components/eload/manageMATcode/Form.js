import React, { useEffect, useState } from "react";
import { ModalBody, ModalFooter, Row, Col } from "reactstrap";
import { FieldItem, FIELD_TYPES, useFieldItem } from "@6d-ui/fields";
import { FormElements } from "./util/Utils";
import {
    CustomButton,
    BUTTON_STYLE,
    BUTTON_TYPE,
    BUTTON_SIZE,
  } from "@6d-ui/buttons";
const Form = (props) => {
    console.log(props.formNumber);
  return (
    <>
      <div className=" bg-white">
        <Row className="noMargin dataTableFormGroup m-0">
        <div style={{ margin: "auto", width: "100%", padding: "10px" }}>
            <CustomButton
              style={BUTTON_STYLE.BRICK}
              type={BUTTON_TYPE.SECONDARY}
              size={BUTTON_SIZE.MEDIUM_LARGE}
              align="right"
              label="Cancel"
              isButtonGroup={true}
              onClick={()=>props.setFormNumber(props.formNumber-1)}
            />
          </div>
          <Col md="12" className="channel-type">
            <FieldItem
              {...FormElements.matCode}
              type={FIELD_TYPES.TEXT}
              value={props.values.matCode}
              onChange={(...e) => props.handleChange("matCode", ...e)}
            //   touched={props.fields.matCode && props.fields.matCode.hasError}
            //   error={props.fields.matCode && props.fields.matCode.errorMsg}
            />
          </Col>
          <Col md="12" className="channel-type">
            <FieldItem
              {...FormElements.pocketTypeId}
              value={props.values.pocketTypeId}
              values={props.pocketType}
              onChange={(...e) =>
                props.handleChange(FormElements.pocketTypeId.name, ...e)
              }
              type={FIELD_TYPES.DROP_DOWN}
            //   touched={
            //     props.fields.pocketTypeId && props.fields.pocketTypeId.hasError
            //   }
            //   error={
            //     props.fields.pocketTypeId && props.fields.pocketTypeId.errorMsg
            //   }
            />
          </Col>
          <Col md="12" className="channel-type">
            <FieldItem
              {...FormElements.denomination}
              type={FIELD_TYPES.DROP_DOWN}
              values={props.denominationOpts}
              value={
                props.values.denomination ? props.values.denomination : null
              }
              onChange={(...e) => props.handleChange("denomination", ...e)}
            //   touched={
            //     props.fields.denomination &&
            //     props.props.fields.denomination.hasError
            //   }
            //   error={
            //     props.fields.denomination && props.fields.denomination.errorMsg
            //   }
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Form;
