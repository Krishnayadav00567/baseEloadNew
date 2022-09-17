import React, { Component } from 'react';
import { Row, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { FieldItem, FIELD_TYPES } from '@6d-ui/fields';
import {
    CustomButton,
    BUTTON_STYLE,
    BUTTON_TYPE,
    BUTTON_SIZE,
    COLOR
} from '@6d-ui/buttons';
import moment from 'moment';
import { dateToStringFormatter } from '../../../util/Util';
import {GLOBAL_CONSTANTS} from '../../../../util/Constants';


export default class AuditSearchFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "fromDate":"",
            "toDate":"",
            "updatedBy": "",
            "updatedByName": ""
        }
    }
    onSearch() {
        const data = {
            
            "fromDate": this.state.fromDate?`${moment(this.state.fromDate).format('YYYY-MM-DD')} 00:00:00`:'',
            "toDate": this.state.toDate ? `${moment(this.state.toDate).format('YYYY-MM-DD')} 23:59:59` : '',
            "updatedBy": this.state.updatedBy,
            "updatedByName": this.state.updatedByName
            
        };
        this.props.onSubmitClick(data);
    }
    handleChange(name, value, obj) {
        const { isTouched } = obj || { isTouched: false };
        if (!isTouched) {
            this.setState({ [name]: value });
        }
    }


    render() {
        return (
            <div>
                <ModalBody>
                    <Row className="mx-0 dataTableFormgroup">
                        <FieldItem
                            label="Start Date"
                            width="md"
                            type={FIELD_TYPES.DATE_PICKER}
                            value={this.state.fromDate}
                            onChange={this.handleChange.bind(this, "fromDate")}
                            touched={false}
                            error=""
                            maxDate={this.state.toDate ? this.state.toDate : moment()}
                            dateFormat={GLOBAL_CONSTANTS.NEW_DATE_FORMAT}
                        />
                        <FieldItem
                            label="End Date"
                            width="md"
                            type={FIELD_TYPES.DATE_PICKER}
                            value={this.state.toDate}
                            onChange={this.handleChange.bind(this, "toDate")}
                            touched={false}
                            error=""
                            minDate={this.state.fromDate}
                            maxDate={moment()}
                            dateFormat={GLOBAL_CONSTANTS.NEW_DATE_FORMAT}
                        />
                        <FieldItem
                            label="User Id"
                            width="md"
                            type={FIELD_TYPES.Text}
                            value={this.state.updatedBy}
                            onChange={this.handleChange.bind(this, "updatedBy")}
                            touched={false}
                            error=""
                            // minDate={this.state.fromDate}
                            // maxDate={moment()}
                        />
                        <FieldItem
                            label="Username"
                            width="md"
                            type={FIELD_TYPES.Text}
                            value={this.state.updatedByName}
                            onChange={this.handleChange.bind(this, "updatedByName")}
                            touched={false}
                            error=""
                            // minDate={this.state.fromDate}
                            // maxDate={moment()}
                        />
                    </Row>
                    <ModalFooter>
                        <CustomButton
                            style={BUTTON_STYLE.BRICK}
                            type={BUTTON_TYPE.SECONDARY}
                            size={BUTTON_SIZE.LARGE}
                            color={COLOR.PRIMARY}
                            align="right"
                            label="Cancel"
                            isButtonGroup={true}
                            onClick={this.props.onCancel}
                        />
                        <CustomButton
                            style={BUTTON_STYLE.BRICK}
                            type={BUTTON_TYPE.PRIMARY}
                            size={BUTTON_SIZE.LARGE}
                            align="right"
                            label="Search"
                            isButtonGroup={true}
                            onClick={() => { this.onSearch(); this.props.onCancel(); }}
                        />
                    </ModalFooter>
                </ModalBody>

            </div>
        );
    }
}