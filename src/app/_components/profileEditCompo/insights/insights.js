import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import styles from "./insights.module.css";
import insightTwoStyles from "./insigntsTwo.module.css";
import Image from "next/image";

const Insights = () => {
  const [insightOne, setInsightOne] = useState(true);
  const [insightTwo, setinsightTwo] = useState(false);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Set the number of products you want to display per page
  const [selectedProductData, setSelectedProductData] = useState(null);
  const [reiveData, setReiveData] = useState([]);

  useEffect(() => {
    setLoading(true);
    loadProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadProducts = async (page) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}products/myProducts/?page=${page}`
      );
      const { results, count } = response.data;
      setProducts(results);

      // Calculate the total number of pages based on the count of products and items per page
      const calculatedTotalPages = Math.ceil(count / itemsPerPage);
      setTotalPages(calculatedTotalPages);

      // Fetch product insights for each product
      const fetchInsightsPromises = results.map(async (product) => {
        const insightResponse = await handleViewDetails(product.id);
        return { ...product, insights: insightResponse }; // Add insights data to the product object
      });

      // Wait for all the insights to be fetched
      const productsWithInsights = await Promise.all(fetchInsightsPromises);

      // Update the products array with insights
      setProducts(productsWithInsights);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const renderPaginationItems = () => {
    const paginationItems = [];

    paginationItems.push(
      <Pagination.First
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      />
    );

    paginationItems.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    paginationItems.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );

    paginationItems.push(
      <Pagination.Last
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    );

    return paginationItems;
  };

  const getProductReview = async () => {
    const authToken = localStorage.getItem("authToken");
    axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}products/getProductReviews/${selectedProductData.id}/`,
      method: "GET",
      headers: {
        Authorization: `Token ${authToken}`,
      },
    })
      .then((response) => {
        setReiveData(response.data);
        console.log(response.data, "responseresponse");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
      });
  };

  useEffect(() => {
    if (selectedProductData) {
      getProductReview();
    }
  }, [selectedProductData]);

  const handleViewDetails = async (productId) => {
    const authToken = localStorage.getItem("authToken");
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}products/getProductInsights/${productId}`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const backBtnClick = () => {
    setInsightOne(true);
    setinsightTwo(false);
  };

  const handleViewDetailsProduct = (product) => {
    setInsightOne(false);
    setinsightTwo(true);
    setSelectedProductData(product);
  };
  return (
    <div className={styles.my_account_tab_content_container}>
      <div className={styles.edit_profile_container}>
        <div className={styles.main_tab_content}>
          <div className={styles.edit_profile_heading_container}>
            <h2>Insights</h2>
          </div>
          {insightOne && (
            <>
              {loading ? (
                <div className="text-center mt-5">Loading...</div>
              ) : products.length === 0 ? (
                <div className="text-center mt-5">No Product found</div>
              ) : (
                <>
                  <div className={styles.edit_profile_tab_container}>
                    <div className={styles.myProductMainDiv}>
                      {products.map((product, index) => (
                        <div key={index} className={styles.productContainer}>
                          <div className={styles.productImgDiv}>
                            <Image
                              src={product.primary_image_thumbnail}
                              alt={product.title}
                              width={150}
                              height={150}
                            />
                          </div>
                          <div className={styles.productdescriptionWithBtn}>
                            <div className={styles.productTitleWithDesc}>
                              <h3 className={styles.productTitle}>
                                {product.title}
                              </h3>
                              <p className={styles.productPrice}>
                                RS {product.rent_per_day}
                                <span>/day</span>
                              </p>
                            </div>
                            <div className={styles.productBtnDiv}>
                              <div className={styles.insightsIconDiv}>
                                <Image
                                  src="/assets/profileEdit/eye.png"
                                  width={24}
                                  height={24}
                                  alt="icon"
                                />
                                <span>{product?.insights?.product_views}</span>
                              </div>
                              <div className={styles.insightsIconDiv}>
                                <Image
                                  src="/assets/profileEdit/heart.png"
                                  width={24}
                                  height={24}
                                  alt="icon"
                                />
                                <span>{product?.insights?.favorites}</span>
                              </div>
                              <div className={styles.insightsIconDiv}>
                                <Image
                                  src="/assets/profileEdit/msg.png"
                                  width={24}
                                  height={24}
                                  alt="icon"
                                />
                                <span>
                                  {product?.insights?.chat_intialized}
                                </span>
                              </div>
                              <button
                                className={styles.viewBtn}
                                onClick={() =>
                                  handleViewDetailsProduct(product)
                                }
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.paginationContainer}>
                      <Pagination
                        className="d-flex justify-content-center"
                        style={{
                          gap: 5,
                          marginTop: "30px",
                          marginBottom: "0px",
                        }}
                      >
                        {renderPaginationItems()}
                      </Pagination>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {insightTwo ? (
            <div>
              <div className={insightTwoStyles.edit_profile_tab_container}>
                <div className={insightTwoStyles.backBtnDiv}>
                  <button
                    className={insightTwoStyles.backBtn}
                    onClick={backBtnClick}
                  >
                    <Image
                      src="/assets/profileEdit/back.png"
                      alt="back"
                      height={8}
                      width={13}
                    />{" "}
                    Back
                  </button>
                </div>
                {selectedProductData && (
                  <>
                    <div className={insightTwoStyles.promotProductImgDescDiv}>
                      <div className={insightTwoStyles.promotProductImg}>
                        <img
                          src={selectedProductData.primary_image}
                          alt="primary"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                      <h3 className={insightTwoStyles.productTitle}>
                        {selectedProductData.title}
                      </h3>
                    </div>

                    <div className={insightTwoStyles.coinTotalDetailDiv}>
                      <p className={insightTwoStyles.availableCoinTitle}>
                        Overview
                      </p>
                      <div className={insightTwoStyles.coinTotalTitleDiv}>
                        <p>Product Views</p>
                        <p>{selectedProductData?.insights?.product_views}</p>
                      </div>
                      <div className={insightTwoStyles.coinTotalTitleDiv}>
                        <p>Favorites</p>
                        <p>{selectedProductData.insights.favorites}</p>
                      </div>
                      <div className={insightTwoStyles.coinTotalDiv}>
                        <p>Chat Initiated</p>
                        <p>{selectedProductData.insights.chat_intialized}</p>
                      </div>
                      {reiveData && reiveData.length > 0 ? (
                        <div>
                          <div className="rating-container">
                            <div className="rating-content">
                              <div className="rating-column">
                                <div className="rating-score">
                                  <div className="rating-value">
                                    {reiveData?.[0]?.avg_review?.avg}
                                  </div>
                                  <div className="ratingstar">
                                    {Array(reiveData?.[0]?.avg_review?.avg)
                                      .fill(0)
                                      .map((_, index) => (
                                        <svg
                                          key={index}
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
                                      ))}
                                  </div>
                                  <div className="rating-count">
                                    (578 Reviews)
                                  </div>
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
                                    <div className="rating-label">
                                      {reiveData?.[0]?.avg_review?.stars["1"]}
                                    </div>
                                    <div className="rating-label">
                                      {reiveData?.[0]?.avg_review?.stars["2"]}
                                    </div>
                                    <div className="rating-label">
                                      {reiveData?.[0]?.avg_review?.stars["3"]}
                                    </div>
                                    <div className="rating-label">
                                      {reiveData?.[0]?.avg_review?.stars["4"]}
                                    </div>
                                    <div className="rating-label">
                                      {reiveData?.[0]?.avg_review?.stars["5"]}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {reiveData && reiveData.length > 0 ? (
                            reiveData.map((review, index) => (
                              <div
                                key={index}
                                className="raring-reviews mt-5"
                                style={{
                                  borderBottom:
                                    index !==
                                    selectedProductData.user_reviews.length - 1
                                      ? "2px solid #F2F6FB"
                                      : undefined,
                                }}
                              >
                                <div className="raring-reviews-star">
                                  {Array(reiveData[0]?.stars)
                                    .fill(0)
                                    .map((_, index) => (
                                      <svg
                                        key={index}
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
                                            <rect
                                              width="16"
                                              height="16"
                                              fill="white"
                                            />
                                          </clipPath>
                                        </defs>
                                      </svg>
                                    ))}
                                </div>
                                <div className="raring-reviews-profile">
                                  {review.user_profile_image ? (
                                    <img
                                      src={review.user_profile_image}
                                      style={{
                                        height: "36px",
                                        width: "36px",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  ) : (
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
                                  )}
                                  <p>{review.user}</p>
                                </div>
                                <p className="raring-reviews-comment">
                                  {review.message}
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
                  </>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
