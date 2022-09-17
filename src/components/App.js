import { connect } from 'react-redux';
import EnsureLoggedInContainer from '../util/EnsureLoggedInContainer';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ContextProvider from '../util/ContextProvider';
import Login from './login/Login';
import Home from './home/Home';
import { setBaseURL } from './ajax/index';
import { BASE_URL, ENCYPT_KEY} from '../util/Constants';
import ForgetPwd from './forgetPwd/ForgetPwd';
import ChangePassword from './login/ForceChangePassword';
import SmartAdapter from './smartAdapter/smartAdapter';
import { withOneTabEnforcer } from "react-one-tab-enforcer"
//css imports
import '@6d-ui/fields/build/styles/min/style.min.css';
import './data-table/styles/min/style.min.css';
import '@6d-ui/buttons/build/styles/min/style.min.css';
import '@6d-ui/popup/build/styles/min/style.min.css'
import '@6d-ui/ui-components/build/styles/min/style.min.css';
import '@6d-ui/form/build/styles/min/style.min.css';
import './styleSheet/common/form.css';
import './styleSheet/out/style.css';
import './styleSheet/out/skeleton.css';
import './Login.css';
import 'react-sortable-tree/style.css';
import { MemoryRouter } from 'react-router';
import 'react-day-picker/lib/style.css';
import { TabErrorPage } from './errorPage/TabErrorPage';
import { EmailVerify } from './home/EmailVerify';
import './styleSheet/out/eloadStyle.css';
import { encryptAuth } from './ajax/elements/util/Utils';

class App extends Component {
  componentDidMount() {
    setBaseURL(BASE_URL);
  }
  render() {
    return (
      // <ContextProvider.Provider value={{
      // }}>
      //   <MemoryRouter basename={process.env.PUBLIC_URL}>
      //     <Switch>
      //       <Route path="/login" component={Login} />
      //       <Route path="/forgetPassword/:userName/:serviceId/:isUser" component={ForgetPwd} />
      //       <Route path="/forceChangePassword" component={ChangePassword} />
      //       <Route path="/emailVerification/verifyEmail/:code" render={(props)=><EmailVerify {...props} />} />
      //       <EnsureLoggedInContainer>
      //         <Switch>
      //           <Route path="/" component={Home} />
      //         </Switch>
      //       </EnsureLoggedInContainer>
      //     </Switch>
      //   </MemoryRouter>
      // </ContextProvider.Provider>
      <ContextProvider.Provider value={{}}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Switch>
          <Route path={`/${encryptAuth("login", ENCYPT_KEY)}`} component={Login} />
          <Route path="/SmartAdapter" component={ SmartAdapter} />
          <Route path="/forgetPassword" component={ForgetPwd} />
          <Route  path={`/${encryptAuth("forceChangePassword", ENCYPT_KEY)}`} component={ChangePassword} />
          <Route path="/emailVerification/verifyEmail/:code" render={(props)=><EmailVerify {...props} />} />
          <EnsureLoggedInContainer>
            <Switch>
            <Route path="/" component={Home} />
            </Switch>
          </EnsureLoggedInContainer>
          </Switch>
        </BrowserRouter>
      </ContextProvider.Provider>
    );
  }
}

function mapStateToProps(state) {
  return { login: state.login };
}

export default connect(mapStateToProps) (withOneTabEnforcer({appName:'dms20-eload-20',OnlyOneTabComponent: TabErrorPage,localStorageTimeout :5 * 1000,localStorageResetInterval:2* 1000}) (App));
