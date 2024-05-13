"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./myPlans.module.css";
import { Spinner } from "react-bootstrap";

const MyPlans = ({ setPlanPaymentData, setShowPlanPayment }) => {
  const [planData, setPlanData] = useState([]);
  const [silverPlanData, setSilverPlanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

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
      `${process.env.NEXT_PUBLIC_BASE_URL}users/myPackages/`,
      setPlanData
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData(
      `${process.env.NEXT_PUBLIC_BASE_URL}products/allPackages/?page=1`,
      setSilverPlanData
    );
  }, []);

  const handleDetalisPlan = (plan) => {
    const result = planData.some((element) => {
      return element.status === "activated";
    });
    if (result) {
      toast.error(
        "You already have one active plan. Please use this filter for upload your product."
      );
      return;
    }
    setSelectedPlan(plan);
    setIsDetailsLoading(true);
    axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}users/isActivePackage/`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Token ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.data.active_plan) {
          setShowPlanPayment(true);
          setPlanPaymentData(plan);
        }
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
      })
      .finally(() => setIsDetailsLoading(false));
  };

  return (
    <div className={styles.my_account_tab_content_container}>
      <div className={styles.edit_profile_container}>
        <div className={styles.main_tab_content}>
          <div className={styles.edit_profile_heading_container}>
            <h2>My Plans</h2>
          </div>
          {loading ? (
            <div className="text-center mt-5">Loading...</div>
          ) : (
            <div className={styles.edit_profile_tab_container}>
              {planData.map((plan, index) => (
                <div
                  key={index}
                  className={styles.activatedPlan_div}
                  style={{ background: "#E7F9E0", margin: "20px 0px" }}
                >
                  <div className={styles.activatedPlanContainerDiv}>
                    <h3 className={styles.mainTitleForPlan}>
                      {plan.package.name}
                    </h3>

                    <button className={styles.activatedBtn}>
                      {plan.status}
                    </button>
                  </div>
                  <div className={styles.activatedProductPlanMainDiv}>
                    <div className={styles.productPlanDetailsDiv}>
                      <p className={styles.productNumber}>
                        {plan.used_products}
                      </p>
                      <p className={styles.productNumberTitle}>Used Product</p>
                    </div>
                    <div className={styles.productPlanDetailsDiv}>
                      <p className={styles.productNumber}>
                        {plan.remaining_product}
                      </p>
                      <p className={styles.productNumberTitle}>
                        Remain Product
                      </p>
                    </div>
                    <div className={styles.productPlanDetailsDiv}>
                      <p className={styles.productNumber}>
                        {plan.total_products}
                      </p>
                      <p className={styles.productNumberTitle}>Total Product</p>
                    </div>
                  </div>
                </div>
              ))}
              <hr></hr>
              <div className={styles.upgradePlanDiv}>
                <p className={styles.planUpgradeHeading}>Upgrade your plan</p>
                {silverPlanData?.results?.map((plan, index) => {
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
                        <h3 className={styles.mainTitleForPlan}>{plan.name}</h3>
                        <p className={styles.planProductName}>
                          {plan.allowed_products} Product
                        </p>
                        <p className={styles.planDescription}>
                          You will rent {plan?.allowed_products} products in our{" "}
                          {plan.name} plan.
                        </p>
                      </div>
                      <div className={styles.planPriceDiv}>
                        <div className={styles.planPriceDivContainer}>
                          <div className={styles.pricingDiv}>
                            <p className={styles.pricingPercent}>
                              {((plan?.original_price - plan?.current_price) /
                                plan?.original_price) *
                                100}
                              % off
                            </p>
                            <p className={styles.offerPricing}>
                              ₹ {plan.original_price}
                            </p>
                          </div>
                          <p className={styles.price}>₹ {plan.current_price}</p>
                        </div>
                        <button
                          className={styles.buyNowBtn}
                          disabled={isDetailsLoading}
                          onClick={() => handleDetalisPlan(plan)}
                        >
                          {isDetailsLoading && selectedPlan.id === plan.id && (
                            <Spinner animation="border" size="sm" />
                          )}
                          Buy Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPlans;
