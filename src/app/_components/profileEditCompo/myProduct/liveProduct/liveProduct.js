"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import toast from "react-hot-toast";
import DraftProduct from "../draftProduct/draftProduct";
import PromotProduct from "../promotProduct/promotProduct";
import styles from "./liveProduct.module.css";

const LiveProduct = () => {
  const authToken = localStorage.getItem("authToken");
  const [activeView, setActiveView] = useState("live");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10; // Set the number of products you want to display per page
  const [promotProductDetalis, setPromotProductDetalis] = useState();

  useEffect(() => {
    setLoading(true);
    loadProducts(currentPage);
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

  const handleStatusUpdate = (status) => {
    setLoading(true);
    axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}products/accessSingleProduct/${status}/`,
      method: "DELETE",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${authToken}`,
      },
    })
      .then((response) => {
        console.log(response, "response");
        if (response.status === 204) {
          loadProducts(1);
          toast.success("Product delete sucessfully");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handlePromt = (data) => {
    setPromotProductDetalis(data);
  };
  return (
    <div className={styles.my_account_tab_content_container}>
      <div className={styles.edit_profile_container}>
        <div className={styles.main_tab_content}>
          <div className={styles.edit_profile_heading_container}>
            <h2>My Products</h2>
          </div>

          {!promotProductDetalis && (
            <div className={styles.edit_profile_tab_container}>
              <div className={styles.edit_profile_tab_options}>
                <button
                  className={
                    activeView === "live"
                      ? styles.activeButtonPersonal
                      : styles.personalBusinessBtn
                  }
                  onClick={() => setActiveView("live")}
                >
                  Live Products
                </button>
                <button
                  className={
                    activeView === "draft"
                      ? styles.activeButtonBusiness
                      : styles.personalBusinessBtn
                  }
                  onClick={() => setActiveView("draft")}
                >
                  In Draft
                </button>
              </div>
              {activeView === "live" && (
                <>
                  {loading ? (
                    <div className="text-center mt-5">Loading...</div>
                  ) : products.length === 0 ? (
                    <div className="text-center mt-5">No Product found</div>
                  ) : (
                    <>
                      <div className={styles.myProductMainDiv}>
                        {products.map((product, index) => {
                          return (
                            <div
                              key={index}
                              className={styles.productContainer}
                            >
                              <div className={styles.productImgDiv}>
                                <Image
                                  src={product.primary_image}
                                  alt="product"
                                  height={40}
                                  width={40}
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
                                  {!product.is_promoted ? (
                                    <button
                                      className={styles.promoteBtn}
                                      onClick={() => handlePromt(product)}
                                    >
                                      Promote
                                    </button>
                                  ) : (
                                    <button className={styles.editBtn}>
                                      Promoted
                                    </button>
                                  )}
                                  <button className={styles.editBtn}>
                                    Edit
                                  </button>
                                  <button
                                    className={styles.deleteBtn}
                                    onClick={() =>
                                      handleStatusUpdate(product.id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                    </>
                  )}
                </>
              )}
              {activeView === "draft" && <DraftProduct />}
            </div>
          )}
        </div>
      </div>
      {promotProductDetalis && (
        <PromotProduct
          promotProductDetalis={promotProductDetalis}
          setPromotProductDetalis={setPromotProductDetalis}
          loadProducts={loadProducts}
        />
      )}
    </div>
  );
};

export default LiveProduct;
