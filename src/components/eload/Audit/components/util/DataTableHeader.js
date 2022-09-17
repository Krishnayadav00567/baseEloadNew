import {
    FIELD_TYPES,
  } from '@6d-ui/fields';

export const AUDIT_VIEW = {
    "AuditHeaderLabels": [
      {
        id: "transactionId",
        name: "Transaction Id",
        isSortable: false
      },
      {
        id: "activity",
        name: "Activity",
        isSortable: false,
        condition: function(data){
          if(data) {
            const val = getUserDetails(data.activity,data.primaryName)
             return val
          }
        }
      },
      // {
      //   id: "primaryName",
      //   name: "Primary Name",
      //   isSortable: false,
      // },
      // {
      //   id: "preUpdate",
      //   name: "Pre Update",
      //   isSortable: false,
      //   //className:['wrap-text']
      // },
      // {
      //   id: "postUpdate",
      //   name: "Post Update",
      //   isSortable: false,
      //   //className:['wrap-text']
      // },
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
        name: "Date",
        isSortable: true
      },
    ],
  
    SEARCH_FIELDS: {
    },
    SEARCH_FILTERS: ['fromDate', 'toDate', 'updatedBy', 'updatedByName']
  
  }

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
      // {
      //   id: "updatedBy",
      //   name: "Updated By",
      //   isSortable: false,
      //   //className:['wrap-text'],
      //   condition: function(data){
      //     if(data) {
      //       const val = getUserDetails(data.updatedByUserId,data.role,data.updatedBy)
      //        return val
      //     }
      //   }
      // },
      // {
      //   id: "date",
      //   name: "Date",
      //   isSortable: false
      // },
    ],
  
    SEARCH_FIELDS: {
    },
    SEARCH_FILTERS: ['fromDate', 'toDate']
  
  }
  
 export const  getUserDetails=(id,role,userName)=>{
   let user='';
    if(id&&(id!=undefined||id!=null||id!='undefined'))
        user=`${id}|`
    if(role&&(role!=undefined||role!=null||role!='undefined'))
      user=`${user}${role}|`
    if(userName&&(userName!=undefined||userName!=null||userName!='undefined'))
    user=`${user}${userName}`
    const length=user.trim().length
    const trimmedUser=user.trim();
    if(trimmedUser.substr(length-1)==='|')
     return trimmedUser.slice(0,-1)     
    return trimmedUser      
  }
 