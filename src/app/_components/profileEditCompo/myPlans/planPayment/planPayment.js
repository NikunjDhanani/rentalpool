"use client";
import { useRouter } from "next/navigation";
import styles from "./planPayment.module.css";
import { useState } from "react";
import { Modal } from "react-bootstrap";

const PlanPayment = ({ planPaymentData,setShowPlanPayment }) => {
  const router = useRouter();
  console.log(router, "datadatadatadatadata");

  const [openModal, setOpenModal] = useState(false);

  const handleOpenPromoModal = () => {
    setOpenModal(true);
  };

  const handleClose = () => setOpenModal(false);

  const loadRazorpay = async () => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }
  };
  const handlePayment = async () => {
    await loadRazorpay();
    const razorpay = new window.Razorpay({
      key: "rzp_test_Q0RtnAxFtND64R",
      amount: 1000, // Example: 1000 is the amount in paisa (Rupees 10)
      currency: "INR",
      name: "Your Website Name",
      description: "Payment for your order",
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "Customer Phone Number",
      },
      theme: {
        color: "#F37254",
      },
      handler: function (response) {
        // Handle successful payment
        console.log(response);
      },
    });

    razorpay.open();
  };

  console.log("planPaymentData", planPaymentData);
  return (
    <>
      <div className={styles.my_account_tab_content_container}>
        <div className={styles.edit_profile_container}>
          <div className={styles.main_tab_content}>
            <div className={styles.edit_profile_tab_container}>
              <div className={styles.backBtnDiv}>
                <button onClick={() => setShowPlanPayment(false)} className={styles.backBtn}>
                  <img src="/assets/profileEdit/back.png" />
                  Back
                </button>
              </div>

              <div>
                <div
                  className={styles.planContainer}
                  style={{ background: "#FFECDD" }}
                >
                  <div className={styles.planTitleDescriptionDiv}>
                    <h3 className={styles.mainTitleForPlan}>
                      {planPaymentData.name} Plan
                    </h3>
                    <p className={styles.planProductName}>
                      {planPaymentData.allowed_products} Product
                    </p>
                    <p className={styles.planDescription}>
                      You will rent {planPaymentData?.allowed_products} products
                      in our {planPaymentData.name} plan.
                    </p>
                  </div>
                  <div className={styles.planPriceDiv}>
                    <div className={styles.planPriceDivContainer}>
                      <div className={styles.pricingDiv}>
                        <p className={styles.pricingPercent}>25% off</p>
                        <p className={styles.offerPricing}>
                          ₹ {planPaymentData.original_price}
                        </p>
                      </div>
                      <p className={styles.price}>₹ {planPaymentData.current_price}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.couponInputDiv}>
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    className={styles.planApplyCouponInput}
                  />
                  <input
                    type="submit"
                    name="Apply"
                    className={styles.planApplyCouponSubmit}
                  />
                  <div className={styles.couponInputCheckboxDiv}>
                    <input type="checkbox" />
                    <label>
                      Use my RP Coins<p>Available : 20</p>
                    </label>
                  </div>
                </div>
                <div className={styles.coinTotalDetailDiv}>
                  <p className={styles.availableCoinTitle}>Total Amount</p>
                  <div className={styles.coinTotalTitleDiv}>
                    <p>Base Amount</p>
                    <p>₹ {planPaymentData.original_price}</p>
                  </div>
                  <div className={styles.coinTotalTitleDiv}>
                    <p>Discount</p>
                    <p>-₹ 40</p>
                  </div>
                  <div className={styles.coinTotalTitleDiv}>
                    <p>Coupon Discount</p>
                    <p>0</p>
                  </div>
                  <div className={styles.coinTotalTitleDiv}>
                    <p>RP Coins</p>
                    <p>0</p>
                  </div>
                  <div className={styles.coinTotalDiv}>
                    <p>Total</p>
                    <p>₹ 160</p>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <button
                    className={styles.blue_btn}
                    onClick={() => handlePayment()}
                  >
                    Pay ₹160
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={openModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className={styles.modal_title}>Promocodes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {[...new Array(3)].map((_, i) => {
            return (
              <div key={i}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className={styles.promo_title}>SAVE50</p>
                    <p className="mb-0">
                      Get 50% discount on your all payments
                    </p>
                  </div>
                  <div>
                    <button className={styles.applyBtn}>Apply</button>
                  </div>
                </div>
                {i !== 2 && <div className={styles.seprator} />}
              </div>
            );
          })}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PlanPayment;
