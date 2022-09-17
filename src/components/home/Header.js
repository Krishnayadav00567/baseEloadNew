import React, { Component } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip
} from "reactstrap";
import Clock from 'react-live-clock';
import _ from 'lodash';

class Header extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.tooltipToggle = this.tooltipToggle.bind(this);
    this.revokeObject = this.revokeObject.bind(this);
    this.state = {
      dispDate: props.dispDate ? props.dispDate : false,
      loggedInUser: props.loggedInUser,
      // showPopover:false
    };
    // this.setWrapperRef = this.setWrapperRef.bind(this);
  }

  toggle(id) {
    this.setState({
      [`dropdownOpen_${id}`]: !this.state[`dropdownOpen_${id}`]
    });
  }

  tooltipToggle(id) {
    this.setState({
      [`tooltipOpen_${id}`]: !this.state[`tooltipOpen_${id}`]
    });
  }

  revokeObject(id) {
    console.log("REVOKE CALLLED", id);
    const urlObjects = _.filter(this.props.header.notificationItems, (o) => o.id == id);
    let timeout = null;
    if (urlObjects && urlObjects.length > 0) {
      timeout = setTimeout(() => {
        console.log("REVOKING URL =>", urlObjects[0].url);
        window.URL.revokeObjectURL(urlObjects[0].url);
        if (timeout != null)
          clearTimeout(timeout);
      }, 10000);
    } else
      console.log("URL NOT REVOKED =>", id);
    this.props.removeFromExport(id);
  }

  // setWrapperRef(node) {
  //   this.wrapperRef = node;
  // }

  // handleClickOutside = (event) => {
  //     if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
  //         this.setState({
  //           showPopover: false
  //         }, () => {
  //             document.removeEventListener('click', this.handleClickOutside);
  //         })
  //     }
  // }

  // togglePopover = () => {
  //   this.setState(
  //     {showPopover: !this.state.showPopover},
  //     () => {
  //       document.addEventListener('click', this.handleClickOutside);
  //     }
  //   );
  // }

  // menuItemClick = (menuId, id) => {
  //   this.props.onHeaderItemClick(menuId, id);
  //   this.togglePopover();
  // }

  render() {
    const { loggedInUser: { username, levelName, regionName, clusterName, channelName, lastLogin, role } } = this.state;
    const getHeaderItems = () => {
      return this.props.items.map((item) => {
        switch (item.type) {
          case 1: {//Button Type
            //   // return (
            //     // <li key={item.id} className="nav-item">
            //     //   <a className="nav-link" onClick={()=>this.props.onHeaderItemClick(item.id, 0)}  style={{ cursor: "pointer" }}>
            //     //     <i className={`fa ${item.icon} notif-menu-drawer`}/>
            //     //   </a>
            //     // </li>
            //   // )
            //   const getNotificationItems = (subItems) => {
            //     /*[{
            //       id: 1,
            //       message: "Transaction Report",
            //       url: 324567uhygtrfde2345t6y7t4gf3ds2345t6y7h4gf3d2e
            //       downloadable: true
            //     }]*/
            //     const buttonStyle = {
            //       marginLeft: '10px', width: '28%', textAlign: 'right'
            //     }
            //     const messageStyle = { overflow: 'hidden', textOverflow:'ellipsis', width: '70%' };
            //     if(subItems && subItems.length > 0) {
            //       return subItems.map((subItem, index) => {
            //         if(!subItem.downloadable) {
            //           buttonStyle.marginLeft = '0px';
            //           buttonStyle.width = '1%';
            //           messageStyle.width = '98%';
            //         }
            //         if(subItem.downloadable){
            //           return (
            //             <DropdownItem key={subItem.id} onClick={() => this.revokeObject(subItem.id)}>
            //               <div className="header_cogs d-flex align-items-center">
            //                 <div className="float-left" style={messageStyle}>{subItem.message}</div>
            //                 <div className="float-left" style={buttonStyle}>
            //                   {
            //                     subItem.downloadable ? 
            //                     <a href={subItem.url} className="btn btn-info btn-sm" download={subItem.message} id={`downloader-${subItem.id}`}>
            //                       <i className="fa fa-download" />
            //                     </a> : null
            //                   }
            //                   <Tooltip placement="left" isOpen={this.state[`tooltipOpen_${subItem.id}`]} autohide={false} target={`downloader-${subItem.id}`} toggle={() => this.tooltipToggle(subItem.id)}>
            //                     { subItem.downloadable ? `Download ${subItem.message}` : subItem.message }
            //                   </Tooltip>
            //                 </div>
            //               </div>
            //             </DropdownItem>
            //           );
            //       }else {
            //            switch(subItem.type){
            //              case "Redirect":
            //                 return (
            //                   <Link to={subItem.url}> 
            //                     <DropdownItem key={subItem.id} >
            //                       <div className="header_cogs d-flex align-items-center">
            //                         <div className="float-left" style={messageStyle}>{subItem.message}</div>
            //                       </div>
            //                     </DropdownItem>
            //                  </Link> 
            //                 );
            //                 case "Alerts":
            //                   return (
            //                     <DropdownItem key={subItem.id} onClick={()=>this.props.removeAlert(subItem.id)}>
            //                       <div className="header_cogs d-flex align-items-center">
            //                         <div className="float-left" style={messageStyle}>{subItem.message}</div>
            //                       </div>
            //                     </DropdownItem>
            //                   );
            //                default: 
            //                   return (
            //                     <DropdownItem key={subItem.id} >
            //                       <div className="header_cogs d-flex align-items-center">
            //                         <div className="float-left" style={messageStyle}>{subItem.message}</div>
            //                       </div>
            //                     </DropdownItem>
            //                   );
            //            }
            //         } 
            //       });
            //     }else {
            //       return (
            //         <div className="header_cogs d-flex align-items-center">
            //           <div className="float-left">No Notifications</div>
            //         </div>
            //       );
            //     }
            //   }
            //   const count = this.props.header.notificationItems && this.props.header.notificationItems.length > 0 ? this.props.header.notificationItems.length : 0;
            //   let badgeStyle = { ...STYLE.badgeStyle };
            //   if(count < 10)
            //     badgeStyle.right = '18px';
            //   return (
            //     <li key={item.id} className="nav-item">
            //       <Dropdown isOpen={this.state[`dropdownOpen_${item.id}`]} toggle={()=>this.toggle(item.id)}>
            //         <DropdownToggle className="nav-link nav-link" nav>
            //           <div className="user-ico">
            //             <i className={(this.props.header.notificationItems && this.props.header.notificationItems.length > 0) ? 
            //               `fa ${item.animatedIcon}` : `fa ${item.icon}`}/>
            //             {
            //               count > 0 ?
            //               <Badge color='light' style={badgeStyle}>{count > 9 ? "9+" : count}</Badge> : 
            //               null
            //             }
            //           </div>
            //         </DropdownToggle>
            //         <DropdownMenu right>
            //           <div className="triangle-up" />
            //           {getNotificationItems(this.props.header.notificationItems)}
            //         </DropdownMenu>
            //       </Dropdown>
            //     </li>
            //   );
            break;
          }
          case 2://Dropdown Type
            // return (
            //   <li key={item.id} className="nav-item">
            //     <div className="user-icon" style={{ color: this.state.showPopover ? "#FF1659" : "#949494" }} onClick={this.togglePopover}>
            //         <i className={`fa ${item.icon}`}/>
            //     </div>
            //     {this.state.showPopover && 
            //         <div ref={this.setWrapperRef} className="notification-main user-container">
            //             <div className="notification-header">
            //                 <div className="notification-header-1">
            //                     <span>{item.subHeader}</span>
            //                 </div>
            //             </div>
            //             <div style={{maxHeight: "300px"}}>
            //                 {
            //                   item.subItems.map((subItem, index) => {
            //                     return (
            //                         <div className="header_cogs d-flex align-items-center"
            //                         key={index} 
            //                         onClick={() => this.menuItemClick(item.id, subItem.id)}
            //                         style={{cursor:"pointer"}}
            //                       >
            //                           <div className="float-left ico">
            //                             <i className={`fa ${subItem.icon}`}/>
            //                           </div>
            //                           <div className="float-left">{subItem.name}</div>
            //                         </div>
            //                     );
            //                   })
            //                 }
            //             </div>
            //         </div>}
            //     </li>
            // );
            const getDropdownItems = (menuId, subItems) => {
              return subItems.map((subItem, index) => {
                return (
                  <DropdownItem key={index} tag="a"  onClick={() => this.props.onHeaderItemClick(menuId, subItem.id)}>
                    <div className="header_cogs d-flex align-items-center">
                      <div className={`float-left ${subItem.id==22?'pad-18':'ico'}`}>
                        <i className={`fa ${subItem.icon} ${subItem.id==24?'pad-right':""}`} />
                      </div>
                      <div className="float-left">{subItem.name}</div>
                    </div>
                  </DropdownItem>
                );
              });
            }
            return (
              <li key={item.id} className="nav-item">
                <Dropdown isOpen={this.state[`dropdownOpen_${item.id}`]} toggle={() => this.toggle(item.id)}>
                  <DropdownToggle className="nav-link nav-link" nav>
                    <div className="user-ico">
                      <i className={`fa ${item.icon}`} />
                    </div>
                  </DropdownToggle>
                  <div className="notification-body">
                    <DropdownMenu right className="user-container">
                      <div className="header_fullName d-flex align-items-center primary-color">
                        <div className="float-left ico">
                          <i className={`fa ${item.subIcon}`} />
                        </div>
                        <div
                          className="float-left setOverflow"
                          title={item.subHeader}
                        >
                          {item.subHeader}
                        </div>
                      </div>
                      {getDropdownItems(item.id, item.subItems)}
                    </DropdownMenu>
                  </div>
                </Dropdown>
              </li>
            );

          default:
            break;
        }
      });
    }
    const userDetails = (label, value) => {
      return <div className="loginHeaders login-details-width">
        <div className="headerLabel" >
          {label}
        </div>
        <div className="login-div login-header-details-value text-ellipsis" id={`header-value-${label}`}>
          {value}
        </div>
        <UncontrolledTooltip placement="bottom" target={`header-value-${label}`}>
          {value}
        </UncontrolledTooltip>
      </div>
    }
    return (
      <header className="app-header navbar primary-background">
        <div>
          {this.props.hideMenuToggle ? '' : <div className="menu-toggle d-flex align-items-center" onClick={() => this.props.toggleSideNav()}>
            <span className="menu-toggle-ico">
              <i className="fa fa-bars" />
              {/* <i className="fa sd-icon-hamburger-menu" /> */}
            </span>
          </div>
          }
          <div className="page-heading d-flex align-items-center" style={this.props.hideMenuToggle && { paddingLeft: 30, paddingBottom: 25 }}>
            {this.props.header && this.props.header.name
              ? this.props.header.name
              : "Dashboard"}
          </div>
        </div>
        <div className="d-flex align-items-center login-header-div" style={{ height: '100%' }} >
          {/* <div className='clearfix login-div text-center'> */}
          {/* <span className='login-header-details-value'>{name}({levelName})</span>
            {regionName||clusterName?<div className="clearfix">
            <span className="login-header-details-lbl pl-2">Region:</span>
            <span className="login-header-details-value" >{regionName||''}</span>
            {clusterName&&<><span className="login-header-details-lbl pl-2">Cluster:</span>
            <span className="login-header-details-value" >{clusterName||''}</span>
            </>}
          </div>:<div className="clearfix text-center">
            <span className="login-header-details-value pl-2" >National</span>
            </div>} */}
          <div className="loginHeaders align-items-center ">
            <div className="text-center headerUserName text-ellipsis login-details-width" id='header-userName'>
              {username}
            </div>
            <UncontrolledTooltip placement="bottom" target='header-userName'>
              {username}
            </UncontrolledTooltip>
            <div className="text-center headerUserName text-ellipsis " style={{ paddingTop: 2, maxWidth: 100 }} id={`header-role`}>
              ({role})
                 </div>
            <UncontrolledTooltip placement="bottom" target={`header-role`}>
              ({role})
            </UncontrolledTooltip>
          </div>
          {regionName || clusterName ? <>
            {userDetails('Region', regionName)}
            {clusterName &&
              userDetails('Cluster', clusterName)
            }
          </>
            : channelName ? userDetails('Channel', channelName)
              : userDetails('Region', 'National')}
          <div className="loginHeaders" style={{ width: '140px' }}>
            <div className="headerLabel">
              Last Login
                 </div>
            <div className="login-header-details-value " id={`header-lastLogin`}>
              {lastLogin}
            </div>
            <UncontrolledTooltip placement="bottom" target={`header-lastLogin`}>
              {lastLogin}
            </UncontrolledTooltip>
          </div>

          {/* <div className='clearfix login-div text-center'>
            <span className='login-header-details-value'>
              {username} ({role})
            </span>
            {regionName||clusterName?
              <div className="clearfix">
                <span className="login-header-details-lbl pl-2">Region:</span>
                <span className="login-header-details-value" >{regionName}</span>
                {clusterName && 
                  <>
                    <span className="login-header-details-lbl pl-2">Cluster:</span>
                    <span className="login-header-details-value" >{clusterName||''}</span>
                  </>
                }
              </div>
              :channelName?<div className="clearfix text-center">
                <span className="login-header-details-value pl-2" >{channelName}</span>
              </div>:<div className="clearfix text-center">
                <span className="login-header-details-value pl-2" >National</span>
              </div>
            }
            <div className="clearfix">
              <span className="login-header-details-lbl pl-2">Last Login Time:</span>
              <span className="login-header-details-value" > {lastLogin}</span>
            </div>
          </div> */}
          {/* {regionName||clusterName?
              <div className="clearfix">
                <span className="login-header-details-lbl pl-2">Region:</span>
                <span className="login-header-details-value" >{regionName}</span>
                {clusterName && 
                  <>
                    <span className="login-header-details-lbl pl-2">Cluster:</span>
                    <span className="login-header-details-value" >{clusterName||''}</span>
                  </>
                }
              </div>
              :<div className="clearfix text-center">
                <span className="login-header-details-value pl-2" >National</span>
              </div>
            } */}
          {/* </div> */}
        </div>
        <div className="d-flex align-items-center">
          {
            this.state.dispDate && <div className="pr-1" >
              <Clock
                format={'dddd, MMMM D, YYYY, h:mm:ss A'}
                ticking={true}
              />
            </div>
          }
          <ul className="nav navbar-nav ml-auto">
            {getHeaderItems()}
          </ul>
        </div>
      </header>
    );
  }
}

export default Header;