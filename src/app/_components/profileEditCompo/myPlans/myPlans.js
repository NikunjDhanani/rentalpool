"use client";

import React, { useEffect, useState } from "react";
import styles from "./myPlans.module.css";
import axios from "axios";
import toast from "react-hot-toast";

const MyPlans = ({ setPlanPaymentData, setShowPlanPayment }) => {
    const [planData, setPlanData] = useState([]);
    const [silverPlanData, setSilverPlanData] = useState([]);
    const authToken = localStorage.getItem("authToken");

    useEffect(() => {
        axios({
            url: `${process.env.NEXT_PUBLIC_BASE_URL}users/myPackages/`,
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Token ${authToken}`,
            },
        })
            .then((res) => {
                setPlanData(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        axios({
            url: `${process.env.NEXT_PUBLIC_BASE_URL}products/allPackages/?page=1`,
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Token ${authToken}`,
            },
        })
            .then((res) => {
                setSilverPlanData(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const handleDetalisPlan = (plan) => {
        axios({
            url: `${process.env.NEXT_PUBLIC_BASE_URL}users/isActivePackage/`,
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Token ${authToken}`,
            },
        })
            .then((response) => {
                if (response.data.active_plan) {
                    setShowPlanPayment(true);
                    setPlanPaymentData(plan);
                } else {
                    toast.success('You have already Free plan');
                }
            })
            .catch((err) => {
                console.error("Error updating profile:", err);
            });
    };

    return (
        <div className={styles.my_account_tab_content_container}>
            <div className={styles.edit_profile_container}>
                <div className={styles.main_tab_content}>
                    <div className={styles.edit_profile_heading_container}>
                        <h2>My Plans</h2>
                    </div>
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

                                    <button className={styles.activatedBtn}>{plan.status}</button>
                                </div>
                                <div className={styles.activatedProductPlanMainDiv}>
                                    <div className={styles.productPlanDetailsDiv}>
                                        <p className={styles.productNumber}>{plan.used_products}</p>
                                        <p className={styles.productNumberTitle}>Used Product</p>
                                    </div>
                                    <div className={styles.productPlanDetailsDiv}>
                                        <p className={styles.productNumber}>
                                            {plan.remaining_product}
                                        </p>
                                        <p className={styles.productNumberTitle}>Remain Product</p>
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
                                                    <p className={styles.pricingPercent}>{((plan?.original_price - plan?.current_price) / plan?.original_price) * 100}% off</p>
                                                    <p className={styles.offerPricing}>
                                                        ₹ {plan.original_price}
                                                    </p>
                                                </div>
                                                <p className={styles.price}>₹ {plan.current_price}</p>
                                            </div>
                                            <button className={styles.buyNowBtn} onClick={() => handleDetalisPlan(plan)}>Buy Now</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPlans;
