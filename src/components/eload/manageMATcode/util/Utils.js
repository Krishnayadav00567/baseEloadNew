import { thousandFormatter } from "../../../../util/Util";
export const LABEL_LIST = [
    {
        id: "matCode",
        name: "MAT code",
        isSortable: false
    },
    {
        id: "pocketName",
        name: "Pocket Type"
    },
    {
        id: "denominationValue",
        name: "Denomination",
        isSortable: false,
        condition: (data) => {
            return thousandFormatter(data.denominationValue, false)
          },
    },
    {
        id: "createdBy",
        name: "Created By",
        // isSortable: true
    },
    {
        id: "createdDate",
        name: "Created Date",
        isSortable: true
    },
    {
        id: "updatedBy",
        name: "Updated By",
        // isSortable: true
    },
    {
        id: "updatedDate",
        name: "Updated Date",
        isSortable: true
    },
   
]

export const FormElements = {
    matCode: {
        name: "matCode",
        label: "MAT Code",
        width: "sm",
        ismandatory: true,
        // regex: /^[a-zA-Z0-9]*$/,
        regex: /^[0-9]+$/,
        maxLength : 10,
        placeholder: "MAT Code"
    },
    denomination: {
        name: "denomination",
        label: "Denomination",
        width: "sm",
        ismandatory: true,
        maxLength : 20
    },
    pocketTypeId: {
        name: "pocketTypeId",
        placeholder: "Select",
        label: "Pocket Type",
        width: "sm",
        ismandatory: true
    },
}
