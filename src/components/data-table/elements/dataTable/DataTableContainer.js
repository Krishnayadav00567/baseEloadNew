import React, { Component } from 'react';
import _ from 'lodash';

import { DataTable } from './DataTable';
import DataTableUtilsV3 from './util/DataTableUtilsV3';
import DataTableUtilsV4 from './util/DataTableUtilsV4';
import { Popup, POPUP_ALIGN } from '@6d-ui/popup';
import { FORM_MODAL } from '../../constants/ModalTypes';


export default class DataTableContainer extends Component {
    
    constructor(props) {
        super(props);
        console.log(props.privilages,'lop', props.menuPrivilages.create);
        const { tabPriv} = props;

        const tabPrivConst = props.menuPrivilages ? {
            "create": _.includes(props.privilages, props.menuPrivilages.create),
            "edit": _.includes(props.privilages, props.menuPrivilages.edit),
            "delete": _.includes(props.privilages, props.menuPrivilages.delete),
            "download": _.includes(props.privilages, props.menuPrivilages.download),
            "info": _.includes(props.privilages, props.menuPrivilages.info),
            "select": _.includes(props.privilages, props.menuPrivilages.select)
        } : {};

        this.tabPriv = Object.assign(tabPrivConst, tabPriv);

        const dtOpts = {
            'listUrl': props.listUrl,
            'isInfiniteScroll': props.isInfiniteScroll,
            'searchFilters': props.tableSearchFilters,
            'setState': data => this.setState(data),
            'listName': props.listName,
            'rowIdParam': props.rowIdParam,
            'labelList': props.tableHeaderLabels,
            'loadingFunction': props.loadingFunction,
            'makeCallBack': props.ajaxUtil.makeCallBack,
            'authKey': props.ajaxUtil.getAuthKey(),
            'channel': props.ajaxUtil.getChannel(),
            'entity':props.ajaxUtil.getEntity(),
            'deleteMessage': props.deleteMessage,
            'deleteMessageParam': props.deleteMessageParam,
            'apiVersion': props.apiVersion,
            'postRequestCallback': props.postRequestCallback,
            'isEncrpt':props.ajaxUtil.getIsEncrpt(),
            "encrptKey":props.ajaxUtil.getEncrptKey(),
            orderByCol:props.orderByCol,
            sort:props.sort||"desc"

        }

        if(this.props.isWithoutPagination){
            this.dataTable = new DataTableUtilsV4(dtOpts) ;
        }else{
            this.dataTable = new DataTableUtilsV3(dtOpts) ;
        }

        this.state = !props.previousState ? {
            'keyword': '',
            'rowCount': props.defaultRowCount || 10,
            'orderByCol': props.orderByCol,
            'sort': props.sort||"desc",
            'modal': 0,
            'filterParams': {},
        } : {
                'modal': 0,
                'keyword': props.previousState.keyword,
                'rowCount': props.previousState.rowCount,
                'orderByCol': props.previousState.orderByCol,
                'sort': props.previousState.sort,
                'filterParams': props.previousState.filterParams,
                "userChannelType": props.previousState.userChannelType,
                "userEntityType": props.previousState.userEntityType,
            };
    }

    componentDidMount() {
        this.dataTable.load(true, null, true, this.state);
    }

    componentWillUnmount() {
        this.props.saveState && this.props.saveState(this.state);
    }

    onSearch = data => {
        this.setState({...data});
        this.dataTable.load(true, { "isAdvanceSearch": true, "keyword": "",sort:this.props.sort||'',orderByCol:this.props.orderByCol||'',...data }, false, this.state);
    }

    loadDataTable = (isReset, data, firstLoad) => {
        this.dataTable.load(isReset, data, firstLoad, this.state);
    }

    togglePopup = (...popupArgs) => {
        const responseList = this.dataTable.getResponseList();
        if (popupArgs[0] === FORM_MODAL.SearchFilter)
            this.setState({ isSearchPopupOpen: true })
        else
            this.setState({ isSearchPopupOpen: false })
        this.props.togglePopup(...popupArgs, responseList);
    }

    handleExtraButtonClick = (buttonClickFn, ...btnArgs) => {
        const responseList = this.dataTable.getResponseList();
        buttonClickFn(responseList, ...btnArgs);
    }

    deleteRow = (obj, message) => this.props.deleteRow(obj, message, this.deleteCallBack,this.dataTable.getResponseList());

