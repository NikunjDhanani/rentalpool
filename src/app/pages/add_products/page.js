"use client";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import styles from "./add_products.module.css";
import Image from "next/image";
import right_arrow from "../../../../public/assets/icons/Right_arrow.svg";
import add_image from "../../../../public/assets/icons/add_image.svg";
import cancel_img_btn from "../../../../public/assets/icons/cancel_img_btn.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const errorSvg = (
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
  </svg>
);

const AddProduct = () => {
  const authToken = localStorage.getItem("authToken");
  const routes = useRouter();
  const [images, setImages] = useState([]);
  // Function to handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages([...images, ...selectedFiles]);
  };

  // Function to handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFiles = Array.from(e.dataTransfer.files);
    setImages([...images, ...selectedFiles]);
  };

  // Function to remove an image from the preview
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const [getCategoryList, setgetCategoryList] = useState([]);
  const [getSubCategoryList, setgetSubCategoryList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}products/listCategories/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setgetCategoryList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}products/listSubcategories/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setgetSubCategoryList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePriceChange = (e) => {
    let keyvalue = e.target.value;
    const numericValue = keyvalue.replace(/[^0-9.]/g, "");
    formik.setFieldValue("productPrice", numericValue);
  };

  // const validateImageSize = (file) => {
  //   const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  //   if (file && file.size > maxSizeInBytes) {
  //     return "File size is too large. Maximum size allowed is 10MB.";
  //   }
  //   return null;
  // };
  const [imageError, setImageError] = useState(false);
  const formik = useFormik({
    initialValues: {
      id: "",
      productTitle: "",
      productDes: "",
      productPrice: "",
      category: "",
      subCategory: "",
      rentalRules: "",
    },
    validationSchema: Yup.object().shape({
      productTitle: Yup.string().required("Product Title is required."),
      productDes: Yup.string().required("Product Description is required."),
      productPrice: Yup.number().required("Price per Day is required."),
      category: Yup.string().required("Category is required."),
      rentalRules: Yup.string().required("Rental rules is required."),
    }),
    onSubmit: (values, { resetForm }) => {
      setImageError(true);
      const obj = {
        product_images: images,
        title: values.productTitle,
        description: values.productDes,
        primary_image: images[0],
        rent_per_day: values.productPrice,
        rules: values.rentalRules,
        category: values.category,
        sub_category: values.subCategory,
        address: values.address,
      };
      routes.push("/pages/review_product");
      console.log("values====>", obj, values, images);
      // console.log("iamages", images);
      // if (images.length === 0) {
      //   setImgFlag(true);
      // }
    },
  });

  const handleSaveToDraft = () => {
    
  }

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
              <Image
                src={right_arrow}
                alt="right_arrow"
                width="16"
                height="16"
              />
              <p className="mb-0 text-dark">Add Products</p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className={`${styles.add_products_form_wrap}`}>
                <div className={`${styles.add_products_form_heading}`}>
                  <h4 className="text-center mb-0">Add Product</h4>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div
                    className={`position-relative ${styles.product_image_section}`}
                  >
                    <h4 className={`${styles.section_heading}`}>
                      Product Images
                    </h4>
                    <div
                      className={`${styles.custom_file_upload}`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <div
                        className={`text-center ${styles.inner_custom_file_upload}`}
                      >
                        <input
                          type="file"
                          id="imageUpload"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                        />
                        <label htmlFor="imageUpload">
                          <Image src={add_image} alt="Add_Image"></Image>
                          <p className="mb-0">Upload your Images</p>
                          <span>or Drop image here</span>
                          <span style={{ color: "#757575", paddingTop: "6px" }}>
                            Images maximum size should be 25 MB.
                          </span>
                        </label>
                      </div>
                    </div>
                    {/* Image preview */}
                    <div
                      className={`d-flex ${styles.image_preview_wrap}`}
                      style={{ width: "100%", overflow: "auto" }}
                    >
                      {images.map((image, index) => (
                        <div key={index} className={`${styles.image_preview}`}>
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index}`}
                            width="150"
                            height="150"
                          />
                          <button
                            type="button"
                            className={`${styles.cancel_img_btn}`}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <Image src={cancel_img_btn} alt="Cancle" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {imageError && images.length === 0 && (
                      <Form.Text
                        className="text-danger"
                        style={{ marginTop: "1%" }}
                      >
                        {errorSvg}
                        Image required.
                      </Form.Text>
                    )}
                  </div>
                  <div className={`${styles.about_product_section}`}>
                    <Form.Group>
                      <Form.Label className={`${styles.section_heading}`}>
                        Product Title
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="productTitle"
                        className={
                          formik.errors.productTitle &&
                          formik.touched.productTitle
                            ? "border-danger mb-0"
                            : ""
                        }
                        value={formik.values.productTitle}
                        onChange={formik.handleChange}
                        placeholder="Product Title"
                      />
                      {formik.errors.productTitle &&
                      formik.touched.productTitle ? (
                        <Form.Text
                          className="text-danger"
                          style={{ marginTop: "1%" }}
                        >
                          {errorSvg}&nbsp;
                          {formik.errors.productTitle}
                        </Form.Text>
                      ) : null}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className={`${styles.section_heading} mt-3`}>
                        Product Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="8"
                        name="productDes"
                        value={formik.values.productDes}
                        className={
                          formik.errors.productDes && formik.touched.productDes
                            ? "border-danger mb-0"
                            : ""
                        }
                        onChange={formik.handleChange}
                        placeholder="Add your product description"
                      />
                      {formik.errors.productDes &&
                        formik.touched.productDes && (
                          <Form.Text className="text-danger">
                            {errorSvg}&nbsp;
                            {formik.errors.productDes}
                          </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className={`${styles.section_heading} mt-3`}>
                        Price per Day
                      </Form.Label>
                      <div className="flex-nowrap input-group mb-0">
                        <Form.Control
                          type="text"
                          name="productPrice"
                          value={formik.values.productPrice}
                          onChange={(e) => handlePriceChange(e)}
                          className={
                            formik.errors.productDes &&
                            formik.touched.productDes
                              ? "border-danger"
                              : "mb-0"
                          }
                          placeholder="₹  Product Price"
                          style={{
                            borderLeft: "none !important",
                            borderRadius: "0 8px 8px 0 !important",
                            marginBottom: 0,
                          }}
                        />
                      </div>
                      {formik.errors.productPrice &&
                        formik.touched.productPrice && (
                          <Form.Text className="text-danger">
                            {errorSvg}&nbsp;
                            {formik.errors.productPrice}
                          </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className={`${styles.section_heading} mt-3`}>
                        Category
                      </Form.Label>
                      <Form.Select
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Category</option>
                        {getCategoryList.map((opt, i) => (
                          <option value={opt.id} key={i}>
                            {opt.title}
                          </option>
                        ))}
                      </Form.Select>
                      {formik.errors.category &&
                        formik.touched.category && (
                          <Form.Text className="text-danger">
                            {errorSvg}&nbsp;
                            {formik.errors.category}
                          </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className={`${styles.section_heading} mt-3`}>
                        Sub Category
                      </Form.Label>
                      <Form.Select
                        name="subCategory"
                        value={formik.values.subCategory}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Sub Category</option>
                        {getSubCategoryList.map((opt, i) => (
                          <option key={i} value={opt.id}>
                            {opt.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    {/* <div className={styles.customSelect}>
                      <div
                        className={styles.selectedOption}
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <p className="mb-0">
                          {selectedOption
                            ? selectedOption.title
                            : "Select option"}
                        </p>
                        <Image
                          src={isOpen ? upArrow : downArrow}
                          alt="arrow"
                          className={styles.arrowIcon}
                        />
                      </div>
                      {isOpen && (
                        <ul
                          className={styles.options}
                          style={{ height: "300px", overflow: "auto" }}
                        >
                          {getSubCategoryList.map((option) => (
                            <li
                              key={option.value}
                              onClick={() => handleSelect(option)}
                            >
                              {option.title}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div> */}
                  </div>
                  <div className={`${styles.location_section}`}>
                    <h4 className={`${styles.section_heading}`}>Location</h4>
                    <div
                      className={`d-sm-flex d-block ${styles.location_wrap}`}
                    >
                      <div className={`${styles.location_box}`}>
                        <p>10 Laxmi Nagar Surat 395004, Gujarat</p>
                        <div
                          className="d-flex justify-content-center"
                          style={{ gap: "13px" }}
                        >
                          <button className={`${styles.edit_location_btn}`}>
                            Edit
                          </button>
                          <button className={`${styles.delete_location_btn}`}>
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className={`${styles.add_new_address}`}>
                        <svg
                          width="25"
                          height="24"
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.5 5V19"
                            stroke="#717171"
                            strokeWidth="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M5.5 12H19.5"
                            stroke="#717171"
                            strokeWidth="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <p>Add New Address</p>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.about_rules_section}`}>
                    <h4 className={`${styles.section_heading}`}>Rules</h4>
                    <div className={`${styles.form_group}`}>
                      <input type="checkbox" id="rule_1" />
                      <label for="rule_1">No late returns</label>
                    </div>
                    <div className={`${styles.form_group}`}>
                      <input type="checkbox" id="rule_2" />
                      <label for="rule_2">
                        Must be cleaned before returned
                      </label>
                    </div>
                    <div className={`${styles.form_group}`}>
                      <input type="checkbox" id="rule_3" />
                      <label for="rule_3">Must not damage</label>
                    </div>
                    {/* <h4 className={`${styles.section_heading}`} style={{marginTop:"20px"}}>Rental rules</h4>
                                    <textarea rows="8" name='rental_rules' placeholder='Add your Rental rules here...' style={{marginBottom:"0"}}></textarea> */}
                    <Form.Group>
                      <Form.Label
                        className={`${styles.section_heading}`}
                        style={{ marginTop: "10px" }}
                      >
                        Rental rules
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="8"
                        name="rentalRules"
                        value={formik.values.rentalRules}
                        className={
                          formik.errors.rentalRules &&
                          formik.touched.rentalRules
                            ? "border-danger mb-0"
                            : ""
                        }
                        onChange={formik.handleChange}
                        placeholder="Add your Rental rules here..."
                      />
                      {formik.errors.rentalRules &&
                        formik.touched.rentalRules && (
                          <Form.Text className="text-danger">
                            {errorSvg}&nbsp;
                            {formik.errors.rentalRules}
                          </Form.Text>
                        )}
                    </Form.Group>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className={`${styles.review_product_btn}`}
                    >
                      Review product
                    </button>
                    <br />
                    <p className={`${styles.save_to_draft_btn}`} onClick={() => handleSaveToDraft()}>
                      or <span> Save to draft</span>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddProduct;
