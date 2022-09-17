import React from 'react';

const LeftContainer = props => {
    let containerStyle = styles.containerStyle;
    if(props.style)
        containerStyle = { ...containerStyle, ...props.style }
    return (
        <div style={containerStyle} className="side-nav-menu-in scrollbar">
            {props.children}
        </div>
    );
};

const styles = {
    containerStyle : {
        height: "100%",
        width: "100%",
        backgroundColor: "#FFFFFF",
        boxShadow: "5px 5px 10px 0 rgba(0,0,0,0.05)",
         overflowX: "hidden"
    }
}

export default LeftContainer;