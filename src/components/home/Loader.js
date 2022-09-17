import React from 'react';

const Loader = ({isLoading, isFirstLoad,loaderwidth}) => {
    return isLoading === true ? (
        <div className="loadingPageContainer" style={isFirstLoad ? {background: "#eaedf0"} : {background: "rgba(0, 0, 0, 0.5)",width:loaderwidth=="202px" ? "85%":loaderwidth=="50px" ?"96.3%":"100%"}}>
            <div style={{ margin: 'auto', width: '200px',height: "100%" }}>
                <div className="three-cogs fa-3x" style={{height: "100%",margin:"auto"}}>
                  <i className="loader"></i>
                  {/* <i className="fa fa-cog fa-spin fa-1x fa-fw"></i>
                  <i className="fa fa-cog fa-spin fa-1x fa-fw"></i> */}
                </div>
            </div>
        </div>
        
    ) : null;
}
export default Loader;
