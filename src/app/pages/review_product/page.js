"use client";
import styles from "./review.module.css";
import Image from "next/image";
import right_arrow from "../../../../public/assets/icons/Right_arrow.svg";

const reviewProduct = () => {
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
                  <h4 className="text-center mb-0">Review Product Details</h4>
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
