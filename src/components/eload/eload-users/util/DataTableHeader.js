import { FIELD_TYPES } from '@6d-ui/fields';
export const ELOAD_USERS = {
  "tableHeaderLabels": [
    // {
    //   id: "userId",
    //   name: "user Id"
    // },
    {
      id: "userName",
      name: "Username"
    },
    // {
    //   id: "firstName",
    //   name: "Name",
    //   isSortable: false,
    //   condition: (data) => {
    //     return data && `${data.firstName || ''} ${data.lastName || ''}`;
    //   }
    // },
    // {
    //   id: "msisdn",
    //   name: "MDN",
    //   isSortable: false,
    //   isSameCase: true
    // },
    {
      id: "role",
      name: "role",
    },
    {
      id: "territory",
      name: "territory"
    },
    {
      id: "status",
      name: "status",
      isSortable: false
    },
    /*  {
       id: "securityLock",
       name: "security Lock",
       isSortable: false
     }, */
    {
      id: "suspend",
      name: "suspend",
    },
    {
      id: "approvalStatus",
      name: "Approval Status",
      condition: (data) => {
        return data ? `${data.approvalActionName || ''} ${data.approvalStatusName || ''}` : ''
      }
    },
    {
      id: "createdDate",
      name: "created Date",
      isSortable: true
    }
  ],
  SEARCH_FILTERS: ['userName', 'firstName', 'lastName', 'roleId',
    'status', 'restrictionId', 'channelId', 'regionId', 'clusterId']
};

