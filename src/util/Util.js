import React, { useEffect, useState } from 'react';
import moment from 'moment';
import CryptoJS from 'crypto-js';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { GLOBAL_CONSTANTS, ENCYPT_KEY, COUNTRY_CODE_MDN } from './Constants';

export function getDropDownValues(values, name) {
    return (values[name] && values[name].label) ? values[name].label : values[name];
}
// to get value form selected dropdown values
export function getValueOfDropDown(values, name) {
    return (values[name] && values[name].value) ? values[name].value : values[name];
}

export function dateToStringFormatter(date) {
    if (date)
        return moment(date).format(GLOBAL_CONSTANTS.NEW_DATE_FORMAT);
}


export function stringToDateFormatter(inputString) {
    if (inputString)
        return moment(inputString, GLOBAL_CONSTANTS.NEW_DATE_FORMAT);
}

export function formatDateTimeStamp(inputString) {
    if (inputString)
        return moment(inputString).format(GLOBAL_CONSTANTS.DATE_TIMESTAMP_FORMAT) != 'Invalid date' ?
            moment(inputString).format(GLOBAL_CONSTANTS.DATE_TIMESTAMP_FORMAT) : inputString
}

export function formatStringToDate(inputString) {
    if (inputString)
        return moment(inputString, GLOBAL_CONSTANTS.DMS_DATE_FORMAT);
}

export function getValuesForDropDown(options, label) {
    return options.find(option => option.label === label);
}
export function getValuesForDropDownFrmValue(options, value) {
    return options.find(option => option.value === value);
}

export function dateTimeConverter(input) {
    const convert = moment(input).format("DD-MM-YYYY HH:mm:ss")
      if (convert)
     return moment(convert, "DD-MM-YYYY HH:mm:ss");
}

export function encrypt(data) {

    const keyHex = CryptoJS.enc.Utf8.parse(ENCYPT_KEY);
    const encrypted = CryptoJS.TripleDES.encrypt(data, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString()
}

export const getCurrentPrivilages = (privilages, menuPrivilages) => {

    const priv = {
        create: false,
        edit: false,
        delete: false,
        download: false,
        info: false
    };
    let privConst = {};
    if (privilages && menuPrivilages) {
        privConst = {
            create: _.includes(privilages, menuPrivilages.create),
            edit: _.includes(privilages, menuPrivilages.edit),
            delete: _.includes(privilages, menuPrivilages.delete),
            download: _.includes(privilages, menuPrivilages.download),
            info: _.includes(privilages, menuPrivilages.info)
        }
    }

    return Object.assign(priv, privConst);
};

export function getDropDownValue(value, attribute = 'value') {
    const valueType = typeof value;

    if (valueType == 'string'
        || valueType == 'number'
        || valueType == 'boolean'
        || valueType == 'undefined'
        || value == null) {
        return value
    };
    if (Array.isArray(value))
        return value.map(v => getDropDownValue(v, attribute));

    return value[attribute];
}

export function getRandomNumber() {
    const min = 1;
    const max = 1000;
    const rand = min + Math.random() * (max - min)
    return rand;
}

export function getOptions(fOptions, oOptions) {
    let options = [];
    if (fOptions && fOptions.length > 0) {
        options = fOptions;
    } else if (oOptions && oOptions.length > 0) {
        options = oOptions;
    }
    return options;
}
export const numberFormat = (value) => {
    if (value) {
        value = value.toString().split('.').join('')
        return new Intl.NumberFormat('id-ID', { style: 'decimal', currency: 'IDR' }).format(parseInt(value));
    } else {
        return '0'
    }
}

export const changeToNumber = (value) => {
    if (value) {
        return parseInt(value.toString().split('.').join(''))
    } else {
        return 0
    }
}

export const expectedDateFormat = (value, toFormat, fromFormat = '') => {
    if (fromFormat) {
        return moment(value, fromFormat).format(toFormat)
    } else {
        return moment(value).format(toFormat)
    }
}

export const getMonths = (value) => {
    let months = [
        { label: 'January', value: '0' },
        { label: 'February', value: '1' },
        { label: 'March', value: '2' },
        { label: 'April', value: '3' },
        { label: 'May', value: '4' },
        { label: 'June', value: '5' },
        { label: 'July', value: '6' },
        { label: 'August', value: '7' },
        { label: 'September', value: '8' },
        { label: 'October', value: '9' },
        { label: 'November', value: '10' },
        { label: 'December', value: '11' }
    ]
    let result = months.slice(0, value);
    result.push({
        label: 'This Month',
        value: new Date().getMonth()
    });
    return result;
}

export const trimCountryCode = (msisdn) => {
    if (msisdn)
        if (msisdn.startsWith(COUNTRY_CODE_MDN)) {
            return msisdn.substring(2, msisdn.length)
        }
    return msisdn
}

export const dropDownValueForText = (value, options) => {
    if (options) {
        for (let i = 0; i < options.length; i++) {
            if (String(options[i].value) === String(value))
                return options[i].label;
        }
    }
    return value
}
export function useWindowHeight() {
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return height;
}

export function thousandFormatter(num, appendDecimal = true) {
    if (num) {
        var num_parts = num.toString().split(".");
        if (num_parts[0].includes(',')) {
            num_parts[0] = num_parts[0].replaceAll(',', '')
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (num_parts.length === 1 && appendDecimal)
            num_parts.push('00')
        return num_parts.join('.');
    }
    else return num;

    // return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function getCaptchaValue(userName,captcha){
    const dataTmp=`${userName}|${captcha}|${uuidv4()}|${moment(new Date()).format("DDMMYYYYhhmmssSSS")}`
    return dataTmp
}