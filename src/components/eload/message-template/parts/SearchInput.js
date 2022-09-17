import React from 'react';

const SearchInput = props =>{
    const {
        placeholder,
        name,
        style,
        needAddButton,
        onClickAddButton,
        onChange
    } = props;
    const styles = {
        inputStyle: {
            width: needAddButton ? '82%' : '100%',
            height: "30px",
            padding: "10px",
            outline: "none",
            borderRadius: "3px 0 0 3px",
            border: "1px solid #EEEEEE",
            backgroundColor: "#FFFFFF",
            color: "#B6B6B6",
            fontFamily: "Open Sans",
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
            fontFamily: "Open Sans",
            fontSize: "14px",
            lineHeight: "27px",
            border: "1px solid #EEEEEE",
            borderLeft: "none"
        }
    };
    let inputStyle = { ...styles.inputStyle };
    let searchIconStyles = { ...styles.searchIconStyle };
    if (style)
        inputStyle = { ...inputStyle, ...style };

    return (
        <div style={{
            display: "-ms-flexbox", /* IE10 */
            display: "flex",
        }}>
            <input style={inputStyle} onChange={(e) => onChange(e.target.value)} type="text" placeholder={placeholder} name={name} />
            <span style={searchIconStyles}>
                <i className="fa fa-search" />
            </span>
            {needAddButton &&
                <div style={{ marginLeft: "8px", color: "#0086D6", marginTop: "3px", cursor: "pointer", fontSize: "0.5rem" }} onClick={onClickAddButton}>
                    {/* <i className="fa fa-plus-circle fa-3x" aria-hidden="true"></i> */}
                    <span className="circle plus"></span>
                </div>
            }
        </div>
    );
}

export default SearchInput;