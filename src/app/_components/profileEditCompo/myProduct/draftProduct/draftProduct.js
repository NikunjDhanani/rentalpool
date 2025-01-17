"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import toast from "react-hot-toast";
import styles from "./draftProduct.module.css";
import Image from "next/image";

const DraftProduct = () => {
  const authToken = localStorage.getItem("authToken");
  const [activeView, setActiveView] = useState("live");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10; // Set the number of products you want to display per page

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

  const handleStatusUpdate = (statusData) => {
    axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}products/myProducts/`,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${authToken}`,
      },
      data: {
        product_status: status,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          if (statusData === "Removed") {
            toast.success("Product delete sucessfully");
          } else if (statusData === "Removed") {
            toast.success("Product delete sucessfully");
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={styles.my_account_tab_content_container}>
      <div className={styles.edit_profile_container}>
        <div className={styles.edit_profile_tab_container}>
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
                        <div key={index} className={styles.productContainer}>
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
                              <button className={styles.editBtn}>Edit</button>
                              <button
                                className={styles.deleteBtn}
                                onClick={() => handleStatusUpdate("Removed")}
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
      </div>
    </div>
  );
};

export default DraftProduct;
