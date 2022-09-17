import React, { useEffect, useState, useMemo } from 'react'
import { ModalBody, ModalFooter, Row, Col } from 'reactstrap'
import ResponsiveContainer from '../../util/ResponsiveContainer'
import { CustomButton, BUTTON_STYLE, BUTTON_TYPE, BUTTON_SIZE } from "@6d-ui/buttons";
import { FieldItem, FIELD_TYPES, useFieldItem } from '@6d-ui/fields';
import { FormElements } from './util/Utils';


export default function EditMATcode(props) {
    const { URLS, ajaxUtil, loadingFunction, setNotification, close, onSuccess, data } = props
    const [denominationOpts, setDenominationOpts] = useState([])
    const [pocketType, setPocketType] = useState([])
    useEffect(() => {
        get_pocket_types()
        denomination_dropdown(data.pocketId)
        // ajaxUtil.sendRequest(`${URLS.LIST_DENOMIATION}`, {}, (response, hasError) => {
        //     if (!hasError && response && response.length)
        //         setDenominationOpts(response.map(data => ({
        //             label: data.denominationDesc,
        //             value: data.denominationId,
        //         })))
        // }, loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });
    }, [])
    const get_pocket_types = () => {
        props.ajaxUtil.sendRequest(props.URLS.POCKET_TYPE_DROP, {}, (response, hasError) => {
            setPocketType(response.map(res => ({
                'value': res.pocketId,
                'label': res.pocketName,
            })))
        }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isProceedOnError: false });
    }
    const denomination_dropdown = (pockettype) => {
        ajaxUtil.sendRequest(`${URLS.LIST_DENOMIATION + "?pocketType="}${pockettype}`, {}, (response, hasError) => {
                if (!hasError && response && response.length)
                    setDenominationOpts(response.map(data => ({
                        label: data.denominationValue,
                        value: data.denominationId,
        })))
        else setDenominationOpts([])
            }, loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });
    }
    const formValues = useMemo(() => ({
        denomination: (data && data.denominationValue && data.denominationId) ? {
            label: data.denominationValue,
            value: data.denominationId
        } : null,
        pocketTypeId : (data && data.pocketName && data.pocketId) ? {
            label: data.pocketName,
            value: data.pocketId
        } : null
    }), [data]);

    function onValueChange(name, value, values, fieldValues) {
        if (value && value !== null) {
            if (name == 'pocketTypeId') {
                denomination_dropdown(value.value)
                values.denomination = "";
            }
            return [{
                ...values,
                [name]: value,
            }]
        }
        
        else {
            if (name == "pocketTypeId") {

                setDenominationOpts([])
                values.denomination = "";
            }
            return [{
                ...values,
                [name]: value,
            }]
        }
    }

    const [values, fields, handleChange, { validateValues }] = useFieldItem(FormElements, formValues, {onValueChange});

    const onUpdateClick = () => {
        if (validateValues(["denomination"])) {
            setNotification({
                hasError: true,
                message: 'Please enter mandatory fields.'
            })
            return
        }

        const request = {
            denominationId: values.denomination.value ? values.denomination.value : values.denomination,
            matCode: data.matCode,
            id: data.id,
            pocketId: values.pocketTypeId.value,
        }

        ajaxUtil.sendRequest(URLS.UPDATE_URL, request, (response, hasError) => {
            if (!hasError) {
                onSuccess()
                close()
            }
        }, loadingFunction, { method: 'PUT' });
    }
    return (
        <ModalBody>
            <ResponsiveContainer className=" bg-white">
                <Row className="noMargin dataTableFormGroup m-0">
                    <Col md="12" className="channel-type">
                        <FieldItem
                            {...FormElements.matCode}
                            type={FIELD_TYPES.VIEW_DETAILS_BOX}
                            value={data.matCode}
                        />
                    </Col>
                    <Col md="12" className="channel-type">
                        <FieldItem
                            {...FormElements.pocketTypeId}
                            value={values.pocketTypeId}
                            values={pocketType}
                            onChange={(...e) => handleChange(FormElements.pocketTypeId.name, ...e)}
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
                            value={values.denomination?values.denomination:null}
                            onChange={(...e) => handleChange('denomination', ...e)}
                            touched={fields.denomination && fields.denomination.hasError}
                            error={fields.denomination && fields.denomination.errorMsg}
                        />
                    </Col>
                </Row>
            </ResponsiveContainer>
            <ModalFooter>
                <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.LARGE}
                    align="right"
                    label="Cancel"
                    isButtonGroup={true}
                    onClick={close}
                />
                <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.PRIMARY}
                    size={BUTTON_SIZE.LARGE}
                    align="right"
                    label="Update"
                    isButtonGroup={true}
                    onClick={onUpdateClick}
                />
            </ModalFooter>
        </ModalBody>
    )
}