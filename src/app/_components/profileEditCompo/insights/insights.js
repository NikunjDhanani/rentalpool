import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import styles from "./insights.module.css";
import insightTwoStyles from "./insigntsTwo.module.css";
import Image from "next/image";

const Insights = () => {
  const [insightOne, setInsightOne] = useState(true);
  const [insightTwo, setinsightTwo] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Set the number of products you want to display per page
  const [selectedProductData, setSelectedProductData] = useState(null);

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
      console.log(results, "resultsresults");
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
  console.log(products, "products");
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

  const handleViewDetails = async (productId) => {
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
                              width={100}
                              height={100}
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
                                <Image src="/assets/profileEdit/eye.png" width={24} height={24} alt="icon" />
                                <span>{product?.insights?.product_views}</span>
                              </div>
                              <div className={styles.insightsIconDiv}>
                                <Image src="/assets/profileEdit/heart.png" width={24} height={24} alt="icon" />
                                <span>{product?.insights?.favorites}</span>
                              </div>
                              <div className={styles.insightsIconDiv}>
                                <Image src="/assets/profileEdit/msg.png" width={24} height={24} alt="icon" />
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
                    <Image src="/assets/profileEdit/back.png" alt="back" height={8} width={13} />{" "}
                    Back
                  </button>
                </div>
                {selectedProductData && (
                  <>
                    <div className={insightTwoStyles.promotProductImgDescDiv}>
                      <div className={insightTwoStyles.promotProductImg}>
                        <Image
                          src={selectedProductData.primary_image}
                          alt="primary"
                          width={100}
                          height={100}
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
                        <p>{selectedProductData.insights.product_views}</p>
                      </div>
                      <div className={insightTwoStyles.coinTotalTitleDiv}>
                        <p>Favorites</p>
                        <p>{selectedProductData.insights.favorites}</p>
                      </div>
                      <div className={insightTwoStyles.coinTotalDiv}>
                        <p>Chat Initiated</p>
                        <p>{selectedProductData.insights.chat_intialized}</p>
                      </div>
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
