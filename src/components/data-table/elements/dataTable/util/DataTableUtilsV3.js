import { ajax as NavigateTable } from '../../../../ajax/index';
import _ from 'lodash';

export default class DataTableUtils {
  constructor(obj) {
    this.rowDataArr=[];  
    this.listUrl = obj.listUrl;
    this.isInfiniteScroll = obj.isInfiniteScroll;
    this.searchFilters = obj.searchFilters || [];
    this.setState = obj.setState;
    this.listName = obj.listName;
    this.rowIdParam = obj.rowIdParam;
    this.labelList = obj.labelList;
    this.apiVersion = obj.apiVersion || 2;
    this.loadingFunction = obj.loadingFunction;
    this.makeCallBack = obj.makeCallBack;
    this.deleteMessage = obj.deleteMessage;
    this.deleteMessageParam = obj.deleteMessageParam;
    this.postRequestCallback = obj.postRequestCallback;
    this.responseList = [];
    this.orderByCol=obj.orderByCol;
    this.sort=obj.sort



    this.API_Options = {
      isShowSuccess: false,
      method: 'GET',
      authKey: obj.authKey,
      channel: obj.channel,
      XENTITY:obj.entity,
      isEncrpt:obj.isEncrpt,
      encrptKey:obj.encrptKey

    }

    this.showData = this.showData.bind(this);
    this.changeAttributes = this.changeAttributes.bind(this);
    this.highlightRow = this.highlightRow.bind(this);
    this.exportDetails = this.exportDetails.bind(this);
  }
  componentDidUnMount(){
    this.rowDataArr=[];  
  }
  
