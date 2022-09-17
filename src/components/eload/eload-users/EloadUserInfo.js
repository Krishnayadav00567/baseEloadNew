import React, { useState, useEffect, useMemo } from 'react';
import { Container, Button, Row, Col, ModalBody } from 'reactstrap';
import {
    CustomButton,
    BUTTON_TYPE,
    BUTTON_SIZE,
    BUTTON_STYLE,
    COLOR
} from '@6d-ui/buttons';
import { FormElements as FIELDS } from './util/DataTableHeader';
import { FieldItem, FIELD_TYPES, useFieldItem, validateForm } from '@6d-ui/fields';
import ResponsiveContainer from '../../util/ResponsiveContainer';
import { MESSAGES } from '../../../util/Constants';
import { Popup, POPUP_ALIGN } from '@6d-ui/popup';
import ChangeStatus from './ChangeStatus';
import { useWindowHeight } from '../../../util/Util';

function EloadUserInfo(props) {
    const { onSuccess, goBack, userDetails, fromProfile, setEdit, fromAproval = false } = props;

    const initialValues = useMemo(() => {
        return {
            userId: userDetails.userId || '',
            userName: userDetails.userName || '',
            firstName: userDetails.firstName || '',
            lastName: userDetails.lastName || '',
            email: userDetails.email || '',
            language: userDetails.language || '',
            role: userDetails.role || '',
            channelId: userDetails.channelName || '',
            regionId: userDetails.regionName || '',
            clusterId: userDetails.clusterName || '',
            timeZone: userDetails.timeZoneName || '',
            securityLock: userDetails.securityLock || '',
            suspended: userDetails.suspend || '',
            createdBy: userDetails.createdBy || '',
            createdOn: userDetails.createdDate || '',
            lastModifiedBy: userDetails.lastModifiedBy || '',
            lastModifiedOn: userDetails.updatedDate || '',
            status: userDetails.status || '',
            msisdn: userDetails.msisdn,
            prevBlockState: userDetails.prevState || '',
            prevBlockCodeChangeReason: userDetails.prevStateChangeReason || ''
        }
    }, [userDetails])
    const [statusOption, setStatusOption] = useState([])
    const [action, setAction] = useState("")
    const [values, fields, handleChange, { validateValues, reset }] = useFieldItem(FIELDS, initialValues);
    const PENDING_STATUS = props.globalConstants && props.globalConstants.APPROVAL_STATUS.PENDING;

    const onResetPaswdClick = () => {
        props.setModalPopup({
            rowId: "",
            isOpen: true,
            onConfirmCallBack: onConfirm,
            title: "Confirm",
            content: `Are you sure you want to reset password ?`,
            CancelBtnLabel: "Cancel",
            confirmBtnLabel: "Confirm",
        });
    }

    const onConfirm = () => {
        props.ajaxUtil.sendRequest(`${props.URLS.RESET_PSWD_URL}/${userDetails.userId}`, {},
            (response, hasError) => {
                goBack();
            }, props.loadingFunction, { method: 'POST' });
    }

    const onChangeStatusClick = () => {
        props.ajaxUtil.sendRequest(`${props.URLS.LIST_SWITCHOVER_STATUS_URL}${userDetails.statusId}`, {}, (response, hasError) => {
            if (!hasError && response && response.response && response.response[0]) {
                setStatusOption((response.response).map(d => {
                    return {
                        value: d.id,
                        label: d.state
                    }
                }))
                setAction("CHANGE_STATUS")
            }
        }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailue: false });
    }
    const height = useWindowHeight();

    return (
        <ModalBody>
            <ResponsiveContainer style={{ height: fromAproval ? "auto" : height - 150 }}>
                <div className="custom-container">
                    <Container fluid>
                        {!fromAproval && <Row style={{ paddingRight: '14px', paddingBottom: '10px' }}>
                            <Col style={{ marginTop: "0.5%" }}>
                                <div className="profile-header-btn-grp float-sm-right">
                                    {props.privilages.some(p => p == props.menuPrivilages.RESET_PASSWORD)
                                        && <CustomButton
                                            style={BUTTON_STYLE.BRICK}
                                            type={BUTTON_TYPE.PRIMARY}
                                            size={BUTTON_SIZE.MEDIUM}
                                            align="right"
                                            label={"Reset Password"}
                                            isButtonGroup={true}
                                            onClick={onResetPaswdClick}
                                        />
                                    }
                                    {props.privilages.some(p => p == props.menuPrivilages.CHANGE_USER_STATUS)
                                        && <CustomButton
                                            style={BUTTON_STYLE.BRICK}
                                            type={BUTTON_TYPE.PRIMARY}
                                            size={BUTTON_SIZE.MEDIUM}
                                            align="right"
                                            label={"Change Status"}
                                            isButtonGroup={true}
                                            onClick={onChangeStatusClick}
                                        />
                                    }
                                </div>
                            </Col>
                        </Row>}
                        <div className="form-Brick-body" >
                            <Row className="mx-0">
                                {
                                    Object.keys(FIELDS).map(k => {
                                        if (FIELDS[k].isNotInfo)
                                            return ''
                                        return <FieldItem
                                            {...FIELDS[k]}
                                            key={FIELDS[k].name}
                                            placeholder=""
                                            type="11"
                                            value={values[FIELDS[k].name]}
                                        />
                                    })
                                }
                                <Col md="4" className="channel-type d-flex align-items-center pt-4">
                                    <label className="checkBoxRadio check mb-2 px-3" >
                                        <div className="float-left btn_container">
                                            <input type="checkbox" name=""
                                                checked={userDetails.otpRequired || false}
                                            />
                                            <span className="checkmark"></span>
                                        </div>
                                        <span style={{ paddingLeft: '20px' }}>Is OTP Required</span>
                                    </label>
                                </Col>
                            </Row>
                        </div>
                    </Container>

                    <Popup
                        type={POPUP_ALIGN.CENTER}
                        title={"Change Status"}
                        isOpen={action == 'CHANGE_STATUS'}
                        close={() => setAction("")}
                        minWidth="450PX"
                        component={
                            <ChangeStatus
                                userID={userDetails.userId}
                                msisdn={userDetails.msisdn}
                                changeAction={() => { onSuccess(); goBack() }}
                                statusOption={statusOption}
                                onCancel={() => setAction("")}
                                CHANGE_URL={props.URLS.CHANGE_STATUS_URL}
                                {...props}
                            />
                        }
                    />
                </div>
            </ResponsiveContainer>
            {/* {!fromProfile &&
                <div className="clearfix" style={{ padding: "12px 35px" }}>
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.SECONDARY}
                        size={BUTTON_SIZE.LARGE}
                        color={COLOR.PRIMARY}
                        align="right"
                        label="Done"
                        isButtonGroup={true}
                        onClick={goBack}
                    />
                </div>
            } */}
            {props.privilages.some(p => p == props.menuPrivilages.edit)
                && !PENDING_STATUS.some(as => as == userDetails.approvalStatusId)
                && <div className="clearfix" style={{ padding: "12px 35px" }}>
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.SECONDARY}
                        size={BUTTON_SIZE.LARGE}
                        color={COLOR.PRIMARY}
                        align="right"
                        label="Edit"
                        isButtonGroup={true}
                        onClick={setEdit}
                    />
                </div>
            }
        </ModalBody>
    )
}

export default EloadUserInfo
