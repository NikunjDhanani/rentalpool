"use client";

import React, { useEffect, useState } from "react";
import styles from "./personalProfileEdit.module.css";
import axios from "axios";
import BusinessProfileEdit from "../businessProfile/businessProfileEdit"

const PersonalProfileEdit = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        profileImage: null 
    });
    const [profileType, setProfileType] = useState('personal');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const axiosInterceptor = axios.interceptors.request.use(config => {
          const authToken = localStorage.getItem('authToken');
          if (authToken) {
            config.headers.Authorization = `Token ${authToken}`;
          }
          return config;
        });
    
        return () => {
          axios.interceptors.request.eject(axiosInterceptor);
        };
      }, []); 

      
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (event) => {
        // Update the profileImage state when a file is selected
        if (event.target.files[0]) {
            setFormData(prevState => ({
                ...prevState,
                profileImage: event.target.files[0]
            }));
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError('');
    
        const formDataToSend = new FormData();
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }

        const authToken = localStorage.getItem('authToken');
        axios({
          url: `${process.env.NEXT_PUBLIC_BASE_URL}users/myProfile/`,
          method: "PUT",
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${authToken}` 
          },
          data: formDataToSend,
        })
        .then(response => {
          console.log('Profile Updated Successfully:', response.data);
        })
        .catch(err => {
          console.error('Error updating profile:', err);
          setError('Failed to update profile. Please try again later.');
        })
      };

      
    return (
        <div className={styles.my_account_tab_content_container}>
            <div className={styles.edit_profile_container}>
                <div className={styles.main_tab_content}>
                    <div className={styles.edit_profile_heading_container}>
                        <h2>Edit Profile</h2>
                    </div>
                    <div className={styles.edit_profile_tab_container}>
                        <div className={styles.edit_profile_tab_options}>
                        <button className={profileType === 'personal' ? styles.activeButtonPersonal : styles.personalBusinessBtn}
                                    onClick={() => setProfileType('personal')}>Personal</button>
                            <button className={profileType === 'business' ? styles.activeButtonBusiness : styles.personalBusinessBtn}
                                    onClick={() => setProfileType('business')}>Business</button>
                        </div>
                        {profileType === 'personal' && (
                         <div className={styles.edit_profile_tab_content}>
                            <div className={styles.my_account_content_section} id="personal">
                                <div className={styles.user_image_container}>
                                    <img src="/assets/profileEdit/profile.png" alt="User Profile" />
                                    <label htmlFor="profileImageUpload" className={styles.imageUploadLabel}>
                            <img className={styles.inputFileImgDiv} src="/assets/profileEdit/add_circle.svg" alt="Add Profile"/>
                        </label>
                        <input
                            type="file"
                            id="profileImageUpload"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                                </div>
                                <form className={styles.formMainDiv} onSubmit={handleSubmit}>
                                    <div className={styles.allFieldMainContainer}>
                                        <div className={styles.half_field_container}>
                                            <label htmlFor="full_name">Full Name</label>
                                            <input type="text" name="fullName" placeholder="Your Full Name" value={formData.fullName} onChange={handleChange} required />
                                        </div>
                                        <div className={styles.half_field_container}>
                                            <label htmlFor="phone_number">Phone Number</label>
                                            <input type="text" name="phoneNumber" placeholder="+91 98989 85858" value={formData.phoneNumber} onChange={handleChange} required />
                                        </div>
                                        <div className={styles.half_field_container}>
                                            <label htmlFor="date_of_birth">Date of Birth</label>
                                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                                        </div>
                                        <div className={styles.gender_radio_container}>
                                            <label className={styles.gender_label}>Gender</label>
                                            <label>
                                                <input type="radio" name="gender" value="male" onChange={handleChange} checked={formData.gender === 'male'}  /> Male
                                            </label>
                                            <label>
                                                <input type="radio" name="gender" value="female" onChange={handleChange} checked={formData.gender === 'female'}  /> Female
                                            </label>
                                            <label>
                                                <input type="radio" name="gender" value="other" onChange={handleChange} checked={formData.gender === 'other'}  /> Other
                                            </label>
                                        </div>
                                        <div className={`${styles.half_field_container} ${styles.address_field}`}>
                                            <label htmlFor="address">Address</label>
                                            <textarea name="address" placeholder="10 Laxmi Nagar, Surat 395004, Gujarat" value={formData.address} onChange={handleChange} required></textarea>
                                        </div>
                                    </div>
                                    <div className={styles.form_btn_container}>
                                        <button type="submit" className={styles.blue_btn} disabled={submitting}>Save</button>
                                        <button type="button" className={styles.transparent_btn} onClick={() => setFormData({ fullName: '', phoneNumber: '', dateOfBirth: '', gender: '', address: '' })}>Discard</button>
                                    </div>
                                </form>
                                
                            </div>
                        </div> 
                    )}
                    {profileType === 'business' && <BusinessProfileEdit />}
                    </div>
                </div>
            </div>
            {/* <BusinessProfileEdit /> */}
        </div>
    );
};


export default PersonalProfileEdit;