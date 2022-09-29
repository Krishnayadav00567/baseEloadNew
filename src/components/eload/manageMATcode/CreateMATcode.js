import React, { useEffect, useState } from "react";
import { ModalBody, ModalFooter, Row, Col } from "reactstrap";
import ResponsiveContainer from "../../util/ResponsiveContainer";
import {
  CustomButton,
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_SIZE,
} from "@6d-ui/buttons";
import {
  FieldItem,
  FIELD_TYPES,
  useFieldItem,
  validateForm,
} from "@6d-ui/fields";
import { FormElements } from "./util/Utils";
import Form from "./Form";

export default function CreateMATcode(props) {
  const { URLS, ajaxUtil, loadingFunction, setNotification, close, onSuccess } =
    props;
  const [denominationOpts, setDenominationOpts] = useState([]);
  const [pocketType, setPocketType] = useState([]);
  const [formNumber, setFormNumber] = useState(1);
  const [editVal, setEditVal] = useState(1);
  const [request, setRequest] = useState([]);
  const [keeper, setKeeper] = useState({
    matCode: "",
    pocketTypeId: "",
    denomination: "",
  });

  const [errorList, setErrorList] = useState();
  const [errorMessage, setErrorMessage] = useState();
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

  const onChange = (data, value) => {
    if ((data == "pocketTypeId" || data == "denomination") && value === null) {
      return;
    }
    if (data == "pocketTypeId" && value && value !== null) {
      denomination_dropdown(value.value);
      setKeeper({ ...keeper });
    }
    setKeeper(() => {
      return {
        ...keeper,
        [data]: value,
      };
    });
  };
  const validateFields = (dataobj) => {
    const err = Object.keys(dataobj).filter((key) => {
      if (FormElements[key]) {
        const field = FormElements[key];
        const validate = validateForm(field.name, dataobj[key], field);
        if (validate && validate.hasError) {
          setErrorList({ ...validate });
          return validate;
        } else {
          return null;
        }
      }
    });
    setErrorMessage([...err]);
    if (err.length > 0) {
      return true;
    } else {
      setKeeper({});
      setErrorMessage([]);
      return false;
    }
  };
  const addToList = () => {
    setRequest([
      ...request,
      {
        denominationId: keeper?.denomination?.value
          ? keeper?.denomination?.value
          : "",
        matCode: keeper?.matCode || "",
        pocketId: keeper?.pocketTypeId?.value || "",
      },
    ]);
    setKeeper();
  };
  const onCreateClick = (valid) => {
    addToList();
    if (valid == "AddMore") {
      setKeeper({ matCode: "", pocketTypeId: "", denomination: "" });
      return true;
    } else {
    }
  };

  const confirm = () => {
    addToList();
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
              onClick={() => {
                if (!validateFields(keeper)) {
                  if (onCreateClick("AddMore")) {
                    setFormNumber(formNumber + 1);
                    setEditVal(1);
                  }
                }
              }}
            />
          </div>
        </Row>
        {formNumber > 0
          ? [...Array(formNumber)].map((value, index) => (
              <Form
                key={index}
                values={values}
                handleChange={handleChange}
                pocketType={pocketType}
                fields={fields}
                denominationOpts={denominationOpts}
                setFormNumber={setFormNumber}
                formNumber={formNumber}
                setEditVal={setEditVal}
                index={index}
                editVal={editVal}
                request={request}
                setRequest={setRequest}
                close={close}
                onChange={onChange}
                errorMessage={errorMessage}
                errorList={errorList}
                setKeeper={setKeeper}
                setErrorMessage={setErrorMessage}
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
          onClick={() => confirm()}
        />
      </ModalFooter>
    </ModalBody>
  );
}
