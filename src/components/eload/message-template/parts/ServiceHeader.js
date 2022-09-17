import React from 'react';

const ServiceHeader = props => {
    const countContainerStyle = { ...STYLES.countContainerStyle };
    if(props.items && props.items < 10)
        countContainerStyle.padding = "1px 10px";
    else
        countContainerStyle.padding = "0px 5px";

    return (
        <div style={STYLES.containerStyle}>
            <span style={STYLES.labelSpanStyle}>{props.label}</span>
            <div style={countContainerStyle}>
                <span style={STYLES.countSpanStyle}>
                    {props.items}
                </span>
            </div>
        </div>
    );
};

const STYLES = {
    containerStyle: {
        height: "40px",
        width: "100%",
        borderRadius: "2px 2px 0 0",
        backgroundColor: "#999",
        boxShadow: "0 0 4px 0 rgba(0,0,0,0.13)",
        padding: "10px 15px"
    },
    labelSpanStyle: {
        height: "18px",
        color: "#FFFFFF",
        fontFamily: "Open Sans",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "18px",
        float: "left"
    },
    countContainerStyle: {
        height: "20px",
        width: "30px",
        borderRadius: "20px",
        backgroundColor: "#FFFFFF",
        float: "right",
        padding: "1px 8px"
    },
    countSpanStyle: {
        height: "20px",
        width: "7px",
        color: "#33495F",
        fontFamily: "Open Sans",
        fontSize: "12px",
        fontWeight: 600,	
        lineHeight: "20px",
        textAlign: "center"
    }
}

export default ServiceHeader;