    deleteCallBack = () => {
        if (this.state.rowData && this.state.rowData.length === 1 && this.state.pageNumber !== 1) {
            this.dataTable.load(false, { "pageNumber": (this.state.pageNumber - 1) }, false, this.state);
        } else {
            this.dataTable.load(false, { "pageNumber": this.state.pageNumber }, false, this.state);
        }
    }
    validateExportFunctionality = () => {   
        if (this.props.exportTypes) {
            let hasErrorLabel = false;
            let hasErrorURL = false;
            this.props.exportTypes.map(item => {
                if (!item.label)
                    hasErrorLabel = true;
                if (!item.url)
                    hasErrorURL = true;
            });
            if (hasErrorLabel)
                console.warn("Please provide :label key for each object in :exportType prop to show export buttons.");
            if (hasErrorURL)
                console.warn("Please provide :url key for each object in :exportType prop for export buttons to work properly.");
        } else {
            console.warn("Please provide :exportType prop as array to show export buttons.");
        }
        if (!this.props.exportResponseHandler)
            console.warn("Please provide :exportResponseHandler prop as function to handle export response.");
        if (!this.props.setNotification)
            console.warn("Please provide :setNotification prop as function to handle export notification.");
        if (!this.props.exportFileName)
            console.warn("Please provide :exportFileName prop as string to set exporting file name. NOTE: Extension is not needed!");
    }
     handleRefeshClick=()=>{
        if (this.state.rowData && this.state.rowData.length === 1 && this.state.pageNumber !== 1) {
            this.dataTable.load(false, { "pageNumber": (this.state.pageNumber - 1) }, false, this.state);
        } else {
            this.dataTable.load(false, { "pageNumber": this.state.pageNumber }, false, this.state);
        }
        this.togglePopup(FORM_MODAL.RefreshClick, null);
    }
    render() {
        let exportProps = {};
        if (this.props.hasExport && this.props.apiVersion == 3) {
            this.validateExportFunctionality();
            exportProps = {
                exportCall: this.dataTable.exportDetails.bind(this, this.state),
                exportTypes: this.props.exportTypes,
                exportResponseHandler: this.props.exportResponseHandler,
                setNotification: this.props.setNotification,
                exportFileName: this.props.exportFileName,
                exportLimit:this.props.exportLimit
            }
        }
        return (
            <>
                <DataTable
                    commonSearch={this.state.keyword}
                    changeAttributes={this.dataTable.changeAttributes.bind(this, this.state)}
                    totalPages={this.state.totalPages}
                    startRow={this.state.startRow}
                    endRow={this.state.endRow}
                    rowData={this.state.rowData}
                    currentPage={this.state.pageNumber}
                    totalRecords={this.state.totalRecords}
                    labelList={this.props.tableHeaderLabels}
                    isInfiniteScroll={this.props.isInfiniteScroll}
                    isCreditLimitConfiguration={this.props.isCreditLimitConfiguration}
                    otherButtons={this.props.otherButtons}
                    actions={this.tabPriv}
                    orderByCol={this.state.orderByCol}
                    sort={this.state.sort}
                    filters={this.state.filters}
                    rowCount={this.state.rowCount}
                    currentRow={this.state.currentRow}
                    highlightRow={this.dataTable.highlightRow}
                    toggleAction={this.togglePopup}
                    searchHelpText={this.props.searchHelpText?this.props.searchHelpText:"Search"}
                    deleteRow={this.deleteRow}
                    filterLabelList={this.props.filterLabelList}
                    header={this.props.header}
                    angerTagPosition={this.props.angerTagPosition}
                    isDifferentHeader={this.props.isDifferentHeader}
                    setPageState={data => this.setState(data)}
                    hasExport={this.props.hasExport}
                    tableButtons={this.props.tableButtons}
                    dataId={this.props.dataId}
                    extraButtons={this.props.extraButtons}
                    removeSearch={this.props.removeSearch ? true : false}
                    isInfoFirst={this.props.isInfoFirst? true : false}
                    onExtraButtonClick={this.handleExtraButtonClick}
                    checkType={this.props.checkType}
                    selectedCluster={this.props.selectedCluster}
                    isSearchbarNotRequired={this.props.isSearchbarNotRequired}
                    joiningDepositFee={this.props.joiningDepositFee}
                    {...exportProps}
                    checkedIds={this.props.checkedIds}
                    refershClick={this.handleRefeshClick}
                    showRefresh={this.props.showRefresh?true:false}
                    hidePagination={this.props.hidePagination?true:false}
                    last={this.state.last}

                />

                {/* Search Filter Popup */}
                {
                    this.props.renderSearchFilter && <Popup
                        type={POPUP_ALIGN.CENTER}
                        title="Advanced Search"
                        isOpen={this.state.isSearchPopupOpen}
                        close={this.togglePopup}
                        component={
                            this.props.renderSearchFilter({
                                togglePopup: this.togglePopup,
                                onSearch: this.onSearch,
                                filterParams: this.state.filterParams
                            })
                        }
                    />
                }

                {this.props.children && this.props.children({ loadDataTable: this.loadDataTable })}

            </>
        )
    }

}

DataTableContainer.defaultProps = {
    listName: 'content'
}