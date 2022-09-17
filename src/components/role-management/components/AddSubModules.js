import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'reactstrap';
import _ from 'lodash';
import {
  CustomButton,
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_SIZE,
  COLOR
} from '@6d-ui/buttons';
import LeftContainer from '../../eload/message-template/parts/LeftContainer';
import ServiceContainerRow from '../../eload/message-template/parts/ServiceContainerRow';
import SearchInput from '../../eload/message-template/parts/SearchInput';
import ServiceHeader from '../../eload/message-template/parts/ServiceHeader';
import { searchInputHandle } from '../../util/Util';
import ResponsiveContainer from '../../util/ResponsiveContainer';
import { Switch } from '@6d-ui/form';
import { FieldItem, FIELD_TYPES, useFieldItem, validateForm } from '@6d-ui/fields';


//converting array to object and handling 
export default function AddSubModules(props) {
  const [searchInput, setSearchInput] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedModuleName, setSelectedModuleName] = useState('');
  const { subModules, subModuleDts,addModules,isView,onCancel } = props;
  const [featureLists, setFeatureLists] = useState([]);
  const [subModuleList, setSubModuleList] = useState({});

  useEffect(() => {
      resetValues();
  }, [subModuleDts])
  const searchInputHandler = value => {
    setSearchInput(searchInputHandle(value));
  };

  const handleModuleClick = (module) => {
    setFeatureLists(module.featureMaster || []);
    setSelectedModuleId(module.id);
    setSelectedModuleName(module.moduleName);
  }
  const getSubModulesList = () => {
    let mainStyle = { ...styles.mainStyle };
    let normalSpan = { ...styles.normalSpan };
    return (<div className="list-Brick scrollbar w-100 m-2" style={{ overflow: 'auto', height: '420px', borderTop: '1px solid #E3E9EC' }}>
      {
        subModules.length > 0
          ?
          subModules.filter(obj => obj.moduleName && obj.moduleName.toLowerCase().indexOf(searchInput.toLowerCase()) > -1)
            .map((module, index) => <div key={index} onClick={() => handleModuleClick(module)} style={selectedModuleId == module.id ? { ...mainStyle, ...styles.isSelected } : mainStyle}>
              <span style={selectedModuleId == module.id ? { ...normalSpan, ...styles.isSelectedSpan } : normalSpan}>
                {module.moduleName}
                <span className={isSelectedModule(module.id) ? 'selected-module' : ''}></span>
              </span>
            </div>)
          : <div className="text-center p-2 ">No  Sub-Modules.!</div>
      }
    </div>
    )
  }
  const handleSwitch = (featureId, e) => {
    let subModuleListTmp = { ...subModuleList }
    if (subModuleListTmp[selectedModuleId]) {
      let featureListTmp = subModuleListTmp[selectedModuleId].featureList;
      if (e.target.checked) {
        featureListTmp = { ...featureListTmp, [featureId]: { featureId, devices: { label: 'Both', value: 3 }} }
      } else {
        delete featureListTmp[featureId]
      }
      if (!_.isEmpty(featureListTmp))
        subModuleListTmp = { ...subModuleListTmp, [selectedModuleId]: { featureList: featureListTmp, subModuleId:selectedModuleId, subModuleName:selectedModuleName } }
      else {
        delete subModuleListTmp[selectedModuleId];
      }
    } else {
      let featureListTmp = {};
      if (e.target.checked) {
        featureListTmp = { ...featureListTmp, [featureId]: { featureId, devices: { label: 'Both', value: 3 } } }
        subModuleListTmp = { ...subModuleListTmp, [selectedModuleId]: { featureList: featureListTmp, subModuleId:selectedModuleId, subModuleName:selectedModuleName } }
      }
    }
    setSubModuleList(subModuleListTmp);
  }
  const getFeatureChecked = (featureId) => {
    if (subModuleList[selectedModuleId] && subModuleList[selectedModuleId].featureList) {
      let featureListTmp = subModuleList[selectedModuleId].featureList;
      if (featureListTmp[featureId])
        return true
      else
        return false
    }
    return false;
  }
  const isSelectedModule = (moduleId) => {
    if (moduleId != selectedModuleId && (subModuleList[moduleId] && subModuleList[moduleId].featureList))
      return true
    else
      return false
  }
  const handleChange = (name, featureId, value, obj) => {
    const { isTouched } = obj || { isTouched: false };
    if (isTouched) return;
    let subModuleListTmp = { ...subModuleList }
    if (subModuleListTmp[selectedModuleId] && subModuleListTmp[selectedModuleId].featureList) {
      let featureListTmp = subModuleList[selectedModuleId].featureList;
      if (featureListTmp[featureId]) {
        let featureIdTmp = { ...featureListTmp[featureId] }
        if (value) {
          featureIdTmp = { ...featureIdTmp, devices: value }
          featureListTmp = { ...featureListTmp, [featureId]: featureIdTmp }
          subModuleListTmp = { ...subModuleListTmp, [selectedModuleId]: { ...subModuleListTmp[selectedModuleId], featureList: featureListTmp } }
        } else {
          delete featureListTmp[featureId]
          if (!_.isEmpty(featureListTmp))
            subModuleListTmp = { ...subModuleListTmp, [selectedModuleId]: {  ...subModuleListTmp[selectedModuleId],featureList: featureListTmp} }
          else {
            delete subModuleListTmp[selectedModuleId];
          }
        }
        setSubModuleList(subModuleListTmp);
      }
      else {
        props.setNotification({
          hasError: true,
          message: "Please Enable a feature"
        });
      }
    } else {
      props.setNotification({
        hasError: true,
        message: "Please Enable a feature"
      });
    }
  }
  const getDeviceValue = (featureId) => {
    if (subModuleList[selectedModuleId] && subModuleList[selectedModuleId].featureList) {
      let featureListTmp = subModuleList[selectedModuleId].featureList;
      if (featureListTmp[featureId])
        return featureListTmp[featureId].devices || null
      else
        return null
    }
    return null;
  }
  const onSubmitClick = () => {
    let subModuleListTmp = { ...subModuleList };
    if (!_.isEmpty(subModuleListTmp))
      addModules(Object.values(subModuleListTmp).map(subMod => ({ ...subMod, featureList: Object.values(subMod.featureList) })))
    else
      props.setNotification({
        hasError: true,
        message: "Please Add at-least one feature"
      });
  } 
   
  const resetValues=()=>{
    if(subModuleDts.length>0){
      const tmpDtls=subModuleDts.map((sub)=>({...sub,featureList:_.mapKeys(sub.featureList, "featureId")}))
      setSubModuleList(_.mapKeys(tmpDtls,'subModuleId'))
  }else
    setSubModuleList({})
  }
  const handleAllSwitch = (features, e) => {
    let subModuleListTmp = { ...subModuleList }
    if (subModuleListTmp[selectedModuleId]) {
      let featureListTmp = {};
      if (e.target.checked) {
        features.map(feat=>{
          featureListTmp={ ...featureListTmp, [feat.featureId]: { featureId:feat.featureId, devices: { label: 'Both', value: 3 } } }
      })
      } else {
        features.map(feat=>{
          delete featureListTmp[feat.featureId]
      })
      }
      if (!_.isEmpty(featureListTmp))
        subModuleListTmp = { ...subModuleListTmp, [selectedModuleId]: { featureList: featureListTmp, subModuleId:selectedModuleId, subModuleName:selectedModuleName } }
      else {
        delete subModuleListTmp[selectedModuleId];
      }
    } else {
      let featureListTmp = {};
      if (e.target.checked) {
        features.map(feat=>{
          featureListTmp={ ...featureListTmp, [feat.featureId]: { featureId:feat.featureId, devices: { label: 'Both', value: 3 } } }
      })
        subModuleListTmp = { ...subModuleListTmp, [selectedModuleId]: { featureList: featureListTmp, subModuleId:selectedModuleId, subModuleName:selectedModuleName } }
      }
    }
    setSubModuleList(subModuleListTmp);
  }
  const getAllFeatureChecked = (features) => {
    if (subModuleList[selectedModuleId] && subModuleList[selectedModuleId].featureList) {
      let featureListTmp = subModuleList[selectedModuleId].featureList;
      const allFeature=features.some((feature)=>{
        if (!featureListTmp[feature.featureId])
          return true
      })
      return !allFeature;
    }
    return false;
  }
  return (
    <ResponsiveContainer offset={100}>
      <div style={{ padding: "3px 10px", height: "100%" }}>
        <Row style={{ height: "100%" }}>
          <Col sm="12" md="4" sm="12" style={{ paddingLeft: "0px", height: "100%" }}>
            <LeftContainer>
              <ServiceHeader label="Sub-Modules" items={subModules.length} />
              <ServiceContainerRow isInput>
                <SearchInput onChange={searchInputHandler} placeholder="Search" name="searchErrorCodes" />
              </ServiceContainerRow>
              {getSubModulesList()}
            </LeftContainer>
          </Col>
          <Col sm="12" md="8" sm="12" className="side-nav-menu-in scrollbar" style={{ marginTop: "4px", backgroundColor: "#FFFFFF", boxShadow: "0 0 4px 0 rgba(0,0,0,0.13)", height: "100%", overflowX: 'hidden' }}>
            {featureLists && featureLists.length > 0 && <Row style={{ ...styles.mainStyle, flexDirection: 'row' }}>
              <Col md="3">
                <span style={{ fontWeight: 600 }}>Permissions</span>
              </Col>
              <Col md="6">
              </Col>
              <Col md="3">
                <Switch
                  handleChange={isView?()=>{}:(e) =>
                  handleAllSwitch(
                    featureLists
                    , e)}
                    checked={getAllFeatureChecked(featureLists)}  />
              </Col>
            </Row>}
            {
              featureLists && featureLists.length > 0 && featureLists.map((feature, index) => <Row key={index} style={{ ...styles.mainStyle, flexDirection: 'row' }}>
                <Col md="3" className="pt-3">
                  {feature.featureName}
                </Col>
                <Col md="3">
                <label className="form-control-label"></label>
                  <Switch
                    moduleId={feature.featureId}
                    handleChange={isView?()=>{}:(e) =>
                      handleSwitch(
                        feature.featureId
                        , e)}
                    checked={getFeatureChecked(feature.featureId)} />
                </Col>
                <FieldItem
                  placeholder="Device"
                  type={FIELD_TYPES.DROP_DOWN}
                  width="md"
                  value={getDeviceValue(feature.featureId)}
                  values={[{ label: 'web', value: 1 }, { label: 'App', value: 2 }, { label: 'Both', value: 3 }]}
                  onChange={isView?()=>{}:(...e) => handleChange('device', feature.featureId, ...e)}
                />
              </Row>
              )
            }
          </Col>
        </Row>
        <div style={{ height: "20px" }}></div>
      {isView?<div className="container-fluid">
        <CustomButton
          style={BUTTON_STYLE.BRICK}
          type={BUTTON_TYPE.PRIMARY}
          size={BUTTON_SIZE.LARGE}
          align="right"
          label="Close"
          isButtonGroup={true}
          onClick={onCancel}
        />
        </div>
        :<div className="container-fluid">
        <CustomButton
          style={BUTTON_STYLE.BRICK}
          type={BUTTON_TYPE.PRIMARY}
          size={BUTTON_SIZE.LARGE}
          align="right"
          label="Save"
          isButtonGroup={true}
          onClick={onSubmitClick}
        />
        <CustomButton
          style={BUTTON_STYLE.BRICK}
          type={BUTTON_TYPE.SECONDARY}
          size={BUTTON_SIZE.LARGE}
          color={COLOR.PRIMARY}
          align="right"
          label="Reset"
          isButtonGroup={true}
          onClick={resetValues}
        />
      </div>}
      </div>
    </ResponsiveContainer>
  );

}

const styles = {
  mainStyle: {
    minHeight: "55px",
    padding: "10px 20px",
    borderBottom: "1px solid #EBEEF1",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer"
  },
  isSelected: {
    background: "linear-gradient(315deg, #F9EEFE 0%, #E8F5FF 100%)",
    borderTop: "1px solid #EBEEF1"
  },
  normalSpan: {
    color: "#33495F",
    width: "100%",
    fontFamily: "Open Sans",
    fontSize: "14px",
    lineHeight: "32px",
    flex: 1,
    position: 'relative',
  },
  isSelectedSpan: {
    fontWeight: 600
  },
};

