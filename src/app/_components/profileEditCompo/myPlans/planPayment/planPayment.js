"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import styles from "./planPayment.module.css";

const PlanPayment = ({ planPaymentData, setShowPlanPayment }) => {
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [couponCodeList, setCouponCodeList] = useState(null);
  const [selectedPromoCode, setSelectedPromoCode] = useState('');
  const [userPromoCode, setUserPromoCode] = useState('');
  const [userPromoCodeAmount, setUserPromoCodeAmount] = useState(0);
  const [rpCoins, setRpCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  const authToken = localStorage.getItem("authToken");
  const totalPayAmount = (planPaymentData.original_price - rpCoins - (planPaymentData.original_price - planPaymentData.current_price) - (selectedPromoCode.charge ?? userPromoCodeAmount)) * 100;

  const handleOpenPromoModal = async () => {
    await getCouponCode()
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
      amount: totalPayAmount,
      currency: "INR",
      name: "Rentals Pool",
      description: "Payment for your order",
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "Customer Phone Number",
      },
      handler: function (response) {
        // Handle successful payment
        console.log(response);
      },
    });
    razorpay.open();
  };

  const getCouponCode = async () => {
    setLoading(true);
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}products/listCoupons/`,
        method: "GET",
      });
      setCouponCodeList(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}users/checkCoins/`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Token ${authToken}`,
      },
    })
      .then((res) => {
        setRpCoins(res.data.coins)
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleApplyCoupon = async () => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}products/getCouponId/`,
        method: "POST",
        data: {
          coupon_name: userPromoCode
        }
      });
      if (response?.status === 200) {
        setUserPromoCodeAmount(response.data.charge);
      } else {
        setUserPromoCodeAmount(0);
        toast.error('Your coupon code is not valid.');
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <div className={styles.my_account_tab_content_container}>
        <div className={styles.edit_profile_container}>
          <div className={styles.main_tab_content}>
            <div className={styles.edit_profile_tab_container}>
              <div className={styles.backBtnDiv}>
                <button
                  onClick={() => setShowPlanPayment(false)}
                  className={styles.backBtn}
                >
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
                        <p className={styles.pricingPercent}>{((planPaymentData?.original_price - planPaymentData?.current_price) / planPaymentData?.original_price) * 100}% off</p>
                        <p className={styles.offerPricing}>
                          ₹ {planPaymentData.original_price}
                        </p>
                      </div>
                      <p className={styles.price}>
                        ₹ {planPaymentData.current_price}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.couponInputDiv}>
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    className={styles.planApplyCouponInput}
                    value={selectedPromoCode.name}
                    onChange={(e) => setUserPromoCode(e.target.value)}
                    disabled={selectedPromoCode.name}
                  />
                  <input
                    type="button"
                    className={styles.planApplyCouponSubmit}
                    disabled={selectedPromoCode.name}
                    onClick={handleApplyCoupon}
                    value="Apply"
                  />
                  <div className={`d-flex justify-content-end ${styles.browseCode}`} onClick={() => handleOpenPromoModal()}>
                    <span>Browse Coupon Codes</span>
                  </div>
                  <div className={styles.couponInputCheckboxDiv}>
                    <input type="checkbox" />
                    <label>
                      Use my RP Coins<p>Available : {rpCoins}</p>
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
                    <p>{planPaymentData.original_price - planPaymentData.current_price}</p>
                  </div>
                  <div className={styles.coinTotalTitleDiv}>
                    <p>Coupon Discount</p>
                    <p>{selectedPromoCode.charge ?? userPromoCodeAmount}</p>
                  </div>
                  <div className={styles.coinTotalTitleDiv}>
                    <p>RP Coins</p>
                    <p>{rpCoins}</p>
                  </div>
                  <div className={styles.coinTotalDiv}>
                    <p>Total</p>
                    <p>₹ {totalPayAmount / 100}</p>
                  </div>
                </div>
                <div className="text-center">
                  <button className={styles.blue_btn} onClick={() => handlePayment()}>
                    Pay ₹{totalPayAmount / 100}
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
          {loading && <div className="text-center mt-4">Loading...</div>}
          {couponCodeList && !loading ?
            couponCodeList.map((promo, i) => {
              return (
                <div key={i}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className={styles.promo_title}>{promo.name}</p>
                      <p className="mb-0">
                        {promo.description}
                      </p>
                    </div>
                    <div>
                      <button className={styles.applyBtn} onClick={() => { setSelectedPromoCode(promo); setOpenModal(false) }}>Apply</button>
                    </div>
                  </div>
                  {i === couponCodeList.legth - 1 && <div className={styles.seprator} />}
                </div>
              );
            })
            :
            <div className="text-center my-4">No PromoCode Available</div>
          }
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PlanPayment;
