import React, { Component } from 'react';
import { ModalBody, ModalFooter, Row } from 'reactstrap';
import {
    CustomButton,
    BUTTON_STYLE,
    BUTTON_TYPE,
    BUTTON_SIZE,
    COLOR
} from '@6d-ui/buttons';
import { FieldItem, FIELD_TYPES } from '@6d-ui/fields';
export default class StatusDropDown extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleChange(name, value, obj) {
        const { isTouched } = obj || { isTouched: false };
        if (!isTouched) {
            this.setState({ [name]: value });
        }
    }

    handleConfirm() {
        const { status, comments } = this.state;
        if (!status) {
            this.props.notify({
                message: "Please select a status",
                hasError: true
            })
            return;
        };
        if (!comments) {
            this.props.notify({
                message: "Please enter the reason",
                hasError: true
            })
            return;
        };
        this.props.onSubmit({ status, comments })
    }

    render() {
        const { status, comments } = this.state;
        return (
            <ModalBody className="bg-white">
                <Row className="mx-0">
                    <FieldItem
                        label="Select Status"
                        values={this.props.options}
                        value={this.state.status}
                        type={FIELD_TYPES.NESTED_DROP_DOWN}
                        width="sm"
                        onChange={this.handleChange.bind(this, "status")}
                        placeholder="Select"
                        touched={false}
                    />
                </Row>    
                <Row className="mx-0">
                    <FieldItem
                        label="Reason"
                        placeholder="Please enter reason"
                        value={this.state.comments}
                        values={this.props.reasons}
                        type={FIELD_TYPES.DROP_DOWN}
                        width="sm"
                        onChange={this.handleChange.bind(this, "comments")}
                        touched={false}
                    />

                </Row>
                <ModalFooter style={{ padding: '15px' }}>
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.SECONDARY}
                        size={BUTTON_SIZE.MEDIUM}
                        color={COLOR.PRIMARY}
                        align="right"
                        label="Cancel"
                        isButtonGroup={true}
                        onClick={this.props.toggleAction}
                    />
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.MEDIUM}
                        align="right"
                        label="Change"
                        isButtonGroup={true}
                        onClick={this.handleConfirm}
                    />
                </ModalFooter>
            </ModalBody>
        );
    }
}