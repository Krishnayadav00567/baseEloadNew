import { FIELD_TYPES } from '@6d-ui/fields';


export const ROLES = {
    "roleId": {
        name: "roleId",
        placeholder: "Enter Role Id",
        label: "Role Id",
        width: "md",
        type: FIELD_TYPES.TEXT,
        regex: /^[a-zA-Z0-9 ., _-]*$/,
    },
    "roleName": {
        name: "roleName",
        placeholder: "Enter Role Name",
        label: "Role Name",
        width: "md",
        ismandatory: true,
        maxLength: 40,
        regex: /^[a-zA-Z0-9 ., _-]*$/,
        type: FIELD_TYPES.TEXT
    },
    "type": {
        name: "type",
        placeholder: "Select",
        label: "Type",
        width: "md",
        ismandatory: true,
        type: FIELD_TYPES.DROP_DOWN,
        values: [
            {
                value: '0',
                label: 'Non Transactional'
            },
            {
                value: '1',
                label: 'Transactional'
            }
        ]
    },
    enableWebLogin:{
        name: "enableWebLogin",
        label:"Web Login",
        placeholder: "",
        width: "md",
        ismandatory: true,
        type:FIELD_TYPES.RADIO_BUTTON,
        values:[{
            value: true,
            label: 'True'
        }, {
            value: false,
            label: 'False'
        }]
    },
    allowedChannels: {
        name: "allowedChannels",
        placeholder: "Select",
        label: "Allowed Channel For Transaction",
        width: "md",
        ismandatory: false,
        isZindex:true,
        type: FIELD_TYPES.MUTLI_SELECT,
    },
};

export const ROLE_FILEDS = {
    "roleName": {
        name: "roleName",
        placeholder: "Enter Role Name",
        label: "Role Name",
        width: "sm",
        ismandatory: true,
        maxLength: 40,
        regex: /^[a-zA-Z0-9 ]*$/,
        type: FIELD_TYPES.TEXT
    },
    "type": {
        name: "type",
        placeholder: "Select",
        label: "Type",
        width: "sm",
        ismandatory: true,
        type: FIELD_TYPES.DROP_DOWN,
        values: [
            {
                value: '0',
                label: 'Non Transactional'
            },
            {
                value: '1',
                label: 'Transactional'
            }
        ]
    }
}