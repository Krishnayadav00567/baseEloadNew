import React from 'react'
import { ModalBody,Col,ModalFooter } from 'reactstrap'
const Terms = (props) => {
    const {onCancel} = props
    return(
        <>
        <ModalBody>
               <div className="terms-content">
<h4>End User License Agreement (EULA)</h4>
<p>Dengan Mengklik tombol LANJUT dan menginstall aplikasi Smart Adapter Client berarti Pengguna setuju untuk tunduk dan mengikatkan diri pada syarat-syarat dan ketentuan-ketentuan penggunaan layanan Smart Adapter Client sbb :</p>

<ul style={{listStyleType:'upper-alpha'}}><li>Definisi
    <ul style={{listStyleType:'decimel'}}>
        <li>
        Pengguna adalah pemilik outlet dan frontliner dari pemilik outlet yang menggunakan aplikasi Smart Adapter Client.
        </li>
        <li>
        Smart Adapter Client adalah aplikasi yang dari waktu ke waktu dibuat/dikembangkan oleh PT Smartfren telecom yang bertujuan untuk memudahkan pengguna untuk melakukan aktifitas yang berhubungan dengan penjualan pulsa smartfren.
        </li>
        <li>
        MSISDN & PIN adalah nomor handphone dan Personal Identification Number yang digunakan oleh pengguna untuk bias terhubung dan melakukan transaksi pulsa ke PT Smartfren telecom
        </li>
    </ul>
    
    
    </li>
    <li>
    Ketentuan
    <ul style={{listStyleType:'decimel'}}>
        <li>
        Pengguna wajib menjaga kerahasiaan MSISDN dan PIN, dan segala resiko kehilangan, pencurian dan/atau pemakaian oleh pihak yang tidak berwenang menjadi tanggung jawab pengguna sendiri.
        </li>
        <li>
        Segala jenis kerusakan, kehilangan data dan/atau potensi kerugian yang diakibatkan hal tersebut menjadi tanggung jawab pengguna sendiri.
        </li>
        <li>
        Apabila terdapat perbedaan data antara aplikasi Smart Adapter Client dan data pada PT Smartfren telecom, maka data yang akan dijadikan acuan adalah data pada PT Smartfren telecom.
        </li>
    </ul>
    </li>
    </ul>
</div>
        </ModalBody>
        <ModalFooter style={{background:'#F5F7FA'}}>
        <div style={{display:'flex',justifyContent:'flex-end'}}>
                  {/* <CustomButton
                      style={BUTTON_STYLE.BRICK}
                      type={BUTTON_TYPE.PRIMARY}
                      size={BUTTON_SIZE.LARGE}
                      align="right"
                      label="Close"
                      isButtonGroup={true}
                      onClick={close}
                  /> */}
                  <button style={{width:'100px',fontSize:'14px'}} onClick={onCancel} className="signIn-btn mt-2">Lanjut</button>
          </div>
   </ModalFooter>
   </>
    )
}
export default Terms;