import {
    AUTH_URL,
    LOGIN_URL,
    LOGOUT_URL,
    AUTH_KEY,
    LOGIN_WITH_OTP,
    ENCYPT_KEY
  } from '../util/Constants';
  import {
    LOGIN,
    LOGOUT,
    VALIDATE,
    SET_LOADING,
    SET_TOAST_NOTIF,
    SET_MODAL_POPUP,
    SET_HEADER,
    SAVE_STATE,
    SET_BREAD_CRUMB,
    ADD_TO_NOTIFICATION,
    REMOVE_FROM_NOTIFICATION,
    CLEAR_ALL_NOTIFICATION,
    CLEAR_MSG,
    LOGIN_OTP
  } from '../util/ActionConstants'
  import { setCredentials, encryptData, ajaxRequest } from '../components/ajax/index';
  import { encrypt, getCaptchaValue } from '../util/Util';
  import { encryptAuth } from '../components/ajax/elements/util/Utils';
  
  export function addToNotification(data) {
      return {
          type: ADD_TO_NOTIFICATION,
          payload: data
      };
  };
  
  export function removeFromNotification(id) {
      return {
          type: REMOVE_FROM_NOTIFICATION,
          payload: id
      };
  };
  
  export function clearAllNotification() {
      return {
          type: CLEAR_ALL_NOTIFICATION,
          payload: []
      };
  };
  export function logIn(payload) {
    const data = {
        "userName": payload.username,
      //   "password": encryptData('md5', payload.password)
        //"password": encrypt(payload.password)
        //"password":payload.password,
        "password":encryptAuth(payload.password,ENCYPT_KEY),
        "captcha":payload.captcha,
        loginToken :encryptAuth(getCaptchaValue(payload.username,payload.captchaTotal), ENCYPT_KEY)
        
    };
    const request = ajaxRequest(LOGIN_URL, data, { authKey : AUTH_KEY });
    return {
        type: LOGIN,
        payload: request
    };
  }
  
  export function logInWithOtp(payload) {
      const data = {
          "userName": payload.username,
        //   "password": encryptData('md5', payload.password)
          //"password": encrypt(payload.password)
          //"password":payload.password,
          "password":encryptAuth(payload.password,ENCYPT_KEY),
          "otp": payload.otp,
          "captcha":payload.captcha,
          loginToken :encryptAuth(getCaptchaValue(payload.username,payload.captchaTotal), ENCYPT_KEY)
          
      };
      const request = ajaxRequest(LOGIN_WITH_OTP, data, { authKey : AUTH_KEY });
      return {
          type: LOGIN_OTP,
          payload: request
      };
    }
  
    export function validateLogin(showResonse = true) {
      const request = ajaxRequest(AUTH_URL, {}, { method: 'GET', authKey : AUTH_KEY, "isEncrpt":true, "encrptKey":ENCYPT_KEY })
    return {
        type: VALIDATE,
        payload: request
    }
  }
  
  export function logOut(msg) {
      const request = ajaxRequest(LOGOUT_URL, null, { authKey : AUTH_KEY });
      setCredentials('','');
      return {
          type: LOGOUT,
          isLoggedIn:true,
          payload: {msg}
      };
  }
  
  export function setLogOut() {
      return {
          type: LOGOUT,
          payload: {}
      };
  }
  
  export function clearErrorMsg() {
      return {
          type: CLEAR_MSG,
          payload: {}
      };
  }
  
  export function setLoading(isLoading, isFirstLoad, timestamp) {
      return {
          type: SET_LOADING,
          payload: {isLoading, isFirstLoad, timestamp}
      };
  }
  
  export function setToastNotif(options) {
      if (options)
        options.timestamp = new Date().getTime();
  
      return {
          type: SET_TOAST_NOTIF,
          payload: options
      };
  }
  
  export function setModalPopup(options) {
      return {
          type: SET_MODAL_POPUP,
          payload: options
      };
  }
  
  export function saveCurrentState(prevState) {
      return {
          type: SAVE_STATE,
          payload:prevState
      };
  }
  
  export function setHeader(options) {
      return {
          type: SET_HEADER,
          payload: options
      };
  }
  
  export function setBreadCrumb(options) {
    return {
        type: SET_BREAD_CRUMB,
        payload: options
    };
  }
  