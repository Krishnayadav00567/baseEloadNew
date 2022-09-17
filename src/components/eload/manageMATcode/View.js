import React, { useState, useEffect, Fragment } from 'react'
import { DataTableContainer } from '../../data-table';
import { LABEL_LIST } from './util/Utils';
import { Popup, POPUP_ALIGN } from '@6d-ui/popup';
import _ from 'lodash'
import CreateMATcode from './CreateMATcode';
import EditMATcode from './EditMATcode';

export default function View(props) {
    const [modal, setModal] = useState(0)
    const FORM_MODAL = props.globalConstants.FORM_MODAL;
    const [data, setData] = useState({})

    useEffect(() => {
        props.setHeader("MAT Code Mapping")
    }, [])

    const toggleAction = (type, id, data) => {
        if (type == FORM_MODAL.Edit) {
            const dataMap = _.mapKeys(data, "id");
            setData({...dataMap[id]})
        }
        setModal(type)
    }
    const propsForDataTable = {
        privilages: props.privilages,
        menuPrivilages: props.menuPrivilages,
        ajaxUtil: props.ajaxUtil,
        listUrl: props.URLS.LIST_URL,
        apiVersion: 3,
        defaultRowCount: props.globalConstants.INITIAL_ROW_COUNT,
        rowIdParam: 'id',
        orderByCol:'id',
        tableHeaderLabels: LABEL_LIST,
        loadingFunction: props.loadingFunction,
        header: "MAT Codes",
        togglePopup: toggleAction,
        tabPriv: {delete: false },

    }
    

    return (
        <div className="custom-container">
            <DataTableContainer
                {...propsForDataTable}
            >
                {childProps =>
                    <Fragment>
                        <Popup
                            type={POPUP_ALIGN.RIGHT}
                            title="Create MAT Code"
                            isOpen={modal === FORM_MODAL.Create}
                            close={toggleAction}
                            minWidth="35%"
                            component={
                                <CreateMATcode
                                    {...props}
                                    onSuccess={() => childProps.loadDataTable(false, null, false)}
                                    close={() => toggleAction(0, null)}
                                />
                            }
                        />
                        <Popup
                            type={POPUP_ALIGN.RIGHT}
                            title="Update MAT Code"
                            isOpen={modal === FORM_MODAL.Edit}
                            close={toggleAction}
                            minWidth="35%"
                            component={
                                <EditMATcode
                                    {...props}
                                    onSuccess={() => childProps.loadDataTable(false, null, false)}
                                    close={() => toggleAction(0, null)}
                                    data={data}
                                />
                            }
                        />
                    </Fragment>}
            </DataTableContainer>
        </div>
    )

}