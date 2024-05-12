import styles from "./promotProduct.module.css";

const PromotProduct = () => {
  const data = [
    {
      img: "/assets/profileEdit/promotProduct.png",
      title: "Red lehnga with...",
      price: "1500",
    },
  ];

  return (
    <div className={styles.my_account_tab_content_container}>
      <div className={styles.edit_profile_container}>
        <div className={styles.main_tab_content}>
          <div className={styles.edit_profile_tab_container}>
            <div className={styles.backBtnDiv}>
              <button className={styles.backBtn}>
                <img src="/assets/profileEdit/back.png" />
                Back
              </button>
            </div>
            <h2 className={styles.referAndEarnTitle}>Promote your product</h2>
            <p className={styles.promotProductDescription}>
              Reach more customers and rent more!
            </p>
            {data.map((product, index) => (
              <div className={styles.promotProductImgDescDiv}>
                <div className={styles.promotProductImg}>
                  <img src={product.img} />
                </div>
                <div>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productPrice}>
                    RS {product.price}
                    <span>/day</span>
                  </p>
                </div>
              </div>
            ))}
            <div>
              <div
                className={styles.planContainer}
                style={{ background: "#FFECDD" }}
              >
                <div className={styles.planTitleDescriptionDiv}>
                  <h3 className={styles.mainTitleForPlan}>7 Days</h3>
                  <p className={styles.planDescription}>
                    Reach up to 2 times more customers
                  </p>
                </div>
                <div className={styles.planPriceDiv}>
                  <div className={styles.planPriceDivContainer}>
                    <div className={styles.pricingDiv}>
                      <p className={styles.pricingPercent}>40% off</p>
                      <p className={styles.offerPricing}>₹ 200</p>
                    </div>
                    <p className={styles.price}>₹ 120</p>
                  </div>
                  <button className={styles.buyNowBtn}>Promote</button>
                </div>
              </div>
              <div
                className={styles.planContainer}
                style={{ background: "#FFECDD" }}
              >
                <div className={styles.planTitleDescriptionDiv}>
                  <h3 className={styles.mainTitleForPlan}>15 Days</h3>
                  <p className={styles.planDescription}>
                    Reach up to 2 times more customers
                  </p>
                </div>
                <div className={styles.planPriceDiv}>
                  <div className={styles.planPriceDivContainer}>
                    <div className={styles.pricingDiv}>
                      <p className={styles.pricingPercent}>40% off</p>
                      <p className={styles.offerPricing}>₹ 200</p>
                    </div>
                    <p className={styles.price}>₹ 120</p>
                  </div>
                  <button className={styles.buyNowBtn}>Promote</button>
                </div>
              </div>
              <div
                className={styles.planContainer}
                style={{ background: "#FFECDD" }}
              >
                <div className={styles.planTitleDescriptionDiv}>
                  <h3 className={styles.mainTitleForPlan}>7 Days</h3>
                  <p className={styles.planDescription}>
                    Reach up to 2 times more customers
                  </p>
                </div>
                <div className={styles.planPriceDiv}>
                  <div className={styles.planPriceDivContainer}>
                    <div className={styles.pricingDiv}>
                      <p className={styles.pricingPercent}>40% off</p>
                      <p className={styles.offerPricing}>₹ 200</p>
                    </div>
                    <p className={styles.price}>₹ 120</p>
                  </div>
                  <button className={styles.buyNowBtn}>Promote</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotProduct;
