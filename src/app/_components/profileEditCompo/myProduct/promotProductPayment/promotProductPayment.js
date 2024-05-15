import styles from "./promotProductPayment.module.css";
import stylesNew from "../promotProduct/promotProduct.module.css";
import { useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import Image from "next/image";

const PromotProductPayment = ({
  promotCardDetalis,
  setpromotCardDetalis,
  planData,
  setPromotProductDetalis,
  loadProducts,
}) => {
  const [payLoading, setPayLoading] = useState(false);

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
  const postVerifyRazorpayOrder = async (response) => {
    try {
      const responce = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}products/verifyRazorpayPromotePackageOrder/`,
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
      setpromotCardDetalis(null);
      setPromotProductDetalis(null);
      loadProducts(1);
      toast.success(responce.data.status);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePaymentCreate = async (promotCardDetalis, planData) => {
    setPayLoading(true);
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}products/createPromoteRazorpayOrder/`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: {
          promote_package: promotCardDetalis.id,
          product: planData.id,
        },
      });
      await handlePayment(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className={styles.my_account_tab_content_container}>
      <div className={styles.edit_profile_container}>
        <div className={styles.main_tab_content}>
          <div className={styles.edit_profile_tab_container}>
            <div className={styles.backBtnDiv}>
              <button
                className={styles.backBtn}
                onClick={() => setpromotCardDetalis(null)}
              >
                <Image src="/assets/profileEdit/back.png" alt="back" height={8} width={13} />{" "}
                Back
              </button>
            </div>
            <h2 className={styles.referAndEarnTitle}>Promote your product</h2>
            <p className={styles.promotProductDescription}>
              Reach more customers and rent more!
            </p>
            <div className={styles.promotProductImgDescDiv}>
              <div className={stylesNew.promotProductImg}>
                <Image src={planData.primary_image} alt="product" height={40} width={40} />
              </div>
              <h3 className={styles.productTitle}>{planData.title}</h3>
              <p className={styles.productPrice}>
                RS {planData.rent_per_day}
                <span>/day</span>
              </p>
            </div>
            <div>
              <div
                className={styles.planContainer}
                style={{ background: "#FFECDD" }}
              >
                <div className={styles.planTitleDescriptionDiv}>
                  <h3 className={styles.mainTitleForPlan}>
                    {promotCardDetalis.no_of_days} Days
                  </h3>
                  <p className={styles.planDescription}>
                    {promotCardDetalis.short_description}
                  </p>
                </div>
                <div className={styles.planPriceDiv}>
                  <div className={styles.planPriceDivContainer}>
                    <div className={styles.pricingDiv}>
                      <p className={styles.pricingPercent}>
                        {((promotCardDetalis?.original_price -
                          promotCardDetalis?.current_price) /
                          promotCardDetalis?.original_price) *
                          100}
                        % off
                      </p>
                      <p className={styles.offerPricing}>
                        ₹ {promotCardDetalis.original_price}
                      </p>
                    </div>
                    <p className={styles.price}>
                      ₹ {promotCardDetalis.current_price}
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.coinTotalDetailDiv}>
                <p className={styles.availableCoinTitle}>Total Amount</p>
                <div className={styles.coinTotalTitleDiv}>
                  <p>Base Amount</p>
                  <p>₹ {promotCardDetalis.original_price}</p>
                </div>
                <div className={styles.coinTotalTitleDiv}>
                  <p>Discount</p>
                  <p>
                    -₹
                    {promotCardDetalis.original_price -
                      promotCardDetalis.current_price}
                  </p>
                </div>
                <div className={styles.coinTotalDiv}>
                  <p>Total</p>
                  <p>
                    ₹{" "}
                    {promotCardDetalis.original_price -
                      (promotCardDetalis.original_price -
                        promotCardDetalis.current_price)}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <button
                  className={styles.blue_btn}
                  onClick={() =>
                    handlePaymentCreate(promotCardDetalis, planData)
                  }
                  disabled={payLoading}
                >
                  {payLoading && <Spinner animation="border" size="sm" />} Pay ₹
                  {promotCardDetalis.original_price -
                    (promotCardDetalis.original_price -
                      promotCardDetalis.current_price)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotProductPayment;