  load(isReset, data, firstLoad, currentState) {
    return this.reloadDataTable(isReset, data, firstLoad, currentState);
  }
  reloadDataTable(isReset, data, firstLoad, currentState) {
    const dataObj = this.getRequestData(isReset, data, currentState);
    const urlParams = Object.keys(dataObj).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(dataObj[k])
    }).join('&')
    // NavigateTable(this.listUrl+'?'+urlParams, {}, this.makeCallBack, (response) => this.showData(response, data), this.loadingFunction, { ...this.API_Options, firstLoad });
    NavigateTable(this.listUrl, dataObj, this.makeCallBack, (response) => this.showData(response, data), this.loadingFunction, { ...this.API_Options, firstLoad });
  }
  getRequestData(isReset, data, currentState = {}) {
    const filters = data ? this.searchFilters.reduce((acc, k) => {
      if (data[k]) acc[k] = data[k];
      return acc;
    }, {}) : {};
    let searchParams = {};
    if(this.isInfiniteScroll&&data&&data.isAdvanceSearch){
      this.rowDataArr=[];
    }

    if (data && data.isDownload) {
      searchParams = {
        "page": 1,
        "size": (currentState.totalRecords ? currentState.totalRecords : ""),
        "sort": (data && data.orderByCol ? data.orderByCol : currentState.orderByCol?currentState.orderByCol:this.orderByCol) || "",
        "order": (data && data.sort ? data.sort : currentState.sort?currentState.sort:this.sort) || "",
        "keyword": (data && data.keyword ?(data.keyword).trim() : (currentState.keyword).trim()),
        ...filters
      }
    } else {
      searchParams = {
        "page": (isReset === true ? 1 : ((data && data.pageNumber) ? data.pageNumber : currentState.pageNumber)) || "",
        "size": (data && data.rowCount ? data.rowCount : currentState.rowCount) || "",
        "sort": (data && data.orderByCol ? data.orderByCol : currentState.orderByCol?currentState.orderByCol:this.orderByCol) || "",
        "order": (data && data.sort ? data.sort : currentState.sort?currentState.sort:this.sort) || "",
        "keyword": (data && data.keyword ? (data.keyword).trim() : (currentState.keyword).trim()),
        ...filters
      }
    }

    return searchParams;

  }
  changeAttributes(currentState, data, evt) {
    if(this.isInfiniteScroll&&currentState.keyword){
      this.rowDataArr=[];
    }
    var dataSet = null;
    const { name, isNotUpdateState, isOnlyUpdateState, sort,
      orderByCol, isResetTable, filterName } = data;

    if (isNotUpdateState) {
      this.reloadDataTable(isResetTable, { "isCommonSearch": true }, false, currentState);
      return false;
    }

   
    
    /* if (name === "pageNumber")
      evt.target.value++; */

    if (name === "sortOptions") {
      const order = (!sort ? 'asc' : (sort === 'desc' ? 'asc' : 'desc'));
      dataSet = { "orderByCol": orderByCol, "sort": order, "currentRow": '' };
    } else if (name === "rowCount") {
      dataSet = { [name]: evt.target.textContent };
    } else if (name === "clearFilter") {
      dataSet = { [filterName]: '' };
    } else
      dataSet = { [name]: evt.target.value };

    const filters = currentState ? this.searchFilters.reduce((acc, k) => {
      if (currentState[k]) acc[k] = currentState[k];
      return acc;
    }, {}) : {};

    dataSet = { ...dataSet, ...filters }
    if (!isOnlyUpdateState) {
      this.reloadDataTable(isResetTable, dataSet, false, currentState);
    } else {
      this.setState(dataSet);
    }
  }
  highlightRow(id) {
    this.setState({ "currentRow": id });
  }
  showData(response, currentState) {
    currentState = currentState ? currentState : {};
    const {isCommonSearch}=currentState;
    if (!response) {
      this.setState({ rowData: [], totalRecords: 0 });
      return false;
    }
    if (this.postRequestCallback && _.isFunction(this.postRequestCallback)) {
      const tableData = this.postRequestCallback(response);
      this.setState(tableData);
    } else {
      const filters = currentState ? this.searchFilters.reduce((acc, k) => {
        if (currentState[k]) acc[k] = currentState[k];
        return acc;
      }, {}) : {};
      const filtersData = { 'filterParams': { ...filters } };

      if (!response[this.listName]
        || response[this.listName].length === 0) {
        this.setState({
          "rowData": [], "totalRecords": 0,
          //  "keyword": response.search.keyword,
          ...filtersData
        });
        return false;
      }
      const rowDataList = this.transformToTableData(response[this.listName]);
      this.responseList = response[this.listName];
      if(this.isInfiniteScroll){
        rowDataList.map((item)=>{
          this.rowDataArr.push(item);
          return; 
        })
      }
      
      const resetData=isCommonSearch?this.searchFilters.reduce((acc, k) => {
         acc[k] = '';
        return acc;
      }, {}):{}
      const responseData = {
        "totalRecords": response.totalElements,
        "rowCount": response.size,
        // "keyword": response.search.keyword,
        "orderByCol": currentState.orderByCol,
        "sort": currentState.sort,
        "pageNumber": response.page + 1,
        // "rowData": rowDataList
        "rowData":this.isInfiniteScroll? this.rowDataArr:rowDataList,
        "last":response.last,
        ...resetData
      }
      const { totalRecords, rowCount, rowData, pageNumber } = responseData;
      const startRow = (rowCount * (pageNumber - 1)) + 1;
      const endRow = (rowData && rowData.length > 0 ? (rowData.length < rowCount ? (startRow + rowData.length) - 1 : (startRow + rowCount) - 1) : 0);
      const totalPages = ((totalRecords && totalRecords !== 0 && rowCount && rowCount !== 0) ? Math.ceil(totalRecords / rowCount) : 0);
      this.setState({ startRow, 
                      endRow, 
                      totalPages, 
                      "currentRow": '', 
                      ...responseData, 
                      ...filtersData.filterParams
                    });
    }

  }
  transformToTableData(data) {
    const rowDataList = [];
    data.forEach((tableData) => {
      const deleteParam = [];
      if (this.deleteMessageParam) {
        this.deleteMessageParam.forEach((delParam) => {
          deleteParam.push(tableData[delParam]);
        });
      } else {
        deleteParam.push(this.rowIdParam)
      }
      const result = {};
      result.rowId = tableData[this.rowIdParam];
      if(typeof this.deleteMessage === "object") {
        result.confirmationMessage = this.deleteMessage.length > 1 ? 
          `${this.deleteMessage[0]} ${deleteParam && deleteParam.length > 1 ? deleteParam.join(' ') : (deleteParam && deleteParam.length === 1 ? deleteParam[0] : '')} ${this.deleteMessage[1]}?`:
          `${this.deleteMessage} ${deleteParam && deleteParam.length > 1 ? deleteParam.join(' ') : (deleteParam && deleteParam.length === 1 ? deleteParam[0] : '')}?`;
      }
      else 
        result.confirmationMessage = `${this.deleteMessage} ${deleteParam && deleteParam.length > 1 ? deleteParam.join(' ') : (deleteParam && deleteParam.length === 1 ? deleteParam[0] : '')}?`;
      result.columnValues = [];
      this.labelList.forEach((row) => {
        const className = []
        const fieldName = [];
        if(row.className&&row.className.length>0){
          className.push(...row.className);
        }
        if (row.condition && _.isFunction(row.condition)) {
          fieldName.push(row.condition(tableData));
        } else if (row.condition && row.condition.length > 0) {
          row.condition.forEach((condition) => {
            switch (condition.condition) {
              case "=":
                  if (typeof condition.value==='string' &&tableData[condition.paramId]?tableData[condition.paramId].toUpperCase().trim() === condition.value.toUpperCase().trim():tableData[condition.paramId] === condition.value)
                  className.push(condition.className);
                break;
              case "combine":
                condition.paramIds.forEach((paramId) => {
                  fieldName.push(tableData[paramId]);
                });
                break;
              default:
                break;
            }
          });
        }

        result.columnValues.push({
          value: (fieldName && fieldName.length > 0 ? fieldName.join(' ') :
            (row.paramId ? tableData[row.paramId] : tableData[row.id])), className: className.join(' '),isAddValue:row.isAddValue||false,AddValue:row.AddValue||''
        });
      });
      rowDataList.push(result);
    });
    return rowDataList;
  }
  transformFilterData(filters) {
    const filterDetails = {};
    filters.forEach((filterData) => {
      filterDetails[filterData.name] = filterData.value;
    });
    return filterDetails;
  }
  getResponseList() {
    return this.responseList;
  }
  exportDetails(currentState, item, fileName, setNotification, callBack,exportLimit,totalRecords,data={}) {
    
    if(exportLimit!=null&&totalRecords>exportLimit)
    {
      
      setNotification && setNotification({
        hasError: true,
        message: `You cannot Download more than ${exportLimit} records`
      });
      
    }else {
      setNotification && setNotification({
        hasError: false,
        message: 'We will notify you when the file is ready for download. Please wait for some time.'
      });
      const request = this.getRequestData(true, { isDownload: true,...currentState}, currentState);
      NavigateTable(item.url, request, null,
        (response) => callBack(response, item, fileName), null, { ...this.API_Options, firstLoad: true, responseType: 'blob' });
    }
    
  }
}
