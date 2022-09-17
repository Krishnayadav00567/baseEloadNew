import React from "react";
import { Row, Col } from "reactstrap";
import { FieldItem, CustomContextMenu, FIELD_TYPES, useFieldItem } from '@6d-ui/fields'
import { FormElements } from '../util/FormElements';

const Templates = props => {
    const [values, fields, handleChange, { validateValues, reset }] = useFieldItem(FormElements)
    let cursorPositionIndex = 0;

    const handleChangeOption = (evt, data) => {
        let dataLabel = '';
        if (cursorPositionIndex) {
                let start = "", end = "";
                start = props.message ? props.message.slice(0, cursorPositionIndex) : "";
                end = props.message ? props.message.slice(cursorPositionIndex, props.message.length) : "";
                dataLabel = start.trim() + ` {${data.data.label}} ` + end.trim();
    
            } else {
                dataLabel = props.message ? props.message : '';
                dataLabel += `{${data.data.label}}`;
            }
        props.onChange(dataLabel);
    }
    return (
        <>
            <Row>
                <Col>
                    <CustomContextMenu
                        id={props.id}
                        options={props.contextMenuOpts}
                        onChange={handleChangeOption}
                        screenWidth={55}
                    >
                        <FieldItem
                            {...FormElements.message}
                            value={props.message}
                            onChange={props.onChange}
                            touched={props.fields && props.fields.hasError}
                            error={props.fields && props.fields.errorMsg}
                        />
                    </CustomContextMenu>
                </Col>
            </Row>
        </>
    );
}

export default Templates;