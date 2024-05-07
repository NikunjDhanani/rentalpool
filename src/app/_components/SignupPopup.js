// SignupPopup.js

import React, { useState, useEffect } from 'react';
import { Form, Modal, Button } from "react-bootstrap";
import Image from 'next/image';
import popup_img from "../../../public/assets/popup_img.png";
import PhoneInput, { PhoneNumber } from 'react-phone-number-input';
import axios from 'axios';
import OtpPopup from './OtpPopup'

const SignupPopup = ({ show, onClose, onSendOtpClick, onLoginClick, formData, setFormData }) => {

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [value, setValue] = useState();

  const phoneNo = formData.phoneNumber;
  const handleSendOtpClick = () => {
    onSendOtpClick(phoneNo);
  };
  const handleLoginClick = () => {
    onLoginClick();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}users/register/`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    })
      .then((response) => {
        if (response.status === 201) {
      handleSendOtpClick();
          console.log('User registered successfully!');
        } else {
          console.error('Registration failed');
        }
      })
      .catch((error) => {
        console.error('Error registering user:', error);
      });
  };

  return (

    <>
    <Modal className='signup_popup' show={show} onHide={onClose}>
      <Modal.Header className='border-0 p-0' closeButton></Modal.Header>
      <Modal.Body className='p-0'>
        <div className='row align-items-center'>
          <div className='col-md-5 p-0 order-md-1 order-3'>
            <Form onSubmit={handleSubmit}>
              <h4 className='popup_heading text-md-start text-center' style={{ marginBottom: "10px" }}>Hello!<br />Register to get started</h4>
              <Form.Group controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </Form.Group>

              <label className='text-start' htmlFor="phoneInput">Phone Number</label>
              {/* <PhoneInput
                id="phoneInput"
                placeholder="Enter phone number"
                value={value}
                onChange={setValue}
                required
              /> */}
              <PhoneInput
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(value) => handleChange({ target: { name: 'phoneNumber', value: value } })}
                required
              />

              <Form.Group controlId="dateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label><br />
                <Form.Check
                  inline
                  label="Male"
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}

                />
                <Form.Check
                  inline
                  label="Female"
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  label="Other"
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === 'other'}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="agreeToTerms">
                <Form.Check
                  className='check_box'
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  label="I have a referral code"
                />
              </Form.Group>

              {/* Conditional rendering based on the checkbox state */}
              {formData.agreeToTerms && (
                <Form.Group controlId="referralCode">
                  <Form.Label style={{ marginTop: "15px" }}>Referral Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    placeholder="Enter referral code"
                  />
                </Form.Group>
              )}

              <p className='text-md-start text-center'>By entering your phone number you confirm that you agree to <a href=''>Terms and Conditions</a></p>
              <Button className='send_otp_btn d-sm-block d-flex justify-content-center' type='submit' variant="primary" >
                Send OTP
              </Button>
              <h5>Already have an account? <span variant="secondary" onClick={handleLoginClick}>Login</span></h5>
            </Form>
          </div>
          <div className='col-md-1 p-0 order-2'></div>
          <div className='col-md-6 p-0 order-md-3 order-1 text-center d-sm-block d-none'>
            <Image className='popup_img mb-md-0 mb-4' src={popup_img} />
          </div>
        </div>
      </Modal.Body>
    </Modal>

    
</>

  );

  
}

export default SignupPopup;
