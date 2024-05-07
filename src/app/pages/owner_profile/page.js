"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import styles from "./owner_profile.module.css";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import more_btn from "../../../../public/assets/icons/More.svg";
// import share_btn from "../../assets/Share.svg";
// import user_image from "/assets/product/defaultimg.png";
import followers from "../../../../public/assets/icons/Users.svg";
import { Pagination } from "react-bootstrap";
import { useMediaQuery } from "../../_components/MediaQueryHook";
import OwnerProfileService from "@/service/owener_profile.service";
import DefaultImg from "../../../../public/assets/product/defaultimg.png";

const Oprofile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("query");

  const [isFavorite, setIsFavorite] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sellerDetails, setSellerDetails] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [totalRecords, setTotalRecords] = useState("");
  const isTable = useMediaQuery("(max-width: 1200px)");
  const itemsPerPage = isTable ? 8 : 9;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);
  const currentItems = productsData.slice(startIndex, endIndex);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // onPageChange(page);
  };

  const renderPaginationItems = () => {
    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <Pagination.Item
          className={`${styles.custom_pagination}`}
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return paginationItems;
  };


  const getHeartFillColor = (productId) => {
    return selectedProducts.includes(productId) ? "red" : "currentColor";
  };

  const fetchSellerDetails = useCallback(async () => {
    const response = await OwnerProfileService.fetchSellerDetails(ownerId);
    setSellerDetails(response);
  }, [ownerId]); // Include 'ownerId' in the dependency array

  const fetchProducts = useCallback(async () => {
    const productRes = await OwnerProfileService.fetchProductsItem(
      ownerId,
      currentPage
    );
    setProductsData(productRes.results);
    setTotalRecords(productRes.count);
  }, [currentPage, ownerId]); // Include 'currentPage' and 'ownerId' in the dependency array

  useEffect(() => {
    fetchSellerDetails();
    fetchProducts();
  }, [fetchSellerDetails, fetchProducts]);

  let callProductHandler = true; 

  const toggleHeartColor = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
    callProductHandler = false; // Set to false to prevent productHandler from being called
  };

  const productHandler = (item) => {
    if(callProductHandler){
      const id = encodeURIComponent(item);
    router.push(`/pages/product-details?query=${id}`);
    }
  };

  return (
    <main>
      
      <div className="owner_profile">
        <div className={`container ${styles.main_container}`}>
          <div className="row pt-3 pb-5">
            <div className={`col-md-4 mb-md-0 mb-2 ${styles.left_col}`}>
              <div className={`p-3 ${styles.user_profile}`}>
                <div
                  className={`d-flex justify-content-end ${styles.more_share_btns}`}
                >
                  <button className="d-sm-none d-block me-3 bg-white p-0 border-0">
                    {/* <Image src={share_btn} alt='Share' /> */}
                  </button>
                  <button className="bg-white p-0 border-0">
                    <Image src={more_btn} alt='More' />
                  </button>
                </div>
                <div className={`text-center ${styles.user_image}`}>
                  <Image
                    className="rounded-circle"
                    src={
                      sellerDetails.profile_photo
                        ? sellerDetails.profile_photo
                        : DefaultImg
                    }
                    width="150"
                    height="150"
                    alt="User Image"
                  />
                </div>
                <h3 className={`pt-3 text-center ${styles.user_name}`}>
                  {sellerDetails.first_name} {sellerDetails.last_name}
                </h3>
                <div
                  className={`d-lg-flex d-sm-block d-flex pt-3 justify-content-center ${styles.follower_following}`}
                >
                  <div
                    className={`d-flex justify-content-center ${styles.user_followers}`}
                  >
                    <Image className='me-3' src={followers} alt="Followers" />
                    <h4 className={`${styles.follower_count}`}>
                      {sellerDetails.followers}
                    </h4>
                    <p>Followers</p>
                  </div>
                  <span
                    className={`mx-xl-2 mx-1 d-lg-block d-sm-none d-block ${styles.separation}`}
                  ></span>
                  <div
                    className={`d-flex justify-content-center ${styles.user_followers}`}
                  >
                    <h4 className={`${styles.follower_count}`}>
                      {sellerDetails.following}
                    </h4>
                    <p>Following</p>
                  </div>
                </div>
                <div className={`pt-3 ${styles.user_info}`}>
                  <h4 className={`${styles.follower_count}`}>
                    {sellerDetails.business_name}
                  </h4>
                  <p>{sellerDetails.business_description}</p>
                </div>
                <div
                  className={`d-lg-flex d-block ${styles.follower_share_btn}`}
                >
                  <button
                    className={`text-center text-white border-0 w-100  mb-lg-0 mb-3 ${styles.follower_btn}`}
                  >
                    Follow
                  </button>
                  <button
                    className={`text-center w-100 d-sm-block d-none ${styles.share_btn}`}
                  >
                    Share Profile
                  </button>
                </div>
              </div>
            </div>
            <div className={`col-md-8 ${styles.right_col}`}>
              <section className={`${styles.searchResultContainer}`}>
                <div className="row">
                  {currentItems &&
                    currentItems.map((item, index) => {
                      return (
                        <div
                          className={`col-xl-4 col-6 ${styles.card_col}`}
                          key={index}
                          onClick={() => productHandler(item.id)}
                        >
                          <div className={`${styles.cardItem}`}>
                            <div className="text-center position-relative">
                              <div
                                id="favouriteid"
                                className="favoutite"
                                onClick={() => toggleHeartColor(item.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill={getHeartFillColor(item.id)}
                                  className="bi bi-heart-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                                  />
                                </svg>
                              </div>
                              <Image
                                className={`w-100 rounded ${styles.product_image}`}
                                src={item.primary_image_thumbnail}
                                alt="girlpic"
                                width={190}
                                height={220}
                              />
                            </div>
                            <p className={`pt-3 ${styles.cardText}`}>
                              {item.title.length > 20
                                ? item.title.slice(0, 20) + "..."
                                : item.title}
                            </p>
                            <div
                              className={`align-items-center ${styles.cardContent}`}
                            >
                              <div className={styles.innerContent}>
                                <p className={`mb-0 ${styles.textCurrency}`}>
                                  {item.rent_per_day}
                                  <span className={styles.suffixtext}>
                                    /days
                                  </span>
                                </p>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: 3 }}
                                >
                                  <svg
                                    width="15"
                                    height="15"
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
                                  <p className={`mb-0 ${styles.locationName}`}>
                                    {item.seller.address}
                                  </p>
                                </div>
                              </div>
                              <button
                                className={`d-sm-block d-none ${styles.rentbutton}`}
                              >
                                <p>Rent</p>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div
                  className={`d-flex justify-content-center ${styles.pagination_wrap}`}
                >
                  <Pagination
                    className="d-flex justify-content-center"
                    style={{ gap: 5, marginTop: "30px", marginBottom: "0px" }}
                  >
                    <Pagination.First
                      className={`${styles.custom_pagination}`}
                      onClick={() => handlePageChange(1)}
                    />
                    <Pagination.Prev
                      className={`${styles.custom_pagination}`}
                      onClick={() => handlePageChange(currentPage - 1)}
                    />

                    {renderPaginationItems()}
                    <Pagination.Next
                      className={`${styles.custom_pagination}`}
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                    <Pagination.Last
                      className={`${styles.custom_pagination}`}
                      onClick={() => handlePageChange(totalPages)}
                    />
                  </Pagination>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// export default Oprofile;

const OprofileWithSuspense = () => {
  return (
     <Suspense fallback={<div>Loading...</div>}>
       <Oprofile />
     </Suspense>
  );
 };
 
 export default OprofileWithSuspense;
