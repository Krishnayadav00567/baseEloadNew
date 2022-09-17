import { encryptAuth } from "../components/ajax/elements/util/Utils";

const { REACT_APP_BASE_URL, REACT_APP_ELOAD_URL, REACT_APP_ELOAD_BAL_URL, REACT_APP_INVENTORYURL, REACT_APP_POSURL, REACT_APP_POSMURL,
    REACT_APP_DEALER_ID, REACT_APP_DISTRIBUTOR_ID, REACT_APP_GOOGLE_API_KEY, REACT_APP_USERNAME, REACT_APP_PASSWORD,
    REACT_APP_SFA_DESIGNATION, REACT_APP_CVS_DESIGNATION, REACT_APP_ACCOUNTUSER_DESG, REACT_APP_MONEY_ICON,
    REACT_APP_DEA_DESIGNATION, REACT_APP_RCS_DESIG, REACT_APP_TRADE_SIS_DESIG, REACT_APP_TABLEAU_URL, REACT_APP_SMARTFREN_BL_URL,REACT_APP_RECAPTCHA_KEY } = process.env;

export const { BASE_URL, DEALER_ID, DISTRIBUTOR_ID, GOOGLE_API_KEY, USERNAME, PASSWORD, SFA_DESIG_ID, CVS_DESIG_ID, ACC_USER_DESG,
    EloadBaseUrl, EloadBalRechUrl, InventoryUrl, POSUrl, POSMUrl, MONEY_ICON, DEA_DESIG_ID, RCS_DESIG, TRADE_SIS, TABLEAU_URL, SMARTFREN_BL_URL,RECAPTCHA_KEY } = {
    BASE_URL: REACT_APP_BASE_URL,
    DEALER_ID: REACT_APP_DEALER_ID,
    DISTRIBUTOR_ID: REACT_APP_DISTRIBUTOR_ID,
    EloadBalRechUrl: REACT_APP_ELOAD_BAL_URL,
    EloadBaseUrl: REACT_APP_ELOAD_URL,
    InventoryUrl: REACT_APP_INVENTORYURL,
    POSUrl: REACT_APP_POSURL,
    POSMUrl: REACT_APP_POSMURL,
    GOOGLE_API_KEY: REACT_APP_GOOGLE_API_KEY,
    USERNAME: REACT_APP_USERNAME,
    PASSWORD: REACT_APP_PASSWORD,
    SFA_DESIG_ID: REACT_APP_SFA_DESIGNATION,
    CVS_DESIG_ID: REACT_APP_CVS_DESIGNATION,
    ACC_USER_DESG: REACT_APP_ACCOUNTUSER_DESG,
    MONEY_ICON: REACT_APP_MONEY_ICON,
    DEA_DESIG_ID: REACT_APP_DEA_DESIGNATION,
    RCS_DESIG: REACT_APP_RCS_DESIG,
    TRADE_SIS: REACT_APP_TRADE_SIS_DESIG,
    TABLEAU_URL: REACT_APP_TABLEAU_URL,
    SMARTFREN_BL_URL: REACT_APP_SMARTFREN_BL_URL,
    RECAPTCHA_KEY:REACT_APP_RECAPTCHA_KEY
};

