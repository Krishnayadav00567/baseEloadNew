import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loadable from 'react-loadable';
import { ErrorPage } from '../../errorPage/ErrorPage';
import Loader from '../Loader';
import { ajaxUtil, setHeaderUtil, saveCurrentStateUtil, setNotification, setModalPopupUtil, setLoadingUtil, isComplexTab } from '../Utils';
import { MESSAGE_UTILS } from '../../../util/Messages';
import { CONSTANTS, ENCYPT_KEY, GLOBAL_CONSTANTS, SERVICE_BASE_APPROVALS } from '../../../util/Constants';
import { PRIVILIAGES as MENU_PRIVILIAGES } from '../../../util/Privilages';
import ErrorBoundary from '../../../ErrorBoundary';
import { encryptAuth } from "../../ajax/elements/util/Utils";

const Loading = (props) => {
  if (props.isLoading) {
    if (props.timedOut) {
      return <ErrorPage errorCode={404} />;
    } else {
      return <Loader isLoading={true} />;
    }
  } else if (props.error) {
    if (props?.error?.name == "ChunkLoadError")
      return window.location.reload();
    return <ErrorPage errorCode={500} />;
  } else {
    return <ErrorPage errorCode={404} />;
  }
}

function createLoadable(loader) {
  return Loadable({
    loader,
    loading: Loading
  });
}

const AsyncHome = createLoadable(() => import('../../dashboard/DashBoard').catch(e => console.error(e)));

const AsyncChangePassword = Loadable({
  loader: () => import('../../changePswd/ChangePswd'),
  loading: Loading
});
const AsyncChangePin = Loadable({
  loader: () => import("../../ChangePin/ChangePin"),
  loading: Loading,
});

const AsyncRoleCreate = Loadable({
  loader: () => import('../../role-management').then(module => module.CreateRole),
  loading: Loading
});

const AsyncRoleView = Loadable({
  loader: () => import('../../role-management').then(module => module.View),
  loading: Loading
});

const AsyncMATcodeMapping = Loadable({
  loader: () => import('../../eload/manageMATcode/View'),
  loading: Loading
})


const AsyncEloadUsers = Loadable({
  loader: () => import('../../eload/eload-users/ViewEloadUsers').catch(e => {
    window.location.reload();
    console.error("errr-->", e)
  }),
  loading: Loading
})

export const Routes = ({ userid, privilages, previousState, userChannelType, userEntityType, designationId, designation, loggedInUser, areaId, exportResponseHandler, loader, loadNotification }) => {

  const properties = {
    'userId': userid,
    'entityId': userEntityType,
    'privilages': privilages,
    'ajaxUtil': ajaxUtil,
    'setHeader': setHeaderUtil,
    'saveCurrentState': saveCurrentStateUtil,
    'setNotification': setNotification,
    'setModalPopup': setModalPopupUtil,
    'loadingFunction': setLoadingUtil,
    'messagesUtil': MESSAGE_UTILS,
    'designationId': designationId,
    'designation': designation,
    'areaId': areaId,
    'globalConstants': GLOBAL_CONSTANTS,
    loggedInUser,
    exportResponseHandler,
    loader,
    loadNotification
  }

  return (
    <div style={{ height: '100%' }}>
      <Switch>
        <Route exact path={`/${encryptAuth("home", ENCYPT_KEY)}`} render={(props) =>
          <ErrorBoundary><AsyncHome {...props} {...properties}
            URLS={CONSTANTS.DASHBOARD} /></ErrorBoundary>}
        />


        <Route exact path={`/${encryptAuth("changePswd", ENCYPT_KEY)}`} render={() =>
          <AsyncChangePassword
            {...properties}
            urlConstants={CONSTANTS.CHANGE_PSWD}
            redirect="home"
          />} />

        <Route exact path={`/${encryptAuth("changePin", ENCYPT_KEY)}`} render={() =>
          <AsyncChangePin
            {...properties}
            urlConstants={CONSTANTS.CHANGE_PIN}
            redirect="home"
          />} />

        <Route exact path={`/${encryptAuth("Roles/create", ENCYPT_KEY)}`} render={(props) =>
          (properties.privilages.includes(MENU_PRIVILIAGES.ROLES.create)) ?
            <ErrorBoundary><AsyncRoleCreate
              {...props}
              {...properties}
              url_Roles={CONSTANTS.ROLES}
              menuPrivilages={MENU_PRIVILIAGES.ROLES}
            /></ErrorBoundary>
            : <Route path="/" render={() => <ErrorPage errorCode={404} />} />
        } />
        <Route exact path={`/${encryptAuth("Roles", ENCYPT_KEY)}`} render={(props) =>
          (properties.privilages.includes(MENU_PRIVILIAGES.ROLES.view)) ?
            <ErrorBoundary><AsyncRoleView
              {...properties}
              {...props}
              url_Roles={CONSTANTS.ROLES}
              menuPrivilages={MENU_PRIVILIAGES.ROLES}
              previousState={previousState && previousState.obj.roles}
              previousStateKey="roles"
              AUDIT_DETAILS={CONSTANTS.AUDIT_DETAILS}
            /></ErrorBoundary>
            : <Route path="/" render={() => <ErrorPage errorCode={404} />} />
        } />

        <Route exact path={`/${encryptAuth("eloadUsers", ENCYPT_KEY)}`} render={(props) =>
          (properties.privilages.includes(MENU_PRIVILIAGES.ELOAD_USERS.view)) ?
            <ErrorBoundary><AsyncEloadUsers
              {...properties}
              {...props}
              URLS={{
                ...CONSTANTS.ELOAD_USERS,
                GET_USER_ROLES: CONSTANTS.MANAGE_ACCOUNT.LIST_ROLES,
                LIST_RESTRICTIONS: CONSTANTS.MANAGE_ACCOUNT.LIST_RESTRICTIONS,
                VALIDATE_MDN: CONSTANTS.VALIDATE_MDN,
                LIST_REGION_URL: CONSTANTS.PRODUCT_PLAN.LIST_REGION_URL,
                LIST_COMMERCIAL_CHANNELS_URLS: CONSTANTS.PRODUCT_PLAN.GET_COM_CHANNELS
              }}
              menuPrivilages={{ ...MENU_PRIVILIAGES.ELOAD_USERS }}
            /> </ErrorBoundary> : <Route path="/" render={() => <ErrorPage errorCode={404} />} />
        } />
        <Route exact path={`/${encryptAuth("matCodeMApping", ENCYPT_KEY)}`} render={(props) =>
          (properties.privilages.includes(MENU_PRIVILIAGES.MAT_CODE.view)) ?
            <ErrorBoundary><AsyncMATcodeMapping
              {...props}
              {...properties}
              URLS={CONSTANTS.MAT_CODE}
              menuPrivilages={MENU_PRIVILIAGES.MAT_CODE}
            /></ErrorBoundary>
            : <Route path="/" render={() => <ErrorPage errorCode={404} />} />
        } /> 
        

        <Route path="/_refresh" render={() => <div className="p-5 text-center text-muted">Refreshing.....</div>} />

        <Route exact path="/" render={() => <Redirect to={`/${encryptAuth("home", ENCYPT_KEY)}`} />} />
        <Route path="/" render={() => <ErrorPage errorCode={404} />} />

      </Switch>
    </div>
  )
}
