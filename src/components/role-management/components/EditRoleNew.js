import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { Redirect, useParams } from 'react-router-dom';
import _ from 'lodash';
import {
  CustomButton,
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_SIZE,
  COLOR
} from '@6d-ui/buttons';
import { FieldItem, validateForm, useFieldItem } from '@6d-ui/fields';
import { ROLE_FILEDS as FIELDS } from './util/FormElements';
import { Popup, POPUP_ALIGN } from '@6d-ui/popup';
import AddSubModules from './AddSubModules';
import {MESSAGES} from '../../../util/Constants';
import { useMemo } from 'react';


export default function EditRoleNew(props) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [modules, setModules] = useState([]);
  const [modal, setModal] = useState(0)
  const [moduleDtls, setModuleDtls] = useState({});
  const [subModules, setSubModules] = useState([]);
  const [index,setIndex]=useState("");
  const { id: ROLE_ID } = useParams();
  const [roleDetails,setRoleDetails]=useState("");
  useMemo(() => {
    props.setHeader("Roles");
    if(ROLE_ID){
    props.ajaxUtil.sendRequest(`${props.url_Roles.CREATE_URL}/${ROLE_ID}`, {}, (response, hasError) => {
      if (!hasError) {
          const selectedModules=_.mapKeys(response.moduleList, "moduleId");
          setRoleDetails({roleName:response.roleName,roleId:response.roleId})
          loadModules(selectedModules);
      }
  }, props.loadingFunction, { method: 'GET', isShowSuccess: false});
}
  }, [ROLE_ID])
  const loadModules=(selectedModules)=>{
    props.ajaxUtil.sendRequest(`${props.url_Roles.GET_MODULES}`, {}, (response, hasError) => {
      if (!hasError && response) {
        setModules(response.response.length>0?response.response.map(mod=>({...mod,moduleId:mod.id,subModuleList:(selectedModules&&selectedModules[mod.id])?selectedModules[mod.id].subModuleList||[]:[]})):[])
      } else {
        setModules([])
      }
    }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });
  }
  const initialValues=useMemo(() => {
    if(!_.isEmpty(roleDetails)){
      return{
        roleName:roleDetails.roleName||''
      }
    }
    return {}
  }, [roleDetails])
  const [values, fields, handleChange, { validateValues, reset }] = useFieldItem(FIELDS, initialValues, {});
  const toggleAction=(module,index,type)=>{
    if(type==='edit'){
        setModuleDtls(module);
        setIndex(index);
        props.ajaxUtil.sendRequest(`${props.url_Roles.GET_FEATURES}?parent=${module.id}`, {}, (response, hasError) => {
          if (!hasError && response) {
            setSubModules(response.response||[])
          } else {
            setSubModules([])
          }
        }, props.loadingFunction, { method: 'GET', isShowSuccess: false, isShowFailure: false });
        setModal(type);
    }else{
      setModal(0)
    }
  }
  const addModules=(subModules)=>{
    let modulesTmp=[...modules];
    modulesTmp[index].subModuleList=subModules;
    setModules(modulesTmp)
    setModal(0);
  }
  const getSubModules=(subModuleList)=>{
    if(subModuleList.length>0){
        const names=subModuleList.map(sb=>(sb.subModuleName))
        return names.toString()
    }
    return '---'

  }
  const onSaveClick = () => {
    const hasError = validateValues(Object.keys(FIELDS));
    const moduleError = modules.some(validateModules);
    const {roleId}=roleDetails;
    if (hasError) {
      props.setNotification({
        hasError: true,
        message: MESSAGES.FILED_MANDATORY
      });
    } else {
      if (moduleError){//atleast one feature added
        const moduleList=modules.map(mod=>(
          {...mod,subModuleList:formatSubModule(mod.subModuleList,mod.moduleId)}
        )).filter(mod=>mod.subModuleList.length>0)
        const req={
          moduleList,
          roleName:values.roleName||''
        }
        props.ajaxUtil.sendRequest(`${props.url_Roles.CREATE_URL}/${roleId}`, req, (response, hasError) => {
          if (!hasError) {
              setIsSuccess(true);
          }
      }, props.loadingFunction, { method: 'PUT', isShowSuccess: true});
    }else {
      props.setNotification({
        hasError: true,
        message: "Please Add at-least one feature"
      });
    }
  }
}
  const validateModules=(module)=>{
    if(module.subModuleList.length>0)
      return true;
  }
  const formatSubModule = (subModule,parentId) => {
    return subModule.map(subMod => ({ ...subMod,parentId,featureList: subMod.featureList.map((ft) => ({ ...ft, devices: ft.devices && ft.devices.value || ft.devices })) }))
  }
  if (isSuccess) {
    return <Redirect to="/Roles" />;
  }
  return (
    <div className="custom-container">
      <div className="form-Brick">
        <div className="form-Brick-body">
          <Row className="mx-0">
            {
              Object.keys(FIELDS).map(k => {
                return <FieldItem
                  {...FIELDS[k]}
                  key={FIELDS[k].name}
                  onChange={(...e) => handleChange(FIELDS[k].name, ...e)}
                  value={values[FIELDS[k].name]}
                  touched={fields[FIELDS[k].name] && fields[FIELDS[k].name].hasError}
                  error={fields[FIELDS[k].name] && fields[FIELDS[k].name].errorMsg}
                />
              })
            }
          </Row>
        </div>
        <div className="form-Brick-Head permissions-container">
          <span>Permissions</span>
        </div>
        <div className="dataTable_wrapper pt-2 form-Brick-body">
          <div className="dataTable-scrollable">
            <table className="data-table dataTable-mainTable table table-hover">
              <thead>
                <tr>
                  <th className="dataTable_head_sortable">
                    <table className="dataTable_label_tab">
                      <tbody>
                        <tr>
                          <td>Module Name</td>
                        </tr>
                      </tbody>
                    </table>
                  </th>
                  <th className="dataTable_head_sortable">
                    <table className="dataTable_label_tab">
                      <tbody>
                        <tr>
                          <td>Sub Modules</td>
                          <td>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  modules.length > 0 ? modules.map((mod, key) => (<tr key={key}>
                    <td className="text-ellipsis"><span>{mod.moduleName}</span></td>
                    <td className="text-ellipsis" style={{maxWidth:300}}><span >{getSubModules(mod.subModuleList)}</span></td>
                    <td><i className="cursor" style={{ cursor: "pointer" }} className="fa fa-pencil" aria-hidden="true"
                    onClick={()=>toggleAction(mod,key,'edit')}
                    ></i>
                    </td>
                  </tr>
                  )) :
                    <td colSpan="3" className="text-danger text-center">
                      <span>No Details</span>
                    </td>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <CustomButton
          style={BUTTON_STYLE.BRICK}
          type={BUTTON_TYPE.PRIMARY}
          size={BUTTON_SIZE.LARGE}
          align="right"
          label="Save"
          isButtonGroup={true}
          onClick={onSaveClick}
        />
        <CustomButton
          style={BUTTON_STYLE.BRICK}
          type={BUTTON_TYPE.SECONDARY}
          size={BUTTON_SIZE.LARGE}
          color={COLOR.PRIMARY}
          align="right"
          label="Cancel"
          isButtonGroup={true}
          onClick={()=>{setIsSuccess(true)}}
        />
      </div>
      <div style={{ height: "100px" }}></div>
      <Popup
                type={POPUP_ALIGN.RIGHT}
                title={moduleDtls.moduleName}
                isOpen={modal === 'edit'}
                close={toggleAction}
                minWidth="85%"
                component={
                  <AddSubModules
                    {...props}
                    subModules={subModules}
                    modules={modules}
                    addModules={addModules}
                    subModuleDts={moduleDtls.subModuleList}
                    onCancel={() => toggleAction(null, null,0)}
                  />
                }
              />
    </div>
  );
}

