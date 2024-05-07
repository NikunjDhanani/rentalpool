"use client";
import styles from "./liveProduct.module.css"
import DraftProduct from "../draftProduct/draftProduct"
import { useState, useEffect } from "react";
import axios from "axios";
import { Pagination } from "react-bootstrap";

const LiveProduct = () => {

  const [activeView, setActiveView] = useState('live');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Set the number of products you want to display per page

  useEffect(() => {
    loadProducts(currentPage);
  }, [currentPage]);

  const loadProducts = async (page) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}products/myProducts/?page=${page}`);
      const { results, count } = response.data;
      setProducts(results);

      // Calculate the total number of pages based on the count of products and items per page
      const calculatedTotalPages = Math.ceil(count / itemsPerPage);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const handleSubmit = async (event) => {

    axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}products/myProducts`,
      method: "POST",
      headers: {

      },
      data: {},
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        console.error(err);
      })
  };


  return (
    <div className={styles.my_account_tab_content_container}>
      <div className={styles.edit_profile_container}>

        <div className={styles.main_tab_content}>

          <div className={styles.edit_profile_heading_container}>
            <h2>My Products</h2>
          </div>

          <div className={styles.edit_profile_tab_container}>
            <div className={styles.edit_profile_tab_options}>
              <button
                className={activeView === 'live' ? styles.activeButtonPersonal : styles.personalBusinessBtn}
                onClick={() => setActiveView('live')}
              >
                Live Products
              </button>
              <button
                className={activeView === 'draft' ? styles.activeButtonBusiness : styles.personalBusinessBtn}
                onClick={() => setActiveView('draft')}
              >
                In Draft
              </button>
            </div >
            {activeView === 'live' && (
              <>
                <div className={styles.myProductMainDiv}>
                  {products.map((product, index) => {
                    // if (product.status === 'Published') {
                    //   return (
                        <div key={index} className={styles.productContainer}>
                          <div className={styles.productImgDiv}>
                            <img src={product.primary_image_thumbnail} alt={product.title} className={styles.productImage} />
                          </div>
                          <div className={styles.productdescriptionWithBtn}>
                            <div className={styles.productTitleWithDesc}>
                              <h3 className={styles.productTitle}>{product.title}</h3>
                              <p className={styles.productPrice}>RS {product.rent_per_day}<span>/day</span></p>
                            </div>
                            <div className={styles.productBtnDiv}>
                              <button className={styles.promoteBtn}>Promote</button>
                              <button className={styles.editBtn}>Edit</button>
                              <button className={styles.deleteBtn}>Delete</button>
                            </div>
                          </div>
                        </div>
                    //   )
                    // }
                  })}
                </div>
                <div className={styles.paginationContainer}>
                  <Pagination className="d-flex justify-content-center" style={{ gap: 5, marginTop: '30px', marginBottom: '0px' }}>
                    {renderPaginationItems()}
                  </Pagination>
                </div>
              </>
            )}
            {activeView === 'draft' && <DraftProduct />}
          </div >
        </div >
      </div >
    </div >
  )
}

export default LiveProduct;