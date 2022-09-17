import React from 'react';
import Pager from 'react-pager';
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  Input,
  UncontrolledTooltip,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from 'reactstrap';
import { FORM_MODAL } from '../../constants/ModalTypes';
import {
  CustomButton,
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_SIZE
} from '@6d-ui/buttons';
import InfiniteScroll from "react-infinite-scroll-component";
import {
  FieldItem,
  FIELD_TYPES
} from '@6d-ui/fields';
import Pagination from "react-js-pagination";

export const DataTable = ({ totalPages, startRow, endRow, currentPage, totalRecords,
  labelList, isInfiniteScroll, actions, filters, rowData, commonSearch, changeAttributes,
  rowCount, orderByCol, sort, toggleAction, currentRow, highlightRow, filterLabelList,
  searchHelpText, header, isViewFilters, deleteRow, extraButtons, tableButtons, dataId,
  showRecords = true, setPageState, hasExport = false, removeSearch = false, isInfoFirst = false, onExtraButtonClick,
  exportTypes, exportCall, exportResponseHandler, setNotification, exportFileName, exportLimit, angerTagPosition, isDifferentHeader, otherButtons, isCreditLimitConfiguration, checkType = "checkbox", selectedCluster, isSearchbarNotRequired, joiningDepositFee, checkedIds = [], refershClick,
  showRefresh = false, hidePagination = false,last
}) => {
  if (!isInfiniteScroll) {
    currentPage--;
  }
  const handlePageChanged = (newPage) => {
    // const target = { "value": newPage++ };
    //const target = { "value": isInfiniteScroll?newPage:newPage};
    const target = { "value": isInfiniteScroll ? newPage : newPage++ };
    const event = { "target": target };
    changeAttributes({ "name": "pageNumber" }, event);
  };
  const getHeader = () => {
    const getSortOptions = (sortOrder) => {
      //Order 1 -Asc 2-Desc
      const getSortIcon = () => {
        switch (sortOrder) {
          case "asc":
            return "fa-sort-asc"

          case "desc":
            return "fa-sort-desc"

          default:
            return "fa-sort"
        }
      };
      const sortClass = getSortIcon();
      return (
        <div className={`dataTable_sortIco${!sortOrder ? ' inActive' : ''}`}>
          <i className={`fa ${sortClass}`} aria-hidden="true"></i>
        </div>
      );
    };
    const getTHClasses = ({ th_Class = [] }) => {
      if (th_Class.length > 0) {
        return th_Class.join(' ')
      }
      return '';
    }
    const getTHWidth = ({ thWidth = '' }) => {
      if (thWidth)
        switch (thWidth) {
          case 'MIN-TH':
            return '20px'
          case 'MAX-TH':
            return '180px'
          case 'MEDIUM-TH':
            return '100px'
          default:
            return thWidth;
        }
      return '';
    }
    return labelList.map((label) => {
      return (
        <th style={{ width: getTHWidth(label) }} className={label.isSortable ? `dataTable_head_sortable ${getTHClasses(label)}` : `${getTHClasses(label)}`} onClick={label.isSortable ? changeAttributes.bind(this, { "name": "sortOptions", "sort": (label.id === orderByCol ? sort : null), "orderByCol": label.id, "isResetTable": true }) : null} key={label.id}>
          <table className="dataTable_label_tab">
            <tbody>
              <tr>
                <td>
                  {label.isSameCase ? label.name : label.name.toLowerCase()}
                </td>
                <td>
                  {label.isSortable ? getSortOptions(label.id === orderByCol ? sort : null) : ''}
                </td>
              </tr>
            </tbody>
          </table>
        </th>
      );
    });
  };
  const getRowData = () => {
    const getTableButtons = (rowId) => {
      if (tableButtons) {
        return tableButtons.map((tableButton, index) => {
          return (
            <td key={index} className="fit-content clickable_ico_dt">
              <span id={`data_${rowId}_table_button_${index}`}>
                <i onClick={() => onExtraButtonClick(tableButton.onClick, rowId)} className={`fa ${tableButton.icon}`} aria-hidden="true"></i>
              </span>
              <UncontrolledTooltip placement="bottom" target={`data_${rowId}_table_button_${index}`}>
                {tableButton.label}
              </UncontrolledTooltip>
            </td>
          );
        });
      } else {
        return null;
      }
    }
    const getColData = (colData, rowId) => {
      let isNormalView = true;
      if (isCreditLimitConfiguration && colData.length && colData[5] && colData[2] && colData[2].value != "Active" && colData[4] && colData[4].value != "Default") {
        colData[5].className = "disable-cell"
      }
      if (isCreditLimitConfiguration && colData.length && colData[4] && colData[4].value != "Default") {
        isNormalView = false;
      }
      //if not proposal disable  
      if (isCreditLimitConfiguration && colData.length && colData[2] && colData[2].value == "Active" && colData[4] && colData[4].value != "Proposal") {
        colData[5].className = "disable-cell"
      }
      if (joiningDepositFee && ((colData.length && colData[6] && colData[6].value != "Collect Fee") || (colData[5] && colData[5].value != "Active"))) {
        colData[6].className = "disable-cell"
      }
      return colData.map((col, idx) => {
        let angerTagPos = null;
        if (angerTagPosition && angerTagPosition.length) {
          angerTagPosition.map((itm) => {
            if (itm === idx + 1) {
              angerTagPos = itm;
              isNormalView = false;
            }
          })
        } else {
          isNormalView = true;
        }
        if (labelList[idx]) {
          return (
            <td style={{ maxWidth: '200px' }} className={`text-ellipsis ${col.className}`} key={labelList[idx].id}>
              {angerTagPos && angerTagPos === idx + 1 ?
                <a onClick={() => { toggleAction("redirect", rowId) }} id={`data_${rowId}_${labelList[idx].id}`} className={col.className} style={isNormalView ? {} : { cursor: "pointer", textDecoration: "underline", color: "#007AFF" }}>{col.value}</a> : (col.isAddValue && !col.value) ?
                  <span onClick={() => { toggleAction('addValue', rowId) }}
                    id={`data_${rowId}_${labelList[idx].id}`} className={`add-col-dataTb ${col.className}`}>{col.AddValue}</span> :
                  <span id={`data_${rowId}_${labelList[idx].id}`} className={col.className}>{col.value}</span>}
              <UncontrolledTooltip placement="bottom" target={`data_${rowId}_${labelList[idx].id}`}>
                {/* {labelList[idx].name} */}
                {col.isAddValue && !col.value ? col.AddValue : col.value}
              </UncontrolledTooltip>
            </td>
          );
        }
      });
    };
    return rowData.map((rows, idx) => {
      return (
        <tr key={rows.rowId} onClick={() => highlightRow(idx)} className={(currentRow === idx ? 'dataTable_selectedRow' : '')}>

          {actions.info === true && isInfoFirst ?
            <td className="fit-content clickable_ico_dt">
              <span id={`data_${rows.rowId}_info_button`}>
                <img src={`${process.env.PUBLIC_URL}/images/view.svg`} onClick={() => { toggleAction(FORM_MODAL.View, rows.rowId) }} />
                {/* <i onClick={() => { toggleAction(FORM_MODAL.View, rows.rowId) }} className="fa fa-eye" aria-hidden="true"></i> */}
              </span>
              <UncontrolledTooltip placement="bottom" target={`data_${rows.rowId}_info_button`}>
                Info
              </UncontrolledTooltip>
            </td> :
            null}
          {getColData(rows.columnValues, rows.rowId)}
          {actions.info === true && !isInfoFirst ?
            <td className="fit-content clickable_ico_dt">
              <span id={`data_${rows.rowId}_info_button`}>
                <img src={`${process.env.PUBLIC_URL}/images/view.svg`} onClick={() => { toggleAction(FORM_MODAL.View, rows.rowId) }} />
                {/* <i onClick={() => { toggleAction(FORM_MODAL.View, rows.rowId) }} className="fa fa-eye" aria-hidden="true"></i> */}
              </span>
              <UncontrolledTooltip placement="bottom" target={`data_${rows.rowId}_info_button`}>
                Info
              </UncontrolledTooltip>
            </td> :
            null}
          {actions.edit === true ?
            <td className="fit-content clickable_ico_dt">
              <span id={`data_${rows.rowId}_edit_button`}>
                <img src={`${process.env.PUBLIC_URL}/images/edit.svg`} onClick={() => { toggleAction(FORM_MODAL.Edit, rows.rowId) }} />
                {/* <i onClick={() => { toggleAction(FORM_MODAL.Edit, rows.rowId) }} className="fa fa-pencil" aria-hidden="true"></i> */}
              </span>
              <UncontrolledTooltip placement="bottom" target={`data_${rows.rowId}_edit_button`}>
                Edit
              </UncontrolledTooltip>
            </td> :
            null}
          {actions.delete === true ?
            <td className="fit-content clickable_ico_dt">
              <span id={`data_${rows.rowId}_delete_button`}>
                <img src={`${process.env.PUBLIC_URL}/images/delete.svg`} onClick={() => { deleteRow(rows.rowId, rows.confirmationMessage) }} />
                {/* <i onClick={() => { deleteRow(rows.rowId, rows.confirmationMessage) }} className="fa fa-trash" aria-hidden="true"></i> */}
              </span>
              <UncontrolledTooltip placement="bottom" target={`data_${rows.rowId}_delete_button`}>
                Delete
              </UncontrolledTooltip>
            </td> :
            null}
          {actions.select === true ?
            <td className="fit-content clickable_ico_dt">
              <span id={`data_${rows.rowId}_select_button`}>
                <label className="checkBoxRadio check mb-0">
                  <span></span>
                  <div className="float-left btn_container">
                    <input type={checkType} value={rows.rowId} checked={checkedIds.some(ids => ids == rows.rowId)} name="checkbox"
                      onClick={() => { toggleAction(FORM_MODAL.Select, rows.rowId) }}
                    />
                    <span className="checkmark"></span>
                  </div>
                </label>
              </span>
              {/* <UncontrolledTooltip placement="bottom" target={`data_${rows.rowId}_select_button`}>
                Select
               </UncontrolledTooltip> */}
            </td> :
            null}
          {getTableButtons(rows.rowId)}
        </tr>
      );
    });
  };
  const getTableButtonHeaders = () => {
    if (tableButtons) {
      return tableButtons.map((tableButton, index) => {
        return (
          <th key={index}>{tableButton.label.toLowerCase()}</th>
        )
      });
    }
  }
  const getTableData = () => {
    if (rowData) {
      if (labelList && labelList.length > 0 && rowData && rowData.length > 0) {
        return (
          <>
            <div className="dataTable_wrapper">
              <div className="dataTable-scrollable">
                <div>
                  {isInfiniteScroll ? <InfiniteScroll
                    dataLength={rowData.length}
                    next={() => { handlePageChanged(currentPage) }}
                    hasMore={currentPage < totalPages ? true : false}
                    loader={<h4>Loading...</h4>}
                    height={400}
                    endMessage={
                      <p style={{ textAlign: 'center' }}>
                        <b>You have seen it all!</b>
                      </p>
                    }
                  >

                    <Table hover className="data-table dataTable-mainTable ">
                      <thead>
                        <tr>
                          {(actions.info === true && isInfoFirst ? <th>Info</th> : null)}
                          {getHeader()}
                          {(actions.info === true && !isInfoFirst ? <th>Info</th> : null)}
                          {(actions.edit === true ? <th>Edit</th> : null)}
                          {(actions.delete === true ? <th>Delete</th> : null)}
                          {(actions.select === true ? <th>Select</th> : null)}
                          {getTableButtonHeaders()}
                        </tr>
                      </thead>
                      <tbody>
                        {getRowData()}
                      </tbody>
                    </Table>
                  </InfiniteScroll>
                    :
                    <Table hover className="data-table dataTable-mainTable">
                      <thead>
                        <tr>
                          {(actions.info === true && isInfoFirst ? <th>Info</th> : null)}
                          {getHeader()}
                          {(actions.info === true && !isInfoFirst ? <th>Info</th> : null)}
                          {(actions.edit === true ? <th>Edit</th> : null)}
                          {(actions.delete === true ? <th>Delete</th> : null)}
                          {(actions.select === true ? <th>Select</th> : null)}
                          {getTableButtonHeaders()}
                        </tr>
                      </thead>
                      <tbody>
                        {getRowData()}
                      </tbody>
                    </Table>}

                </div>
              </div>
            </div>

            {!isInfiniteScroll && <Row>
              <Col lg="3" md="12" sm="12">
                {showRecords &&
                  <div className="dataTable_wrapper clearfix d-flex align-items-center">
                    <div className="float-left">
                      <UncontrolledButtonDropdown>
                        <DropdownToggle caret outline color="dataTable-rowCount" className="btn-block-c drop-down-button" size="sm">
                          {rowCount}
                        </DropdownToggle>
                        <DropdownMenu className="data-table-rowCount-dd">
                          <DropdownItem onClick={changeAttributes.bind(this, { "name": "rowCount", "isResetTable": true })}>5</DropdownItem>
                          <DropdownItem onClick={changeAttributes.bind(this, { "name": "rowCount", "isResetTable": true })}>10</DropdownItem>
                          <DropdownItem onClick={changeAttributes.bind(this, { "name": "rowCount", "isResetTable": true })}>20</DropdownItem>
                          <DropdownItem onClick={changeAttributes.bind(this, { "name": "rowCount", "isResetTable": true })}>50</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </div>
                    <div className="dataTable_rowCountText float-left px-2 dataTable_pagination_wrapper">Records Per Page</div>
                  </div>
                }
              </Col>
              <Col lg="9" md="12" sm="12">
                <div className="dataTable_wrapper">
                  {/* <Pager
                    total={totalPages ? totalPages : 0}
                    current={currentPage}
                    visiblePages={3}
                    titles={{ first: '<< First', last: 'Last >>', prev: '< Prev', next: 'Next >' }}
                    className="pagination-sm pull-right"
                    onPageChanged={handlePageChanged}
                  /> */}
                  {!hidePagination ?
                    <Pagination
                      prevPageText='< Prev'
                      nextPageText='Next >'
                      firstPageText='<< First'
                      lastPageText='Last >>'
                      activePage={(currentPage + 1)}
                      itemsCountPerPage={rowCount}
                      totalItemsCount={totalRecords ? totalRecords : 0}
                      pageRangeDisplayed={3}
                      onChange={handlePageChanged}
                      innerClass="pagination pagination-sm pull-right"
                    />
                    :
                      <ul className="pagination pagination-sm pull-right">
  <li className={`${!currentPage?'disabled':''}`}>
    <a className="" onClick={!currentPage?()=>{}:()=>handlePageChanged(currentPage)} aria-label="Go to previous page">&lt; Prev</a>
    </li>
    <li className={`${last?'disabled':''}`}>
    <a className="" onClick={last?()=>{}:()=>handlePageChanged(currentPage+2)} aria-label="Go to previous page"> Next &gt;</a>
    </li>

  </ul>
                  }
                </div>
               {!hidePagination? <div className="dataTable_rowCountText float-right px-2">
                  {/* {(rowData && rowData.length > 0 ? (`Showing ${startRow} to ${endRow} of ${totalRecords}`) : '')} */}
                  {(rowData && rowData.length > 0 ? (<span className="dataTable_pagination_wrapper">Page <span className='dataTable_pagination'>{currentPage + 1}</span> of <span>{totalPages}</span></span>) : '')}
                </div>
                :''}
              </Col>
            </Row>}
          </>
        );
      } else {
        return (
          <div className="dataTable_notFound text-center">
            Not Found !!
          </div>
        );
      }
    } else {
      return <div className="dataTable_notFound text-center">
        Loading ...
      </div>
    }
  }
  const getFilters = () => {
    if (filters && filters.length > 0) {
      return filters.map((filter, idx) => {
        return (
          <div key={idx} className="dataTable_pageDetails">
            <div className="datatable_filter_components">
              {`${filterLabelList[filter.name]} : ${filter.value}`}
              <div onClick={changeAttributes.bind(this, { "filterName": filter.name, "name": "clearFilter", "isResetTable": true })} className="filterClose" filtername={filter.name}>
                <i className="fa fa-times" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        );
      });
    }
  }
  const getFilterRow = () => {
    if (isViewFilters) {
      return (
        <Row>
          <Col lg="12">
            {getFilters()}
          </Col>
        </Row>
      )
    } else {
      return null;
    }
  }
  const getCreateButton = () => {
    const getExtraButtons = () => {
      if (extraButtons) {
        return extraButtons.map((extraButton, index) => {
          return (
            <div key={index} className=" float-left dataTable_wrapper">
              <CustomButton
                style={BUTTON_STYLE.BRICK}
                type={BUTTON_TYPE.PRIMARY}
                size={BUTTON_SIZE.MEDIUM}
                align="left"
                label={extraButton.label}
                isButtonGroup={true}
                // icon={extraButton.icon}
                onClick={extraButton.onClick}
              />
            </div>
          )
        });
      } else {
        return null;
      }
    }
    const getCreatePopup = () => {
      toggleAction(FORM_MODAL.Create, null);
    }
    if (actions.create) {
      return (
        <div className="float-left">
          <div className="float-left dataTable_wrapper">
            <CustomButton
              style={BUTTON_STYLE.BRICK}
              type={BUTTON_TYPE.PRIMARY}
              size={BUTTON_SIZE.MEDIUM}
              align="left"
              label="Create"
              isButtonGroup={true}
              // icon="fa-plus"
              onClick={getCreatePopup}
            />
          </div>
          {getExtraButtons()}
        </div>
      );
    } else if (extraButtons && extraButtons.length > 0) {
      return (
        <div className="float-left">
          {getExtraButtons()}
        </div>
      );
    }
  }
  const getDownloadButton = () => {
    return (
      <UncontrolledButtonDropdown title="download">
        <DropdownToggle caret outline color="dataTable-export-btn drop-down-button" size="sm">
          Export
        </DropdownToggle>
        <DropdownMenu right className="dataTable_export_dd">
          {
            exportTypes && exportTypes.map((item, ind) => {
              return <DropdownItem
                key={ind} className="custom-dropdown-item"
                onClick={() => exportCall(item, exportFileName, setNotification, exportResponseHandler, exportLimit, totalRecords)}>
                {item && item.label}
              </DropdownItem>;
            })
          }
          {/* <DropdownItem>csv</DropdownItem>
          <DropdownItem>excel</DropdownItem> */}
        </DropdownMenu>
      </UncontrolledButtonDropdown >
    );
  }
  const handleKeyPress = (e) => {
    const target = { "value": e.target.value };
    const event = { "target": target };
    setPageState({ keyword: e.target.value });
    if (e.keyCode === 13) {
      changeAttributes({ "name": "commonSearch", "isNotUpdateState": true, "isResetTable": true }, event);
    }
  }
  const handleSearchClick = () => {
    if (commonSearch)
      changeAttributes({ "name": "commonSearch", "isNotUpdateState": true, "isResetTable": true });
  }
  const getFilterIcon = () => {
    if (filterLabelList) {
      return (
        <div className="dataTable_wrapper float-right">
          <Button color="dataTable-sm-btn btn-block-c" size="sm" onClick={() => toggleAction(FORM_MODAL.SearchFilter, null)}>
            <i style={{ color: "#2B2B2B" }} className="fa fa-filter"></i>
          </Button>
        </div>
      );
    } else {
      return '';
    }
  }
  return (
    <Container className="dataTable" fluid>
      {!isDifferentHeader ?
        !isSearchbarNotRequired &&
        <Row>
          <Col lg="6" md="12" sm="12" className="d-flex align-items-center">
            <div className="dataTable_tc_head float-left dataTable_wrapper clearfix mr-2">
              {header}  {!hidePagination ? `| ${totalRecords || ''}` : ''}
            </div>
            {getCreateButton()}
          </Col>
          <Col lg="6" md="12" sm="12">
            <div>
              {getFilterIcon()}
              {hasExport ? <div className="dataTable_wrapper float-right">
                {getDownloadButton()}
              </div> : ''
              }
            </div>
            {removeSearch ? '' : <div className="dataTable_wrapper float-right pr-1 searchIco-data-div">
              <Input type="search" className="dataTable_common_search"
                placeholder={searchHelpText} size="sm" onKeyUp={handleKeyPress}
                onChange={changeAttributes.bind(this, { "name": "keyword", "isOnlyUpdateState": true })}
                value={commonSearch}
              />
              {!commonSearch && <span className="searchIco-data-table-common c-pointer" onClick={handleSearchClick}>
                <i className="fa fa-search" />
              </span>}
              {commonSearch && <span className="closeIco-data-table-common c-pointer" onClick={() => { setPageState({ keyword: '' }) }}>
                <i className="fa fa-times" />
              </span>}
            </div>}
            <div className="dataTable_wrapper float-right">
              {showRefresh ? <span
                className="float-right c-pointer refersh-dataTable"
                onClick={refershClick}>
                <i style={{ color: "#2B2B2B" }} className="fa fa-refresh"></i>
              </span> : ''
              }
            </div>
          </Col>
        </Row>
        :
        <Row style={{ alignItems: "center" }}>
          <Col className="col-6 list-data-col">
            <span className="listDataCount">{totalRecords} Items</span>
            {removeSearch ? '' : <div className="dataTable_wrapper float-right pr-1 searchIco-data-div">
              <span className="searchIco-data-table-common c-pointer" onClick={handleSearchClick}>
                <i className="fa fa-search" />
              </span>
              <Input type="search" className="dataTable_common_search"
                placeholder={searchHelpText} size="sm" onKeyUp={handleKeyPress}
                onChange={changeAttributes.bind(this, { "name": "keyword", "isOnlyUpdateState": true })}
                value={commonSearch} />
              {commonSearch && <span className="closeIco-data-table-common c-pointer" onClick={() => { setPageState({ keyword: '' }) }}>
                <i className="fa fa-times" />
              </span>}
            </div>}
          </Col>
          <Col className="list-data-col-filter">
            {otherButtons && otherButtons.length &&
              <div style={{ display: "flex" }}>
                {selectedCluster && selectedCluster.length !== 0 &&
                  <CustomButton
                    style={otherButtons[0].buttonStyle}
                    type={otherButtons[0].buttonType}
                    size={otherButtons[0].buttonSize}
                    align={otherButtons[0].align}
                    label={otherButtons[0].label}
                    isButtonGroup={otherButtons[0].isButtonGroup}
                    icon=""
                    onClick={() => { toggleAction("selectedCluster", null) }}
                  />
                }
                {(rowData !== undefined && rowData.length && rowData[0] &&
                  rowData[0].columnValues.length) &&
                  <CustomButton
                    style={otherButtons[1].buttonStyle}
                    type={otherButtons[1].buttonType}
                    size={otherButtons[1].buttonSize}
                    align={otherButtons[1].align}
                    label={otherButtons[1].label}
                    isButtonGroup={otherButtons[1].isButtonGroup}
                    icon=""
                    onClick={() => { toggleAction("collectfee", null) }}
                  />
                }
                <CustomButton
                  style={otherButtons[2].buttonStyle}
                  type={otherButtons[2].buttonType}
                  size={otherButtons[2].buttonSize}
                  align={otherButtons[2].align}
                  label={otherButtons[2].label}
                  isButtonGroup={otherButtons[2].isButtonGroup}
                  icon=""
                  onClick={() => otherButtons[2].onClickHandler(rowData.length)}
                />
              </div>
            }
          </Col>
        </Row>
      }
      {getFilterRow()}
      {getTableData()}
    </Container>
  );
};

