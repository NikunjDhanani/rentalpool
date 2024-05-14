"use client";
import { useMediaQuery } from "@/app/_components/MediaQueryHook/index";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import cancel_btn from "../../../../public/assets/icons/cancel.svg";
import product_image from "../../../../public/assets/product.png";
import styles from "./favorites.module.css";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsData, setProductsData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const isTablet = useMediaQuery("(max-width: 1200px)");
  const itemsPerPage = isTablet ? 8 : 12;

  const handleCancelProduct = (productId) => {
    setProductsData(productsData.filter((product) => product.id !== productId));
  };

  // Calculate total pages based on total records and items per page
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const paginationItems = [];

    paginationItems.push(
      <Pagination.First
        className={`${styles.custom_pagination}`}
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      />
    );

    paginationItems.push(
      <Pagination.Prev
        className={`${styles.custom_pagination}`}
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    if (totalPages <= 9) {
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
    } else {
      if (currentPage > 5) {
        paginationItems.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
      }

      let start, end;

      if (isTablet) {
        start = Math.max(1, currentPage - 2);
        end = Math.min(currentPage + 2, totalPages);
      } else {
        if (currentPage > 6) {
          paginationItems.push(
            <Pagination.Ellipsis key="ellipsis2" disabled />
          );
        }
        start = Math.max(1, currentPage - 3);
        end = Math.min(currentPage + 3, totalPages);
      }

      for (let i = start; i <= end; i++) {
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

      if (currentPage < totalPages - 3) {
        paginationItems.push(<Pagination.Ellipsis key="ellipsis3" disabled />);
      }
    }

    paginationItems.push(
      <Pagination.Next
        className={`${styles.custom_pagination}`}
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );

    paginationItems.push(
      <Pagination.Last
        className={`${styles.custom_pagination}`}
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    );

    return paginationItems;
  };

  const fetchData = () => {
    // Set sample data
    const data = axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}products/favouriteProducts/`,
      method: "GET",
    })
      .then((res) => {
        setProductsData(res.data);
        setTotalRecords(res.data.results.length);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Calculate indexes for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);
  const currentItems = Array.isArray(productsData)
    ? productsData.slice(startIndex, endIndex)
    : [];

  return (
    <main>
      <div className={`${styles.my_favorites}`}>
        <div className={`container ${styles.main_container}`}>
          <div className={`${styles.product_wrapper}`}>
            <h4 className={`${styles.heading}`}>My Favorites</h4>
            {totalRecords !== 0 ? (
              <>
                <div className="row">
                  {currentItems.map((product) => (
                    <div
                      key={product.id}
                      className={`col-xl-3 col-lg-3 col-6 ${styles.product_card}`}
                    >
                      <div
                        className={`position-relative ${styles.product_item}`}
                      >
                        <button
                          className={`${styles.cancel_button}`}
                          onClick={() => handleCancelProduct(product.id)}
                        >
                          <Image src={cancel_btn} alt="button" />
                        </button>
                        <Image
                          className={`${styles.product_image}`}
                          src={product_image}
                          alt="button"
                        />
                        <p className={`mb-0 ${styles.product_name}`}>
                          {product.name}
                        </p>
                        <p className={`${styles.product_price}`}>
                          Rs {product.price}
                          <sub>/days</sub>
                        </p>
                        <button className={`${styles.inquiry_btn}`}>
                          Send Inquiry
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className={`d-flex justify-content-center ${styles.pagination_wrap}`}
                >
                  <Pagination
                    className="d-flex justify-content-center"
                    style={{ gap: 5, marginTop: "30px", marginBottom: "0px" }}
                  >
                    {renderPaginationItems()}
                  </Pagination>
                </div>
              </>
            ) : (
              <h4>No Product Available in Favorites</h4>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
