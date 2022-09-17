import { CLEAR_MSG, LOGIN, LOGIN_OTP, LOGOUT, VALIDATE } from '../util/ActionConstants';
import { LOGIN_ERROR_CODES } from '../util/Messages';

export default function (state = {}, action) {

    const { payload } = action;
    switch (action.type) {
        case LOGIN: {
            let login;
            if (payload && payload.status === 200) {
                login = getLogedInUser(payload)
            } else {
                const { response } = payload;
                const data = response ? response.data || {} : {};
                login = {

                    respMsg: data.responseMessage || LOGIN_ERROR_CODES['generic'],
                    error: data.responseMessage || LOGIN_ERROR_CODES['generic'],
                    isLoggedIn: false,
                    userDetails: null,
                    time: new Date().getTime(),
                    resetOtp:true
                }
            }

            /*            let data = {"userId":"56412077","name":"Alex","username":null,"email":"abc1@gmail.com","authorities":[{"authority":"1000"},{"authority":"1001"}],"enabled":true,"credentialsNonExpired":true,"accountNonExpired":true,"accountNonLocked":true};
                       login = {
                           isLoggedIn: true,
                           userDetails: data,
                           respMsg: null
                       } */

            return login;
        }
        case LOGIN_OTP: {
            let login;
            if (payload && payload.status === 200) {
                login = getLogedInUser(payload)
            } else {
                const { response } = payload;
                const data = response ? response.data || {} : {};
                login = {

                    respMsg: data.responseMessage || LOGIN_ERROR_CODES['generic'],
                    error: data.responseMessage || LOGIN_ERROR_CODES['generic'],
                    isLoggedIn: false,
                    userDetails: null,
                    time: new Date().getTime(),
                    resetOtp:false
                }
            }

            return login;
        }
        case LOGOUT:
            return { isLoggedIn: false, userDetails: null, respMsg: payload.msg || "You Have Been Logged Out" }

        case VALIDATE:
            let validate;

            if (payload && payload.status === 200) {
                validate = getLogedInUser(payload);
            } else {
                validate = {
                    isLoggedIn: false,
                    userDetails: null,
                    time: new Date().getTime()
                }

            }

            return validate;
        case CLEAR_MSG:
            return {
                isLoggedIn: false, userDetails: null, respMsg: '', login: {
                    respMsg: '',
                    isLoggedIn: false,
                    userDetails: null,
                    time: new Date().getTime()
                }
            }
        default:
            return state;
    }

}


function getLogedInUser(payload) {
    const { data } = payload;
    if (data.userId)
        data.privilages = data.authorities.map(a => parseInt(a.authority));
    return data.userId ? {
        isLoggedIn: true,
        userDetails: data,
        respMsg: null
    } : {
        respMsg: data.message || LOGIN_ERROR_CODES['generic'],
        isLoggedIn: false,
        userDetails: null,
        time: new Date().getTime()
    }
}