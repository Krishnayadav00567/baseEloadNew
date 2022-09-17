import React, { Component } from 'react';
import {
    Container,
    Col,
    Row
} from 'reactstrap';
import { Switch } from '@6d-ui/form';
import { FieldItem, FIELD_TYPES } from '@6d-ui/fields';
import _ from 'lodash';

class Permissions extends Component {
    render() {
        const getModuleList = (modules) => {
            return _.orderBy(modules,['moduleName'],['asc']).map((item, index) => {

                return (
                    <Row key={index}
                        style={{
                            paddingBottom: '0.3rem',
                            paddingTop: '0.3rem'
                        }}>
                        <Col md="3">
                            {item.moduleName}
                        </Col>
                        <Col md="3">
                            <Switch
                                moduleId={item.id}
                                handleChange={(e) => this.props
                                    .handleSwitch({
                                        moduleId: item.id,
                                        features: item.featureMaster
                                    }, e)}
                                checked={!_.isEmpty(this.props.permissions[item.id])} />
                        </Col>
                        <Col md="6" style={{ paddingLeft: "0rem" }}>
                            <Row>
                                <Col md="10">
                                    <FieldItem
                                        values={this.props.getPermissions(item.featureMaster)}
                                        value={this.props.permissions[item.id]?this.props.permissions[item.id]:null}
                                        type={FIELD_TYPES.MUTLI_SELECT}
                                        width="xs"
                                        onChange={(value) => this.props.handleDropDownChange(item.id, value)}
                                        placeholder={selectText}
                                        disabled={false}
                                        touched={false}
                                        error=""
                                        menuIsOpen={true}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                );
            });
        };

        const selectText = "Select";
        return (
            <Container>
                {getModuleList(this.props.modules)}
            </Container>
        );
    }
}

export default Permissions;
