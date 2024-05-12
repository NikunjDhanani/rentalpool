"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  useRef,
} from "react";
import styles from "./owner_profile.module.css";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import more_btn from "../../../../public/assets/icons/More.svg";
// import share_btn from "../../assets/Share.svg";
// import user_image from "/assets/product/defaultimg.png";
import followers from "../../../../public/assets/icons/Users.svg";
import { Button, Modal, Pagination } from "react-bootstrap";
import { useMediaQuery } from "../../_components/MediaQueryHook";
import OwnerProfileService from "@/service/owener_profile.service";
import DefaultImg from "../../../../public/assets/product/defaultimg.png";
import axios from "axios";

const Oprofile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("query");
  const authToken = localStorage.getItem("authToken");
  const profile = localStorage.getItem("profile");
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
    if (callProductHandler) {
      const id = encodeURIComponent(item);
      router.push(`/pages/product-details?query=${id}`);
    }
  };

  const handleFollowRequest = async () => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}users/sendFollowRequest/`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        data: {
          followed_user: JSON.parse(profile).id,
        },
      });
      if (response.status === 201) {
        setSellerDetails({
          ...sellerDetails,
          iFollowed: true,
          followers: sellerDetails.followers + 1,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleUnFollowRequest = async () => {
    try {
      await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}users/sendUnfollowRequest/${sellerDetails.id}/`,
        method: "GET",
      });
    } catch (error) {
      console.error(error);
    }
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

  return (
    <main>
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
      <div className="owner_profile">
        <div className={`container ${styles.main_container}`}>
          <div className="row pt-3 pb-5">
            <div className={`col-md-4 mb-md-0 mb-2 ${styles.left_col}`}>
              <div className={`p-3 ${styles.user_profile}`}>
                <div
                  className={`d-flex justify-content-end ${styles.more_share_btns}`}
                >
                  <Image
                    class=" dropdown-toggle"
                    type="button"
                    id="dropdownMenu2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    src={more_btn}
                    alt="More"
                  />
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                    <li>
                      <button class="dropdown-item" type="button">
                        <svg
                          width="26"
                          height="26"
                          xmlns="http://www.w3.org/2000/svg"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          style={{ marginRight: "5PX" }}
                        >
                          <path d="M24 23h-24l12-22 12 22zm-22.315-1h20.63l-10.315-18.912-10.315 18.912zm10.315-2c.466 0 .845-.378.845-.845 0-.466-.379-.844-.845-.844-.466 0-.845.378-.845.844 0 .467.379.845.845.845zm.5-11v8h-1v-8h1z" />
                        </svg>
                        Report Owner
                      </button>
                    </li>
                    <li>
                      <button class="dropdown-item" type="button">
                        <svg
                          width="26"
                          height="26"
                          xmlns="http://www.w3.org/2000/svg"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          style={{ marginRight: "5PX" }}
                        >
                          <path d="M24 23h-24l12-22 12 22zm-22.315-1h20.63l-10.315-18.912-10.315 18.912zm10.315-2c.466 0 .845-.378.845-.845 0-.466-.379-.844-.845-.844-.466 0-.845.378-.845.844 0 .467.379.845.845.845zm.5-11v8h-1v-8h1z" />
                        </svg>
                        Block Owner
                      </button>
                    </li>
                  </ul>
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
                    <Image className="me-3" src={followers} alt="Followers" />
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
                  {!sellerDetails.iFollowed ? (
                    <button
                      onClick={() => handleFollowRequest()}
                      className={`text-center text-white border-0 w-100  mb-lg-0 mb-3 ${styles.follower_btn}`}
                    >
                      Follow
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUnFollowRequest()}
                      className={`text-center w-100 d-sm-block mb-lg-0 mb-3 d-none ${styles.share_btn}`}
                    >
                      Following
                    </button>
                  )}
                  <button
                    className={`text-center w-100 d-sm-block d-none ${styles.share_btn}`}
                    onClick={handleButtonClick}
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
