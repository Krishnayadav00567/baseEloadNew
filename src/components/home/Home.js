import React, { Component, Fragment } from "react";
import { Container, Breadcrumb, BreadcrumbItem, Row, Col } from "reactstrap";
// import { Alert } from '@6d-ui/ui-components';
import Alert from './Alert';
import Loader from './Loader';
import Notification from './Notification';
import { withRouter } from 'react-router'
import { MENU_DETAILS, PRIVILIAGES } from "../../util/Privilages";
import { connect } from "react-redux";
import { Routes } from './sub/Routes'
import { setModalPopup, logOut, addToNotification, removeFromNotification, clearAllNotification } from '../../actions';
import { store } from '../../index';
import SideMenu from './SideMenu';
import ResponsiveContainer from "../util/ResponsiveContainer";
import { ENCYPT_KEY, FULLSCRREN_PATHS } from '../../util/Constants';
import _ from 'lodash';
import ChangePswd from "../changePswd/ChangePswd";
// import ChangePassword from "../ChangePassword/ChangePassword";
import { Popup, POPUP_ALIGN } from '@6d-ui/popup';
import { CHANGE_PSWD, CONSTANTS } from "../../util/Constants";
import { ajaxUtil } from './Utils';
import { Badge } from 'reactstrap';
import moment from 'moment';
import InfiniteScroll from "react-infinite-scroll-component";
import { setNotification } from '../home/Utils'
import Header from "./Header";
import ChangePin from "../ChangePin/ChangePin";
import { GLOBAL_CONSTANTS } from '../../util/Constants'
import { encryptAuth } from "../ajax/elements/util/Utils";

