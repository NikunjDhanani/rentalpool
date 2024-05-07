"use client";
import React, { useState } from "react";
import styles from "./bussiness_details.module.css";
import Image from "next/image";
import right_arrow from "../../../../public/assets/icons/Right_arrow.svg";
import { Button, Form, Modal } from "react-bootstrap";
import { Field, useFormik } from "formik";
import * as Yup from "yup";
import BussinessService from "@/service/bussiness.service";
import { useRouter } from "next/navigation";

const BussinessDetails = () => {
  const router = useRouter();
  const [modalShow, setModalShow] = useState(false);

  const handlePinCodeChange = (e) => {
    let value = e.target.value;

    // Remove any non-digit characters
    value = value.replace(/\D/g, "");

    // Limit length to 6 characters
    value = value.slice(0, 6);

    formik.setFieldValue("pincode", value);
  };

  const formik = useFormik({
    initialValues: {
      bussiness_name: "",
      bussiness_address: "",
      email: "",
      flatno: "",
      pincode: "",
      city: "",
      state: "",
      gstno: "",
    },
    validationSchema: Yup.object().shape({
      bussiness_name: Yup.string().required("Error Message"),
      bussiness_address: Yup.string().required("Error Message"),
      email: Yup.string().email("Error Message").required("Error Message"),
      flatno: Yup.string().required("Error Message"),
      pincode: Yup.number().required("Error Message"),
      city: Yup.string().required("Error Message"),
      state: Yup.string().required("Error Message"),
      gstno: Yup.string().required("Error Message"),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log("values", values);

      const formData = new FormData();
      formData.append("business_email ", values.email);
      formData.append("gst_no", values.gstno);
      formData.append("business_name ", values.bussiness_name);
      formData.append("business_description", values.bussiness_address);
      formData.append("business_address", values.flatno);
      formData.append("business_city ", values.city);
      formData.append("business_state ", values.state);
      formData.append("business_pincode ", values.pincode);
      console.log("formdata", formData);

      try {
        const response = await BussinessService.AddBussinessDetails(formData);
        console.log("response", response);
        if (response.status === 201) {
          setModalShow(true);
          // open po/pup
        } else {
          setModalShow(false);
          // close popu
        }
      } catch (error) {
        console.log("error", error);
      }
    },
  });

  return (
    <main>
      <div className={`${styles.add_products}`}>
        <div className={`container ${styles.main_container}`}>
          <div className="row">
            <div
              className={`d-flex align-items-center px-md-5 px-2 ${styles.breadcrumes}`}
            >
              <p className="mb-0">Home</p>
              <Image
                src={right_arrow}
                alt="right_arrow"
                width="16"
                height="16"
              />
              <p className="mb-0">Business Details</p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className={`${styles.add_products_form_wrap}`}>
                <div className={`${styles.add_products_form_heading}`}>
                  <h4 className="text-center mb-0">Business Details</h4>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className={`${styles.about_product_section}`}>
                    <Form.Group>
                      <Form.Label className={`${styles.section_heading}`}>
                        Business Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="bussiness_name"
                        className={
                          formik.errors.bussiness_name &&
                          formik.touched.bussiness_name
                            ? "border-danger mb-1"
                            : "mb-3"
                        }
                        value={formik.values.bussiness_name}
                        onChange={formik.handleChange}
                        placeholder="Business Name"
                      />
                      {formik.errors.bussiness_name &&
                      formik.touched.bussiness_name ? (
                        <Form.Text
                          className="text-danger"
                          style={{ marginTop: "1%" }}
                        >
                          <svg
                            width="14"
                            height="12"
                            viewBox="0 0 14 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.1601 8.50833L8.68597 1.08833C8.50506 0.805304 8.25579 0.572383 7.96117 0.411042C7.66655 0.2497 7.33605 0.165131 7.00014 0.165131C6.66423 0.165131 6.33373 0.2497 6.03911 0.411042C5.74448 0.572383 5.49522 0.805304 5.31431 1.08833L0.84014 8.50833C0.682088 8.77179 0.596183 9.07223 0.591063 9.37942C0.585943 9.68661 0.661789 9.98974 0.810973 10.2583C0.983453 10.5606 1.23311 10.8118 1.53442 10.986C1.83574 11.1602 2.17791 11.2513 2.52597 11.25H11.4743C11.8201 11.2537 12.1607 11.1661 12.4618 10.9961C12.7629 10.8261 13.0139 10.5796 13.1893 10.2817C13.3429 10.0103 13.4211 9.7028 13.416 9.39103C13.4109 9.07925 13.3225 8.77451 13.1601 8.50833ZM7.00014 8.91666C6.88477 8.91666 6.77199 8.88245 6.67606 8.81835C6.58013 8.75426 6.50536 8.66315 6.46121 8.55656C6.41706 8.44997 6.40551 8.33268 6.42801 8.21953C6.45052 8.10637 6.50608 8.00243 6.58766 7.92085C6.66924 7.83927 6.77318 7.78371 6.88634 7.7612C6.99949 7.7387 7.11678 7.75025 7.22337 7.7944C7.32996 7.83855 7.42107 7.91332 7.48516 8.00925C7.54926 8.10517 7.58347 8.21796 7.58347 8.33333C7.58347 8.48804 7.52201 8.63641 7.41262 8.74581C7.30322 8.8552 7.15485 8.91666 7.00014 8.91666ZM7.58347 6.58333C7.58347 6.73804 7.52201 6.88641 7.41262 6.99581C7.30322 7.1052 7.15485 7.16666 7.00014 7.16666C6.84543 7.16666 6.69706 7.1052 6.58766 6.99581C6.47826 6.88641 6.41681 6.73804 6.41681 6.58333V4.24999C6.41681 4.09528 6.47826 3.94691 6.58766 3.83752C6.69706 3.72812 6.84543 3.66666 7.00014 3.66666C7.15485 3.66666 7.30322 3.72812 7.41262 3.83752C7.52201 3.94691 7.58347 4.09528 7.58347 4.24999V6.58333Z"
                              fill="#D44848"
                            />
                          </svg>{" "}
                          {formik.errors.bussiness_name}
                        </Form.Text>
                      ) : null}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className={`${styles.section_heading}`}>
                        Business Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="8"
                        name="bussiness_address"
                        value={formik.values.bussiness_address}
                        className={
                          formik.errors.bussiness_address &&
                          formik.touched.bussiness_address
                            ? "border-danger mb-1"
                            : "mb-3"
                        }
                        onChange={formik.handleChange}
                        placeholder="Add your Business description"
                      />
                      {formik.errors.bussiness_address &&
                      formik.touched.bussiness_address ? (
                        <Form.Text
                          className="text-danger"
                          style={{ marginTop: "1%" }}
                        >
                          <svg
                            width="14"
                            height="12"
                            viewBox="0 0 14 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.1601 8.50833L8.68597 1.08833C8.50506 0.805304 8.25579 0.572383 7.96117 0.411042C7.66655 0.2497 7.33605 0.165131 7.00014 0.165131C6.66423 0.165131 6.33373 0.2497 6.03911 0.411042C5.74448 0.572383 5.49522 0.805304 5.31431 1.08833L0.84014 8.50833C0.682088 8.77179 0.596183 9.07223 0.591063 9.37942C0.585943 9.68661 0.661789 9.98974 0.810973 10.2583C0.983453 10.5606 1.23311 10.8118 1.53442 10.986C1.83574 11.1602 2.17791 11.2513 2.52597 11.25H11.4743C11.8201 11.2537 12.1607 11.1661 12.4618 10.9961C12.7629 10.8261 13.0139 10.5796 13.1893 10.2817C13.3429 10.0103 13.4211 9.7028 13.416 9.39103C13.4109 9.07925 13.3225 8.77451 13.1601 8.50833ZM7.00014 8.91666C6.88477 8.91666 6.77199 8.88245 6.67606 8.81835C6.58013 8.75426 6.50536 8.66315 6.46121 8.55656C6.41706 8.44997 6.40551 8.33268 6.42801 8.21953C6.45052 8.10637 6.50608 8.00243 6.58766 7.92085C6.66924 7.83927 6.77318 7.78371 6.88634 7.7612C6.99949 7.7387 7.11678 7.75025 7.22337 7.7944C7.32996 7.83855 7.42107 7.91332 7.48516 8.00925C7.54926 8.10517 7.58347 8.21796 7.58347 8.33333C7.58347 8.48804 7.52201 8.63641 7.41262 8.74581C7.30322 8.8552 7.15485 8.91666 7.00014 8.91666ZM7.58347 6.58333C7.58347 6.73804 7.52201 6.88641 7.41262 6.99581C7.30322 7.1052 7.15485 7.16666 7.00014 7.16666C6.84543 7.16666 6.69706 7.1052 6.58766 6.99581C6.47826 6.88641 6.41681 6.73804 6.41681 6.58333V4.24999C6.41681 4.09528 6.47826 3.94691 6.58766 3.83752C6.69706 3.72812 6.84543 3.66666 7.00014 3.66666C7.15485 3.66666 7.30322 3.72812 7.41262 3.83752C7.52201 3.94691 7.58347 4.09528 7.58347 4.24999V6.58333Z"
                              fill="#D44848"
                            />
                          </svg>{" "}
                          {formik.errors.bussiness_address}
                        </Form.Text>
                      ) : null}
                    </Form.Group>

                    <Form.Group>
                      <Form.Label className={`${styles.section_heading}`}>
                        Email Id
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="email"
                        className={
                          formik.errors.email && formik.touched.email
                            ? "border-danger mb-1"
                            : "mb-3"
                        }
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        placeholder="Email Id"
                      />
                      {formik.errors.email && formik.touched.email ? (
                        <Form.Text
                          className="text-danger"
                          style={{ marginTop: "1%" }}
                        >
                          <svg
                            width="14"
                            height="12"
                            viewBox="0 0 14 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.1601 8.50833L8.68597 1.08833C8.50506 0.805304 8.25579 0.572383 7.96117 0.411042C7.66655 0.2497 7.33605 0.165131 7.00014 0.165131C6.66423 0.165131 6.33373 0.2497 6.03911 0.411042C5.74448 0.572383 5.49522 0.805304 5.31431 1.08833L0.84014 8.50833C0.682088 8.77179 0.596183 9.07223 0.591063 9.37942C0.585943 9.68661 0.661789 9.98974 0.810973 10.2583C0.983453 10.5606 1.23311 10.8118 1.53442 10.986C1.83574 11.1602 2.17791 11.2513 2.52597 11.25H11.4743C11.8201 11.2537 12.1607 11.1661 12.4618 10.9961C12.7629 10.8261 13.0139 10.5796 13.1893 10.2817C13.3429 10.0103 13.4211 9.7028 13.416 9.39103C13.4109 9.07925 13.3225 8.77451 13.1601 8.50833ZM7.00014 8.91666C6.88477 8.91666 6.77199 8.88245 6.67606 8.81835C6.58013 8.75426 6.50536 8.66315 6.46121 8.55656C6.41706 8.44997 6.40551 8.33268 6.42801 8.21953C6.45052 8.10637 6.50608 8.00243 6.58766 7.92085C6.66924 7.83927 6.77318 7.78371 6.88634 7.7612C6.99949 7.7387 7.11678 7.75025 7.22337 7.7944C7.32996 7.83855 7.42107 7.91332 7.48516 8.00925C7.54926 8.10517 7.58347 8.21796 7.58347 8.33333C7.58347 8.48804 7.52201 8.63641 7.41262 8.74581C7.30322 8.8552 7.15485 8.91666 7.00014 8.91666ZM7.58347 6.58333C7.58347 6.73804 7.52201 6.88641 7.41262 6.99581C7.30322 7.1052 7.15485 7.16666 7.00014 7.16666C6.84543 7.16666 6.69706 7.1052 6.58766 6.99581C6.47826 6.88641 6.41681 6.73804 6.41681 6.58333V4.24999C6.41681 4.09528 6.47826 3.94691 6.58766 3.83752C6.69706 3.72812 6.84543 3.66666 7.00014 3.66666C7.15485 3.66666 7.30322 3.72812 7.41262 3.83752C7.52201 3.94691 7.58347 4.09528 7.58347 4.24999V6.58333Z"
                              fill="#D44848"
                            />
                          </svg>{" "}
                          {formik.errors.email}
                        </Form.Text>
                      ) : null}
                    </Form.Group>

                    <Form.Group>
                      <Form.Label className={`${styles.section_heading}`}>
                        Flat No. / Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="flatno"
                        className={
                          formik.errors.flatno && formik.touched.flatno
                            ? "border-danger mb-1"
                            : "mb-3"
                        }
                        value={formik.values.flatno}
                        onChange={formik.handleChange}
                        placeholder="Flat No. / Address"
                      />
                      {formik.errors.flatno && formik.touched.flatno ? (
                        <Form.Text
                          className="text-danger"
                          style={{ marginTop: "1%" }}
                        >
                          <svg
                            width="14"
                            height="12"
                            viewBox="0 0 14 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.1601 8.50833L8.68597 1.08833C8.50506 0.805304 8.25579 0.572383 7.96117 0.411042C7.66655 0.2497 7.33605 0.165131 7.00014 0.165131C6.66423 0.165131 6.33373 0.2497 6.03911 0.411042C5.74448 0.572383 5.49522 0.805304 5.31431 1.08833L0.84014 8.50833C0.682088 8.77179 0.596183 9.07223 0.591063 9.37942C0.585943 9.68661 0.661789 9.98974 0.810973 10.2583C0.983453 10.5606 1.23311 10.8118 1.53442 10.986C1.83574 11.1602 2.17791 11.2513 2.52597 11.25H11.4743C11.8201 11.2537 12.1607 11.1661 12.4618 10.9961C12.7629 10.8261 13.0139 10.5796 13.1893 10.2817C13.3429 10.0103 13.4211 9.7028 13.416 9.39103C13.4109 9.07925 13.3225 8.77451 13.1601 8.50833ZM7.00014 8.91666C6.88477 8.91666 6.77199 8.88245 6.67606 8.81835C6.58013 8.75426 6.50536 8.66315 6.46121 8.55656C6.41706 8.44997 6.40551 8.33268 6.42801 8.21953C6.45052 8.10637 6.50608 8.00243 6.58766 7.92085C6.66924 7.83927 6.77318 7.78371 6.88634 7.7612C6.99949 7.7387 7.11678 7.75025 7.22337 7.7944C7.32996 7.83855 7.42107 7.91332 7.48516 8.00925C7.54926 8.10517 7.58347 8.21796 7.58347 8.33333C7.58347 8.48804 7.52201 8.63641 7.41262 8.74581C7.30322 8.8552 7.15485 8.91666 7.00014 8.91666ZM7.58347 6.58333C7.58347 6.73804 7.52201 6.88641 7.41262 6.99581C7.30322 7.1052 7.15485 7.16666 7.00014 7.16666C6.84543 7.16666 6.69706 7.1052 6.58766 6.99581C6.47826 6.88641 6.41681 6.73804 6.41681 6.58333V4.24999C6.41681 4.09528 6.47826 3.94691 6.58766 3.83752C6.69706 3.72812 6.84543 3.66666 7.00014 3.66666C7.15485 3.66666 7.30322 3.72812 7.41262 3.83752C7.52201 3.94691 7.58347 4.09528 7.58347 4.24999V6.58333Z"
                              fill="#D44848"
                            />
                          </svg>{" "}
                          {formik.errors.flatno}
                        </Form.Text>
                      ) : null}
                    </Form.Group>

                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label className={`${styles.section_heading}`}>
                            Pincode
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="pincode"
                            className={
                              formik.errors.pincode && formik.touched.pincode
                                ? "border-danger mb-1"
                                : "mb-3"
                            }
                            value={formik.values.pincode}
                            onChange={(e) => handlePinCodeChange(e)}
                            placeholder="Pincode"
                          />
                          {formik.errors.pincode && formik.touched.pincode ? (
                            <Form.Text
                              className="text-danger"
                              style={{ marginTop: "1%" }}
                            >
                              <svg
                                width="14"
                                height="12"
                                viewBox="0 0 14 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.1601 8.50833L8.68597 1.08833C8.50506 0.805304 8.25579 0.572383 7.96117 0.411042C7.66655 0.2497 7.33605 0.165131 7.00014 0.165131C6.66423 0.165131 6.33373 0.2497 6.03911 0.411042C5.74448 0.572383 5.49522 0.805304 5.31431 1.08833L0.84014 8.50833C0.682088 8.77179 0.596183 9.07223 0.591063 9.37942C0.585943 9.68661 0.661789 9.98974 0.810973 10.2583C0.983453 10.5606 1.23311 10.8118 1.53442 10.986C1.83574 11.1602 2.17791 11.2513 2.52597 11.25H11.4743C11.8201 11.2537 12.1607 11.1661 12.4618 10.9961C12.7629 10.8261 13.0139 10.5796 13.1893 10.2817C13.3429 10.0103 13.4211 9.7028 13.416 9.39103C13.4109 9.07925 13.3225 8.77451 13.1601 8.50833ZM7.00014 8.91666C6.88477 8.91666 6.77199 8.88245 6.67606 8.81835C6.58013 8.75426 6.50536 8.66315 6.46121 8.55656C6.41706 8.44997 6.40551 8.33268 6.42801 8.21953C6.45052 8.10637 6.50608 8.00243 6.58766 7.92085C6.66924 7.83927 6.77318 7.78371 6.88634 7.7612C6.99949 7.7387 7.11678 7.75025 7.22337 7.7944C7.32996 7.83855 7.42107 7.91332 7.48516 8.00925C7.54926 8.10517 7.58347 8.21796 7.58347 8.33333C7.58347 8.48804 7.52201 8.63641 7.41262 8.74581C7.30322 8.8552 7.15485 8.91666 7.00014 8.91666ZM7.58347 6.58333C7.58347 6.73804 7.52201 6.88641 7.41262 6.99581C7.30322 7.1052 7.15485 7.16666 7.00014 7.16666C6.84543 7.16666 6.69706 7.1052 6.58766 6.99581C6.47826 6.88641 6.41681 6.73804 6.41681 6.58333V4.24999C6.41681 4.09528 6.47826 3.94691 6.58766 3.83752C6.69706 3.72812 6.84543 3.66666 7.00014 3.66666C7.15485 3.66666 7.30322 3.72812 7.41262 3.83752C7.52201 3.94691 7.58347 4.09528 7.58347 4.24999V6.58333Z"
                                  fill="#D44848"
                                />
                              </svg>{" "}
                              {formik.errors.pincode}
                            </Form.Text>
                          ) : null}
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label className={`${styles.section_heading}`}>
                            City
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            className={
                              formik.errors.city && formik.touched.city
                                ? "border-danger mb-1"
                                : "mb-3"
                            }
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            placeholder="City"
                          />
                          {formik.errors.city && formik.touched.city ? (
                            <Form.Text
                              className="text-danger"
                              style={{ marginTop: "1%" }}
                            >
                              <svg
                                width="14"
                                height="12"
                                viewBox="0 0 14 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.1601 8.50833L8.68597 1.08833C8.50506 0.805304 8.25579 0.572383 7.96117 0.411042C7.66655 0.2497 7.33605 0.165131 7.00014 0.165131C6.66423 0.165131 6.33373 0.2497 6.03911 0.411042C5.74448 0.572383 5.49522 0.805304 5.31431 1.08833L0.84014 8.50833C0.682088 8.77179 0.596183 9.07223 0.591063 9.37942C0.585943 9.68661 0.661789 9.98974 0.810973 10.2583C0.983453 10.5606 1.23311 10.8118 1.53442 10.986C1.83574 11.1602 2.17791 11.2513 2.52597 11.25H11.4743C11.8201 11.2537 12.1607 11.1661 12.4618 10.9961C12.7629 10.8261 13.0139 10.5796 13.1893 10.2817C13.3429 10.0103 13.4211 9.7028 13.416 9.39103C13.4109 9.07925 13.3225 8.77451 13.1601 8.50833ZM7.00014 8.91666C6.88477 8.91666 6.77199 8.88245 6.67606 8.81835C6.58013 8.75426 6.50536 8.66315 6.46121 8.55656C6.41706 8.44997 6.40551 8.33268 6.42801 8.21953C6.45052 8.10637 6.50608 8.00243 6.58766 7.92085C6.66924 7.83927 6.77318 7.78371 6.88634 7.7612C6.99949 7.7387 7.11678 7.75025 7.22337 7.7944C7.32996 7.83855 7.42107 7.91332 7.48516 8.00925C7.54926 8.10517 7.58347 8.21796 7.58347 8.33333C7.58347 8.48804 7.52201 8.63641 7.41262 8.74581C7.30322 8.8552 7.15485 8.91666 7.00014 8.91666ZM7.58347 6.58333C7.58347 6.73804 7.52201 6.88641 7.41262 6.99581C7.30322 7.1052 7.15485 7.16666 7.00014 7.16666C6.84543 7.16666 6.69706 7.1052 6.58766 6.99581C6.47826 6.88641 6.41681 6.73804 6.41681 6.58333V4.24999C6.41681 4.09528 6.47826 3.94691 6.58766 3.83752C6.69706 3.72812 6.84543 3.66666 7.00014 3.66666C7.15485 3.66666 7.30322 3.72812 7.41262 3.83752C7.52201 3.94691 7.58347 4.09528 7.58347 4.24999V6.58333Z"
                                  fill="#D44848"
                                />
                              </svg>{" "}
                              {formik.errors.city}
                            </Form.Text>
                          ) : null}
                        </Form.Group>
                      </div>
                    </div>
                    <Form.Group>
                      <Form.Label className={`${styles.section_heading}`}>
                        State
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        className={
                          formik.errors.state && formik.touched.state
                            ? "border-danger mb-1"
                            : "mb-3"
                        }
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        placeholder="State"
                      />
                      {formik.errors.state && formik.touched.state ? (
                        <Form.Text
                          className="text-danger"
                          style={{ marginTop: "1%" }}
                        >
                          <svg
                            width="14"
                            height="12"
                            viewBox="0 0 14 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.1601 8.50833L8.68597 1.08833C8.50506 0.805304 8.25579 0.572383 7.96117 0.411042C7.66655 0.2497 7.33605 0.165131 7.00014 0.165131C6.66423 0.165131 6.33373 0.2497 6.03911 0.411042C5.74448 0.572383 5.49522 0.805304 5.31431 1.08833L0.84014 8.50833C0.682088 8.77179 0.596183 9.07223 0.591063 9.37942C0.585943 9.68661 0.661789 9.98974 0.810973 10.2583C0.983453 10.5606 1.23311 10.8118 1.53442 10.986C1.83574 11.1602 2.17791 11.2513 2.52597 11.25H11.4743C11.8201 11.2537 12.1607 11.1661 12.4618 10.9961C12.7629 10.8261 13.0139 10.5796 13.1893 10.2817C13.3429 10.0103 13.4211 9.7028 13.416 9.39103C13.4109 9.07925 13.3225 8.77451 13.1601 8.50833ZM7.00014 8.91666C6.88477 8.91666 6.77199 8.88245 6.67606 8.81835C6.58013 8.75426 6.50536 8.66315 6.46121 8.55656C6.41706 8.44997 6.40551 8.33268 6.42801 8.21953C6.45052 8.10637 6.50608 8.00243 6.58766 7.92085C6.66924 7.83927 6.77318 7.78371 6.88634 7.7612C6.99949 7.7387 7.11678 7.75025 7.22337 7.7944C7.32996 7.83855 7.42107 7.91332 7.48516 8.00925C7.54926 8.10517 7.58347 8.21796 7.58347 8.33333C7.58347 8.48804 7.52201 8.63641 7.41262 8.74581C7.30322 8.8552 7.15485 8.91666 7.00014 8.91666ZM7.58347 6.58333C7.58347 6.73804 7.52201 6.88641 7.41262 6.99581C7.30322 7.1052 7.15485 7.16666 7.00014 7.16666C6.84543 7.16666 6.69706 7.1052 6.58766 6.99581C6.47826 6.88641 6.41681 6.73804 6.41681 6.58333V4.24999C6.41681 4.09528 6.47826 3.94691 6.58766 3.83752C6.69706 3.72812 6.84543 3.66666 7.00014 3.66666C7.15485 3.66666 7.30322 3.72812 7.41262 3.83752C7.52201 3.94691 7.58347 4.09528 7.58347 4.24999V6.58333Z"
                              fill="#D44848"
                            />
                          </svg>{" "}
                          {formik.errors.state}
                        </Form.Text>
                      ) : null}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className={`${styles.section_heading}`}>
                        GST No.
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="gstno"
                        className={
                          formik.errors.gstno && formik.touched.gstno
                            ? "border-danger mb-1"
                            : "mb-3"
                        }
                        value={formik.values.gstno}
                        onChange={formik.handleChange}
                        placeholder="GST No."
                      />
                      {formik.errors.gstno && formik.touched.gstno ? (
                        <Form.Text
                          className="text-danger"
                          style={{ marginTop: "1%" }}
                        >
                          <svg
                            width="14"
                            height="12"
                            viewBox="0 0 14 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.1601 8.50833L8.68597 1.08833C8.50506 0.805304 8.25579 0.572383 7.96117 0.411042C7.66655 0.2497 7.33605 0.165131 7.00014 0.165131C6.66423 0.165131 6.33373 0.2497 6.03911 0.411042C5.74448 0.572383 5.49522 0.805304 5.31431 1.08833L0.84014 8.50833C0.682088 8.77179 0.596183 9.07223 0.591063 9.37942C0.585943 9.68661 0.661789 9.98974 0.810973 10.2583C0.983453 10.5606 1.23311 10.8118 1.53442 10.986C1.83574 11.1602 2.17791 11.2513 2.52597 11.25H11.4743C11.8201 11.2537 12.1607 11.1661 12.4618 10.9961C12.7629 10.8261 13.0139 10.5796 13.1893 10.2817C13.3429 10.0103 13.4211 9.7028 13.416 9.39103C13.4109 9.07925 13.3225 8.77451 13.1601 8.50833ZM7.00014 8.91666C6.88477 8.91666 6.77199 8.88245 6.67606 8.81835C6.58013 8.75426 6.50536 8.66315 6.46121 8.55656C6.41706 8.44997 6.40551 8.33268 6.42801 8.21953C6.45052 8.10637 6.50608 8.00243 6.58766 7.92085C6.66924 7.83927 6.77318 7.78371 6.88634 7.7612C6.99949 7.7387 7.11678 7.75025 7.22337 7.7944C7.32996 7.83855 7.42107 7.91332 7.48516 8.00925C7.54926 8.10517 7.58347 8.21796 7.58347 8.33333C7.58347 8.48804 7.52201 8.63641 7.41262 8.74581C7.30322 8.8552 7.15485 8.91666 7.00014 8.91666ZM7.58347 6.58333C7.58347 6.73804 7.52201 6.88641 7.41262 6.99581C7.30322 7.1052 7.15485 7.16666 7.00014 7.16666C6.84543 7.16666 6.69706 7.1052 6.58766 6.99581C6.47826 6.88641 6.41681 6.73804 6.41681 6.58333V4.24999C6.41681 4.09528 6.47826 3.94691 6.58766 3.83752C6.69706 3.72812 6.84543 3.66666 7.00014 3.66666C7.15485 3.66666 7.30322 3.72812 7.41262 3.83752C7.52201 3.94691 7.58347 4.09528 7.58347 4.24999V6.58333Z"
                              fill="#D44848"
                            />
                          </svg>{" "}
                          {formik.errors.gstno}
                        </Form.Text>
                      ) : null}
                    </Form.Group>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className={`${styles.review_product_btn}`}
                    >
                      Submit
                    </button>
                    <br />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        //   {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
        onHide={() => setModalShow(false)}
      >
        <Modal.Body className="text-center">
          <h4 style={{ color: "#046BFB" }}>Thank You for Joining with Us!</h4>
          <p style={{ color: "#263238" }}>
            You can upload your product and rent it now.
          </p>
          <div>
            <svg
              width="337"
              height="219"
              viewBox="0 0 337 219"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1901_2609)">
                <path
                  d="M167.083 35.1391H131.991V81.6748H167.083V35.1391Z"
                  fill="#FFD817"
                />
                <path
                  d="M135.967 43.3237H142.851"
                  stroke="#FFA200"
                  stroke-width="0.879"
                  stroke-miterlimit="10"
                />
                <path
                  d="M135.967 50.1889H161.81"
                  stroke="#FFA200"
                  stroke-width="0.879"
                  stroke-miterlimit="10"
                />
                <path
                  d="M135.967 57.054H161.81"
                  stroke="#FFA200"
                  stroke-width="0.879"
                  stroke-miterlimit="10"
                />
                <path
                  d="M135.967 63.9192H161.81"
                  stroke="#FFA200"
                  stroke-width="0.879"
                  stroke-miterlimit="10"
                />
                <path
                  d="M135.967 70.7844H161.81"
                  stroke="#FFA200"
                  stroke-width="0.879"
                  stroke-miterlimit="10"
                />
                <path
                  d="M20.011 64.8435C20.011 64.8435 24.9037 50.0621 26.8578 44.494C28.8119 38.9258 30.1395 27.4093 23.4269 26.1272C16.7144 24.8376 13.9995 34.3117 14.0666 43.1821C14.1263 52.0226 20.011 64.8435 20.011 64.8435Z"
                  fill="#FF7700"
                />
                <path
                  d="M18.8401 88.5399C18.8401 88.5399 13.9698 60.1922 5.06446 63.2111C-3.83341 66.23 4.61695 86.0354 18.8401 88.5399Z"
                  fill="#FF7700"
                />
                <path
                  d="M23.3006 78.9839C23.3006 78.9839 22.4951 69.3383 26.7688 60.9301C31.0424 52.5145 36.405 53.3867 37.479 57.2255C39.8359 65.6038 26.5674 73.5275 23.3006 78.9839Z"
                  fill="#FF7700"
                />
                <path
                  d="M25.6202 102.509C25.6202 102.509 25.3144 94.1976 28.2903 84.1421C31.2662 74.0865 39.1945 70.8739 43.3041 75.6668C45.4894 78.2161 42.6179 89.1885 35.5772 94.1752C29.6627 98.3644 25.6202 102.509 25.6202 102.509Z"
                  fill="#FF7700"
                />
                <path
                  d="M23.4492 109.933C23.4492 109.933 18.3103 96.5531 11.0682 93.2658C3.81867 89.9786 1.88695 95.107 3.72171 100.392C5.54902 105.684 12.6121 110.514 23.4492 109.933Z"
                  fill="#FF7700"
                />
                <path
                  d="M22.7635 26.9024C22.7635 26.9024 13.7015 70.1508 28.2305 121.04"
                  stroke="#995417"
                  stroke-width="1.0223"
                  stroke-miterlimit="10"
                />
                <path
                  d="M37.9261 77.4558C37.6874 77.6943 27.2084 94.3094 24.583 106.221"
                  stroke="#995417"
                  stroke-width="1.0223"
                  stroke-miterlimit="10"
                />
                <path
                  d="M6.31738 95.584C6.31738 95.584 9.90487 102.8 25.6719 111.148"
                  stroke="#995417"
                  stroke-width="1.0223"
                  stroke-miterlimit="10"
                />
                <path
                  d="M4.43066 66.5058C5.61655 74.3922 9.21895 82.778 21.8535 90.0307"
                  stroke="#995417"
                  stroke-width="1.0223"
                  stroke-miterlimit="10"
                />
                <path
                  d="M34.5328 56.5695C34.5328 56.5695 26.5672 65.5069 21.3389 85.7223"
                  stroke="#995417"
                  stroke-width="1.0223"
                  stroke-miterlimit="10"
                />
                <path
                  d="M325.894 113.176C325.894 113.176 324.626 103.448 324.074 99.7658C323.522 96.0835 324.074 88.8008 328.385 88.8008C332.696 88.8008 333.248 94.9877 332.151 100.466C331.055 105.938 325.894 113.176 325.894 113.176Z"
                  fill="#FF7700"
                />
                <path
                  d="M323.798 127.979C323.798 127.979 330.182 111.014 335.336 113.936C340.482 116.865 332.897 128.121 323.798 127.979Z"
                  fill="#FF7700"
                />
                <path
                  d="M322.173 121.532C322.173 121.532 323.821 115.658 322.173 109.941C320.524 104.223 317.108 104.126 315.982 106.377C313.528 111.29 320.8 117.767 322.173 121.532Z"
                  fill="#FF7700"
                />
                <path
                  d="M328.691 89.3674C328.691 89.3674 329.161 117.208 314.117 146.98"
                  stroke="#995417"
                  stroke-width="1.0223"
                  stroke-miterlimit="10"
                />
                <path
                  d="M335.337 116.053C333.666 120.794 330.444 125.557 321.755 128.546"
                  stroke="#995417"
                  stroke-width="1.0223"
                  stroke-miterlimit="10"
                />
                <path
                  d="M317.884 106.325C317.884 106.325 321.755 112.803 322.59 125.937"
                  stroke="#995417"
                  stroke-width="1.0223"
                  stroke-miterlimit="10"
                />
                <path
                  d="M221.925 204.197H326.096C326.096 204.197 331.817 203.385 328.58 197.459C325.35 191.525 323.605 191.525 327.588 178.853C331.563 166.181 338.775 142.813 333.055 141.576C327.334 140.338 321.121 158.295 313.909 159.011C306.697 159.726 322.859 97.2537 305.205 96.6798C287.551 96.1133 280.093 138.601 273.88 146.055C267.667 153.509 258.613 140.808 251.908 150.438C245.202 160.069 247.075 191.242 240.504 188.052C229.525 182.707 221.925 204.197 221.925 204.197Z"
                  fill="#8EAD46"
                />
                <path
                  d="M305.213 96.6798C305.213 96.6798 293.399 166.181 276.744 204.197"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M333.055 141.576C333.055 141.576 316.393 184.563 296.628 204.197"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M255.637 147.196C255.637 147.196 266.056 175.805 265.683 204.19"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M228.973 191.704C228.973 191.704 231.494 198.599 236.342 204.19"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M250.08 154.083C250.08 154.083 252.787 156.133 259.515 159.98"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M247.283 166.181C247.283 166.181 254.108 176.803 264.46 184.757"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M276.036 142.336C276.036 142.336 274.686 172.42 282.211 190.206"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M286.888 114.681C286.888 114.681 285.821 147.196 291.385 159.972"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M312.328 143.938C312.328 143.938 301.372 166.301 286.634 176.677"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M313.827 118.908C313.827 118.908 304.847 127.793 297.665 134.248"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M296.636 100.094L300.962 118.908"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M334.129 155.067C334.129 155.067 328.565 161.649 321.92 166.181"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M327.588 178.853C327.588 178.853 314.312 191.436 303.423 196.452"
                  stroke="#525730"
                  stroke-width="0.8771"
                  stroke-miterlimit="10"
                />
                <path
                  d="M336.59 204.197H212.445"
                  stroke="black"
                  stroke-width="0.9556"
                  stroke-miterlimit="10"
                />
                <path
                  d="M42.4979 152.965V143.946L36.8072 144.252C36.4417 142.902 35.9122 141.62 35.2334 140.435L39.4698 136.626L33.0854 130.245L29.2742 134.479C28.0883 133.801 26.8129 133.264 25.4555 132.906L25.7613 127.219H16.7366L17.0424 132.906C15.6925 133.272 14.4096 133.801 13.2237 134.479L9.41249 130.245L3.02811 136.626L7.26447 140.435C6.58576 141.62 6.04876 142.895 5.69075 144.252L0 143.946V152.965L5.69075 152.66C6.05621 154.009 6.58576 155.291 7.26447 156.476L3.02811 160.285L9.41249 166.666L13.2237 162.432C14.4096 163.11 15.6925 163.647 17.0424 164.005L16.7366 169.692H25.7613L25.4555 164.005C26.8055 163.64 28.0883 163.11 29.2742 162.432L33.0854 166.666L39.4698 160.285L35.2334 156.476C35.9122 155.291 36.4492 154.009 36.8072 152.66L42.4979 152.965ZM21.249 156.335C16.8933 156.335 13.3654 152.809 13.3654 148.456C13.3654 144.102 16.8933 140.577 21.249 140.577C25.6047 140.577 29.1325 144.102 29.1325 148.456C29.1325 152.809 25.6047 156.335 21.249 156.335Z"
                  fill="#D4DAFF"
                />
                <path
                  d="M115.605 93.6907V83.4041L109.109 83.7544C108.691 82.2115 108.087 80.7579 107.311 79.4087L112.144 75.0705L104.865 67.7953L100.524 72.6255C99.1741 71.8503 97.7123 71.2465 96.1759 70.8291L96.5264 64.3366H86.2338L86.5844 70.8291C85.0405 71.2465 83.5861 71.8503 82.2361 72.6255L77.8954 67.7953L70.616 75.0705L75.449 79.4087C74.6733 80.7579 74.0692 82.2189 73.6515 83.7544L67.1553 83.4041V93.6907L73.6515 93.3404C74.0692 94.8833 74.6733 96.3369 75.449 97.6861L70.616 102.024L77.8954 109.299L82.2361 104.469C83.5861 105.244 85.048 105.848 86.5844 106.266L86.2338 112.758H96.5264L96.1759 106.266C97.7198 105.848 99.1741 105.244 100.524 104.469L104.865 109.299L112.144 102.024L107.311 97.6861C108.087 96.3369 108.691 94.8759 109.109 93.3404L115.605 93.6907ZM91.3727 97.5295C86.4054 97.5295 82.3778 93.5043 82.3778 88.5399C82.3778 83.5755 86.4054 79.5504 91.3727 79.5504C96.34 79.5504 100.368 83.5755 100.368 88.5399C100.368 93.5043 96.34 97.5295 91.3727 97.5295Z"
                  fill="#D4DAFF"
                />
                <path
                  d="M25.6273 200.261H241.921C241.921 200.261 230.733 183.847 214.325 179.576C197.916 175.305 193.053 182.372 183.738 166.725C174.422 151.079 165.845 141.426 154.658 141.039C143.47 140.644 125.063 152.6 104.291 139.764C79.9468 124.722 60.182 137.841 59.0633 157.55C57.9445 177.258 20.7794 170.803 25.6273 200.261Z"
                  fill="#ECFFBF"
                />
                <path
                  d="M164.413 200.261C164.413 200.261 168.575 188.439 172.476 189.281C176.376 190.131 178.979 195.908 183.507 191.302C188.034 186.687 185.789 170.594 193.933 169.23C202.078 167.866 197.521 187.261 202.839 183.989C209.387 179.964 216.219 158.608 224.49 160.568C232.762 162.536 232.59 200.261 232.59 200.261H164.413Z"
                  fill="#598048"
                />
                <path
                  d="M139.397 200.261L170.968 138.236L189.249 144.833L210.707 97.1792L232.187 105.133L260.193 40.0364L271.91 44.2554V8.97541L238.348 33.5738L249.61 37.0548L221.454 79.0435L196.827 66.871L164.51 112.713L137.905 99.49L77.3135 200.261H139.397Z"
                  fill="#FFD817"
                />
                <path
                  d="M6.51149 200.5C6.51149 200.5 -2.4535 166.942 4.22177 165.958C10.897 164.974 10.1363 173.024 16.5878 172.666C23.0393 172.309 12.6497 113.958 27.9767 111.513C43.2963 109.068 52.4552 167.329 60.1373 161.396C67.8195 155.462 84.1235 123.224 86.361 200.224L6.51149 200.5Z"
                  fill="#8EAD46"
                />
                <path
                  d="M27.9766 111.506C27.9766 111.506 31.1091 163.133 44.0569 200.492"
                  stroke="#525730"
                  stroke-width="0.9512"
                  stroke-miterlimit="10"
                />
                <path
                  d="M32.8547 112.766C32.8547 112.766 31.5271 122.955 29.5059 128.471"
                  stroke="#525730"
                  stroke-width="0.9512"
                  stroke-miterlimit="10"
                />
                <path
                  d="M19.8467 126.66C19.8467 126.66 21.0176 131.453 31.5265 144.639"
                  stroke="#525730"
                  stroke-width="0.9512"
                  stroke-miterlimit="10"
                />
                <path
                  d="M45.9143 135.143C45.9143 135.143 43.7961 169.953 38.001 179.382"
                  stroke="#525730"
                  stroke-width="0.9512"
                  stroke-miterlimit="10"
                />
                <path
                  d="M4.22168 165.958C4.22168 165.958 8.93539 180.925 25.6944 200.5"
                  stroke="#525730"
                  stroke-width="0.9512"
                  stroke-miterlimit="10"
                />
                <path
                  d="M18.9521 149.343C18.9521 149.343 25.1948 172.13 41.3646 192.092"
                  stroke="#525730"
                  stroke-width="0.9512"
                  stroke-miterlimit="10"
                />
                <path
                  d="M11.7998 170.654C11.7998 170.654 13.2691 177.012 13.8359 184.667"
                  stroke="#525730"
                  stroke-width="0.9512"
                  stroke-miterlimit="10"
                />
                <path
                  d="M2.90918 183.907C2.90918 183.907 10.5689 189.311 21.4507 195.334"
                  stroke="#525730"
                  stroke-width="0.9512"
                  stroke-miterlimit="10"
                />
                <path
                  d="M4.1543 200.261H221.924"
                  stroke="#292E4A"
                  stroke-width="1.0223"
                  stroke-miterlimit="10"
                />
                <path
                  d="M52.6262 227.595C46.1523 227.595 40.8867 222.333 40.8867 215.863V100.429C40.8867 93.959 46.1523 88.6965 52.6262 88.6965H103.03C109.504 88.6965 114.77 93.959 114.77 100.429V215.863C114.77 222.333 109.504 227.595 103.03 227.595H52.6262Z"
                  fill="#3747A3"
                />
                <path
                  d="M58.384 227.595C51.9102 227.595 46.6445 222.333 46.6445 215.863V100.429C46.6445 93.959 51.9102 88.6965 58.384 88.6965H108.788C115.262 88.6965 120.527 93.959 120.527 100.429V215.863C120.527 222.333 115.262 227.595 108.788 227.595H58.384Z"
                  fill="#4A60DB"
                />
                <path
                  d="M108.796 92.2595H97.0785C96.4594 92.2595 95.9075 92.662 95.7285 93.2584L95.1841 95.0026C94.8857 95.9716 93.9833 96.635 92.9689 96.635H74.2185C73.2042 96.635 72.3017 95.9716 72.0034 95.0026L71.4589 93.2584C71.2725 92.6695 70.728 92.2595 70.1089 92.2595H58.3844C53.872 92.2595 50.21 95.9195 50.21 100.429V215.863C50.21 220.372 53.872 224.032 58.3844 224.032H108.788C113.3 224.032 116.963 220.372 116.963 215.863V100.429C116.97 95.9195 113.308 92.2595 108.796 92.2595Z"
                  fill="#292E4A"
                />
                <path
                  d="M88.7842 93.8621H78.3872C78.0739 93.8621 77.8203 93.6087 77.8203 93.2956C77.8203 92.9826 78.0739 92.7291 78.3872 92.7291H88.7842C89.0974 92.7291 89.351 92.9826 89.351 93.2956C89.351 93.6087 89.0974 93.8621 88.7842 93.8621Z"
                  fill="#292E4A"
                />
                <path
                  d="M43.4375 112.087V129.299"
                  stroke="white"
                  stroke-width="1.4467"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M43.4375 134.673V142.716"
                  stroke="white"
                  stroke-width="1.4467"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M204.658 222.243L218.27 144.386H318.794L305.182 222.243H204.658Z"
                  fill="#4A60DB"
                />
                <path
                  d="M302.423 218.956H208.589L221.029 147.673H314.871L302.423 218.956Z"
                  fill="#292E4A"
                />
                <path
                  d="M280.219 202.453C280.219 202.453 281.278 205.375 280.905 206.798C280.532 208.23 279.413 209.467 279.354 211.584C279.294 213.693 279.495 217.42 280.174 217.547C280.845 217.674 280.39 214.752 280.995 214.506C281.599 214.26 283.65 218.799 283.65 218.799H289.743C289.743 218.799 287.633 205.688 287.319 203.452C286.991 201.208 280.219 202.453 280.219 202.453Z"
                  fill="#F9B989"
                />
                <path
                  d="M176.734 167.419C176.734 167.419 166.911 166.614 164.428 165.988C161.944 165.369 155.418 167.419 155.418 167.419L166.352 176.416C166.352 176.416 169.089 174.701 172.073 174.194C175.056 173.688 177.107 173.874 177.107 173.874L176.734 167.419Z"
                  fill="#F9B989"
                />
                <path
                  d="M218.799 111.185C218.68 113.653 218.016 119.802 218.396 122.657C218.777 125.512 220.268 127.502 223.244 127.04C226.213 126.578 228.861 139.123 228.861 139.123L235.245 140.077L239.862 133.078L235.543 125.4C235.543 125.4 238.668 116.925 237.035 111.946C235.402 106.974 223.587 103.068 219.157 104.685C214.727 106.31 218.799 111.185 218.799 111.185Z"
                  fill="#F9B989"
                />
                <path
                  d="M225.08 132.34L232.419 135.24L233.977 138.594V134.308L239.459 128.531L240.906 131.699L255.54 189.654H233.724L220.955 138.594L224.774 136.082L225.08 132.34Z"
                  fill="#FF7700"
                />
                <path
                  d="M267.518 218.792H222.969L231.3 189.654H265.138L267.518 218.792Z"
                  fill="white"
                />
                <path
                  d="M224.774 136.082C226.952 142.015 236.737 183.259 238.244 188.849C239.75 194.44 240.623 209.847 240.623 209.847C240.623 209.847 227.697 210.093 224.774 209.847C221.85 209.601 225.706 191.711 225.579 187.612C225.453 183.512 217.621 162.268 217.621 162.268C217.621 162.268 202.951 175.067 200.713 175.313C198.475 175.559 175.354 174.694 175.354 174.694V166.621C175.354 166.621 194.746 165.503 196.857 164.385C198.968 163.267 211.774 148.485 214.884 144.758C218.002 141.016 220.858 136.231 224.774 136.082Z"
                  fill="#6470B5"
                />
                <path
                  d="M212.938 153.129C211.259 153.316 209.484 163.938 207.344 167.016C205.979 168.969 204.017 171.981 202.839 174.194C207.56 171.041 217.629 162.261 217.629 162.261C216.667 160.024 214.616 152.943 212.938 153.129Z"
                  fill="#495285"
                />
                <path
                  d="M279.712 204.227H288.17L284.844 185.569C283.77 178.682 281.554 172.033 278.295 165.876C272.761 155.44 264.124 139.839 260.581 137.111C258.247 135.314 247.716 131.334 240.906 131.706C240.906 131.706 248.648 179.226 249.767 186.68C250.886 194.134 255.547 208.856 255.547 208.856H271.18L267.525 187.47L263.378 167.486L272.209 179.345L279.712 204.227Z"
                  fill="#6470B5"
                />
                <path
                  d="M263.371 167.478C263.371 167.478 258.053 160.114 256.845 156.014C255.637 151.914 254.98 146.227 255.54 144.647C256.099 143.066 254.235 142.41 253.392 149.216C252.549 156.021 252.549 162.074 256.659 168.783C260.768 175.491 257.874 179.405 261.134 185.368C264.393 191.331 268.585 193.679 268.585 193.679L263.371 167.478Z"
                  fill="#495285"
                />
                <path
                  d="M213.444 103.962C215.578 99.326 220.679 102.091 226.318 102.762C231.956 103.426 237.214 104.149 239.042 108.159C240.869 112.169 238.602 120.346 235.536 125.393C235.536 125.393 233.06 122.307 233.03 120.182C233.008 118.058 235.529 116.686 234.485 114.637C233.433 112.587 231.934 113.884 231.598 114.763C231.263 115.643 231.069 116.575 230.681 116.112C230.293 115.65 231.009 113.75 230.8 112.162C230.591 110.574 229.823 108.226 226.28 108.763C222.738 109.299 219.016 108.509 219.016 108.509L218.792 111.185C218.8 111.185 211.05 109.188 213.444 103.962Z"
                  fill="black"
                />
                <path
                  d="M196.663 27.1633H173.967V57.2553H196.663V27.1633Z"
                  fill="#FFEB8A"
                />
                <path
                  d="M176.54 32.4557H180.985"
                  stroke="#FFA200"
                  stroke-width="0.7146"
                  stroke-miterlimit="10"
                />
                <path
                  d="M176.54 36.8908H193.247"
                  stroke="#FFA200"
                  stroke-width="0.7146"
                  stroke-miterlimit="10"
                />
                <path
                  d="M176.54 41.3334H193.247"
                  stroke="#FFA200"
                  stroke-width="0.7146"
                  stroke-miterlimit="10"
                />
                <path
                  d="M176.54 45.7761H193.247"
                  stroke="#FFA200"
                  stroke-width="0.7146"
                  stroke-miterlimit="10"
                />
                <path
                  d="M176.54 50.2112H193.247"
                  stroke="#FFA200"
                  stroke-width="0.7146"
                  stroke-miterlimit="10"
                />
                <path
                  d="M103.299 194.499L105.029 224.002H57.4072C57.4072 224.002 58.6379 217.421 58.6379 212.106C58.6379 201.484 64.9775 194.499 64.9775 194.499H103.299Z"
                  fill="white"
                />
                <path
                  d="M89.0459 224.002H105.029L103.299 194.499H97.2054L89.0459 224.002Z"
                  fill="#D1D1D1"
                />
                <path
                  d="M118 106.042C118 106.042 117.5 112.751 118.372 113.928C119.245 115.106 118.917 115.852 118.119 116.224C117.321 116.597 117.321 122.806 115.456 123.246C113.592 123.678 111.973 122.27 111.294 124.252C110.608 126.228 109.743 131.013 109.743 131.013L97.9961 130.208L101.293 121.509C101.293 121.509 99.0552 115.047 100.547 109.456C102.039 103.865 117.627 100.452 118 106.042Z"
                  fill="#F59462"
                />
                <path
                  d="M95.1837 127.599L114.844 130.365C115.299 130.432 115.59 130.872 115.478 131.311L114.322 135.791C114.322 135.791 115.314 142.746 114.941 147.964C114.568 153.181 110.339 171.317 109.22 176.908C108.102 182.498 107.229 196.288 104.372 196.415C101.516 196.542 68.3261 196.415 62.6055 196.415C56.8849 196.415 65.462 190.578 68.3261 185.48C71.1826 180.389 74.6657 163.244 79.2675 153.427C83.8694 143.61 94.0575 132.616 94.3111 130.476C94.5647 128.345 94.0874 127.443 95.1837 127.599Z"
                  fill="#6470B5"
                />
                <path
                  d="M93.498 147.546C91.4245 144.93 90.2536 145.586 91.3649 149.961C92.4762 154.337 93.8783 158.258 97.9805 160.867C101.68 163.222 102.575 177.191 108.616 180.776C108.825 179.3 109.026 177.966 109.235 176.923C110.153 172.353 113.143 159.398 114.404 151.966C114.396 151.966 95.2507 149.745 93.498 147.546Z"
                  fill="#495285"
                />
                <path
                  d="M118.491 153.129C118.491 153.129 125.577 162.715 127.874 163.386C130.171 164.057 153.173 165.92 155.157 165.92C157.148 165.92 161.683 168.716 163.488 169.588C165.293 170.46 170.014 174.433 167.59 175.864C165.166 177.295 160.937 177.169 158.513 175.864C156.089 174.56 154.098 172.823 151.927 172.823C149.75 172.823 128.426 173.36 123.772 171.951C117.306 169.99 107.274 159.093 105.641 157.661L118.491 153.129Z"
                  fill="#F59462"
                />
                <path
                  d="M153.128 174.47C153.314 173.054 153.031 171.63 155.089 172.376C157.148 173.121 159.236 174.843 160.87 175.313C162.503 175.782 160.825 177.69 159.52 177.69C158.214 177.69 152.941 175.894 153.128 174.47Z"
                  fill="#F9B989"
                />
                <path
                  d="M152.897 167.061C152.897 167.061 161.332 165.525 163.48 165.876C165.628 166.226 164.234 167.106 161.802 167.859C156.208 169.573 150.63 168.194 152.897 167.061Z"
                  fill="#F9B989"
                />
                <path
                  d="M105.879 113.064C105.879 113.064 103.641 110.828 103.022 113.064C102.403 115.3 104.887 117.164 104.454 118.408C104.022 119.653 102.157 124.498 100.785 124.245C99.4199 123.999 101.158 121.263 99.5393 118.781C97.9208 116.299 95.8101 113.317 97.175 107.727C98.5398 102.136 102.896 103.627 104.387 101.517C105.879 99.408 107.124 97.291 112.964 97.9171C118.804 98.5358 121.415 95.0846 123.906 97.8053C126.389 100.526 126.017 105.49 119.804 106.862C113.591 108.226 112.345 106.363 111.04 107.853C109.727 109.337 107.49 112.937 105.879 113.064Z"
                  fill="#995417"
                />
                <path
                  d="M92.1407 145.988L104.32 159.965L119.923 153.942C119.923 153.942 112.592 142.887 110.101 139.906C107.617 136.924 103.261 133.883 99.532 134.502C95.8103 135.113 89.0977 141.948 92.1407 145.988Z"
                  fill="#6470B5"
                />
                <path
                  d="M107.603 137.446C107.603 137.446 110.974 139.861 115.009 146.682"
                  stroke="#495285"
                  stroke-miterlimit="10"
                />
              </g>
              <defs>
                <clipPath id="clip0_1901_2609">
                  <rect width="337" height="219" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <Button
            style={{ width: "294px", height: "56px" }}
            onClick={() => {
              setModalShow(false);
              router.push("/add_products");
            }}
          >
            Add Product
          </Button>
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default BussinessDetails;
