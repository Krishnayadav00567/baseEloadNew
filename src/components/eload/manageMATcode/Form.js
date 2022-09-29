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
  const removeFromArray = () => {
    const temp = [...props.request];
    temp.pop();
    props.setRequest(() => {
      return [...temp];
    });
  };
  return (
    <>
      <div className=" bg-white">
        <Row className="noMargin dataTableFormGroup m-0">
          <div style={{ margin: "auto", width: "100%", padding: "10px" }}>
            {props.index === props.request.length ? (
              <CustomButton
                style={BUTTON_STYLE.BRICK}
                type={BUTTON_TYPE.SECONDARY}
                size={BUTTON_SIZE.MEDIUM_LARGE}
                align="right"
                label="Cancel"
                isButtonGroup={true}
                onClick={() => {
                  const temp = props.request[props.request.length - 1];
                  props.setKeeper({ ...temp });
                  props.setFormNumber(props.formNumber - 1);
                  props.setErrorMessage();
                  removeFromArray();
                  if (props.formNumber == 1) {
                    props.close();
                  }
                }}
              />
            ) : null}
          </div>
          <Col md="12" className="channel-type">
            <FieldItem
              {...FormElements.matCode}
              type={FIELD_TYPES.TEXT}
              disabled={props.index < props.request.length}
              value={props.request[props.index]?.matCode}
              onChange={(...e) => props.onChange("matCode", ...e)}
              touched={
                props.index == props.request.length &&
                props.errorMessage?.some((key) => key == "matCode") &&
                props.errorList.hasError
              }
              error={
                props.index == props.request.length &&
                props.errorMessage?.some((key) => key == "matCode") &&
                props.errorList.errorMsg
              }
            />
          </Col>
          <Col md="12" className="channel-type">
            <FieldItem
              {...FormElements.pocketTypeId}
              value={props.request[props.index]?.pocketTypeId}
              values={props.pocketType}
              disabled={props.index < props.request.length}
              onChange={(...e) =>
                props.onChange(FormElements.pocketTypeId.name, ...e)
              }
              type={FIELD_TYPES.DROP_DOWN}
              touched={
                props.index == props.request.length &&
                props.errorMessage?.some((key) => key == "pocketTypeId") &&
                props.errorList.hasError
              }
              error={
                props.index == props.request.length &&
                props.errorMessage?.some((key) => key == "pocketTypeId") &&
                props.errorList.errorMsg
              }
            />
          </Col>
          <Col md="12" className="channel-type">
            <FieldItem
              {...FormElements.denomination}
              disabled={props.index < props.request.length}
              type={FIELD_TYPES.DROP_DOWN}
              values={props.denominationOpts}
              value={
                props.request[props.index]?.denominationId
                  ? props.request[props.index]?.denominationId
                  : ""
              }
              onChange={(...e) => props.onChange("denomination", ...e)}
              touched={
                props.index == props.request.length &&
                props.errorMessage?.some((key) => key == "denomination") &&
                props.errorList.hasError
              }
              error={
                props.index == props.request.length &&
                props.errorMessage?.some((key) => key == "denomination") &&
                props.errorList.errorMsg
              }
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Form;
