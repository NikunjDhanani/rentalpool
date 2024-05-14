import axios from 'axios';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useRef, useState } from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import popup_img from "../../../public/assets/popup_img.png";

const OtpPopup = ({ show, onClose, setShowLogin, setShowSignup, setShowOtp, formData, loginFormData }) => {

  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const refs = useRef(Array(6).fill(null));

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, '');
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      refs.current[index + 1].focus();
    }
  };

  const handleVerifyOtpClick = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}users/verifyOTP/`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        phoneNumber: loginFormData.phoneNumber,
        otp: enteredOtp,
      }
    })
      .then((response) => {
        if (response.status === 200) {
          router.push('/')
          const token = response.data.token;
          localStorage.setItem('authToken', token);
          setShowLogin(false);
          setShowSignup(false);
          setShowOtp(false);
          setOtp(['', '', '', '', '', '']);
          setPhoneNumber('');
        } else {
          console.error('OTP verification failed');
        }
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error)
      })
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}users/resendOTP/`,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          phoneNumber: loginFormData.phoneNumber,
        }
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };


  // Set token in headers of Axios requests
  axios.interceptors.request.use(config => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Token ${authToken}`;
    }
    return config;
  });

  return (
    <Modal className='sendotp_popup' show={show} onHide={onClose}>
      <Modal.Header className='border-0 pt-0' closeButton></Modal.Header>
      <Modal.Body className='p-0'>
        <div className='row align-items-center'>
          <div className='col-md-5 p-0 order-md-1 order-3'>
            <Form onSubmit={handleVerifyOtpClick}>
              <h4 className='popup_heading text-md-start text-center'>Please enter the OTP</h4>
              <Form.Group controlId="otp">
                <Form.Label>Enter the verification code we just sent on your mobile number:</Form.Label>
                <span className='mobile_no'>{formData.phoneNumber}</span>
                <div className="otp-input-container">
                  {otp && otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      className="otp-input"
                      ref={(input) => (refs.current[index] = input)}
                    />
                  ))}
                </div>
              </Form.Group>
              <Button className='verify_otp_btn d-sm-block d-flex justify-content-center' variant="primary" type="submit">Verify</Button>
              <h5>Didn’t received code? <span variant="secondary" onClick={handleResendOtp}>Resend</span></h5>
            </Form>
          </div>
          <div className='col-md-1 p-0 order-2'></div>
          <div className='col-md-6 p-0 order-md-3 order-1 text-center d-sm-block d-none'>
            <Image className='popup_img mb-md-0 mb-4' src={popup_img} alt="Description of the image content" />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default OtpPopup;
