import React, { useEffect, useState } from 'react';
import Terms from './Terms/terms'
//import {Manuels} from './utils/listItems'
import { Popup, POPUP_ALIGN } from '@6d-ui/popup';
import { ajaxUtil, setLoadingUtil } from '../home/Utils';
import { DOWNLOAD_ADAPTER_FILES, LIST_ADAPTER_FILES } from '../../util/Constants';

function SmartAdapter(props) {
  const [openModal, setOpenModal] = useState(false)
  const [searchInput, setSearchInput] = useState('');
  const [manuels, setManuels] = useState("");
  const [exeFiles, setExeFiles] = useState("");

  const toggleAction = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    ajaxUtil.sendRequest(`${LIST_ADAPTER_FILES}/userManual`, {}, (response, hasError) => {
      if (!hasError) {
        setManuels([...response.response || [],
        { "contentName": "Guava", "directory": true, "file": false, "uploadedDate": "", fromLocal: true, displayText: 'Coming Soon' },
        { "contentName": "Technosmart", "directory": true, "file": false, "uploadedDate": "", fromLocal: true, displayText: 'hubungi support technosmart' },
        ])
      } else {
        setManuels([{ "contentName": "Guava", "directory": true, "file": false, "uploadedDate": "", fromLocal: true, displayText: 'Coming Soon' },
        { "contentName": "Technosmart", "directory": true, "file": false, "uploadedDate": "", fromLocal: true, displayText: 'hubungi support technosmart' },
        ])
      }
    }, setLoadingUtil, { isShowSuccess: false, method: 'GET' });

    ajaxUtil.sendRequest(`${LIST_ADAPTER_FILES}/application`, {}, (response, hasError) => {
      if (!hasError) {
        setExeFiles(response.response || [])
      }
      else {
        setExeFiles([])
      }
    }, setLoadingUtil, { isShowSuccess: false, method: 'GET' });

  }, [])

  const filteredManuels = manuels && manuels?.filter(data => data.contentName.toLowerCase().includes(searchInput.toLowerCase()))
  const downloadPackage = (folderName) => {
    window.open(`${DOWNLOAD_ADAPTER_FILES}/application/${folderName}`)
    /* if (type === "win32") {
      window.open("https://sris.smartfren.com/download/smart_adapter/SA-32bit-6.0.exe")
    }
    else if (type === "win64") {
      window.open("https://sris.smartfren.com/download/smart_adapter/SA-64bit-6.0.exe")
    }
    else {
      window.open("https://sris.smartfren.com/download/smart_adapter/smartAdapter-6.0.tar.gz")
    } */
  }
  const openFile = (folderName) => {
    window.open(`${DOWNLOAD_ADAPTER_FILES}/userManual/${folderName}`)
    /* ajaxUtil.sendRequest(`${DOWNLOAD_ADAPTER_FILES}${encodeURIComponent(`/userManual/${folderName}`)}`, {}, (response, hasError) => {
      if (!hasError) {
        if (!hasError) {
          const blob = new Blob([response], { type: 'text/csv;charset=utf-8' })
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.setAttribute('hidden', '');
          a.setAttribute('href', url);
          a.setAttribute('download', `${folderName}.zip`);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }
    }, setLoadingUtil, { isShowSuccess: false, method: 'GET' }); */
  }
  const handleSearchInput = (event) => {
    setSearchInput(event.target.value)
  }
  const {smartAdpterVersion="V 6.0 | 24/4/2019"}=window;
  return (
    <div className="adapterContainer scrollbar">
      <div className="container mt-3" style={{ fontFamily: 'Open Sans !important' }}>
        <div className="d-flex flex-column flex-md-row client-container">
          <div className="w-100 w-md-50 left-container">

            <img className="mt-4" src={`${process.env.PUBLIC_URL}/images/logo/Smartfren Logo.svg`} />
            <span className="mt-2 sub-head">Client Adapter</span>
            <div className="version-num">{smartAdpterVersion}</div>
            <div className="download-text">
              Download installer below
            </div>
            <div>
              {
                exeFiles ? exeFiles.length > 0 ? exeFiles.map((appFile,index)=><button key={index} className="download-btn" onClick={() => downloadPackage(appFile.contentName)}>
                  {appFile.contentName}
                </button>
                 ) :
                  <div className="dataTable_notFound text-center">
                   Installer not found
                  </div>
                  :
                  <div className="dataTable_notFound text-center">
                    Loading ...
                  </div>
              }
            </div>
            <span className="terms">By downloading, You agree <span className="agreeTerms" onClick={() => setOpenModal(true)}>Terms and conditions</span></span>
            {/* <span className="small-text">Sign In to portal to explore more</span>
            <button className="signIn-btn mt-2">Sign In</button> */}
          </div>
          <div className="w-100 w-md-50 right-container">
            <div className="d-flex justify-content-between flex-wrap mb-3">
              <span className="right-head">
                User Manuals
              </span>
              <div className="search-bar">
                <input type="text" className="search-input" placeholder="search" onChange={handleSearchInput} />
                <i className="fa fa-search search-icon" />
                {/* <FontAwesomeIcon className="search-icon" icon={faSearch} /> */}
              </div>
            </div>
            {manuels ? <div className="manuel-container">
              {filteredManuels.map((manuel, index) => {
                return <div key={index} className="manuels cursor-pointer" onClick={manuel.fromLocal ? () => { } : () => openFile(manuel.contentName)}><span>{manuel.contentName} </span>{manuel.fromLocal ?
                  manuel.displayText : <i className="fa fa-file manuel-icon" />
                }</div>
              })}
            </div> : <div className="dataTable_notFound text-center">
              Loading ...
            </div>}
          </div>
        </div>
        <Popup
          type={POPUP_ALIGN.RIGHT}
          title="Terms and Conditions"
          isOpen={openModal}
          close={toggleAction}
          minWidth="55%"
          component={
            <Terms
              {...props}
              onCancel={toggleAction}

            />
          }
        />



      </div>
    </div>
  );
}

export default SmartAdapter;
