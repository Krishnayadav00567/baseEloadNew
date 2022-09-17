import axios from 'axios';
import { getToken, setToken, encrypt, getuuid } from '../util/Utils';
import { store } from '../../../../index';
import { CHANNEL } from '../../../../util/Constants';

export function ajax(url, request, makeCallBack, callback, loadingFunction, options) {
  var loadingId = 0;
  const { method = 'POST', isShowGenericMessage = true,
    isShowSuccess = true, isShowFailure = true, firstLoad,
    isProceedOnError = true, isGetFile, authKey, channel, returnFullResponse = false, responseType, isLogout = true, isEncrpt, encrptKey, isEload, isPhs, isIsiVoucher, isActive, ActiveStatus = ""
  } = options || {};
  const headers = getToken(authKey, channel, isEncrpt, encrptKey);
  if (isGetFile)
    headers['content-type'] = 'multipart/form-data';
  if (isEload) {
    headers['channel'] = CHANNEL;
    headers['userId'] = store.getState().login.userDetails.userId;
  }
  if (isPhs) {
    headers['channelId'] = store.getState().login.userDetails.channelId;
    headers['userId'] = store.getState().login.userDetails.userId;
  }
  if (isIsiVoucher) {
    headers['outletId'] = store.getState().login.userDetails.userId;
  }
  if (isActive) {
    headers['channel'] = CHANNEL;
    headers['userId'] = store.getState().login.userDetails.userId;
    headers['activeStatus'] = ActiveStatus;
  }
  const authOptions = {
    method,
    url: url,
    data: request,
    headers,
    json: true
  };

  if (method && method.trim().toUpperCase() == 'GET') {
    authOptions.params = request;
  }

  if (responseType) authOptions.responseType = responseType;

  if (loadingFunction)
    loadingId = loadingFunction({ isLoading: true, firstLoad });

  axios(authOptions).then((response) => {
    if (makeCallBack)
      makeCallBack(response, callback, isShowGenericMessage, isShowSuccess, isShowFailure, isProceedOnError, returnFullResponse, isLogout);
    else if (callback)
      callback(response);

    if (loadingFunction)
      loadingFunction({ isLoading: false, firstLoad, timestamp: loadingId });

  }).catch(async (err) => {
    // 11-11-2021 :converting blob to string & setting in response for download failure case 
    let text;
    if (responseType == 'blob') {
      text = await (new Response(err.response.data)).text();
    }
    if (makeCallBack)
      makeCallBack(err.response, callback, isShowGenericMessage, isShowSuccess, isShowFailure, isProceedOnError, returnFullResponse, isLogout);
    else if (callback) {
      if (responseType == 'blob') {
        const response = { ...err.response, data: JSON.parse(text) }
        callback(response)
      } else
        callback(err.response);
    }

    if (loadingFunction)
      loadingFunction({ isLoading: false, firstLoad, timestamp: loadingId });
  })
}
export function ajaxRequest(url, requestData, options) {
  // const { method = 'POST', authKey, channel, isEncrpt, encrptKey } = options || {};
  const { method = 'POST', authKey, channel = "WEB", isEncrpt, encrptKey } = options || {};
  const headers = getToken(authKey, channel, isEncrpt, encrptKey);
  const authOptions = {
    method,
    url: url,
    data: requestData,
    headers,
    json: true
  };
  const request = axios(authOptions);
  return request;
}
export function setCredentials(token, userId, msisdn, entity) {
  setToken(token, userId, msisdn, entity);
}
export function getHeaders(auth) {
  return getToken(auth);
}
export function encryptData(type, value) {
  return encrypt(type, value);
}
export function setBaseURL(baseURL) {
  axios.defaults.baseURL = baseURL;
}
export function getUuid() {
  return getuuid();
}