import React from 'react';

const ServiceContainerRow = props => {
    const {
        isInput,
        isSelected,
        isRule
    } = props
    let divStyles = styles.divStyles;
    if(isInput)
        divStyles = { ...divStyles, ...styles.input };
    if(isSelected)
        divStyles = { ...divStyles, ...styles.selected };
    if(isRule)
        divStyles = { ...divStyles, ...styles.isRule };
    if(!isInput && !isRule)
        divStyles = { ...divStyles, minHeight: "40px", padding: "6px 14px" };

    return (
        <div style={divStyles}>
            {props.children}
        </div>
    );
};

const styles = {
    divStyles: {
        minHeight: "51px",
        width: "100%",
        padding: "8px 14px",
        borderTop: "1px solid #EBEEF1", 
        borderBottom: "1px solid #EBEEF1"
    },
    selected: {
        background: "linear-gradient(315deg, #F9EEFE 0%, #E8F5FF 100%)",
    },
    input: {
        backgroundColor: "#EAEDF0",
        padding: "10px 15px",
        borderBottom: "none",
        borderTop: "none"
    },
    isRule: {
        padding: "10px",
        minHeight: "51px"
    }
};

export default ServiceContainerRow;