export const LOGIN = "login";
export const LOGOUT = "logout";
export const CHANGE_PSWD = "changePswd";
export const SET_LOADING = "set_loading";
export const SET_TOAST_NOTIF = "set_toast_notif";
export const SET_MODAL_POPUP = "set_modal_popup";
export const SET_HEADER = "set_header";
export const SET_BREAD_CRUMB = "set_breadcrumb";
// export const EloadBaseUrl = 'http://10.0.14.140:9089/SmartFrenEload/';
// export const EloadBalRechUrl = 'http://10.0.14.140:8080/ERecharge/rest/v1/';
// export const InventoryUrl = 'http://smartfrennusantara.6dtech.co.in:38080/';
// export const POSUrl = 'http://10.0.10.51:7072/';
// export const POSMUrl = 'http://10.0.10.51:7000/';
export const GLOBAL_CONSTANTS = {
    INITIAL_ROW_COUNT: 10,
    FILE_UPLOAD_MAX_SIZE: 5,
    DATE_FORMAT: "YYYY-MM-DD",
    NEW_DATE_FORMAT: "DD-MM-YYYY",
    DATE_TIMESTAMP_FORMAT: "DD-MM-YYYY hh:mm:ss",
    DMS_DATE_FORMAT: "DD/MM/YYYY",
    GET_ROLES_URL: `hierarchy/role`,
    FORM_MODAL: {
        SearchFilter: 1,
        Create: 2,
        Edit: 3,
        View: 4,
        Delete: 5,
        Select: 6,
        RefreshClick: 7
    },
    BL_RESULT_CODES: {
        SUCCESS: "0"
    },
    ENTITY_IDS: {
        CHANNEL_PARTNER: 3,
        OPERATOR: 1
    },
    LEVEL_ID: {
        OPERATOR: 1
    },
    USER_STATUS: {
        ACTIVE: {
            id: 1,
            name: 'Active'
        },
        SUSPEND: {
            id: 2,
            name: 'Suspended'
        }
    },
    SERVICE_TYPE: {
        CorporateVA: 1,
        Productplan: 2,
        POINTOFCHARGE_MDN: 3,
        Denomination_Template: 4,
        FrontMargin_Topup: 5,
        FrontMargin_Product: 6,
        Roaming_Template: 7,
        Dct_Template: 8,
        Pocket_Template: 9,
        Brand_Prefix: 11,
        Pocket_Type: 12,
        Blacklist_Mdn: 13,
        Topup: 19,
        PURCHASE_PLAN_BILL: 55,
        PURCHASE_COCKTAIL_PLAN_BILL: 61,
        LOP: 64,
        DEDUCT_SVA: 59,
        EMPTY_SVA: 58,
        MA_1RS_TOPUP: 19,
        BULK_RESOLVE_TRANSACTION_FILE_TYPE: 9,
        Manage_Account: 10,
        REVERSE_TRANSFER: 152,//Open_Reversal
        CHANGE_MDN: 68,
        RETIRED_MERCHANT_REPORT: 43,
        NON_SELF_CARE_CHANGE_MDN: 67,
        SELFCARE_CHANGE_MDN: 80,
        SRIS_CHANGE_MDN: 161,
        MERCHANT_RETAG: 60,
        COCKTAIL_TEMPLATE:20,
        MA_TRANSFER_REVERSE: 8
    },
    APPROVAL_PENDING: {
        PARTNER: 5,
        SALES_LOC: 2,
        PARTNER_USER: 6,
        OUTLET: 0,
        SKA: 0
    },
    ACTIVE_STATUS: {
        PARTNER: 1,
        PARTNER_USER: 1,
        OUTLET: 1,
        SALES_LOC: 1
    },
    REJECT_STATUS: {
        PARTNER_USER: 8,
        PARTNER: 6
    },
    COMMON_APPROVAL_STATUS: {
        PENDING: [4, 5, 6],
        APPROVED: [1, 2]
    },
    APPROVAL_STATUS: {
        APPROVED: [2, 3],
        PENDING: [1],
        CREATE_REJECT: [1, 10, 7, 16]
    }
}

export const MESSAGES = {
    FILED_MANDATORY: `Please enter all mandatory fields highlighted.`,
    FIELD_PROPER_VALUE: `Please enter proper values`,
    FIELD_ERROR: `Please Enter Proper Values in the fields highlighted in red`,
    APPROVAL_ERROR: `Cannot edit this record`
}
export const ErrorMessages = {
    MANDATORY: "This field is mandatory",
}

export const AUTH_KEY = 'Bearer';
export const CHANNEL = 'WEB';
export const LOGIN_URL = `auth/login`;
export const FIRST_LOGIN_URL = `auth/isFirstLogin`;
//export const LOGIN_URL = "/v1/api/auth/signin";
export const LOGOUT_URL = "/v1/api/auth/logout";
// export const AUTH_URL = `${BASE_URL}v1/api/auth/authorize`;
export const AUTH_URL = `${BASE_URL}auth/profile/getUserInfo`;
export const CHANGE_PSWD_URL = "auth/changePassword";
export const SET_PSWD_URL = "auth/setPassword";
export const FORGET_PSWD_URL = "auth/resetPassword";
//export const FORGET_PSWD_GET_OTP = 'auth/otp/generate';
export const FORGET_PSWD_GET_OTP = 'auth/otp/password/generate';
export const CHANGE_PSWD_GET_OTP = 'auth/otp/changePassword/generate';
export const FORGET_PSWD_VALIDATE_OTP = 'auth/otp/validate';
export const VERIFY_EMAIL = `auth/emailVerification/verifyEmail?code=`

export const CHANGE_PIN_URL = `${EloadBalRechUrl}pos/changePin`;
export const RESET_PIN_URL = `${EloadBalRechUrl}pos/resetPin`;
export const GENERATE_OTP_URL = `auth/unregisteredotp/getOtp`;
export const VALIDATE_OTP_URL = `auth/unregisteredotp/validate`;
export const LOGIN_WITH_OTP = `auth/loginWithOtp`;

export const ENCYPT_KEY = "sdsd34545sdfasd232sds334";

