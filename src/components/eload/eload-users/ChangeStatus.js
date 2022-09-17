import React from 'react'
import { FieldItem, FIELD_TYPES, useFieldItem } from '@6d-ui/fields';
import { Row, ModalBody, ModalFooter } from 'reactstrap';
import {
    CustomButton,
    BUTTON_TYPE,
    BUTTON_SIZE,
    BUTTON_STYLE,
    COLOR
} from '@6d-ui/buttons';


const FormElements = {
    state: {
        name: "state",
        placeholder: "Status",
        label: "Status",
        width: "sm",
        ismandatory: false
    },
    reason: {
        name: "reason",
        placeholder: "Reason",
        label: "Reason",
        width: "sm",
        Length: 50,
        type: FIELD_TYPES.TEXT_AREA,
    }
}
export default function ChangeStatus(props) {
    const { statusOption, onCancel, CHANGE_URL, userID, changeAction, msisdn } = props;
    const [values, fields, handleChange, { validateValues, reset, updateValue }] = useFieldItem(FormElements, {}, { onValueChange })

    const changeStatusCall = () => {
        if (validateValues(["state"])) {
            props.setNotification({
                hasError: true,
                message: "Please select Status"
            })
            return
        }

        props.ajaxUtil.sendRequest(CHANGE_URL, {
            msisdn: msisdn,
            state: values.state && values.state.value,
            userId: userID,
            reason: values.reason || ''
        }, (response, hasError) => {
            if (!hasError && response) {
                onCancel()
                changeAction()
            }
        }, props.loadingFunction, { method: 'PUT' });
    }
    function onValueChange(name, value, values, fieldValues) {
        switch (name) {
            case "reason":
                if (value.length > FormElements[name].Length) {
                    return [{
                        ...values,
                        [name]: value.substring(0, FormElements[name].Length)
                    }]
                }
            default:
                return [{
                    ...values,
                    [name]: value
                }]
        }
    }
    return (
        <ModalBody className="bg-white">
            <div class="pl-3 form-Brick-Head">
                <span>Please Select the  New Status</span>
            </div>
            <Row className="mx-0">
                <FieldItem
                    {...FormElements.state}
                    value={values.state}
                    values={statusOption}
                    type={FIELD_TYPES.DROP_DOWN}
                    onChange={(...e) => handleChange(FormElements.state.name, ...e)}
                    disabled={false}
                    touched={false}
                    error=""
                />
                <FieldItem
                    {...FormElements.reason}
                    value={values.reason}
                    onChange={(...e) => handleChange(FormElements.reason.name, ...e)}
                    disabled={false}
                    touched={false}
                    error=""
                />
            </Row>
            <ModalFooter>
                <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.MEDIUM}
                    color={COLOR.PRIMARY}
                    align="right"
                    label="Cancel"
                    isButtonGroup={true}
                    onClick={onCancel}
                />
                <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.PRIMARY}
                    size={BUTTON_SIZE.MEDIUM}
                    align="right"
                    label="Change"
                    isButtonGroup={true}
                    onClick={() => changeStatusCall()}
                />
            </ModalFooter>
        </ModalBody>
    );
}