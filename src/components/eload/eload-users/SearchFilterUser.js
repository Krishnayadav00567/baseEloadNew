import React, { useMemo, useState, useEffect } from 'react'
import {
    CustomButton,
    BUTTON_STYLE,
    BUTTON_TYPE,
    BUTTON_SIZE,
    COLOR
} from '@6d-ui/buttons';
import { Row, ModalBody, ModalFooter } from 'reactstrap';
import { FieldItem, useFieldItem, FIELD_TYPES } from '@6d-ui/fields';
import { USER_SEARCH_FILTERS as FIELDS, USER_EXTRA_SEARCH_FILTERS as EXTRA_FIELDS } from './util/DataTableHeader'

export default function SearchFilterUser(props) {
    const { ajaxUtil, loadingFunction, URLS } = props;
    const [options, setOptions] = useState({});
    const { channelId, channelName, regionId, regionName, clusterId, clusterName } = props.loggedInUser

    useEffect(() => {

        ajaxUtil.sendRequest(URLS.LIST_RESTRICTIONS, { type: 'U' }, (response, hasError) => {
            if (!hasError && response.response && (response.response).length)
                setOptions(options => ({
                    ...options,
                    ["status"]: ((response.response).reduce((opts, resp) => {
                        opts = [...opts, {
                            value: resp.id,
                            label: resp.state
                        }]
                        return opts;
                    }, []))
                }));
        }, loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });

        ajaxUtil.sendRequest(URLS.LIST_RESTRICTIONS, { type: 'B' }, (response, hasError) => {
            setOptions(options => ({
                ...options,
                ["restrictionId"]: (response.response.reduce((opts, resp) => {
                    opts = [...opts, {
                        value: resp.id,
                        label: resp.state
                    }]
                    return opts;
                }, []))
            }));
        }, loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });

        props.ajaxUtil.sendRequest(`${props.URLS.GET_USER_ROLES}8`, {}, (response, hasError) => {
            if (!hasError && response) {
                setOptions(options => ({
                    ...options,
                    ["roleId"]: (response.length > 0 && response[0].roleDetails && response[0].roleDetails.reduce((opts, resp) => {
                        opts = [...opts, {
                            value: resp.roleId,
                            label: resp.roleName
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
    }, [])

    useEffect(() => {
        if (channelId && channelId != 1)
            setRegionOpts(channelId)
        if (regionId && channelId != 1)
            setClusterOpts(regionId)
    }, [props.loggedInUser])

    const formValues = useMemo(() => ({
        'userName': props.userName || '',
        'firstName': props.firstName || '',
        'lastName': props.lastName || '',
        'roleId': props.roleId ? props.roleId : null,
        'status': props.status ? props.status : null,
        'restrictionId': props.restrictionId ? props.restrictionId : '',
        'channelId': props?.channelId || null,
        'regionId': props?.regionId || null,
        'clusterId': props?.clusterId || null,
    }), [props]);

    const [values, fields, handleChange, { reset }] = useFieldItem(FIELDS, formValues, { onValueChange })
    const onSearch = () => {
        const data = {
            'userName': values.userName || '',
            'firstName': values.firstName || '',
            'lastName': values.lastName || '',
            'roleId': values.roleId && values.roleId.value ? values.roleId.value : values.roleId || '',
            'status': values.status && values.status.value ? values.status.value : values.status,
            'restrictionId': values.restrictionId && values.restrictionId.value ? values.restrictionId.value : values.restrictionId,
            'channelId': values?.channelId?.value || null,
            'regionId': values?.regionId?.value || null,
            'clusterId': values?.clusterId?.value || null,
        };
        props.onSubmitClick(data);
        onClearClick();
    }

    const onClearClick = () => {
        props.setFilterParams({});
        reset({});
    }

    const setRegionOpts = (channelId) => {
        props.ajaxUtil.sendRequest(`${props.URLS.LIST_REGION_URL}?channelId=${channelId}`, {}, (response, hasError) => {
            if (!hasError && response?.length) {
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
            }
            else setOptions(options => ({
                ...options,
                ["clusterId"]: [],
                ['regionId']: []
            }))

        }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });
    }

    const setClusterOpts = (regionId) => {
        props.ajaxUtil.sendRequest(`${props.URLS.GET_TERITORY}?parentId=${regionId}`, {}, (response, hasError) => {
            if (!hasError && response?.length) {
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
            else setOptions(options => ({
                ...options,
                ["clusterId"]: []
            }))
        }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });

    }

    function onValueChange(name, value, values, fieldValues) {
        switch (name) {
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
        <div>
            <ModalBody>
                <Row className="mx-0 dataTableFormgroup">
                    {
                        Object.keys(FIELDS).map(k => {
                            if (FIELDS[k].isView)
                                return ''
                            return <FieldItem
                                {...FIELDS[k]}
                                key={FIELDS[k].name}
                                onChange={(...e) => handleChange(FIELDS[k].name, ...e)}
                                value={values[FIELDS[k].name]}
                                values={FIELDS[k].values ? FIELDS[k].values : options[FIELDS[k].name]}
                                touched={fields[FIELDS[k].name] && fields[FIELDS[k].name].hasError}
                                error={fields[FIELDS[k].name] && fields[FIELDS[k].name].errorMsg}
                            />
                        })
                    }
                    {channelId && channelName && channelId != 1 ?
                        <FieldItem
                            {...EXTRA_FIELDS.channelId}
                            value={channelName}
                            type="11"
                        /> :
                        <FieldItem
                            {...EXTRA_FIELDS.channelId}
                            value={values.channelId}
                            onChange={(...e) => handleChange(EXTRA_FIELDS.channelId.name, ...e)}
                            values={EXTRA_FIELDS['channelId'].values ? EXTRA_FIELDS['channelId'].values : options[EXTRA_FIELDS['channelId'].name]}
                            touched={fields.channelId && fields.channelId.hasError}
                            error={fields.channelId && fields.channelId.errorMsg}
                        />}
                    {regionId && regionName && channelId != 1 ?
                        <FieldItem
                            {...EXTRA_FIELDS.regionId}
                            value={regionName}
                            type="11"
                        /> :
                        <FieldItem
                            {...EXTRA_FIELDS.regionId}
                            value={values.regionId}
                            onChange={(...e) => handleChange(EXTRA_FIELDS.regionId.name, ...e)}
                            values={EXTRA_FIELDS['regionId'].values ? EXTRA_FIELDS['regionId'].values : options[EXTRA_FIELDS['regionId'].name]}
                            touched={fields.regionId && fields.regionId.hasError}
                            error={fields.regionId && fields.regionId.errorMsg}
                        />}

                    {clusterId && clusterName && channelId != 1 ?
                        <FieldItem
                            {...EXTRA_FIELDS.clusterId}
                            value={clusterName}
                            type="11"
                        /> : <FieldItem
                            {...EXTRA_FIELDS.clusterId}
                            value={values.clusterId}
                            onChange={(...e) => handleChange(EXTRA_FIELDS.clusterId.name, ...e)}
                            values={EXTRA_FIELDS['clusterId'].values ? EXTRA_FIELDS['clusterId'].values : options[EXTRA_FIELDS['clusterId'].name]}
                            touched={fields.clusterId && fields.clusterId.hasError}
                            error={fields.clusterId && fields.clusterId.errorMsg}
                        />}
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
                        onClick={onClearClick}
                    />
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.LARGE}
                        align="right"
                        label="Search"
                        isButtonGroup={true}
                        onClick={() => {
                            onSearch();
                            props.onCancel();
                        }}
                    />
                </ModalFooter>
            </ModalBody>

        </div>
    )
}