export const COUNTRY_CODE = '+62';
export const COUNTRY_CODE_MDN = '62';

export const FULLSCRREN_PATHS = [
    `/${encryptAuth("eloadUsers", ENCYPT_KEY)}`,
    `/${encryptAuth("approvalWorkflow", ENCYPT_KEY)}`,
    `/${encryptAuth("mytasks", ENCYPT_KEY)}`,
    `/${encryptAuth("myProfile", ENCYPT_KEY)}`,
    `/${encryptAuth("merchantAccount", ENCYPT_KEY)}`,
    `/${encryptAuth("eloadUsers", ENCYPT_KEY)}`,
];

export const NON_SELECTABLE_APPROVAL_STATUS = [1]
export const LIST_ADAPTER_FILES=`${EloadBaseUrl}smartAdapterFile/view?dir=true&path=`;
export const DOWNLOAD_ADAPTER_FILES=`${EloadBaseUrl}smartAdapterFile/download?path=`;
export const CONSTANTS = {
    CHANGE_PSWD: {
        CHANGE_PSWD_URL: "auth/changePassword"
    },
    CHANGE_PIN: {
        CHANGE_PIN_URL: "/v1/pin/change"
    },
    ROLES: {
        CREATE_URL: `/auth/role`,
        UPDATE_URL: `/auth/role`,
        DELETE_URL: `/auth/role/delete/`,
        SEARCH_URL: `auth/role`,
        GET_FEATURES: `auth/module`,
        GET_ROLE_AUDIT_DATA: `${EloadBaseUrl}viewAudit?serviceType=99`,
        EXPORT_ROLE_AUDIT_DATA_EXCEL: `${EloadBaseUrl}export/excel?serviceType=99`,
        EXPORT_ROLE_AUDIT_DATA_CSV: `${EloadBaseUrl}export/csv?serviceType=99`,
        GET_MODULES: `hierarchy/module/applicationModules`,
        GET_CHANNELS: `${EloadBaseUrl}v1/api/transactionreport/getChannels`,
    },
    DASHBOARD: {
        GET_LATEST_NOTIFICATIONS: 'notification/notification/webNotification',
        GET_ALL_NOTIFICATIONS: 'notification/notification/allNotification',
        READ_NOTIFICATIONS: 'notification/notification/markRead'
    },
    VALIDATE_MDN: `${EloadBaseUrl}ippManagement/checkOnboardUser`,
    
    PRODUCT_PLAN: {
        GET_COM_CHANNELS: `${EloadBaseUrl}commercialChannel`,
        LIST_REGION_URL: `${EloadBaseUrl}location/getRegion`,
    },
    
    MANAGE_ACCOUNT: {
        LIST_RESTRICTIONS: `${EloadBaseUrl}user/state`,
        LIST_ROLES: `${EloadBaseUrl}hierarchy/levelRoleDetails?levelId=`,
    },
   
    ELOAD_USERS: {
        GET_LANGUAGES: `${EloadBaseUrl}user/language`,
        GET_TERITORY: `${EloadBaseUrl}location/getCluster`,
        GET_USERS: `${EloadBaseUrl}userAdministration/view?isUser=true`,
        CREATE_USER: `${EloadBaseUrl}userAdministration/createUser`,
        GET_USER_INFO: `${EloadBaseUrl}userAdministration/getUserDetails?userId=`,
        DELETE_USER: `${EloadBaseUrl}userAdministration/deleteUser?userId=`,
        UPDATE_USER: `${EloadBaseUrl}userAdministration/updateUser`,
        LIST_TIME_ZONE: `${EloadBaseUrl}user/timeZone`,
        CHANGE_STATUS_URL: `${EloadBaseUrl}usermanagementstatus/changestate`,
        LIST_SWITCHOVER_STATUS_URL: `${EloadBaseUrl}usermanagementstatus/switchOverStatus/`,
        RESET_PSWD_URL: `auth/resetPassword`,
        RESET__USER_PSWD_URL: `auth/selfCareResetPassword`,
        GET_USER_PROFILE:`${EloadBaseUrl}profile/getUserInfo`
    },
    MAT_CODE: {
        LIST_URL: `${EloadBaseUrl}matCode/view`,
        CREATE_URL: `${EloadBaseUrl}matCode/createMatCode`,
        UPDATE_URL: `${EloadBaseUrl}matCode/updateMatCode`,
        DELETE_URL: `${EloadBaseUrl}`,
        LIST_DENOMIATION: `${EloadBaseUrl}EtopupPocketType/viewDenomination`,
        POCKET_TYPE_DROP: `${EloadBaseUrl}EtopupPocketType/pocketType`,
    },
    }
