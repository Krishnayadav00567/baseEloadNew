import uuidv4 from 'uuid/v4';
import md5 from 'md5';
import moment from 'moment';
import CryptoJS from 'crypto-js';

export function getToken(auth, channel,isEncrpt=false,encrptKey="key") {
    let autVal=auth;
    if(isEncrpt&&getCookie("X-Auth-Token"))
        autVal=encryptAuth(moment(new Date()).format("DDMMYYYYhhmmssSSS")+ "_" + uuidv4() + '||' + getCookie("X-Auth-Token"), encrptKey);
    
    const entity=getCookie("X-Entity")?{"X-Entity": getCookie("X-Entity")}:{};
    const posm={userId: "10072",channel: channel}
    return {
        "X-Auth-Token":autVal,
        "X-UserId": getCookie("X-UserId"),
        "loginId": getCookie("X-UserId"),
        "X-Msisdn": getCookie("X-Msisdn"),
        "X-OrderId": getuuid(),
        "Authorization" :auth+" "+(getCookie("X-Auth-Token")?getCookie("X-Auth-Token"):''),
        "X-Channel": channel,
        "Access-Control-Allow-Origin": "*",
        ...entity,
        ...posm
    }
}
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
export function setToken(token, userId ,msisdn="") {
    if (!token && !userId) {
        document.cookie = `X-Auth-Token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
        document.cookie = `X-UserId=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
        document.cookie = `X-Msisdn=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    } else {
        const date = new Date();
        date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
        document.cookie = `X-Auth-Token=${token};expires=${date.toUTCString()};path=/`;
        document.cookie = `X-UserId=${userId};expires=${date.toUTCString()};path=/`;
        document.cookie = `X-Msisdn=${msisdn};expires=${date.toUTCString()};path=/`;
    }
}
export function getuuid() {
    //return uuidv1();
    // return Math.floor(Math.random() * 9000) +moment(new Date()).format("DDMMYYYYhhmm")
    return Math.floor(Math.random() * 90000000000000) + 10000000000000;
}
export function encrypt(type, value) {
  switch (type) {
    case 'md5':
      return md5(value);
    default:
      return value;
  }
}

export function encryptAuth(data,key) {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.TripleDES.encrypt(data, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString()
}