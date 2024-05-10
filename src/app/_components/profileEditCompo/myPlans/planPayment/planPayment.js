"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Modal, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import styles from "./planPayment.module.css";

const PlanPayment = ({ planPaymentData, setShowPlanPayment }) => {
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [couponCodeList, setCouponCodeList] = useState(null);
  const [selectedPromoCode, setSelectedPromoCode] = useState({});
  const [userPromoCode, setUserPromoCode] = useState("");
  const [userPromoCodeAmount, setUserPromoCodeAmount] = useState(0);
  const [userPromoCodeId, setUserPromoCodeId] = useState();
  const [rpCoins, setRpCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rpCoinCheck, setRpCoinCheck] = useState(false);
  const [applyCodeLoading, setApplyCodeLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const authToken = localStorage.getItem("authToken");
  const totalPayAmount =
    (planPaymentData.original_price -
      (rpCoinCheck && rpCoins) -
      (planPaymentData.original_price - planPaymentData.current_price) -
      (selectedPromoCode.charge ?? userPromoCodeAmount)) *
    100;

  const handleOpenPromoModal = async () => {
    setOpenModal(true);
    await getCouponCode();
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

  const handlePayment = async (res) => {
    await loadRazorpay();
    const razorpay = new window.Razorpay({
      key: "rzp_test_wWIFX3u8n8hlHy",
      amount: res.amount,
      currency: res.currency,
      name: "Rentals Pool",
      description: "Payment for your order",
      order_id: res.order_id,
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "Customer Phone Number",
      },
      handler: function (response) {
        if (
          response.razorpay_payment_id &&
          response.razorpay_order_id &&
          response.razorpay_signature
        ) {
          postVerifyRazorpayOrder(response);
          razorpay.close();
        } else {
          errorNotification("Payment Unsuccessful");
        }
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
        setRpCoins(res.data.coins);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleApplyCoupon = async () => {
    setApplyCodeLoading(true);
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}products/getCouponId/`,
        method: "POST",
        data: {
          coupon_name: userPromoCode,
        },
      });
      if (response?.status === 200) {
        if (response.data.charge_type === "Percentage") {
          setUserPromoCodeAmount(
            (planPaymentData.current_price * response.data.charge) / 100
          );
        } else {
          setUserPromoCodeAmount(response.data.charge)
        }
        setUserPromoCodeId(response.data.id);
      } else {
        toast.error("Your coupon code is not valid.");
      }
    } catch (error) {
      if (error.response.data.id === -1) {
        toast.error("Your coupon code is not valid.");
      }
    }
    finally {
      setApplyCodeLoading(false)
    }
  };

  const handlePaymentCreate = async (planPaymentData) => {
    setPayLoading(true);
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}products/createRazorpayOrder/`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: {
          package: planPaymentData.id,
          coupon: selectedPromoCode?.id ?? userPromoCodeId,
          use_coins: rpCoinCheck,
        },
      });
      if (response.data.amount > 0) {
        await handlePayment(response.data);
      } else {
        await handlePaymentCreateZeroOrder(response.data);
      }
    } catch (error) {
      console.error(error);
    }
    finally {
      setPayLoading(false);
    }
  };

  const postVerifyRazorpayOrder = async (response) => {
    try {
      const responce = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}products/verifyRazorpayOrder/`,
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        data: {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        },
      });
      toast.success(responce.data.status);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaymentCreateZeroOrder = async (responseData) => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}products/verifyRazorpayZeroOrder/`,
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        data: {
          order_id: responseData.order_id,
        },
      });
      toast.success(response.data.status);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApplyClick = (promo) => {
    if (promo.charge_type === "Percentage") {
      const data = promo.charge = (planPaymentData.current_price * promo.charge) / 100
      setSelectedPromoCode(promo);
    } else {
      setSelectedPromoCode(promo)
    }
    setOpenModal(false);
  }

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
                        <p className={styles.pricingPercent}>
                          {((planPaymentData?.original_price -
                            planPaymentData?.current_price) /
                            planPaymentData?.original_price) *
                            100}
                          % off
                        </p>
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
                    disabled={applyCodeLoading}
                    onClick={handleApplyCoupon}
                    value="Apply"
                  />
                  <div
                    className={`d-flex justify-content-end ${styles.browseCode}`}
                    onClick={() => handleOpenPromoModal()}
                  >
                    <span>Browse Coupon Codes</span>
                  </div>
                  <div className={styles.couponInputCheckboxDiv}>
                    <input
                      type="checkbox"
                      onChange={(e) => setRpCoinCheck(e.target.checked)}
                    />
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
                    <p>
                      {planPaymentData.original_price -
                        planPaymentData.current_price}
                    </p>
                  </div>
                  <div className={styles.coinTotalTitleDiv}>
                    <p>Coupon Discount</p>
                    <p>{selectedPromoCode.charge ?? userPromoCodeAmount}</p>
                  </div>
                  <div className={styles.coinTotalTitleDiv}>
                    <p>RP Coins</p>
                    <p>{rpCoinCheck ? rpCoins : 0}</p>
                  </div>
                  <div className={styles.coinTotalDiv}>
                    <p>Total</p>
                    <p>₹ {totalPayAmount / 100}</p>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    className={styles.blue_btn}
                    onClick={() => handlePaymentCreate(planPaymentData)}
                    disabled={payLoading}
                  >
                    {payLoading && <Spinner animation="border" size="sm" />}  Pay ₹{totalPayAmount / 100}
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
          {loading ? <div className="text-center my-4">Loading...</div>
            : couponCodeList ? (
              couponCodeList.map((promo, i) => {
                return (
                  <div key={i}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className={styles.promo_title}>{promo.name}</p>
                        <p className="mb-0">{promo.description}</p>
                      </div>
                      <div>
                        <button
                          className={styles.applyBtn}
                          onClick={() => handleApplyClick(promo)}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                    {i === couponCodeList.legth - 1 && (
                      <div className={styles.seprator} />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center my-4">No PromoCode Available</div>
            )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PlanPayment;
