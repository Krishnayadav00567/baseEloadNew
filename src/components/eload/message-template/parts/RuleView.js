import React from 'react';

const RuleView = props => {
    const {
        isSeleted,
        ruleId,
        ruleName,
        ruleSubTitle,
        onRuleSelect,
        isWallet
    } = props;
    let mainStyle = { ...styles.mainStyle };
    let normalSpan = { ...styles.normalSpan };
    let subTitle = { ...styles.subTitle };
    if(isSeleted) {
        mainStyle = { ...mainStyle, ...styles.isSeleted };
        normalSpan = { ...normalSpan, ...styles.isSeletedSpan }
    }
    if(isWallet) {
        subTitle = { ...subTitle, fontSize: '11px' };
    }
    if(isWallet && isSeleted) {
        subTitle = { ...subTitle, fontWeight: 'bold' };
    }

    return (
        <div style={mainStyle} onClick={() => onRuleSelect(ruleId, ruleName)}>
            <span style={normalSpan}>
                {ruleName}
            </span>
            <span style={subTitle}>
                {ruleSubTitle}
            </span>
        </div>
    );
};

const styles = {
    mainStyle: {
        minHeight: "55px",
        padding: "10px 20px",
        borderBottom: "1px solid #EBEEF1",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer"
    },
    isSeleted: {
        background: "linear-gradient(315deg, #F9EEFE 0%, #E8F5FF 100%)",
        borderTop: "1px solid #EBEEF1"
    },
    normalSpan: {
        color: "#33495F",
        width: "100%",	
        fontFamily: "Open Sans", 
        fontSize: "14px",
        lineHeight: "20px",
        flex: 1
    },
    isSeletedSpan: {
        fontWeight: 600
    },
    subTitle: {
        width: "100%",
        color: "#33495F",	
        fontFamily: "Open Sans",	
        fontSize: "10px",	
        lineHeight: "16px",
        flex: 1
    }
};

export default RuleView;