import { GLOBAL_CONSTANTS } from '../../../../util/Constants';
import moment from 'moment';
import { getUserDetails } from '../../../eload/Audit/components/util/DataTableHeader';

export const ROLES = {
    AUDIT_DETAILS: [
        {
            id: "transactionId",
            name: "Transaction Id",
            isSortable: false
          },
        {
            id: "activity",
            name: "Activity"
        },
        {
            id: "updatedBy",
            name: "Updated By",
            isSortable: false,
            //className:['wrap-text'],
            condition: function(data){
              if(data) {
                const val = getUserDetails(data.updatedByUserId,data.role,data.updatedBy)
                 return val
              }
            }
          },
        {
            id: "date",
            name: "Date"
        },
        
    ],
    AUDIT_SEARCH_FILTERS: ['fromDate', 'toDate', 'updatedBy', 'updatedByName'],
    LABEL_LIST: [
        {
            id: "roleName",
            paramId: "roleName",
            name: "Role Name",
            isSortable: false
        },
        {
            id: "createdDate",
            paramId: "createdDate",
            name: "Created Date",
            isSortable: true
        },
        {
            id: "createdBy",
            paramId: "createdBy",
            name: "Created By",
            isSortable: true
        },

    ],
        SEARCH_FIELDS: {
        roleId: "Id",
        roleName: "roleName",
        roleDesc: "Description",
        type: 'Type'
    },
    // SEARCH_FILTERS: ['roleId', 'roleName', 'roleDesc']
    SEARCH_FILTERS: ['roleId', 'roleName', 'type']

};


export const AUDIT_INFO = {
    "AuditHeaderLabels": [
      {
        id: "transactionId",
        name: "Transaction Id",
        isSortable: false
      },
      {
        id: "fieldName",
        name: "Fields Name",
        isSortable: false
      },
      {
        id: "moduleName",
        name: "Module Name",
        isSortable: false
      },
      {
        id: "preUpdate",
        name: "Pre Update",
        isSortable: false,
        //className:['wrap-text']
      },
      {
        id: "postUpdate",
        name: "Post Update",
        isSortable: false,
        //className:['wrap-text']
      },
      {
        id: "updateType",
        name: "Activity",
        isSortable: false,
      },
    ],
  
    SEARCH_FIELDS: {
    },
    SEARCH_FILTERS: ['fromDate', 'toDate']
  
  }