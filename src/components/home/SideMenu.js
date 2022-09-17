import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Collapse, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';
import { saveCurrentState } from '../../actions/index';
import { store } from '../../index';
import { FULLSCRREN_PATHS } from '../../util/Constants';
import { FieldItem, FIELD_TYPES, useFieldItem, validateForm } from '@6d-ui/fields';
import { connect } from 'react-redux';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      openedMenu: null,
      // filteredMenu: this.props.menus,
      filteredMenu: this.props.menus.map(m => {
        let sortedsubmenus;
        if(m.submenus && m.submenus.length > 0) {
            sortedsubmenus = m.submenus.sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))
        }
        return {...m,submenus:sortedsubmenus}
         
    }),
      searchMenu: "",
      windowHeight: 0,
      navigatedMenu: null,
      selectedMenu:null,
    };
    this.toggle = this.toggle.bind(this);
    this.renderMenus = this.renderMenus.bind(this);
    this.checkPrivilages = this.checkPrivilages.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.clearState = this.clearState.bind(this);
    this.onMenuMouseOver = this.onMenuMouseOver.bind(this);
    this.onMenuMouseLeave = this.onMenuMouseLeave.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ "windowHeight": window.innerHeight });
  }
  componentDidUpdate(prevProps) {
    if (this.props.isNavMouseOver && prevProps.isNavMouseOver != this.props.isNavMouseOver && this.state.openedMenu) {
      this.setState({ openedMenu: null })
    }
  }


  toggle(id) {
    if (!this.props.isMenuDisabled) {
      const openedMenu = this.state.openedMenu === id ? null : id;
      this.setState({ openedMenu });
    }
  }

  checkPrivilages(menuPrivilages) {
    if (menuPrivilages && menuPrivilages.length > 0) {
      const diff = _.difference(menuPrivilages, this.props.privilages, _.isEqual);
      if (_.isEqual(diff.sort(), menuPrivilages.sort())) {
        //No Privilages available for this menu
        return false;
      }
    }
    return true;
  }
  onMenuMouseOver() {
    this.props.onNavMouseOver();
  }
  onMenuMouseLeave() {
    this.setState({ navigatedMenu: this.state.openedMenu });
    this.setState({ openedMenu: null });
    this.props.onNavMouseRemove();
  }
  clearState(linkTo, id) {
    if (!this.props.isMenuDisabled) {
      store.dispatch(saveCurrentState(
        null
      ));
      if (FULLSCRREN_PATHS.includes(linkTo) && !this.props.isNavMouseOver)
        this.props.toggleSideNav();
    }
    this.setState({selectedMenu : id});
  }
  handleChange = (name, value) => {
    let menus = _.cloneDeep(this.props.menus);
    let filteredMenu = this.filterMenuItems(menus, value);

    this.setState({[name] : value, filteredMenu});
  }
  filterMenuItems = (menus, searchText) => {
    return menus.filter((menu) => {
      if(!menu.submenus) {
        return menu.label.toLocaleLowerCase().includes(searchText.toLocaleLowerCase());
      } else {
        let subMenuItems = this.filterMenuItems(menu.submenus, searchText);
        if(subMenuItems.length > 0) {
          menu.submenus = subMenuItems;
          return true;
        }
      }
    });
  }
  handleSearchMenu = () => {
    let menus = _.cloneDeep(this.props.menus);
    let searchMenu = this.state.searchMenu;
    let filteredMenu = this.filterMenuItems(menus, searchMenu);
    this.setState({ filteredMenu });
  }
  clearSearch = () => {
    let menus = _.cloneDeep(this.props.menus);
    this.setState({ filteredMenu: menus , searchMenu: ''});
  }
  redirect=(id, link,privilage)=>{
    this.setState({ navigatedMenu: id });
    store.dispatch(saveCurrentState(
      null
    ));
    if(FULLSCRREN_PATHS.includes(link)&&!this.props.isNavMouseOver)
      this.props.toggleSideNav();    
    this.props.route(id, link,privilage);
    localStorage.clear();
  }
  renderMenus(menus, isSubmenu, isNavShown) {
    return menus && Array.isArray(menus) ? (
      menus.map(
        menu => {
          if (menu.privilages && menu.privilages.length > 0) {
            if (this.checkPrivilages(menu.privilages) === false)
              return false;
          }
          let isSelectParent = false;
          if (menu.submenus && menu.submenus.length > 0) {
            let subMenuPrivilages = [];
            menu.submenus.forEach(
              submenu => {
                if (submenu.privilages) {
                  subMenuPrivilages.push(...submenu.privilages);
                }
                if (`${submenu.linkTo}` === window.location.pathname) {
                  isSelectParent = true;
                }
                if (submenu.id == this.state.selectedMenu) {
                  isSelectParent = true;
                }
              }
            );
            if (this.checkPrivilages(subMenuPrivilages) === false)
              return false;
          }
          // console.log("==log==",isSelectParent);
          return (
            <ListGroupItem key={menu.id} className={(isNavShown ? "" : "listgroupshown")} >
              {
                menu.submenus && Array.isArray(menu.submenus) ?
                  [
                    <a className={("parentLink ") +(this.props.isMenuDisabled && menu.label !== 'Home' ? 'disableTab' : '') + (isNavShown ? "" : "menutext " + (this.state.navigatedMenu === menu.id ? "opened" : "")) + (isSelectParent ? "selected" : (this.state.openedMenu === menu.id ? "opened" : ""))} onClick={() => this.toggle(menu.id)} key={`anchor-${menu.id}`}>
                      <span>
                        {/* <i className={`fa ${menu.icon} menu-icon ` + (isNavShown ? "":"iconshown")} /> */}
                        <img className={`menu-icon ` + (isNavShown ? "" : "iconshown")} src={`${process.env.PUBLIC_URL}/images/menus/${menu.icon}`} />
                        {menu.label}
                      </span>
                      <i className="fa fa-angle-right submenu-icon ml-auto my-0 mr-0"
                        {...(this.state.openedMenu === menu.id ? { style: { transform: 'rotate(90deg)' } } : {})}
                      ></i>
                    </a>,
                    <Collapse isOpen={this.state.openedMenu === menu.id && !this.props.isMenuDisabled} key={`submenu-${menu.id}`}>
                      <ListGroup className="justify-content-center" className="side-submenu-item">
                        {this.renderMenus(menu.submenus, true, isNavShown)}
                      </ListGroup>
                    </Collapse>
                  ]
                  :
                    <a onClick={()=>this.redirect(menu.id,menu.linkTo,menu.privilages)}
                      isActive={ (match, location) => { return location.pathname.substring(0, menu.linkTo.length) === menu.linkTo } }
                      activeClassName="opened"
                      className={`${(isNavShown ? "":"menutext")}${(window.location.pathname.split('/snd')[1] === menu.linkTo ? " opened" : "")}${isSubmenu ? " custom-submenu" : ""}`}
                    >
                      {(!isSubmenu ?
                        <img className={`${isNavShown ? "menu-icon":"iconshown menu-icon"}`} src={`${process.env.PUBLIC_URL}/images/menus/${menu.icon}`} />
                      : "")}
                      {menu.label}
                    </a>
              }
            </ListGroupItem>
          )
        }
      )
    ) : false ;
  }

  render() {
    const {version:{version,buildDate}}=window;
    const sideNavSubStyle = {
      height: this.state.windowHeight - 128
    };
    return (
      <div>
        <div className={"logo-div primary-color text-center " + (this.props.isNavShown ? '' : 'toogleIconDiv')}>
          <span className={"head-toggle-menu " + (this.props.isNavShown ? '' : 'toogleIconSpan')} onClick={this.props.toggleSideNav}><i className={"fa fa-bars " + (this.props.isNavShown ? '' : 'toogleIconMenu')}></i></span>
          <img src={this.props.logo} alt="6d Technlogies" className={"head-logo-img " + (this.props.isNavShown ? '' : 'minSideBar')} />
        </div>
        <div style={sideNavSubStyle} className={"side-nav-menu-in scrollbar " + (this.props.isNavShown ? '' : 'side-nav-shown')}
          onMouseOver={this.props.isNavMouseOver ? this.onMenuMouseOver : null} onMouseLeave={this.props.isNavMouseOver ? this.onMenuMouseLeave : null} >
          <ListGroup className="side-menu-item">
              <div className="searchWrap">
                <div className="searchBarWrap">
                  <Col className="col-12">
                    <div className="input-group search-group-fields">
                      <input
                        value={this.state.searchMenu}
                        placeholder="Search menu items"
                        onChange={(event) => (this.handleChange ? this.handleChange("searchMenu", event.target.value) : null)}
                        className="form-control" 
                        type="text"
                      />
                      {
                        this.state.searchMenu ?
                        <div className="input-group-append pointer" onClick={this.clearSearch}>
                          <i className="fa fa-close"></i>
                        </div>
                        :
                        <div className="input-group-append pointer" onClick={this.handleSearchMenu}>
                          <i className="fa fa-search"></i>
                        </div>
                      }
                    </div>
                  </Col>
                </div>
              </div>
            {this.renderMenus(this.state.filteredMenu, false, this.props.isNavShown)}
          </ListGroup>
        </div>
        <div style={{ height: '10px' }}>
        </div>
        {this.props.isFooterDiv ?
          <div className={"menu_footer text-center " + (this.props.isNavShown ? '' : 'minSideBar')}>
            <div>{`${this.props.footerText} ${version}`}</div>
          </div> : <div className="menu_footer text-center" style={{ display: 'none' }}>
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { isMenuDisabled: state.login.isMenuDisabled };
}

export default connect(mapStateToProps, null)(SideMenu);

