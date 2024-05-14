"use client";
import Image from "next/image";
import right_arrow from "../../../../public/assets/icons/Right_arrow.svg";
import styles from "./review.module.css";
import { useRouter } from 'next/router';
import React from "react";

const reviewProduct = () => {
  const product = [];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  // const { obj, values, images } = router.query;
  // console.log(obj, values, images ,'obj, values, images')

  const parsedObj = {
    "product_images": [
      { "image": "https://rentalspoolbucket.s3.amazonaws.com/home/posters/1_Kf3UUxU.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6N4LJWPPMN2G2XXA%2F20240514%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240514T053138Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=43964a7e6652b7ab918ce3a440f3a61871e383ec7d589fcb28016758080c4298" },
      { "image": "https://rentalspoolbucket.s3.amazonaws.com/home/posters/3_p46nzhl.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6N4LJWPPMN2G2XXA%2F20240514%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240514T053138Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=2e4142ebd5ed1c1de12d7c0a69170f78b17cf5e9ebd233b8145a7ace3b843172" }
    ],
    "productTitle": "Red Saree",
    "productDes": "Free Size",
    "productPrice": "350",
    "category": "2",
    "subCategory": "21",
    "rentalRules": "50% payment first",
    "address": "Surat"
  };

  const productImg = product && product.primary_image;

  // Check if product.images is an array before mapping over it
  const additionalImages = Array.isArray(product && product.images)
    ? product && product.images.map((imageObj) => imageObj.image)
    : [];

  // Combine productImg with additionalImages
  const thumbnailImages = [productImg, ...additionalImages].filter(
    (img) => img !== null && img !== undefined
  );

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
              <p className="mb-0">Add Products</p>
              <Image
                src={right_arrow}
                alt="right_arrow"
                width="16"
                height="16"
              />
              <p className="mb-0 text-dark">Review Product</p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className={`${styles.add_products_form_wrap}`}>
                <div className={`${styles.add_products_form_heading}`}>
                  <h4 className="text-center mb-2">Review Product Details</h4>
                </div>
                <div>
                  <div className="big-image" style={{ width: '70%', transform: 'translate(18%, 0px)' }}>
                    <Image
                      src={thumbnailImages[selectedImageIndex]}
                      alt="Big Image"
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
                <div className={`${styles.part_details}`}>
                  <p className={`${styles.product_title}`}>{parsedObj?.productTitle}</p>
                  <div className="product-price">
                    {parsedObj && `₹${parsedObj.productPrice}`}{" "}
                    <span className="product-price-unit">/day</span>
                  </div>
                  <div>
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
                    <span className={`${styles.product_address}`}>{parsedObj.address}</span>
                  </div>
                </div>
                <div className={`${styles.part_details}`}>
                  <p className={`${styles.part_details_title}`}>Description</p>
                  <ul>
                    <li className={`${styles.part_details_desc}`}>{parsedObj?.productDes}</li>
                  </ul>
                </div>
                <div className={`${styles.part_details}`}>
                  <p className={`${styles.part_details_title}`}>Rental Rules</p>
                  <ul>
                    <li className={`${styles.part_details_desc}`}>{parsedObj?.rentalRules}</li>
                  </ul>
                </div>
                <div className="text-center">
                  <button className={`${styles.review_btn_submit}`}>
                    Upload Product
                  </button>
                  <button className={`${styles.review_btn_submit}`}>
                    Edit Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default reviewProduct;
