"use client";
import SubHeader from "@/app/_components/SubHeader";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import styles from "./product_details.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swiper from "swiper";
import * as Yup from "yup";
import DefaultImg from "../../../../public/assets/product/defaultimg.png";
import { Modal } from "react-bootstrap";

const ProductDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ProductId = searchParams.get("query");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sendInquryDetails, setSendInquryDetails] = useState({});

  const profile = localStorage.getItem("profile");
  const authToken = localStorage.getItem("authToken");
  const owner = "Owner's Profile";

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required."),
    phoneNumber: Yup.string().required("Phone Number is required."),
    flatBuilding: Yup.string().required("Flat No./Building Name is required."),
    pincode: Yup.string().required("Pincode is required."),
    city: Yup.string().required("City is require."),
    state: Yup.string().required("State is required."),
    date: Yup.date().required("Select Date is required."),
    additionalNotes: Yup.string().max(2000, "Max 2000 characters allowed."),
  });

  // yyyy/MM/dd formate in convert for
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}products/accessSingleProduct/${ProductId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (ProductId) {
      fetchData();
    }
  }, [ProductId]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        if (!product || !product.title) return; // Exit early if product or product.title is not defined

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}products/filterProducts/?search=${product.title}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        if (data.results.length === 0) {
          // If no matching products, fetch any 4 products
          const anyProductsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}products/filterProducts/`
          );
          if (!anyProductsResponse.ok) {
            throw new Error("Failed to fetch data");
          }
          const anyProductsData = await anyProductsResponse.json();
          console.log("ABCD", anyProductsData);
          setFilteredProducts(
            anyProductsData.results
              .filter((res) => +res.id !== +ProductId)
              .slice(0, 4)
          ); // Get only the first 4 products
        } else {
          // Filter out the current product and get other matching products
          const otherMatchingProducts = data.results.filter(
            (result) => result.title !== product.title
          );
          if (otherMatchingProducts.length > 0) {
            setFilteredProducts(
              otherMatchingProducts
                .filter((res) => +res.id !== +ProductId)
                .slice(0, 4)
            ); // Get only the first 4 other matching products
          } else {
            // If no other matching products, fetch any 4 products
            const anyProductsResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}products/filterProducts/`
            );
            if (!anyProductsResponse.ok) {
              throw new Error("Failed to fetch data");
            }
            const anyProductsData = await anyProductsResponse.json();
            setFilteredProducts(
              anyProductsData.results
                .filter((res) => +res.id !== +ProductId)
                .slice(0, 4)
            ); // Get only the first 4 products
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFilteredProducts();
  }, [product]); // Only 'product' is used as a dependency

  const productImg = product && product.primary_image;

  // Check if product.images is an array before mapping over it
  const additionalImages = Array.isArray(product && product.images)
    ? product && product.images.map((imageObj) => imageObj.image)
    : [];

  // Combine productImg with additionalImages
  const thumbnailImages = [productImg, ...additionalImages].filter(
    (img) => img !== null && img !== undefined
  );

  useEffect(() => {
    // Initialize Swiper
    new Swiper(".swiper-container", {
      slidesPerView: 4,
      spaceBetween: 10,
      // Other Swiper options
    });
  }, []);

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleArrowClick = (direction) => {
    if (direction === "left") {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === 0 ? thumbnailImages.length - 1 : prevIndex - 1
      );
    } else if (direction === "right") {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === thumbnailImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  function truncateTitle(title) {
    const words = title.split(" ");
    if (words.length > 2) {
      return words.slice(0, 2).join(" ") + "...";
    } else {
      return title;
    }
  }
  const ownerProfile = (item) => {
    const id = encodeURIComponent(item);
    router.push(`/pages/owner_profile?query=${id}`);
  };

  let callProductHandler = true; // Set initial value to true

  const productHandler = (item) => {
    if (callProductHandler) {
      const id = encodeURIComponent(item);
      router.push(`/pages/product-details?query=${id}`);
    }
  };

  const toggleHeartColor = (favId) => {
    if (selectedProducts.includes(favId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== favId));
    } else {
      setSelectedProducts([...selectedProducts, favId]);
    }
    callProductHandler = false; // Set to false to prevent productHandler from being called
  };

  const getHeartFillColor = (favId) => {
    return selectedProducts.includes(favId) ? "red" : "currentColor";
  };

  const [modalOpen, setModalOpen] = useState(false);

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const currentUrl = window.location.href;
  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        // Clipboard successfully copied
        setModalOpen(false); // Close the modal
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };

  const handleAddToFavroutes = () => {
    
  }

  return (
    <main>
      <div>
        <SubHeader />
        <div className="product-detail container">
          <div className="product-detail-container">
            <div className="product-image-column">
              <div className="product-image-container">
                <div>
                  <div className="big-image">
                    <Image
                      src={thumbnailImages[selectedImageIndex]}
                      alt="Big Image"
                      height={485}
                      width={461}
                    />
                    <div className="arrows">
                      <button
                        className="arrow left"
                        onClick={() => handleArrowClick("left")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          className="bi bi-chevron-left"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                          />
                        </svg>
                      </button>
                      <button
                        className="arrow right"
                        onClick={() => handleArrowClick("right")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          className="bi bi-chevron-right"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="swiper-container">
                    <div className="swiper-wrapper">
                      {thumbnailImages.map((image, index) => (
                        <div
                          key={index}
                          className="swiper-slide"
                          onClick={() => handleThumbnailClick(index)}
                        >
                          <Image
                            src={image}
                            alt={`Thumbnail ${index}`}
                            height={71}
                            width={68}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="product-info-column">
              <div className="product-info-container">
                <div className="product-info-header">
                  <div className="product-title-price">
                    <div className="product-title">
                      {product && product.title}
                    </div>
                    <div className="product-price">
                      {product && `₹${product.rent_per_day}`}{" "}
                      <span className="product-price-unit">/day</span>
                    </div>
                  </div>
                  <div className="product-like-share">
                    <span onClick={() => handleAddToFavroutes()}>
                      <svg
                        className="product-like-share-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="#717171"
                        class="bi bi-heart"
                        viewBox="0 0 16 16"
                      >
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                      </svg>
                    </span>
                    <span onClick={() => handleButtonClick()}>
                      <svg
                        width="24"
                        height="24"
                        className="product-like-share-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="17.5"
                          cy="4.5"
                          r="2.5"
                          stroke="#717171"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="5.5"
                          cy="11.5"
                          r="2.5"
                          stroke="#717171"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M15 6L8 10"
                          stroke="#717171"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 13.5L15 18"
                          stroke="#717171"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="17.5"
                          cy="19.5"
                          r="2.5"
                          stroke="#717171"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="product-location">
                  <Image
                    loading="lazy"
                    src="/assets/icons/location.png"
                    className="product-location-icon"
                    width={24}
                    height={24}
                    alt=""
                  />
                  <div className="product-location-text">
                    {product && product.address && product.address.address
                      ? product.address.address
                      : product && product.seller && product.seller.address}
                  </div>
                </div>
                <div className="product-owner-label">{owner}</div>
                <div className="product-cta">
                  <div
                    className=" product-inquiry-btn"
                    data-bs-target="#exampleModalToggle"
                    data-bs-toggle="modal"
                  >
                    Send Inquiry
                  </div>
                  <div
                    className="product-owner-info"
                    onClick={() => ownerProfile(product && product.seller.id)}
                  >
                    <div className="product-owner-avatar-name">
                      <Image
                        loading="lazy"
                        src={
                          product && product.seller.profile_photo
                            ? product && product.seller.profile_photo
                            : DefaultImg
                        }
                        className="product-owner-avatar"
                        width={40}
                        height={40}
                        alt=""
                      />
                      <div className="product-owner-name">
                        {product && product.seller.first_name}{" "}
                        {product && product.seller.last_name}
                      </div>
                    </div>

                    <svg
                      width="16"
                      className="product-owner-info-icon"
                      height="24"
                      viewBox="0 0 16 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="14.8429"
                        height="24"
                        transform="matrix(-1 1.41357e-07 5.40669e-08 1 16 0)"
                        fill="white"
                      />
                      <path
                        d="M0.999999 19L6.33061 12.7809C6.7158 12.3316 6.7158 11.6684 6.33061 11.2191L0.999999 5"
                        stroke="#717171"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="product-info-divider" />
                <div className="product-description-label">Description</div>
                <div className="product-description-text">
                  <ul>
                    <li>{product && product.description}</li>
                  </ul>
                </div>
                <div className="product-info-divider" />
                <div className="product-description-label">Rental Rules</div>
                <div className="product-description-text">
                  <ul>
                    {product &&
                      product.default_rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                  </ul>
                </div>
                <div className="product-info-divider" />
                <div className="product-description-label">
                  Rating & Reviews
                </div>

                {product && product.user_reviews.length > 0 ? (
                  <div>
                    <div className="rating-container">
                      <div className="rating-content">
                        <div className="rating-column">
                          <div className="rating-score">
                            <div className="rating-value">4.7</div>
                            <div className="ratingstar">
                              <svg
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.4343 0L13.5243 6.26L20.4343 7.27L15.4343 12.14L16.6143 19.02L10.4343 15.77L4.25433 19.02L5.43433 12.14L0.434326 7.27L7.34433 6.26L10.4343 0Z"
                                  fill="#046BFB"
                                />
                              </svg>
                              <svg
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.4343 0L13.5243 6.26L20.4343 7.27L15.4343 12.14L16.6143 19.02L10.4343 15.77L4.25433 19.02L5.43433 12.14L0.434326 7.27L7.34433 6.26L10.4343 0Z"
                                  fill="#046BFB"
                                />
                              </svg>
                              <svg
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.4343 0L13.5243 6.26L20.4343 7.27L15.4343 12.14L16.6143 19.02L10.4343 15.77L4.25433 19.02L5.43433 12.14L0.434326 7.27L7.34433 6.26L10.4343 0Z"
                                  fill="#046BFB"
                                />
                              </svg>
                              <svg
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.4343 0L13.5243 6.26L20.4343 7.27L15.4343 12.14L16.6143 19.02L10.4343 15.77L4.25433 19.02L5.43433 12.14L0.434326 7.27L7.34433 6.26L10.4343 0Z"
                                  fill="#046BFB"
                                />
                              </svg>
                              <svg
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.4343 0L13.5243 6.26L20.4343 7.27L15.4343 12.14L16.6143 19.02L10.4343 15.77L4.25433 19.02L5.43433 12.14L0.434326 7.27L7.34433 6.26L10.4343 0Z"
                                  fill="#046BFB"
                                />
                              </svg>
                            </div>
                            <div className="rating-count">(578 Reviews)</div>
                          </div>
                        </div>
                        <div className="rating-column-2">
                          <div className="rating-bars">
                            <div className="rating-bar">
                              <div className="rating-bar-bg">
                                <div className="rating-bar-fill" />
                              </div>
                              <div className="rating-bar-bg">
                                <div className="rating-bar-fill rating-bar-fill-2" />
                              </div>
                              <div className="rating-bar-bg">
                                <div className="rating-bar-fill rating-bar-fill-3" />
                              </div>
                              <div className="rating-bar-bg">
                                <div className="rating-bar-fill rating-bar-fill-4" />
                              </div>
                              <div className="rating-bar-bg">
                                <div className="rating-bar-fill rating-bar-fill-5" />
                              </div>
                            </div>
                            <div className="rating-labels">
                              <div className="rating-label">488</div>
                              <div className="rating-label">74</div>
                              <div className="rating-label">14</div>
                              <div className="rating-label">0</div>
                              <div className="rating-label">0</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {product && product.user_reviews.length > 0 ? (
                      user_reviews.map((review, index) => (
                        <div key={index} className="raring-reviews">
                          <div className="raring-reviews-star">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_2448_1531)">
                                <path
                                  d="M7.99992 1.33331L10.0599 5.50665L14.6666 6.17998L11.3333 9.42665L12.1199 14.0133L7.99992 11.8466L3.87992 14.0133L4.66659 9.42665L1.33325 6.17998L5.93992 5.50665L7.99992 1.33331Z"
                                  fill="#E7B66B"
                                  stroke="#E7B66B"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_2448_1531">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_2448_1531)">
                                <path
                                  d="M7.99992 1.33331L10.0599 5.50665L14.6666 6.17998L11.3333 9.42665L12.1199 14.0133L7.99992 11.8466L3.87992 14.0133L4.66659 9.42665L1.33325 6.17998L5.93992 5.50665L7.99992 1.33331Z"
                                  fill="#E7B66B"
                                  stroke="#E7B66B"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_2448_1531">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_2448_1531)">
                                <path
                                  d="M7.99992 1.33331L10.0599 5.50665L14.6666 6.17998L11.3333 9.42665L12.1199 14.0133L7.99992 11.8466L3.87992 14.0133L4.66659 9.42665L1.33325 6.17998L5.93992 5.50665L7.99992 1.33331Z"
                                  fill="#E7B66B"
                                  stroke="#E7B66B"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_2448_1531">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_2448_1531)">
                                <path
                                  d="M7.99992 1.33331L10.0599 5.50665L14.6666 6.17998L11.3333 9.42665L12.1199 14.0133L7.99992 11.8466L3.87992 14.0133L4.66659 9.42665L1.33325 6.17998L5.93992 5.50665L7.99992 1.33331Z"
                                  fill="#E7B66B"
                                  stroke="#E7B66B"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_2448_1531">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_2448_1531)">
                                <path
                                  d="M7.99992 1.33331L10.0599 5.50665L14.6666 6.17998L11.3333 9.42665L12.1199 14.0133L7.99992 11.8466L3.87992 14.0133L4.66659 9.42665L1.33325 6.17998L5.93992 5.50665L7.99992 1.33331Z"
                                  fill="#E7B66B"
                                  stroke="#E7B66B"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_2448_1531">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          <div className="raring-reviews-profile">
                            <svg
                              width="36"
                              height="36"
                              viewBox="0 0 36 36"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                opacity="0.2"
                                cx="18"
                                cy="18"
                                r="18"
                                fill="#5465FF"
                              />
                              <circle
                                cx="4"
                                cy="4"
                                r="4"
                                transform="matrix(-1 0 0 1 22 9)"
                                stroke="#046BFB"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M11 22.9347C11 22.0743 11.5409 21.3068 12.3511 21.0175V21.0175C16.004 19.7128 19.996 19.7128 23.6489 21.0175V21.0175C24.4591 21.3068 25 22.0743 25 22.9347V24.2502C25 25.4376 23.9483 26.3498 22.7728 26.1818L21.8184 26.0455C19.2856 25.6837 16.7144 25.6837 14.1816 26.0455L13.2272 26.1818C12.0517 26.3498 11 25.4376 11 24.2502V22.9347Z"
                                stroke="#046BFB"
                                strokeWidth="1.5"
                              />
                            </svg>
                            <p>{review.user}</p>
                          </div>
                          <p className="raring-reviews-comment">
                            {review.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="no-review-yet">No reviews yet.</p>
                    )}
                  </div>
                ) : (
                  <p className="no-review-yet">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="productinquirymobile">
        <div
          className="product-inquiry-btn2"
          data-bs-target="#exampleModalToggle"
          data-bs-toggle="modal"
        >
          Send Inquiry
        </div>
        <div className="heartforinquiry">
          <svg
            className="product-like-share-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="#717171"
            class="bi bi-heart"
            viewBox="0 0 16 16"
          >
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
          </svg>
        </div>
      </div>

      <div className="related-imagediv">
        <div className="container">
          <h1>Related Products</h1>

          <div className="productmain related-product d-flex align-items-center flex-wrap">
            {filteredProducts.map((data) => {
              return (
                <div
                  key={data.id}
                  className="product1"
                  onClick={() => productHandler(data.id)}
                >
                  <Image
                    id="productimg"
                    src={data.primary_image}
                    alt="product"
                    width={300}
                    height={200}
                  />
                  <div
                    className="favoutite"
                    onClick={() => toggleHeartColor(data.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill={getHeartFillColor(data.id)}
                      className="bi bi-heart-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                      />
                    </svg>
                  </div>
                  <div className="product-description">
                    <p>{truncateTitle(data.title)}</p>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="prices">
                        <h5>
                          <span>Rs {data.rent_per_day}</span>/day
                        </h5>
                        <h6>
                          {" "}
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 10.4167C20 15.8445 13.6 21.5 12 21.5C10.4 21.5 4 15.8445 4 10.4167C4 6.04441 7.58172 2.5 12 2.5C16.4183 2.5 20 6.04441 20 10.4167Z"
                              stroke="#717171"
                              strokeWidth="1.5"
                            />
                            <circle
                              cx="3"
                              cy="3"
                              r="3"
                              transform="matrix(-1 0 0 1 15 7)"
                              stroke="#717171"
                              strokeWidth="1.5"
                            />
                          </svg>
                          {data.seller.address}
                        </h6>
                      </div>
                      <button>Rent</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="modal  fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog  modal-dialog-centered">
          <div className="modal-content inquiry-modal">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id="exampleModalToggleLabel"
                style={{
                  color: "#046BFB",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Send Inquiry
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <Formik
              initialValues={{
                fullName: "",
                phoneNumber: "",
                flatBuilding: "",
                pincode: "",
                city: "",
                state: "",
                date: null,
                additionalNotes: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="modal-body">
                    <div className="modal-inquiry-input">
                      <p>Full Name</p>
                      <Field type="text" name="fullName" />
                      <ErrorMessage
                        name="fullName"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="modal-inquiry-input">
                      <p>Phone Number</p>
                      <Field type="text" name="phoneNumber" />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="modal-inquiry-input">
                      <p>Flat No./ Building Name</p>
                      <Field type="text" name="flatBuilding" />
                      <ErrorMessage
                        name="flatBuilding"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="d-flex gap-4 w-100">
                      <div className="modal-inquiry-input w-100">
                        <p>Pincode</p>
                        <Field type="text" name="pincode" />
                        <ErrorMessage
                          name="pincode"
                          component="div"
                          className="error-message"
                        />
                      </div>
                      <div className="modal-inquiry-input w-100">
                        <p>City</p>
                        <Field type="text" name="city" />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="error-message"
                        />
                      </div>
                    </div>
                    <div className="modal-inquiry-input">
                      <p>State</p>
                      <Field type="text" name="state" />
                      <ErrorMessage
                        name="state"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="modal-inquiry-input calender">
                      <p>Select Date</p>
                      <div className="inquiry-calender">
                        <Field name="date">
                          {({ field, form, meta }) => (
                            <DatePicker
                              selected={field.value}
                              onChange={(val) =>
                                form.setFieldValue(field.name, val)
                              }
                              dateFormat="dd/MM/yyyy"
                              inline
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="date"
                          component="div"
                          className="error-message"
                        />
                      </div>
                    </div>
                    <div className="modal-inquiry-input">
                      <p>Additional Notes</p>
                      <Field
                        as="textarea"
                        name="additionalNotes"
                        placeholder="Add Notes"
                        rows="5"
                      />
                      <span>Max. 2000 characters</span>
                      <ErrorMessage
                        name="additionalNotes"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="submit-inquiry">
                      <button type="submit" disabled={isSubmitting}>
                        Send Inquiry
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <div className="p-4">
          <p>URL: {currentUrl}</p>
          <button
            className={`text-center w-100 d-sm-block mb-lg-0 mb-3 d-none ${styles.share_btn}`}
            onClick={handleCopyToClipboard}
          >
            Copy URL
          </button>
        </div>
      </Modal>
    </main>
  );
};

// export default ProductDetailPage;

const ProductDetailPageWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetailPage />
    </Suspense>
  );
};

export default ProductDetailPageWithSuspense;
