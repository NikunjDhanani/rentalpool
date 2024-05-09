import axios from 'axios';
import Image from 'next/image';
import { Button, Modal } from "react-bootstrap";
import PhoneInput from 'react-phone-number-input';
import popup_img from "../../../public/assets/popup_img.png";

const LoginPopup = ({ show, onClose, onSignupClick, onSendOtpClick, loginFormData, setLoginformData }) => {
  const handleRegisterClick = () => {
    onSignupClick();
  };

  const handleSendOtpClick = () => {
    onSendOtpClick();
  };

  const handleChange = (value) => {
    // Update loginFormData with the new phoneNumber value
    setLoginformData({
      ...loginFormData,
      phoneNumber: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}users/login/`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        phoneNumber: loginFormData.phoneNumber
      }
    })
      .then((response) => {
        if (response.status == 200) {
          handleSendOtpClick()
        } else {

        }
      })
      .catch((error) => {
        console.error('Error registering user:', error);
      });
  };

  return (
    <Modal className='login_popup' show={show} onHide={onClose}>
      <Modal.Header className='border-0 pt-0' closeButton></Modal.Header>
      <Modal.Body className='p-0'>
        <div className='row align-items-center'>
          <div className='col-md-5 p-0 order-md-1 order-3'>
            <form onSubmit={handleSubmit}>
              <h4 className='popup_heading text-md-start text-center'>Welcome back!<br />Glad to see you, Again</h4>
              <label className='text-start' htmlFor="phoneInput">Phone Number</label>
              <PhoneInput
                id="phoneInput"
                placeholder="Enter phone number"
                value={loginFormData.phoneNumber}
                onChange={handleChange}
                required
              />
              <p className='text-md-start text-center'>By entering your phone number you confirm that you agree to <a href=''>Terms and Conditions</a></p>
              <Button type='submit' className='send_otp_btn d-sm-block d-flex justify-content-center' variant="primary" >
                Send OTP
              </Button>
              <h5>Don’t have an account? <span variant="secondary" onClick={handleRegisterClick}>Register Now</span></h5>

            </form>
          </div>
          <div className='col-md-1 p-0 order-2'>

          </div>
          <div className='col-md-6 p-0 order-md-3 order-1 text-center d-sm-block d-none'>
            <Image className='popup_img mb-md-0 mb-4' src={popup_img} />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default LoginPopup;
