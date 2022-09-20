import React, { useEffect, useState } from "react";
import { ModalBody, ModalFooter, Row, Col } from "reactstrap";
import ResponsiveContainer from "../../util/ResponsiveContainer";
import {
  CustomButton,
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_SIZE,
} from "@6d-ui/buttons";
import { FieldItem, FIELD_TYPES, useFieldItem } from "@6d-ui/fields";
import { FormElements } from "./util/Utils";
import Form from "./Form";

export default function CreateMATcode(props) {
  const { URLS, ajaxUtil, loadingFunction, setNotification, close, onSuccess } =
    props;
  const [denominationOpts, setDenominationOpts] = useState([]);
  const [pocketType, setPocketType] = useState([]);
  const [formNumber, setFormNumber] = useState(0);

  useEffect(() => {
    get_pocket_types();
    // ajaxUtil.sendRequest(`${URLS.LIST_DENOMIATION}`, {}, (response, hasError) => {
    //     if (!hasError && response && response.length)
    //         setDenominationOpts(response.map(data => ({
    //             label: data.denominationDesc,
    //             value: data.denominationId,
    //         })))
    // }, loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });
  }, []);

  const [values, fields, handleChange, { validateValues }] = useFieldItem(
    FormElements,
    {},
    { onValueChange }
  );
  const get_pocket_types = () => {
    props.ajaxUtil.sendRequest(
      props.URLS.POCKET_TYPE_DROP,
      {},
      (response, hasError) => {
        setPocketType(
          response.map((res) => ({
            value: res.pocketId,
            label: res.pocketName,
          }))
        );
      },
      props.loadingFunction,
      { method: "GET", isShowSuccess: false, isProceedOnError: false }
    );
  };
  const denomination_dropdown = (pockettype) => {
    ajaxUtil.sendRequest(
      `${URLS.LIST_DENOMIATION + "?pocketType="}${pockettype}`,
      {},
      (response, hasError) => {
        if (!hasError && response && response.length)
          setDenominationOpts(
            response.map((data) => ({
              label: data.denominationValue,
              value: data.denominationId,
            }))
          );
        else setDenominationOpts([]);
      },
      loadingFunction,
      { method: "GET", isShowSuccess: false, isShowFailure: false }
    );
  };
  function onValueChange(name, value, values, fieldValues) {
    if (value && value !== null) {
      if (name == "pocketTypeId") {
        denomination_dropdown(value.value);
        values.denomination = "";
      }
      return [
        {
          ...values,
          [name]: value,
        },
      ];
    } else {
      if (name == "pocketTypeId") {
        setDenominationOpts([]);
        values.denomination = "";
      }
      return [
        {
          ...values,
          [name]: value,
        },
      ];
    }
  }
  const onCreateClick = () => {
    if (validateValues(["matCode", "denomination", "pocketTypeId"])) {
      setNotification({
        hasError: true,
        message: "Please enter mandatory fields.",
      });
      return;
    }

    const request = {
      denominationId: values.denomination.value
        ? values.denomination.value
        : "",
      matCode: values.matCode,
      pocketId: values.pocketTypeId.value,
      // pocketName: values.pocketTypeId.label
    };

    ajaxUtil.sendRequest(
      URLS.CREATE_URL,
      request,
      (response, hasError) => {
        if (!hasError) {
          onSuccess();
          close();
        }
      },
      loadingFunction,
      { method: "POST" }
    );
  };
  return (
    <ModalBody>
      <ResponsiveContainer className=" bg-white">
        <Row className="noMargin dataTableFormGroup m-0">
          <div style={{ margin: "auto", width: "100%", padding: "10px" }}>
            <CustomButton
              style={BUTTON_STYLE.BRICK}
              type={BUTTON_TYPE.PRIMARY}
              size={BUTTON_SIZE.MEDIUM_LARGE}
              align="right"
              label="Add More"
              isButtonGroup={true}
              onClick={() => setFormNumber(formNumber + 1)}
            />
            <CustomButton
              style={BUTTON_STYLE.BRICK}
              type={BUTTON_TYPE.SECONDARY}
              size={BUTTON_SIZE.MEDIUM_LARGE}
              align="right"
              label="Cancel"
              isButtonGroup={true}
              onClick={() => setFormNumber(formNumber > 0 ? formNumber - 1 : 0)}
            />
          </div>
          <Col md="12" className="channel-type">
            <FieldItem
              {...FormElements.matCode}
              type={FIELD_TYPES.TEXT}
              value={values.matCode}
              onChange={(...e) => handleChange("matCode", ...e)}
              touched={fields.matCode && fields.matCode.hasError}
              error={fields.matCode && fields.matCode.errorMsg}
            />
          </Col>
          <Col md="12" className="channel-type">
            <FieldItem
              {...FormElements.pocketTypeId}
              value={values.pocketTypeId}
              values={pocketType}
              onChange={(...e) =>
                handleChange(FormElements.pocketTypeId.name, ...e)
              }
              type={FIELD_TYPES.DROP_DOWN}
              touched={fields.pocketTypeId && fields.pocketTypeId.hasError}
              error={fields.pocketTypeId && fields.pocketTypeId.errorMsg}
            />
          </Col>
          <Col md="12" className="channel-type">
            <FieldItem
              {...FormElements.denomination}
              type={FIELD_TYPES.DROP_DOWN}
              values={denominationOpts}
              value={values.denomination ? values.denomination : null}
              onChange={(...e) => handleChange("denomination", ...e)}
              touched={fields.denomination && fields.denomination.hasError}
              error={fields.denomination && fields.denomination.errorMsg}
            />
          </Col>
        </Row>
        {formNumber > 0
          ? [...Array(formNumber)].map((value, index) => (
              <Form
                key={index}
                onValueChange={onValueChange}
                values={values}
                handleChange={handleChange}
                pocketType={pocketType}
                fields={fields}
                denominationOpts={denominationOpts}
                setFormNumber={setFormNumber}
                formNumber={formNumber}
              />
            ))
          : null}
      </ResponsiveContainer>

      <ModalFooter>
        <CustomButton
          style={BUTTON_STYLE.BRICK}
          type={BUTTON_TYPE.SECONDARY}
          size={BUTTON_SIZE.LARGE}
          align="right"
          label="Cancel from App"
          isButtonGroup={true}
          onClick={close}
        />
        <CustomButton
          style={BUTTON_STYLE.BRICK}
          type={BUTTON_TYPE.PRIMARY}
          size={BUTTON_SIZE.LARGE}
          align="right"
          label="Confirm"
          isButtonGroup={true}
          onClick={onCreateClick}
        />
      </ModalFooter>
    </ModalBody>
  );
}
