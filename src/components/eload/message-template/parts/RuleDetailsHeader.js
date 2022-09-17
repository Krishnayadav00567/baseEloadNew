import React from 'react';
import { Row, Col } from 'reactstrap';

import { CustomButton, BUTTON_SIZE, BUTTON_TYPE, BUTTON_STYLE } from '@6d-ui/buttons'

const RuleDetailsHeader = props => {
    const {
        isModify,
        onModifyClick
    } = props;

    return (
        <div style={{ 
            height: "51px",
            width: "100%",
            backgroundColor: "#E9ECEF",
            padding: "10px 30px" 
        }}>
            <Row>
                <Col sm="7">
                    <span style={{
                        height: "30px",
                        color: "#7E91A4",
                        fontFamily: "Open Sans",
                        fontSize: "16px",
                        fontWeight: 600,
                        lineHeight: "30px",
                        textAlign: 'left'
                    }}>
                        {props.children}
                    </span>
                </Col>
                <Col sm="5">
                    {isModify &&
                        <CustomButton 
                            style={BUTTON_STYLE.BRICK}
                            type={BUTTON_TYPE.PRIMARY}
                            size={BUTTON_SIZE.MEDIUM}
                            align="right"
                            label="Modify"
                            isButtonGroup={true}
                            onClick={onModifyClick}
                        />
                    }
                </Col>
            </Row>
        </div>
    );
};

export default RuleDetailsHeader;