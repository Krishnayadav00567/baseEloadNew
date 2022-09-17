import { validateForm } from '@6d-ui/fields';
import { useState, useEffect } from "react";

export default function useFieldItem(FIELDS, initialValues = {}, preValidation, postValidation) {
    // const initialValues = defaultValues == null ? {} : defaultValues;
    const [values, setValues] = useState(initialValues);
    const [fields, setFields] = useState({});

    useEffect(() => {
        console.log('upated')
    }, [values])

    const handleChange = (name, value, obj) => {

        const { isTouched } = obj || {
            isTouched: false
        };

        if (isTouched) {
            value = values[name];
        }

        const fieldValues = fields;
        if (FIELDS[name]) {
            const validate = validateForm(name, value, FIELDS[name], preValidation, postValidation);
            if (validate) {
                fieldValues[name] = validate;
            } else {
                fieldValues[name] = {
                    hasError: false,
                    errorMsg: ''
                };
            }
        }

        setValues(values => ({
            ...values,
            [name]: value
        }))

        setFields(fieldValues)

        if (isTouched && fields[name] && fields[name].hasError) {
            setFields(fields);
            return false;
        }
    }

    const validateValues = (keys) => {
        const fieldValues = fields;
        keys.map((key) => {
            const validate = validateForm(key, values[key], FIELDS[key], preValidation, postValidation);
            if (validate) {
                fieldValues[key] = validate;
            } else {
                fieldValues[key] = {
                    hasError: false,
                    errorMsg: ''
                };
            }
        }
        );
        setFields(fieldValues)
    }

    const reset = () => {
        setValues(values => {
            const newValues = {};
            Object.keys(values).forEach(function (key) {
                newValues[key] = ''
            });
            return newValues;
        })
        setFields({});
    };



    return [values, fields, handleChange, validateValues, reset]
}


