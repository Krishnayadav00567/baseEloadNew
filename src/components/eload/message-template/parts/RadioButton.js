import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const RadioButton = props => {

    const {
        name,
        onClick,
        value,
        checked,
        moreButton,
        deleteRule,
        duplicateRule,
        isRule
    } = props;

    // let radioButton = <input type="radio" name={name} value={value} onChange={() => onClick(value, props.children)}/>;
    let labelStyle = styles.labelStyle;
    if(checked) {
        labelStyle = {
            ...labelStyle,
            ...styles.activeLabelStyle
        }
    }

    let divStyle = {};
    if(!isRule) {
        divStyle = {
            paddingTop: "0px"
        };
        labelStyle = { ...labelStyle, ...divStyle };
    }

    return (
        <div className="checkBoxRadio_main rc-mandatory" style={{ 
                overflow: "visible", 
                width: "100%", 
                border: "none", 
                backgroundColor: "inherit", 
                padding: "0px" 
            }}>
            <div className="checkBoxRadio_container cb-left">
                <label className="checkBoxRadio radio">
                    <div className="float-left btn_container" style={divStyle}>
                        {/* radioButton */}
                        <input type="radio" 
                            name={name} 
                            value={value} 
                            checked={checked ? true : false} 
                            onChange={() => onClick(value, props.children)}/>
                        <span className="checkmark"></span>
                    </div>
                    <div className="float-left checkBoxRadio_label " style={labelStyle}>{props.children}</div>
                </label>
            </div>
            {
                moreButton && checked ? 
                <UncontrolledDropdown style={{
                    boxSizing: "border-box",
                    height: "25px",
                    width: "25px",
                    border: "1px solid #EAEDF0",
                    backgroundColor: "#FFFFFF",
                    float: "right",
                    borderRadius: "50%",
                    marginTop: "5px",
                    padding: "1px 4px"
                }}>
                    <DropdownToggle tag="div">
                        <img src={`${process.env.PUBLIC_URL}/images/icons/more.svg`} />
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem style={{fontSize: "small"}} onClick={() => duplicateRule(value)}>Duplicate</DropdownItem>
                        <DropdownItem style={{fontSize: "small"}} onClick={() => deleteRule(value)}>Delete</DropdownItem>
                        {/* {privilages.edit === true && } */}
                        {/* {(type > 0 && privilages.create === true) ? <DropdownItem onClick={() => props.setNodeAction(1, "")} >Add Node</DropdownItem> : null} */}
                        {/* {(type > 0 && privilages.create === true) ? <DropdownItem onClick={() => props.setNodeAction(1, "")} >Create</DropdownItem> : null} */}
                        {/* {privilages.delete === true && <DropdownItem onClick={() => props.setNodeAction(3)} >Delete Node</DropdownItem>} */}
                    </DropdownMenu>
                </UncontrolledDropdown>
                : null
            }
        </div>
    );

};

const styles = {
    labelStyle: {
        marginLeft: "3px",
        fontFamily: "Open Sans",
        fontSize: "12px",
        color: "#626466"
    },
    activeLabelStyle: {
        fontWeight: "600",
        color: "#2B2B2B"
    }
};

export default RadioButton;