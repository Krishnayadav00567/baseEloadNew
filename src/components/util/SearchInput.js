import React from 'react';

const SearchInput = props => {
    const {
        placeholder,
        name,
        style,
        onChange,
        float
    } = props;

    let inputStyle = { ...styles.inputStyle };
    let searchIconStyles = { ...styles.searchIconStyle };

    if(style)
        inputStyle = { ...inputStyle, ...style };
    
    return (
        <div style={{
            display: "-ms-flexbox", /* IE10 */
            display: "flex",
            padding: '5px 0px 5px 0px',
            float: float?float:'right'
        }}>
            <input style={inputStyle} onChange={(e) => onChange(e.target.value)} type="text" placeholder={placeholder} name={name} />
            <span style={searchIconStyles}>
                <i className="fa fa-search" />
            </span>
        </div>
    );
};

const styles= {
    inputStyle: {
        height: "30px",
        padding: "5px",
        outline: "none",
        borderRadius: "3px 0 0 3px",
        border: "1px solid #EEEEEE",
        backgroundColor: "#FFFFFF",
        color: "#524A48",
        fontSize: "14px",
        lineHeight: "30px",
        borderRight: "none"
    },
    searchIconStyle: {
        // padding: "6px",
        width: "28px",
        height: "30px",
        background: "transparent",
        textAlign: "center",
        borderRadius: "0 3px 3px 0",
        backgroundColor: "#FFFFFF",
        color: "#B6B6B6",
        fontSize: "14px",
        lineHeight: "27px",
        border: "1px solid #EEEEEE",
        borderLeft: "none"
    }
};

export default SearchInput;