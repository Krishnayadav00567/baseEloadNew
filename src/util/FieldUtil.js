import React from 'react';
import { validateForm } from '@6d-ui/fields';
import _ from 'lodash';
import { FIELD_TYPES } from "@6d-ui/fields";
import moment from 'moment';

export function getGroupArray(groups = [], nonEditableFields = [], assignedFields = [],hasParent) {
    return groups.reduce((acc, group) => {
        const getFields = getFieldsArray(group.fields, nonEditableFields, assignedFields,hasParent);
        const getGroups = getGroupArray(group.subGroups, nonEditableFields, assignedFields,hasParent);
        if ((getFields && getFields.length > 0) || (getGroups && getGroups.length > 0)) {
            acc = [...acc, {
                ...group,
                fields: getFields,
                subGroups: getGroups
            }]
        }
        return acc;
    }, [])
}

function getFieldsArray(fields = [], nonEditableFields = [], assignedFields = [],hasParent) {
    let isSeparateEdit;
    const allFields = Object.keys(fields).map(key => {
        if (nonEditableFields.find(f => fields[key].name == f)) {
            isSeparateEdit = true;
        } else {
            isSeparateEdit = false;
        }
        return { fieldId: key, ...fields[key], isSeparateEdit }
    })
    return _.intersectionWith(allFields, assignedFields, (f1, f2) => {
        //add is Mandatory tag to field list fronm API call response
        if(f1.fieldId == f2.id){
            if(f1.name==="parent"&&hasParent){
                f1.ismandatory=true;    
            }else
            f1.ismandatory = f2.isMandatory == 1 ? true : false
            f1.fieldOrder=f2.fieldOrder;
        }
        return f1.fieldId == f2.id;
    });
}

export function getAllFields(groups = [],minDateFields=[],notMaxDateFields=[]) {
    return groups.reduce((allFields, group) => {
        const f = getAllFields(group.subGroups,minDateFields,notMaxDateFields);
        group.fields.reduce((acc, f) => {
            if (f.regex)
                f.regex = new RegExp(f.regex);
            else
                f.regex = undefined;
            //if field id present in notMaxDateFields will not have max date else current date will be maxdate    
            if(f.type==3&&notMaxDateFields.includes(f.fieldId)){
                f.maximumDate=''
            }else{
                f.maximumDate=moment()
            }
            //if field id present in minDateFields current date will be mindate
            if(f.type==3&&minDateFields.includes(f.fieldId)){
                f.minimumDate=moment()
            }else{
                f.minimumDate=''
            }    
            if(f.type==FIELD_TYPES.INPUT_WITH_BUTTON)    
                f.isTextBoxButton=true
            acc[f.name] = f;
            return acc
        }, allFields)
        return { ...allFields, ...f };
    }, []);
}

export function validateTabFields(group, values, setNotification, messagesUtil) {
    const fields = getAllFields([group]);
    return Object.keys(fields).some(key => {
        const field = fields[key];
        const validate = validateForm(field.name, values[field.name], field);
        if (validate && validate.hasError) {
            setNotification({
                message: messagesUtil.EMPTY_FIELD_MSG,
                hasError: true
            })
        }
        return validate.hasError;
    });
}
export function getAdditionalFields(fields = [],minDateFields=[],notMaxDateFields=[]) {
    return fields.reduce((acc, f) => {
            if (f.regex)
                f.regex = new RegExp(f.regex);
            else
                f.regex = undefined;
            //if field id present in notMaxDateFields will not have max date else current date will be maxdate    
            if(f.type==3&&notMaxDateFields.includes(f.fieldId)){
                f.maximumDate=''
            }else{
                f.maximumDate=moment()
            }
            //if field id present in minDateFields current date will be mindate
            if(f.type==3&&minDateFields.includes(f.fieldId)){
                f.minimumDate=moment()
            }else{
                f.minimumDate=''
            }    
            if(f.type==FIELD_TYPES.INPUT_WITH_BUTTON)    
                f.isTextBoxButton=true
            acc[f.name] = f;
            return acc
        }, [])
}