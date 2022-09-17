import React, { useState, useEffect, useMemo } from 'react';
import { Container, Button, Row, Col } from 'reactstrap';
import {
    CustomButton,
    BUTTON_TYPE,
    BUTTON_SIZE,
    BUTTON_STYLE,
    COLOR
} from '@6d-ui/buttons';
import { FormElements as FIELDS } from './util/DataTableHeader';
import { FieldItem, FIELD_TYPES, useFieldItem, validateForm } from '@6d-ui/fields';
import { COUNTRY_CODE, MESSAGES } from '../../../util/Constants';
import _ from 'lodash';
import { trimCountryCode } from '../../../util/Util';

function CreateEloadUser(props) {
    const [options, setOptions] = useState({});
    const { onSuccess, goBack, isEdit, userDetails } = props;
    const [mdnSuccess, setMdnSuccess] = useState(false);
    const defaultTme = 2;
    const { channelId, channelName, regionId, regionName, clusterId, clusterName } = props.loggedInUser
    const [otpRequired, setIsOtpRequired] = useState(false)
    const initialValues = useMemo(() => {
        if (isEdit)
            return {
                userId: userDetails.userId || '',
                userName: userDetails.userName || '',
                firstName: userDetails.firstName || '',
                lastName: userDetails.lastName || '',
                email: userDetails.email || '',
                language: userDetails.languageId || '',
                role: userDetails.roleId || '',
                channelId: userDetails.channelId && userDetails.channelName ? { value: userDetails.channelId, label: userDetails.channelName } : null,
                regionId: userDetails.regionId && userDetails.regionName ? { value: userDetails.regionId, label: userDetails.regionName } : null,
                clusterId: userDetails.clusterId && userDetails.clusterName ? { value: userDetails.clusterId, label: userDetails.clusterName } : null,
                // territory: userDetails.territoryId || '',
                timeZone: userDetails.timeZone || '',
                status: userDetails.status || '',
                statusId: userDetails.statusId || '',
                securityLock: userDetails.securityLockId || '',
                msisdn: trimCountryCode(userDetails.msisdn || ''),
                timeZoneName: userDetails.timeZoneName || ''
            }
        else
            return {
                timeZone: options && options.timeZone && options.timeZone.filter(k => k.value == defaultTme).length > 0 ? options.timeZone.filter(k => k.value == defaultTme)[0] : null,
                language: options?.language?.length && options.language.filter(l => l.value.toUpperCase().trim() === 'I').length > 0 ? options.language.filter(l => l.value.toUpperCase().trim() === 'I')[0] : null,
                channelId: channelId && channelName && channelId != 1 ? { value: channelId, label: channelName } : null,
                regionId: regionId && regionName && channelId != 1 ? { value: regionId, label: regionName } : null,
                clusterId: clusterId && clusterName && channelId != 1 ? { value: clusterId, label: clusterName } : null,
            }
    }, [userDetails, options.timeZone, options.language])
    const [values, fields, handleChange, { validateValues, reset, updateValue }] = useFieldItem(FIELDS, initialValues, { onValueChange });

    useEffect(() => {
        if (isEdit) {
            if (userDetails.channelId)
                setRegionOpts(userDetails.channelId)
            if (userDetails.regionId)
                setClusterOpts(userDetails.regionId)
            setIsOtpRequired(userDetails.otpRequired)
        }
    }, [userDetails])
    // useEffect(() => {
    //     if (options?.language?.length && !isEdit) {
    //         (options.language).map(lan => {
    //             if (lan.value && lan.value.toUpperCase().trim() === 'I')
    //                 updateValue({
    //                     language: lan
    //                 })
    //         })
    //     }
    // }, [options.language])

    useEffect(() => {
        props.ajaxUtil.sendRequest(`${props.URLS.GET_LANGUAGES}`, {}, (response, hasError) => {
            if (!hasError && response) {
                setOptions(options => ({
                    ...options,
                    ["language"]: (response.reduce((opts, resp) => {
                        opts = [...opts, {
                            value: resp.languageId,
                            label: resp.language
                        }]
                        return opts;
                    }, []))
                }));
            }
        }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });
        props.ajaxUtil.sendRequest(`${props.URLS.LIST_COMMERCIAL_CHANNELS_URLS}`, {}, (response, hasError) => {
            if (!hasError && response) {
                setOptions(options => ({
                    ...options,
                    ["channelId"]: (response.reduce((opts, resp) => {
                        opts = [...opts, {
                            value: resp.id,
                            label: resp.channelName
                        }]
                        return opts;
                    }, []))
                }));
            }
        }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });

        props.ajaxUtil.sendRequest(`${props.URLS.GET_USER_ROLES}${props.loggedInUser.levelId}`, {}, (response, hasError) => {
            if (!hasError && response && response.length > 0 && response[0].roleDetails) {
                setOptions(options => ({
                    ...options,
                    ["role"]: (response[0].roleDetails.reduce((opts, resp) => {
                        opts = [...opts, {
                            value: resp.roleId,
                            label: resp.roleName
                        }]
                        return opts;
                    }, []))
                }));
            }
        }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });

        props.ajaxUtil.sendRequest(props.URLS.LIST_TIME_ZONE, {}, (response, hasError) => {
            if (!hasError && response.response && (response.response).length)
                setOptions(options => ({
                    ...options,
                    ["timeZone"]: (response.response.reduce((opts, resp) => {
                        opts = [...opts, {
                            value: resp.id,
                            label: resp.timeZone
                        }]
                        return opts;
                    }, []))
                }));
        }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });

        if (channelId && channelId != 1 && !regionId)
            setRegionOpts(channelId)
        if (regionId && !clusterId && channelId != 1)
            setClusterOpts(regionId)
    }, [])


    const createButtonHandler = () => {
        const hasError = validateValues(Object.keys(FIELDS));

        if (hasError) {
            props.setNotification({
                message: 'Please enter proper values in fields highlighted in red',
                hasError: true
            })
            return
        }
        if (values.msisdn) {
            if (!mdnSuccess) {
                props.setNotification({
                    message: `Please Enter Valid MDN`,
                    hasError: true
                })
                return
            }
        }
        const req = {
            "email": values && values.email || '',
            "firstName": values && values.firstName || '',
            "language": values && values.language && values.language.value || '',
            "lastName": values && values.lastName || '',
            "roleId": values && values.role && values.role.value || '',
            "channelId": values && values.channelId && values.channelId.value || '',
            "regionId": values && values.regionId && values.regionId.value || '',
            "clusterId": values && values.clusterId && values.clusterId.value || '',
            "timeZone": values && values.timeZone && values.timeZone.value || '',
            "userName": values && values.userName || '',
            "status": 16,
            'securityLock': 5,
            'msisdn': values && values.msisdn || null,
            otpRequired: otpRequired
        }
        props.ajaxUtil.sendRequest(`${props.URLS.CREATE_USER}`, req, (response, hasError) => {
            if (!hasError && response) {
                onSuccess();
                goBack();
            }
        }, props.loadingFunction, { method: 'POST', isShowSuccess: true, isShowFailure: true });

    }
    const updateButtonHandler = () => {
        const hasError = validateValues(Object.keys(FIELDS).filter(name => !['userName', 'msisdn'].includes(name)), ['userName', 'msisdn']);
        if (values.msisdn && values.msisdn!= trimCountryCode(userDetails.msisdn || '')) {
            if (!mdnSuccess) {
                props.setNotification({
                    message: `Please Enter Valid MDN`,
                    hasError: true
                })
                return
            }
        }
        if (!hasError) {
            const req = {
                "email": values && values.email || '',
                "firstName": values && values.firstName || '',
                "language": values && values.language && values.language.value ? values.language.value : values.language,
                "lastName": values && values.lastName || '',
                "roleId": values && values.role && values.role.value ? values.role.value : values.role,
                "channelId": values?.channelId?.value ? values.channelId.value : values.channelId,
                "regionId": values?.regionId?.value ? values.regionId.value : values.regionId,
                "clusterId": values?.clusterId?.value ? values.clusterId.value : values.clusterId,
                "timeZone": values && values.timeZone && values.timeZone.value ? values.timeZone.value : values.timeZone,
                "userName": values && values.userName || '',
                "status": values && values.statusId || '',
                'securityLock': values && values.securityLock,
                'userId': values && values.userId || '',
                'msisdn': values && values.msisdn != 0 ? values.msisdn : null,
                otpRequired: otpRequired
            }
            props.ajaxUtil.sendRequest(`${props.URLS.UPDATE_USER}`, req, (response, hasError) => {
                if (!hasError && response) {
                    onSuccess();
                    goBack();
                }
            }, props.loadingFunction, { method: 'PUT', isShowSuccess: true, isShowFailure: true });
        } else {
            props.setNotification({
                message: 'Please enter proper values in fields highlighted in red',
                hasError: true
            })
        }
    }
    const validateMdn = (mdn) => {
        if(mdn.length<10)
        {
            props.setNotification({
                message: 'Please enter proper MDN',
                hasError: true
            })
            return
        }
        props.ajaxUtil.sendRequest(`${props.URLS.VALIDATE_MDN}?msisdn=${mdn}`, {}, (response, hasError) => {
            if (hasError) {
                setMdnSuccess(false)
            }
            else setMdnSuccess(true)
        }, props.loadingFunction, { method: 'POST', isShowSuccess: false, isShowFailure: true });
    }

    const setRegionOpts = (channelId) => {
        props.ajaxUtil.sendRequest(`${props.URLS.LIST_REGION_URL}?channelId=${channelId}`, {}, (response, hasError) => {
            if (!hasError && response?.length)
                setOptions(options => ({
                    ...options,
                    ["clusterId"]: [],
                    ["regionId"]: (response.reduce((opts, resp) => {
                        opts = [...opts, {
                            value: resp.locationId,
                            label: resp.locationName
                        }]
                        return opts;
                    }, []))
                }));
        }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });
    }

    const setClusterOpts = (regionId) => {
        props.ajaxUtil.sendRequest(`${props.URLS.GET_TERITORY}?parentId=${regionId}`, {}, (response, hasError) => {
            if (!hasError && response) {
                setOptions(options => ({
                    ...options,
                    ["clusterId"]: (response.reduce((opts, resp) => {
                        opts = [...opts, {
                            value: resp.locationId,
                            label: resp.locationName
                        }]
                        return opts;
                    }, []))
                }));
            }
        }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });

    }

    function onValueChange(name, value, values, fieldValues) {
        switch (name) {
            case "msisdn":
                // if (value.length >= 10 && Number(value))
                //     validateMdn(value)
                // else
                //     setMdnSuccess(false)
                setMdnSuccess(false)
                return [{
                    ...values,
                    [name]: value,
                }]

            case 'channelId':
                if (value?.value)
                    setRegionOpts(value.value)
                else setOptions(options => ({
                    ...options,
                    ["clusterId"]: [],
                    ['regionId']: []
                }))
                return [{
                    ...values,
                    clusterId: null,
                    regionId: null,
                    [name]: value,
                }]

            case 'regionId':
                if (value?.value)
                    setClusterOpts(value.value)
                else setOptions(options => ({
                    ...options,
                    ["clusterId"]: []
                }))
                return [{
                    ...values,
                    clusterId: null,
                    [name]: value,
                }]

            default:
                return [{
                    ...values,
                    [name]: value,
                }]
        }
    }

    return (
        <>
            <div className="form-Brick-body">
                {isEdit ? <Row className="mx-0">
                    <Col md="4" className="channel-type">
                        <FieldItem
                            {...FIELDS.userId}
                            value={values.userId}
                            type="11"
                        />
                    </Col>
                    <Col md="4" className="channel-type">
                        <FieldItem
                            {...FIELDS.userName}
                            value={values.userName}
                            type="11"
                        />
                    </Col>
                    <Col md="4" className="channel-type">
                        <FieldItem
                            {...FIELDS.firstName}
                            value={values.firstName}
                            onChange={(...e) => handleChange(FIELDS.firstName.name, ...e)}
                            touched={fields.firstName && fields.firstName.hasError}
                            error={fields.firstName && fields.firstName.errorMsg}
                        />
                    </Col>
                    <Col md="4" className="channel-type">
                        <FieldItem
                            {...FIELDS.lastName}
                            value={values.lastName}
                            onChange={(...e) => handleChange(FIELDS.lastName.name, ...e)}
                            touched={fields.lastName && fields.lastName.hasError}
                            error={fields.lastName && fields.lastName.errorMsg}
                        />
                    </Col>
                    <Col md="4" className="channel-type modal-eload">
                        {props.privilages.some(p => p === props.menuPrivilages.EDIT_MDN) ?
                            <>
                                {values.msisdn ?
                                    (mdnSuccess ?
                                        <i className="fa fa-check-circle fa-2x text-success simIcon mdn-success-failure-icon"></i>
                                        : <i className="fa fa-times-circle fa-2x text-danger simIcon mdn-success-failure-icon"></i>)
                                    : ""}
                                <span className="prefix" style={{ zIndex: 1 }}>{COUNTRY_CODE}</span>
                                <FieldItem
                                    {...FIELDS.msisdn}
                                    value={values.msisdn}
                                    onChange={(...e) => handleChange(FIELDS.msisdn.name, ...e)}
                                    touched={fields.msisdn && fields.msisdn.hasError}
                                    error={fields.msisdn && fields.msisdn.errorMsg}
                                />
                                <span><button className="validate-mdn-button" onClick={() => validateMdn(values.msisdn)}>Validate</button></span>
                            </>
                            : <FieldItem
                                {...FIELDS.msisdn}
                                value={values.msisdn}
                                type={'11'}
                            />
                        }
                    </Col>
                    <Col md="4" className="channel-type">
                        <FieldItem
                            {...FIELDS.email}
                            value={values.email}
                            onChange={(...e) => handleChange(FIELDS.email.name, ...e)}
                            touched={fields.email && fields.email.hasError}
                            error={fields.email && fields.email.errorMsg}
                        />
                    </Col>
                    <Col md="4" className="channel-type">
                        <FieldItem
                            {...FIELDS.language}
                            value={values.language}
                            onChange={(...e) => handleChange(FIELDS.language.name, ...e)}
                            values={FIELDS['language'].values ? FIELDS['language'].values : options[FIELDS['language'].name]}
                            touched={fields.language && fields.language.hasError}
                            error={fields.language && fields.language.errorMsg}
                        />
                    </Col>
                    <Col md="4" className="channel-type">
                        <FieldItem
                            {...FIELDS.role}
                            value={values.role}
                            onChange={(...e) => handleChange(FIELDS.role.name, ...e)}
                            values={FIELDS['role'].values ? FIELDS['role'].values : options[FIELDS['role'].name]}
                            touched={fields.role && fields.role.hasError}
                            error={fields.role && fields.role.errorMsg}
                        />
                    </Col>
                    <Col md="4" className="channel-type">
                        {channelId && channelName && channelId != 1 ?
                            <FieldItem
                                {...FIELDS.channelId}
                                value={channelName}
                                type="11"
                            /> :
                            <FieldItem
                                {...FIELDS.channelId}
                                value={values.channelId}
                                onChange={(...e) => handleChange(FIELDS.channelId.name, ...e)}
                                values={FIELDS['channelId'].values ? FIELDS['channelId'].values : options[FIELDS['channelId'].name]}
                                touched={fields.channelId && fields.channelId.hasError}
                                error={fields.channelId && fields.channelId.errorMsg}
                            />}
                    </Col>
                    <Col md="4" className="channel-type">
                        {regionId && regionName && channelId != 1 ?
                            <FieldItem
                                {...FIELDS.regionId}
                                value={regionName}
                                type="11"
                            /> :
                            <FieldItem
                                {...FIELDS.regionId}
                                value={values.regionId}
                                onChange={(...e) => handleChange(FIELDS.regionId.name, ...e)}
                                values={FIELDS['regionId'].values ? FIELDS['regionId'].values : options[FIELDS['regionId'].name]}
                                touched={fields.regionId && fields.regionId.hasError}
                                error={fields.regionId && fields.regionId.errorMsg}
                            />}
                    </Col>
                    <Col md="4" className="channel-type">
                        {clusterId && clusterName && channelId != 1 ?
                            <FieldItem
                                {...FIELDS.clusterId}
                                value={clusterName}
                                type="11"
                            /> : <FieldItem
                                {...FIELDS.clusterId}
                                value={values.clusterId}
                                onChange={(...e) => handleChange(FIELDS.clusterId.name, ...e)}
                                values={FIELDS['clusterId'].values ? FIELDS['clusterId'].values : options[FIELDS['clusterId'].name]}
                                touched={fields.clusterId && fields.clusterId.hasError}
                                error={fields.clusterId && fields.clusterId.errorMsg}
                            />}
                    </Col>
                    <Col md="4" className="channel-type">
                        <FieldItem
                            {...FIELDS.timeZone}
                            value={values && values.timeZoneName}
                            type="11"
                        />
                    </Col>
                    <Col md="4" className="channel-type">
                        <FieldItem
                            {...FIELDS.status}
                            value={values && values.status}
                            type="11"
                        />
                    </Col>
                    <Col md="4" className="channel-type d-flex align-items-center pt-4">
                        <label className="checkBoxRadio check mb-2 px-3" >
                            <div className="float-left btn_container">
                                <input type="checkbox" name=""
                                    onChange={(props.privilages.some(p => p === props.menuPrivilages.EDIT_IS_OTP))
                                        ? (e) => setIsOtpRequired(e.target.checked) : () => { }}
                                    checked={otpRequired}
                                />
                                <span className="checkmark"></span>
                            </div>
                            <span style={{ paddingLeft: '20px' }}>Is OTP Required</span>
                        </label>
                    </Col>

                </Row>
                    : <Row className="mx-0">
                        <Col md="4" className="channel-type">
                            <FieldItem
                                {...FIELDS.userName}
                                value={values.userName}
                                onChange={(...e) => handleChange(FIELDS.userName.name, ...e)}
                                touched={fields.userName && fields.userName.hasError}
                                error={fields.userName && fields.userName.errorMsg}
                            />
                        </Col>
                        <Col md="4" className="channel-type">
                            <FieldItem
                                {...FIELDS.firstName}
                                value={values.firstName}
                                onChange={(...e) => handleChange(FIELDS.firstName.name, ...e)}
                                touched={fields.firstName && fields.firstName.hasError}
                                error={fields.firstName && fields.firstName.errorMsg}
                            />
                        </Col>
                        <Col md="4" className="channel-type">
                            <FieldItem
                                {...FIELDS.lastName}
                                value={values.lastName}
                                onChange={(...e) => handleChange(FIELDS.lastName.name, ...e)}
                                touched={fields.lastName && fields.lastName.hasError}
                                error={fields.lastName && fields.lastName.errorMsg}
                            />
                        </Col>
                        <Col md="4" className="channel-type modal-eload">
                            {values.msisdn ? (mdnSuccess ? <i className="fa fa-check-circle fa-2x text-success simIcon mdn-success-failure-icon"></i> : <i className="fa fa-times-circle fa-2x text-danger simIcon mdn-success-failure-icon"></i>) : ""}
                            <span className="prefix" style={{ zIndex: 1 }}>{COUNTRY_CODE}</span>
                            <FieldItem
                                {...FIELDS.msisdn}
                                value={values.msisdn}
                                onChange={(...e) => handleChange(FIELDS.msisdn.name, ...e)}
                                touched={fields.msisdn && fields.msisdn.hasError}
                                error={fields.msisdn && fields.msisdn.errorMsg}
                            />
                            <span><button className="validate-mdn-button" onClick={() => validateMdn(values.msisdn)}>Validate</button></span>
                        </Col>
                        <Col md="4" className="channel-type">
                            <FieldItem
                                {...FIELDS.email}
                                value={values.email}
                                onChange={(...e) => handleChange(FIELDS.email.name, ...e)}
                                touched={fields.email && fields.email.hasError}
                                error={fields.email && fields.email.errorMsg}
                            />
                        </Col>
                        <Col md="4" className="channel-type">
                            <FieldItem
                                {...FIELDS.language}
                                value={values.language}
                                onChange={(...e) => handleChange(FIELDS.language.name, ...e)}
                                values={FIELDS['language'].values ? FIELDS['language'].values : options[FIELDS['language'].name]}
                                touched={fields.language && fields.language.hasError}
                                error={fields.language && fields.language.errorMsg}
                            />
                        </Col>
                        <Col md="4" className="channel-type">
                            <FieldItem
                                {...FIELDS.role}
                                value={values.role}
                                onChange={(...e) => handleChange(FIELDS.role.name, ...e)}
                                values={FIELDS['role'].values ? FIELDS['role'].values : options[FIELDS['role'].name]}
                                touched={fields.role && fields.role.hasError}
                                error={fields.role && fields.role.errorMsg}
                            />
                        </Col>
                        <Col md="4" className="channel-type">
                            {channelId && channelName && channelId != 1 ?
                                <FieldItem
                                    {...FIELDS.channelId}
                                    value={channelName}
                                    type="11"
                                /> :
                                <FieldItem
                                    {...FIELDS.channelId}
                                    value={values.channelId}
                                    onChange={(...e) => handleChange(FIELDS.channelId.name, ...e)}
                                    values={FIELDS['channelId'].values ? FIELDS['channelId'].values : options[FIELDS['channelId'].name]}
                                    touched={fields.channelId && fields.channelId.hasError}
                                    error={fields.channelId && fields.channelId.errorMsg}
                                />}
                        </Col>
                        <Col md="4" className="channel-type">
                            {regionId && regionName && channelId != 1 ?
                                <FieldItem
                                    {...FIELDS.regionId}
                                    value={regionName}
                                    type="11"
                                /> :
                                <FieldItem
                                    {...FIELDS.regionId}
                                    value={values.regionId}
                                    onChange={(...e) => handleChange(FIELDS.regionId.name, ...e)}
                                    values={FIELDS['regionId'].values ? FIELDS['regionId'].values : options[FIELDS['regionId'].name]}
                                    touched={fields.regionId && fields.regionId.hasError}
                                    error={fields.regionId && fields.regionId.errorMsg}
                                />}
                        </Col>
                        <Col md="4" className="channel-type">
                            {clusterId && clusterName && channelId != 1 ?
                                <FieldItem
                                    {...FIELDS.clusterId}
                                    value={clusterName}
                                    type="11"
                                /> : <FieldItem
                                    {...FIELDS.clusterId}
                                    value={values.clusterId}
                                    onChange={(...e) => handleChange(FIELDS.clusterId.name, ...e)}
                                    values={FIELDS['clusterId'].values ? FIELDS['clusterId'].values : options[FIELDS['clusterId'].name]}
                                    touched={fields.clusterId && fields.clusterId.hasError}
                                    error={fields.clusterId && fields.clusterId.errorMsg}
                                />
                            }
                        </Col>
                        <Col md="4" className="channel-type">
                            <FieldItem
                                {...FIELDS.timeZone}
                                value={values.timeZone && values.timeZone.label || ''}
                                type="11"
                            />
                        </Col>
                        <Col md="4" className="channel-type d-flex align-items-center pt-4">
                            <label className="checkBoxRadio check mb-2 px-3" >
                                <div className="float-left btn_container">
                                    <input type="checkbox" name=""
                                        onChange={(e) => setIsOtpRequired(e.target.checked)}
                                        checked={otpRequired}
                                    />
                                    <span className="checkmark"></span>
                                </div>
                                <span style={{ paddingLeft: '20px' }}>Is OTP Required</span>
                            </label>
                        </Col>
                    </Row>}
            </div>

            <div className="clearfix custom-sticky-button">
                {isEdit ? <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.PRIMARY}
                    size={BUTTON_SIZE.LARGE}
                    align="right"
                    label="Update"
                    isButtonGroup={true}
                    onClick={updateButtonHandler}
                /> :
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.LARGE}
                        align="right"
                        label="Create"
                        isButtonGroup={true}
                        onClick={createButtonHandler}
                    />
                }
                <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.LARGE}
                    color={COLOR.PRIMARY}
                    align="right"
                    label="Cancel"
                    isButtonGroup={true}
                    onClick={goBack}
                />
            </div>
        </>
    )
}

export default CreateEloadUser
