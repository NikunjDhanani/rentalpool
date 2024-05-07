"use client";

import React, { useEffect, useState } from "react";
import styles from "./myPlans.module.css";
import axios from "axios";

const MyPlans = () => {
    const [planData, setPlanData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem("authToken")
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}users/myPackages/`, {
                    headers: {
                        token: "7d06038979f128c1af0790237774a13fc47a5815"
                    }
                });
                setPlanData(response.data);
                console.log(response.data); 
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();

    }, []);

    console.log("planData", planData)


    return (
        <div className={styles.my_account_tab_content_container}>
            <div className={styles.edit_profile_container}>
                <div className={styles.main_tab_content}>
                    <div className={styles.edit_profile_heading_container}>
                        <h2>My Plans</h2>
                    </div>
                    <div className={styles.edit_profile_tab_container}>
                        {planData.map((plan, index) => (
                            <div key={index} className={styles.activatedPlan_div} style={{ background: "#E7F9E0", margin: "20px 0px" }}>
                                <div className={styles.activatedPlanContainerDiv} >
                                    <h3 className={styles.mainTitleForPlan}>{plan.package.name}</h3>

                                    <button className={styles.activatedBtn}>{plan.status}</button>
                                </div>
                                <div className={styles.activatedProductPlanMainDiv}>
                                    <div className={styles.productPlanDetailsDiv}>
                                        <p className={styles.productNumber}>{plan.used_products}</p>
                                        <p className={styles.productNumberTitle}>Used Product</p>
                                    </div>
                                    <div className={styles.productPlanDetailsDiv}>
                                        <p className={styles.productNumber}>{plan.remaining_product}</p>
                                        <p className={styles.productNumberTitle}>Remain Product</p>
                                    </div>
                                    <div className={styles.productPlanDetailsDiv}>
                                        <p className={styles.productNumber}>{plan.total_products}</p>
                                        <p className={styles.productNumberTitle}>Total Product</p>
                                    </div>

                                </div>
                            </div>
                        ))}

                        <hr ></hr>
                        <div className={styles.upgradePlanDiv}>

                            <p className={styles.planUpgradeHeading}>Upgrade your plan</p>

                            <div className={styles.planContainer} style={{ background: "#E8E8ED" }}>
                                <div className={styles.planTitleDescriptionDiv}>
                                    <h3 className={styles.mainTitleForPlan}>Sliver Plan</h3>
                                    <p className={styles.planProductName}>3 Product</p>
                                    <p className={styles.planDescription}>You will rent 3 products in our Sliver plan.</p>

                                </div>
                                <div className={styles.planPriceDiv}>
                                    <div className={styles.planPriceDivContainer}>
                                        <div className={styles.pricingDiv}>
                                            <p className={styles.pricingPercent}>25% off</p>
                                            <p className={styles.offerPricing}>₹ 300
                                            </p>
                                        </div>
                                        <p className={styles.price}>₹ 225</p>
                                    </div>
                                    <button className={styles.buyNowBtn}>Buy Now</button>
                                </div>
                            </div>

                            <div className={styles.planContainer} style={{ background: "#FFECDD" }}>
                                <div className={styles.planTitleDescriptionDiv}>
                                    <h3 className={styles.mainTitleForPlan}>Gold Plan</h3>
                                    <p className={styles.planProductName}>5 Product</p>
                                    <p className={styles.planDescription}>You will rent 5 products in our Sliver plan.</p>

                                </div>
                                <div className={styles.planPriceDiv}>
                                    <div className={styles.planPriceDivContainer}>
                                        <div className={styles.pricingDiv}>
                                            <p className={styles.pricingPercent}>30% off</p>
                                            <p className={styles.offerPricing}>₹ 500
                                            </p>
                                        </div>
                                        <p className={styles.price}>₹ 350</p>
                                    </div>
                                    <button className={styles.buyNowBtn}>Buy Now</button>
                                </div>
                            </div>

                            <div className={styles.planContainer} style={{ background: "#F1F7FF" }}>
                                <div className={styles.planTitleDescriptionDiv}>
                                    <h3 className={styles.mainTitleForPlan}>Diamond Plan</h3>
                                    <p className={styles.planProductName}>10 Product</p>
                                    <p className={styles.planDescription}>You will rent 10 products in our Sliver plan.</p>

                                </div>
                                <div className={styles.planPriceDiv}>
                                    <div className={styles.planPriceDivContainer}>
                                        <div className={styles.pricingDiv}>
                                            <p className={styles.pricingPercent}>45% off</p>
                                            <p className={styles.offerPricing}>₹ 1000
                                            </p>
                                        </div>
                                        <p className={styles.price}>₹ 550</p>
                                    </div>
                                    <button className={styles.buyNowBtn}>Buy Now</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default MyPlans;