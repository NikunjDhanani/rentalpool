"use client";

import React, { useState } from "react";
import styles from "./businessProfileEdit.module.css";
import axios from "axios";

const BusinessProfileEdit = () => {
    const [formData, setFormData] = useState({
        businessName: "",
        businessDescription: "",
        email: "",
        gstNumber: "",
        businessAddress: "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.businessName.trim()) {
            newErrors.businessName = "Business Name is required";
        }
        if (!formData.businessDescription.trim()) {
            newErrors.businessDescription = "Business Description is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.gstNumber.trim()) {
            newErrors.gstNumber = "GST Number is required";
        }
        if (!formData.businessAddress.trim()) {
            newErrors.businessAddress = "Business Address is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }
        setSubmitting(true);
        setError("");

        const authToken = localStorage.getItem('authToken');
        axios({
          url: `${process.env.NEXT_PUBLIC_BASE_URL}users/updateToBusinessProflie/`,
          method: "PATCH",
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${authToken}` 
          },
          data: formData,
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
                    {/* <div className={styles.edit_profile_heading_container}>
                        <h2>Edit Profile</h2>
                    </div> */}
                    <div className={styles.edit_profile_tab_container}>
                        {/* <div className={styles.edit_profile_tab_options}>
                            <button className={styles.personalBtn}>Personal</button>
                            <button className={styles.businessBtn}>Business</button>
                        </div> */}
                        <div className={styles.edit_profile_tab_content}>
                            <div className={styles.my_account_content_section} id="business">
                                <form className={styles.formMainDiv} onSubmit={handleSubmit}>
                                    <div className={styles.allFieldMainContainer}>
                                        <div className={styles.half_field_container}>
                                            <label htmlFor="businessName">Business Name</label>
                                            <input type="text" name="businessName" placeholder="Krisha Fashion Wear" value={formData.businessName} onChange={handleChange} required />
                                        </div>
                                        <div className={`${styles.half_field_container} ${styles.address_field}`}>
                                            <label htmlFor="businessDescription">Business Description</label>
                                            <textarea name="businessDescription" placeholder="Description of your business" value={formData.businessDescription} onChange={handleChange} required></textarea>
                                        </div>
                                        <div className={styles.half_field_container}>
                                            <label htmlFor="email">Email Id</label>
                                            <input type="email" name="email" placeholder="rahulpatel@gmail.com" value={formData.email} onChange={handleChange} required />
                                        </div>
                                        <div className={styles.half_field_container}>
                                            <label htmlFor="gstNumber">GST No.</label>
                                            <input type="text" name="gstNumber" placeholder="GST Number" value={formData.gstNumber} onChange={handleChange} required />
                                        </div>
                                        <div className={`${styles.half_field_container} ${styles.address_field} ${styles.business_address_field}`}>
                                            <label htmlFor="businessAddress">Business Address</label>
                                            <textarea name="businessAddress" placeholder="10 Laxmi Nagar Surat 395004, Gujarat" value={formData.businessAddress} onChange={handleChange} required></textarea>
                                        </div>
                                    </div>
                                    <div className={styles.form_btn_container}>
                                        <button type="submit" className={styles.blue_btn} disabled={submitting}>Save</button>
                                        <button type="button" className={styles.transparent_btn} onClick={() => setFormData({
                                            businessName: "",
                                            businessDescription: "",
                                            email: "",
                                            gstNumber: "",
                                            businessAddress: "",
                                        })}>Discard</button>
                                    </div>
                                </form>
                                {error && <p className={styles.error}>{error}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessProfileEdit;
