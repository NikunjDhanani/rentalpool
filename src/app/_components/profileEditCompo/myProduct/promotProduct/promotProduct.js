import { useEffect, useState } from "react";
import styles from "./promotProduct.module.css";
import axios from "axios";
import PromotProductPayment from "../promotProductPayment/promotProductPayment";

const PromotProduct = ({
  promotProductDetalis,
  setPromotProductDetalis,
  loadProducts,
}) => {
  const [planData, setPlanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promotCardDetalis, setpromotCardDetalis] = useState(null);
  const authToken = localStorage.getItem("authToken");
  const fetchData = async (url, setDataFunction) => {
    try {
      const response = await axios({
        url,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${authToken}`,
        },
      });
      setDataFunction(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData(
      `${process.env.NEXT_PUBLIC_BASE_URL}products/promotePackages/`,
      setPlanData
    );
  }, []);

  const handleDetalisPlan = (plan) => {
    setpromotCardDetalis(plan);
  };

  return (
    <div className={styles.my_account_tab_content_container}>
      {!promotCardDetalis && (
        <div className={styles.edit_profile_container}>
          <div className={styles.main_tab_content}>
            <div className={styles.edit_profile_tab_container}>
              <div className={styles.backBtnDiv}>
                <button
                  className={styles.backBtn}
                  onClick={() => setPromotProductDetalis(null)}
                >
                  <img src="/assets/profileEdit/back.png" />
                  Back
                </button>
              </div>
              <h2 className={styles.referAndEarnTitle}>Promote your product</h2>
              <p className={styles.promotProductDescription}>
                Reach more customers and rent more!
              </p>
              <div className={styles.promotProductImgDescDiv}>
                <div className={styles.promotProductImg}>
                  <img src={promotProductDetalis.primary_image} />
                </div>
                <div>
                  <h3 className={styles.productTitle}>
                    {promotProductDetalis.title}
                  </h3>
                  <p className={styles.productPrice}>
                    RS {promotProductDetalis.rent_per_day}
                    <span>/day</span>
                  </p>
                </div>
              </div>
              {loading ? (
                <div className="text-center mt-5">Loading...</div>
              ) : planData.length === 0 ? (
                <div className="text-center mt-5">No promot data found</div>
              ) : (
                <>
                  {planData.map((cur, index) => {
                    const backgroundColor =
                      index % 3 === 0
                        ? "#F1F7FF"
                        : index % 3 === 1
                        ? "#FFECDD"
                        : "#E8E8ED";

                    return (
                      <div
                        className={styles.planContainer}
                        style={{ background: backgroundColor }}
                      >
                        <div className={styles.planTitleDescriptionDiv}>
                          <h3 className={styles.mainTitleForPlan}>
                            {cur.no_of_days} Days
                          </h3>
                          <p className={styles.planDescription}>
                            {cur.short_description}
                          </p>
                        </div>
                        <div className={styles.planPriceDiv}>
                          <div className={styles.planPriceDivContainer}>
                            <div className={styles.pricingDiv}>
                              <p className={styles.pricingPercent}>
                                {((cur?.original_price - cur?.current_price) /
                                  cur?.original_price) *
                                  100}
                                % off
                              </p>
                              <p className={styles.offerPricing}>
                                ₹ {cur.original_price}
                              </p>
                            </div>
                            <p className={styles.price}>
                              ₹ {cur.current_price}
                            </p>
                          </div>
                          <button
                            className={styles.buyNowBtn}
                            onClick={() => handleDetalisPlan(cur)}
                          >
                            Promote
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {promotCardDetalis && (
        <PromotProductPayment
          promotCardDetalis={promotCardDetalis}
          setpromotCardDetalis={setpromotCardDetalis}
          planData={promotProductDetalis}
          setPromotProductDetalis={setPromotProductDetalis}
          loadProducts={loadProducts}
        />
      )}
    </div>
  );
};

export default PromotProduct;