export const FormElements = {
  userId: {
    name: "userId",
    placeholder: "User Id",
    label: "User Id",
    width: "md",
    ismandatory: false,
    type: FIELD_TYPES.TEXT_BOX_DISABLED,
    isView: true,
    isEdit: true,
  },
  userName: {
    name: "userName",
    placeholder: "JXXn",
    label: "Username",
    width: "md",
    ismandatory: true,
    regex: /^[A-Za-z0-9&()_.-]+$/,
    type: FIELD_TYPES.TEXT,
    isEdit: true,
  },
  firstName: {
    name: "firstName",
    placeholder: "JXXN",
    label: "First Name",
    width: "md",
    regex: /^[A-Za-z0-9&() _.-]+$/,
    ismandatory: true,
    maxLength: 45,
    type: FIELD_TYPES.TEXT
  },
  lastName: {
    name: "lastName",
    placeholder: "PXaXl",
    label: "Last Name",
    width: "md",
    regex: /^[A-Za-z0-9&() _.-]+$/,
    ismandatory: true,
    maxLength: 45,
    type: FIELD_TYPES.TEXT
  },
  msisdn: {
    name: 'msisdn',
    placeholder: "XXXXXXXXXXX",
    label: "MDN",
    width: "md",
    ismandatory: false,
    minLength: 10,
    maxLength: 14,
    regex: /^[0-9]*$/,
    messages: {
      regex: 'Only numbers allowed'
    },
    isEdit: true,
  },
  email: {
    name: "email",
    placeholder: "jp@XX.XX",
    label: "Email",
    width: "md",
    regex: /^[a-zA-Z0-9.\_%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/,
    ismandatory: true,
    maxLength: 45,
    type: FIELD_TYPES.TEXT
  },
  language: {
    name: "language",
    placeholder: "Select",
    label: "Language",
    width: "md",
    ismandatory: true,
    type: FIELD_TYPES.DROP_DOWN
  },
  role: {
    name: "role",
    placeholder: "Select",
    label: "Role",
    width: "md",
    ismandatory: true,
    maxLength: 45,
    type: FIELD_TYPES.DROP_DOWN
  },
  channelId: {
    name: "channelId",
    placeholder: "Select",
    label: "Commercial Channel",
    width: "md",
    //ismandatory: true,
    maxLength: 45,
    type: FIELD_TYPES.DROP_DOWN
  },
  regionId: {
    name: "regionId",
    placeholder: "Select",
    label: "Region",
    width: "md",
    //ismandatory: true,
    maxLength: 45,
    type: FIELD_TYPES.DROP_DOWN
  },
  clusterId: {
    name: "clusterId",
    placeholder: "Select",
    label: "Cluster",
    width: "md",
    //ismandatory: true,
    maxLength: 45,
    type: FIELD_TYPES.DROP_DOWN
  },
  timeZone: {
    name: "timeZone",
    placeholder: "Select",
    label: "Time Zone",
    width: "md",
    //ismandatory: true,
    maxLength: 45,
    type: FIELD_TYPES.DROP_DOWN,
    /* values:[
      {value:'Asia/Jakarta',label:'Asia/Jakarta'},
      {value:'Asia/Makassar',label:'Asia/Makassar'},
      {value:'Asia/Jayapura',label:'Asia/Jayapura'}
    ] */
  },
  status: {
    name: "status",
    placeholder: "Status",
    label: "Status",
    width: "md",
    ismandatory: false,
    maxLength: 45,
    type: FIELD_TYPES.TEXT_BOX_DISABLED,
    isView: true,
    isEdit: true,
  },
  securityLock: {
    name: "securityLock",
    placeholder: "Lock",
    label: "Security Lock",
    width: "md",
    ismandatory: false,
    maxLength: 45,
    type: FIELD_TYPES.TEXT_BOX_DISABLED,
    isView: true
  },
  suspended: {
    name: "suspended",
    placeholder: "XXX",
    label: "Suspended",
    width: "md",
    ismandatory: false,
    maxLength: 45,
    type: FIELD_TYPES.TEXT_BOX_DISABLED,
    isView: true,
    isNotInfo : true,
  },
  prevBlockState: {
    name: "prevBlockState",
    placeholder: "Last Restriction",
    label: "Last Restriction",
    width: "md",
    type: FIELD_TYPES.TEXT_BOX_DISABLED,
    isView: true
  },
  prevBlockCodeChangeReason: {
    name: "prevBlockCodeChangeReason",
    placeholder: "Last Restriction Comment",
    label: "Last Restriction Comment",
    width: "md",
    type: FIELD_TYPES.TEXT_BOX_DISABLED,
    isView: true
  },
  createdBy: {
    name: "createdBy",
    placeholder: "created",
    label: "Created By",
    width: "md",
    type: FIELD_TYPES.TEXT_BOX_DISABLED,
    isView: true
  },
  createdOn: {
    name: "createdOn",
    placeholder: "XX-XX-XXXX",
    label: "Created on",
    width: "md",
    type: FIELD_TYPES.TEXT_BOX_DISABLED,
    isView: true
  },
  lastModifiedBy: {
    name: "lastModifiedBy",
    placeholder: "jXXn",
    label: "Last Modified By",
    width: "md",
    type: FIELD_TYPES.TEXT_BOX_DISABLED,
    isView: true
  },
  lastModifiedOn: {
    name: "lastModifiedOn",
    placeholder: "XX-XX-XXXX",
    label: "Last Modified On",
    width: "md",
    type: FIELD_TYPES.TEXT_BOX_DISABLED,
    isView: true
  },
}

export const USER_SEARCH_FILTERS = {
  userName: {
    name: "userName",
    placeholder: "JXXn",
    label: "Username",
    width: "md",
    ismandatory: false,
    regex: /^[A-Za-z0-9&()_.-]+$/,
    type: FIELD_TYPES.TEXT
  },
  firstName: {
    name: "firstName",
    placeholder: "JXXn",
    label: "First Name",
    width: "md",
    regex: /^[A-Za-z0-9&() _.-]+$/,
    ismandatory: false,
    minLength :1,
    maxLength: 45,
    type: FIELD_TYPES.TEXT
  },
  lastName: {
    name: "lastName",
    placeholder: "PXXl",
    label: "Last Name",
    width: "md",
    regex: /^[A-Za-z0-9&() _.-]+$/,
    ismandatory: false,
    minLength :1,
    maxLength: 45,
    type: FIELD_TYPES.TEXT
  },
  roleId: {
    name: "roleId",
    placeholder: "Select",
    label: "Role",
    width: "md",
    ismandatory: false,
    maxLength: 45,
    type: FIELD_TYPES.DROP_DOWN
  },
  status: {
    name: "status",
    placeholder: "Select",
    label: "Status",
    width: "md",
    ismandatory: false,
    maxLength: 45,
    type: FIELD_TYPES.DROP_DOWN,
  },
  restrictionId: {
    name: "restrictionId",
    placeholder: "Select",
    label: "Restriction",
    width: "md",
    ismandatory: false,
    maxLength: 45,
    type: FIELD_TYPES.DROP_DOWN,
  }
}
export const USER_EXTRA_SEARCH_FILTERS = {
  channelId: {
    name: "channelId",
    placeholder: "Select",
    label: "Commercial Channel",
    width: "md",
    ismandatory: false,
    maxLength: 45,
    type: FIELD_TYPES.DROP_DOWN,
  },
  regionId: {
    name: "regionId",
    placeholder: "Select",
    label: "Region",
    width: "md",
    ismandatory: false,
    maxLength: 45,
    type: FIELD_TYPES.DROP_DOWN,
  },
  clusterId: {
    name: "clusterId",
    placeholder: "Select",
    label: "Cluster",
    width: "md",
    ismandatory: false,
    maxLength: 45,
    type: FIELD_TYPES.DROP_DOWN,
  }
}