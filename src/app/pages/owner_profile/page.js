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
import { Modal, Pagination } from "react-bootstrap";
import { useMediaQuery } from "../../_components/MediaQueryHook";
import OwnerProfileService from "@/service/owener_profile.service";
import DefaultImg from "../../../../public/assets/product/defaultimg.png";
import axios from "axios";
import toast from "react-hot-toast";

const Oprofile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("query");
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

  const handleFollowRequest = async (id) => {
    const authToken =
      localStorage.getItem("authToken") && localStorage.getItem("authToken");
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}users/sendFollowRequest/`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        data: {
          followed_user: id,
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
  const [currentUrl, setCurrentUrl] = useState(null);
  useEffect(() => {
    if (sellerDetails) {
      setCurrentUrl(
        `https://app.rentalspool.com/profile?id=${sellerDetails.id}`
      );
    }
  }, [sellerDetails]);

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

  const handleReportOwner = async () => {
    const authToken =
      localStorage.getItem("authToken") && localStorage.getItem("authToken");
    const userId =
      localStorage.getItem("profile") &&
      JSON.parse(localStorage.getItem("profile"))?.id;
    try {
      const res = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}products/reportSeller/`,
        method: "POST",
        headers: {
          Authorization: `Token ${authToken}`,
        },
        data: {
          reasons: "null",
          seller: +ownerId,
          user: +userId,
        },
      });

      if (res?.status === 201) {
        toast.success("Seller Reported");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlockOwner = async () => {
    const authToken =
      localStorage.getItem("authToken") && localStorage.getItem("authToken");
    const userId =
      localStorage.getItem("profile") &&
      JSON.parse(localStorage.getItem("profile"))?.id;
    try {
      const res = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}products/blockUser/`,
        method: "POST",
        headers: {
          Authorization: `Token ${authToken}`,
        },
        data: {
          reasons: "null",
          user: +userId,
        },
      });

      if (res?.status === 201) {
        toast.success("Seller Blocked");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <div className="p-4">
          <p>URL: {currentUrl}</p>
          <button
            className={`text-center w-100 d-sm-block mb-lg-0 mb-3 d-none`}
            style={{
              background: "#ffffff",
              border: "1px solid #046BFB",
              color: "#046BFB",
            }}
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
                    className=" dropdown-toggle"
                    type="button"
                    id="dropdownMenu2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    src={more_btn}
                    alt="More"
                  />
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                    <li>
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => handleReportOwner()}
                      >
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
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => handleBlockOwner()}
                      >
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
                      onClick={() => handleFollowRequest(sellerDetails.id)}
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
                              {item.title.length > 19
                                ? item.title.slice(0, 19) + "..."
                                : item.title}
                              {item.is_promoted && (
                                <svg
                                  style={{
                                    marginLeft: "5px",
                                    marginBottom: "5px",
                                  }}
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M18.6577 1.49454C18.6505 1.45999 18.6337 1.42819 18.6092 1.40287C18.5846 1.37755 18.5533 1.35975 18.519 1.35157C16.2311 0.792193 10.9448 2.78555 8.08073 5.64844C7.5699 6.15514 7.1042 6.7054 6.68893 7.29297C5.80573 7.21485 4.92252 7.28008 4.16979 7.60821C2.04596 8.54297 1.4276 10.982 1.25534 12.0313C1.24556 12.0887 1.24925 12.1476 1.2661 12.2034C1.28295 12.2591 1.31252 12.3102 1.35246 12.3526C1.3924 12.395 1.44164 12.4276 1.49629 12.4477C1.55095 12.4679 1.60954 12.4751 1.66744 12.4688L5.07799 12.0926C5.08043 12.3497 5.09594 12.6066 5.12448 12.8621C5.14164 13.0396 5.22042 13.2054 5.34713 13.3309L6.66784 14.6484C6.79338 14.775 6.95917 14.8537 7.13659 14.8711C7.39071 14.8995 7.64612 14.915 7.90182 14.9176L7.5276 18.3238C7.52136 18.3817 7.52861 18.4403 7.54879 18.4949C7.56897 18.5495 7.60153 18.5987 7.64392 18.6386C7.6863 18.6786 7.73736 18.7081 7.79308 18.725C7.84881 18.7419 7.90769 18.7456 7.9651 18.7359C9.01237 18.568 11.4557 17.9496 12.385 15.8258C12.7131 15.0731 12.7803 14.1941 12.7046 13.3152C13.2935 12.8999 13.8452 12.4341 14.3534 11.9231C17.2264 9.06446 19.2085 3.8961 18.6577 1.49454ZM11.487 8.5129C11.2246 8.25072 11.0459 7.91663 10.9735 7.55288C10.901 7.18913 10.9381 6.81207 11.08 6.46939C11.2219 6.12671 11.4622 5.8338 11.7705 5.62772C12.0789 5.42163 12.4415 5.31164 12.8124 5.31164C13.1833 5.31164 13.5458 5.42163 13.8542 5.62772C14.1626 5.8338 14.4029 6.12671 14.5448 6.46939C14.6866 6.81207 14.7237 7.18913 14.6512 7.55288C14.5788 7.91663 14.4001 8.25072 14.1378 8.5129C13.9638 8.68711 13.7572 8.82531 13.5298 8.91961C13.3023 9.01391 13.0586 9.06245 12.8124 9.06245C12.5662 9.06245 12.3224 9.01391 12.095 8.91961C11.8675 8.82531 11.6609 8.68711 11.487 8.5129Z"
                                    fill="#EF6239"
                                  />
                                  <path
                                    d="M6.57812 15.6027C6.36406 15.8172 6.0207 15.9008 5.60742 15.9723C4.67891 16.1305 3.85898 15.3281 4.02578 14.3895C4.08945 14.0336 4.27773 13.5348 4.39492 13.4176C4.42054 13.3925 4.43759 13.3599 4.44365 13.3245C4.44971 13.2892 4.44448 13.2528 4.42869 13.2206C4.41291 13.1884 4.38738 13.162 4.35572 13.1451C4.32406 13.1282 4.28789 13.1217 4.25234 13.1266C3.73311 13.1901 3.25005 13.4255 2.88008 13.7953C1.96172 14.7145 1.875 18.125 1.875 18.125C1.875 18.125 5.2875 18.0383 6.20586 17.1191C6.57682 16.7495 6.81253 16.2657 6.875 15.7457C6.88945 15.5824 6.69062 15.4852 6.57812 15.6027Z"
                                    fill="#EF6239"
                                  />
                                </svg>
                              )}
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