let webNotTimer;
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ischngepwd: false,
            ischangepin: false,
            notifications: [],
            notfCount: 0,
            showNotifications: false,
            cancelPwdChange: Boolean,
            isSideNavShown: FULLSCRREN_PATHS.includes(this.props.location.pathname) ? false : true,
            isNavMouseOver: FULLSCRREN_PATHS.includes(this.props.location.pathname) ? true : false,
            isLoggedIn: false,
            isFooterDiv: true,
            footerText: "Powered by Smartfren",
            MENU_DETAILS,
            order: "desc",
            page: 1,
            size: 10,
            isLastPage: false,
            HEADER_BUTTONS: [
                // {
                //     id: 1,
                //     type: 1,
                //     icon: 'fa-bell',
                //     animatedIcon: 'fa-bell faa-ring animated faa-slow'
                // },
                {
                    id: 2,
                    type: 2,
                    icon: 'fa-user-circle-o',
                    subIcon: 'fa-user-o',
                    subHeader: this.props.login.userDetails.name,
                    subItems: this.props.login.userDetails.ldapUser ? [
                        {
                            id: 23,
                            name: 'Sign Out',
                            icon: 'fa-sign-out'
                        },
                    ] : this.props.login && this.props.login.userDetails && !this.props.login.userDetails.user ? [{
                        id: 25,
                        name: 'My Profile',
                        icon: 'fa-user-o'
                    },
                    {
                        id: 22,
                        name: 'Change Password',
                        icon: 'fa-key'
                    },

                    {
                        id: 24,
                        name: 'Change Pin',
                        icon: 'fa-lock'
                    },
                    {
                        id: 23,
                        name: 'Sign Out',
                        icon: 'fa-sign-out'
                    },

                    ] :
                        [{
                            id: 25,
                            name: 'My Profile',
                            icon: 'fa-user-o'
                        },
                        {
                            id: 22,
                            name: 'Change Password',
                            icon: 'fa-key'
                        },
                        {
                            id: 23,
                            name: 'Sign Out',
                            icon: 'fa-sign-out'
                        },

                        ]
                }
            ],
        };
        this.toggleSideNav = this.toggleSideNav.bind(this);
        this.route = this.route.bind(this);
        this.onNavMouseOver = this.onNavMouseOver.bind(this);
        this.onNavMouseRemove = this.onNavMouseRemove.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);

    }
    componentWillMount() {
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        this.getNotifications()
        webNotTimer = setInterval(() => {
            let notf = this.state.notifications.filter((item) => item.type === 'download');
            this.setState({
                notifications: notf,
                notfCount: 0,
                page: 1
            }, () => {
                this.getNotifications()
            })
        }, 60000);

        // window.history.pushState(null, null, window.location.pathname);
        //     window.addEventListener('popstate', function (event){
        //         if( window.location.pathname == `/snd/${encryptAuth("home", ENCYPT_KEY)}` || window.location.pathname == `/snd/${encryptAuth("myProfile", ENCYPT_KEY)}`)
        //          window.history.pushState({}, document.title,  window.location.href);
        //      });
    }

    componentWillUnmount() {
        if (webNotTimer)
            clearInterval(webNotTimer);
        localStorage.clear();    
    }

    reloadNotifications = () => {
        let notf = this.state.notifications.filter((item) => item.type === 'download');
        this.setState({
            notifications: notf,
            notfCount: 0,
            page: 1
        }, () => {
            this.getNotifications()
        })
    }
    getNotifications = () => {
        const { login } = this.props;
        const { order, page, size } = this.state;
        ajaxUtil.sendRequest(`${CONSTANTS.DASHBOARD.GET_ALL_NOTIFICATIONS}?order=${order}&page=${page}&size=${size}&readStatus=0&notificationType=4`,
            {}, (response, hasError) => {
                if (!hasError && response) {
                    if (response.content && response.content.length > 0) {
                        this.setState(prevState => ({
                            notfCount: prevState.notfCount + response.content.length
                        }))
                        response.content.map(m => {

                            this.setState(prevState => ({
                                notifications: [...prevState.notifications, {
                                    id: m.id,
                                    title: m.title && m.title,
                                    message: m.message,
                                    taskId: m.orderId && m.orderId,
                                    url: `/${encryptAuth("mytasks", ENCYPT_KEY)}`,
                                    createdDate: m.createdDate ? m.createdDate.split(' ')[0] : '',
                                    approvalRedirect: m.approvalRedirect,
                                    notificationType: m.notificationType
                                }],
                                isLastPage: response.last
                            }))
                        }
                        )
                    }
                }
            }, this.props.loadingFunction, { method: "GET", isShowSuccess: false, isShowFailure: false });
    }
    toggleAction(type) {
        this.setState({ modal: type });
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside = (event) => {
        console.log("inside")
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({
                showNotifications: false
            }, () => {
                document.removeEventListener('click', this.handleClickOutside);
            })
        }
    }

    toggleSideNav() {
        this.setState({ isSideNavShown: this.state.isNavMouseOver, isNavMouseOver: !this.state.isNavMouseOver });
    }
    route(id, link, privilage) {
        this.setState({ currentMenuPrivilage: privilage })
        if (this.props.location.pathname !== link)
            this.props.history.push(link);
        else {
            this.props.history.replace(`/_refresh`); // this is to rerender the route
            setTimeout(() => {
                this.props.history.replace(link);
            });
        }
    }

    removeFromExportArray = id => {
        this.props.removeFromNotification(id);
    }
    downloadHandler = (data) => {
        const { notifications } = this.state;
        if (data.type === 'download') {
            let notF = notifications;
            this.downloadData(data.url, data.message)
            _.remove(notF, {
                id: data.id
            });
            this.setState({
                showNotifications: false,
                notifications: notF,
                notfCount: --this.state.notfCount
            })
        }
    }

    readNotification = (id, notfObj, isFromCloseIcon) => {
        let url = "";
        if (!id) {
            url = `${CONSTANTS.DASHBOARD.READ_NOTIFICATIONS}?notificationType=4`
            this.setState({
                notifications: [],
                notfCount: []
            })
        }
        if (notfObj && notfObj.type === 'download') {
            let notf = this.state.notifications.filter((item) => item.id != id);
            this.setState({
                notifications: notf,
                notfCount: --this.state.notfCount
            })
        }
        if (notfObj && notfObj.type != 'download') {
            url = `${CONSTANTS.DASHBOARD.READ_NOTIFICATIONS}?notificationIds=${id}&notificationType=4`
            if (notfObj.taskId && !isFromCloseIcon) {
                this.setState({
                    showNotifications: false,
                })
                this.props.history.push({ pathname: `/${encryptAuth("mytasks", ENCYPT_KEY)}`, state: { taskId: notfObj.taskId } });
            }
        }
        if (url) {
            ajaxUtil.sendRequest(url,
                {}, (response, hasError) => {
                    if (!hasError && response) {
                        if (id) {
                            let notf = this.state.notifications.filter((item) => item.id != id);
                            this.setState({
                                // showNotifications:false,
                                notifications: notf,
                                notfCount: --this.state.notfCount
                            })
                        }
                    }
                }, this.props.loadingFunction, { method: "PUT", isShowSuccess: false, isShowFailure: false });
        }
    }

    onHeaderItemClick(menuId, SubMenuId) {
        if (menuId === 2 && SubMenuId === 25) {
            if (this.props.login && this.props.login.userDetails && !this.props.login.userDetails.user) {
                this.route(menuId, `/${encryptAuth("myProfile", ENCYPT_KEY)}`)
            } else {
                this.route(menuId, `/${encryptAuth("eloadUserProfile", ENCYPT_KEY)}`);
            }
        }
        if (menuId === 2 && SubMenuId === 22) {
            this.setState({
                ischngepwd: !this.state.ischngepwd
            })
        }
        if (menuId === 2 && SubMenuId === 23) {
            store.dispatch(clearAllNotification());
            store.dispatch(logOut());
        }
        if (menuId === 2 && SubMenuId === 24) {
            this.setState({
                ischangepin: !this.state.ischangepin
            })
        }
    }
    exportResponseHandler = (exportResponse, item, fileName) => {
        let fileType = 'xls';
        const fileNameTmp = fileName;
        // var type = headers?headers['content-disposition'].split('filename=')[1].split(';')[0]:`Recharge.xlsx`;
        if (item && item.type) {
            if (item.type == 'xls') {
                fileType = 'xlsx'
            }
            else {
                fileType = item.type;
            }

        } else {
            if (item.label) {
                switch (item.label.toLowerCase()) {
                    case 'excel':
                        fileType = 'xlsx'; break;
                    case 'csv':
                        fileType = 'csv'; break;
                    default: break;
                }
            }
        }
        if (fileName)
            fileName = fileName.endsWith("-") ? (fileName + Date.now()) : (fileName + "-" + Date.now());
        else
            fileName = Date.now();

        fileName = fileName + "." + fileType;
        let notf = this.state.notifications;
        if (exportResponse && exportResponse.data && exportResponse.status === 200) {
            const { headers } = exportResponse;
            const contentType = headers['content-type'];
            notf.splice(0, 0, {
                id: (+ new Date() + Math.floor(Math.random() * 999999)).toString(36),
                title: `Download ${fileNameTmp} ${fileType} Report`,
                message: fileName,
                url: window.URL.createObjectURL(exportResponse.data),
                downloadable: true,
                type: "download",
                createdDate: moment(new Date()).format("DD-MM-YYYY")
            });
            this.setState({
                notifications: notf,
                notfCount: ++this.state.notfCount
            })
        } else {
            // showing error message from BL 
            if (exportResponse?.data?.statusCode == '400')
                setNotification({
                    message: exportResponse?.data?.message || "Failed to download!",
                    hasError: true,
                    timestamp: new Date().getTime()
                });
            else {
                notf.splice(0, 0, {
                    id: (+ new Date() + Math.floor(Math.random() * 999999)).toString(36),
                    title: `Download ${fileNameTmp} ${fileType} Report`,
                    message: exportResponse?.data?.message || "Failed to download!",
                    downloadable: false,
                    type: "text",
                    createdDate: moment(new Date()).format("DD-MM-YYYY")
                });
                this.setState({
                    notifications: notf,
                    notfCount: ++this.state.notfCount
                })
            }
        }
    }
    downloadData = (url, fileName) => {
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    onNavMouseOver() {
        this.setState({ isSideNavShown: true })
    }
    onNavMouseRemove() {
        this.setState({ isSideNavShown: false })
    }
    openNotifications = () => {
        this.setState({
            showNotifications: !this.state.showNotifications
        }, () => {
            if (this.state.notifications) {
                console.log("openNot");
                document.addEventListener('click', this.handleClickOutside);
            }
        })
    }
    fetchMoreData = () => {
        let pageNo = this.state.page;
        this.setState({
            page: ++pageNo
        }, () => {
            this.getNotifications();
        })
    };

    readNotfHandler = (notf, index) => {
        let url = `${CONSTANTS.DASHBOARD.READ_NOTIFICATIONS}?notificationIds=${notf.id}&notificationType=4`
        ajaxUtil.sendRequest(url,
            {}, (response, hasError) => {
                let tmp = this.state.notfCount;
                let tmpNotf = this.state.notifications;
                tmpNotf[index] = { ...tmpNotf[index], readStatus: 1 }
                tmp = --tmp;
                this.setState({
                    notfCount: tmp,
                    notifications: tmpNotf
                })
            }, this.props.loadingFunction, { method: "PUT", isShowSuccess: false, isShowFailure: false });
    }
    render() {
        const getBreadCrumb = () => {
            if (this.props.breadcrumb && this.props.breadCrumb.length > 0) {
                return (
                    <Container className="main_breadCrumb_container">
                        <Row>
                            <Col>
                                <Breadcrumb
                                    className="main_breadCrumb">
                                    <BreadcrumbItem>
                                        <i className="fa fa-home" />
                                    </BreadcrumbItem>
                                    <BreadcrumbItem active>Dash Board</BreadcrumbItem>
                                </Breadcrumb>
                            </Col>
                        </Row>
                    </Container>
                );
            }
        };
        const sideNavStyle = {
            width: this.state.isSideNavShown ? '205px' : '50px'
        };
        return (
            <div>
                <div className="home-main-div">
                    <div className="side-nav-menu" style={sideNavStyle}>
                        <SideMenu
                            currentPath={this.props.location.pathname}
                            privilages={this.props.login.userDetails.privilages}
                            route={this.route}
                            menus={this.state.MENU_DETAILS}
                            logo={`${process.env.PUBLIC_URL}/images/logo/sfpro_logo@6d.svg`}
                            // logo={`${process.env.PUBLIC_URL}/images/logo/6d-logo.png`}
                            toggleSideNav={this.toggleSideNav}
                            isFooterDiv={this.state.isFooterDiv}
                            footerText={this.state.footerText}
                            isNavShown={this.state.isSideNavShown}
                            isNavMouseOver={this.state.isNavMouseOver}
                            onNavMouseOver={this.onNavMouseOver}
                            onNavMouseRemove={this.onNavMouseRemove}
                            redirectPath={`/${encryptAuth("home", ENCYPT_KEY)}`}
                        />
                    </div>
                    <div className="main-content-div">
                        <div className="notification-icon" style={{ color: this.state.showNotifications ? "#FF1659" : "#949494" }} onClick={this.openNotifications}>
                            <i className={this.state.notifications.length > 0 ? "fa fa-bell faa-ring animated faa-slow" : "fa fa-bell"}></i>
                            {this.state.notfCount > 0 && <Badge color="light" className="notification-badge">{this.state.notfCount > 9 ? "9+" : this.state.notfCount}</Badge>}
                        </div>
                        {this.state.showNotifications &&
                            <div ref={this.setWrapperRef} className="notification-container notification-main">
                                <div className="notification-header">
                                    <div className="notification-header-1">
                                        <span className="notification-icon-v2"><i className="fa fa-bell"></i></span>
                                        <span className="notification-title">Notifications</span>
                                    </div>
                                    {this.state.notifications.length > 0 ?
                                        <div onClick={() => this.readNotification()} className="notification-header-2">
                                            Clear All
                                        </div> :
                                        null}
                                </div>
                                {this.state.notifications.length > 0 ?
                                    <div className="notification-body">
                                        <InfiniteScroll
                                            dataLength={this.state.notifications.length}
                                            next={() => this.fetchMoreData()}
                                            hasMore={!this.state.isLastPage}
                                            loader={<h4 style={{ fontSize: "12px" }}>Loading...</h4>}
                                            height={265}
                                        >
                                            {this.state.notifications.map((item, key) => {
                                                return <div onClick={item.readStatus != 1 && !item.downloadable && !(item.taskId && item.approvalRedirect) ? () => this.readNotfHandler(item, key) : () => { }} className="notification-card" key={key} style={{ cursor: "pointer" }}>
                                                    {item.title ? <div style={{ fontSize: "14px", fontWeight: "600", fontSize: "12px", textTransform: "capitalize" }}>{item.title}</div> : <div style={{ height: "21px" }} />}
                                                    <div style={{ color: "#999999", fontSize: "12px" }}>{item.message}</div>

                                                    {item.createdDate && <Badge color="light" pill>{item.createdDate === moment(new Date()).format("DD-MM-YYYY") ? "Today" : item.createdDate}</Badge>}
                                                    {item.downloadable ? <span onClick={(e) => { e.stopPropagation(); this.downloadHandler(item) }} className="notification-redirection-link" >Download File</span> : null}
                                                    {(item.taskId && item.approvalRedirect) && <div onClick={(e) => { e.stopPropagation(); this.readNotification(item.id, item) }} className="notification-redirection-link">Open<span style={{ marginLeft: "5px" }}><i className="fa fa-external-link-square" aria-hidden="true"></i></span></div>}
                                                    <span onClick={(e) => { e.stopPropagation(); this.readNotification(item.id, item, true) }} style={{ position: "absolute", top: "0px", right: "5px", color: "#a3b4bc", cursor: "pointer" }}><i className="fa fa-times-circle" aria-hidden="true"></i></span>
                                                </div>
                                            })}
                                        </InfiniteScroll>
                                    </div>
                                    :
                                    <div className="notification-body">
                                        No Notifications
                                    </div>
                                }
                            </div>
                        }

                        <HeaderContainer
                            onHeaderItemClick={this.onHeaderItemClick.bind(this)}
                            items={this.state.HEADER_BUTTONS}
                            header={this.props.header}
                            toggleSideNav={this.toggleSideNav}
                            hideMenuToggle={true}
                            removeFromExport={this.removeFromExportArray.bind(this)}
                            removeAlert={(id) => { this.readNotification(id) }}
                            loggedInUser={this.props.login.userDetails}
                        />
                        <main style={{ minHeight: window.innerHeight - 70 }}>
                            <ResponsiveContainer style={{ overflowX: 'scroll', overflow: 'auto', position: 'relative', backgroundColor: '#ffffff' }} offset={70}>
                                {getBreadCrumb()}
                                <div className="main-container" style={{ minHeight: '100%' }}>
                                    {/*Routes Comes HERE*/}
                                    {/* {getRouteDeatisl()} */}
                                    <Routes
                                        userid={this.props.login.userDetails.userId}
                                        loggedInUser={this.props.login.userDetails}
                                        privilages={this.props.login.userDetails.privilages}
                                        designationId={this.props.login.userDetails.designationId}
                                        userChannelType={this.props.login.userDetails.channelType}
                                        userEntityType={this.props.login.userDetails.entityId}
                                        areaId={this.props.login.userDetails.areaId}
                                        exportResponseHandler={this.exportResponseHandler}
                                        loader={this.props.loader}
                                        loadNotification={this.reloadNotifications}
                                    />

                                </div>
                                <Notification
                                    toast={this.props.toast}
                                />
                                <AlertContainer
                                    setModalPopup={this.props.setModalPopup}
                                    modal={this.props.modal}
                                />
                                <Popup
                                    type={POPUP_ALIGN.CENTER}
                                    title="Change Password"
                                    isOpen={this.state.ischngepwd}
                                    close={() => this.setState({ ischngepwd: false })}
                                    minWidth="450px"
                                    component={
                                        <ChangePswd
                                            {...this.props}
                                        />
                                        // <ChangePassword 
                                        //     {...this.props}
                                        //     ajaxUtil={ajaxUtil}
                                        //     loadingFunction={this.props.loadingFunction}
                                        // />
                                    }
                                />
                                <Popup
                                    type={POPUP_ALIGN.CENTER}
                                    title="Change Pin"
                                    isOpen={this.state.ischangepin}
                                    close={() =>
                                        this.setState({ ischangepin: false })
                                    }
                                    minWidth="450px"
                                    component={
                                        <ChangePin
                                            {...this.props}
                                            ajaxUtil={ajaxUtil}
                                            setNotification={setNotification}
                                            onCancel={() =>
                                                this.onHeaderItemClick(2, 24)
                                            }
                                        />
                                    }
                                />
                            </ResponsiveContainer>
                            <Loader
                                loaderwidth={sideNavStyle.width}
                                {...this.props.loader}
                            />
                        </main>
                    </div>
                </div>

            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        login: state.login,
        breadcrumb: state.breadcrumb,
        toast: state.toast,
        loader: state.loader
    };
}

const AlertContainer = connect(({ modal }) => ({ modal }))(props => <Alert {...props} />);
const HeaderContainer = connect(({ header }) => ({ header }))(props => <Header {...props} />);

export default withRouter(connect(mapStateToProps, { setModalPopup, addToNotification, removeFromNotification })(Home));
