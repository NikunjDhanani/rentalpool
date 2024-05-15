"use client";
import { useState } from "react";
import PersonalProfileEdit from "../../_components/profileEditCompo/editProfile/personalProfile/personalProfileEdit";
import Insights from "../../_components/profileEditCompo/insights/insights";
import MyPlans from "../../_components/profileEditCompo/myPlans/myPlans";
import LiveProduct from "../../_components/profileEditCompo/myProduct/liveProduct/liveProduct";
import ReferAndEarn from "../../_components/profileEditCompo/referAndEarn/referAndEarn";
import LoginPopup from "../../_components/LoginPopup";
import OtpPopup from "../../_components/OtpPopup";
import SignupPopup from "../../_components/SignupPopup";
import PlanPayment from "../../_components/profileEditCompo/myPlans/planPayment/planPayment";
import styles from "./profile.module.css";
import { useEffect } from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("editProfile");
  const [showPlanPayment, setShowPlanPayment] = useState(false);
  const [planPaymentData, setPlanPaymentData] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [loginFormData, setLoginformData] = useState({ phoneNumber: "" });
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    agreeToTerms: false,
    referralCode: "",
  });
  const [localStorageData, setLocalStorageData] = useState(undefined);

  useEffect(() => {
    const savedValue = window.localStorage.getItem("authToken");
    setLocalStorageData(savedValue ? savedValue : undefined);
  }, []);

  const handleLoginButtonClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupButtonClick = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSendOtpButtonClick = () => {
    setShowSignup(false);
    setShowOtp(true);
    setShowLogin(false);
  };

  const handleClose = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowOtp(false);
  };

  return (
    <div
      className={styles.my_account_profile_container}
      style={{ margin: "40px 0px" }}
    >
      <div className={styles.edit_profile_sub_container}>
        <div className={styles.my_account_heading_container}>
          <h1>My Account</h1>
        </div>

        <div className={styles.my_account_tab_container}>
          <div className={styles.my_account_tab_options_container}>
            <ul>
              {localStorageData !== undefined ? (
                <li
                  className={
                    activeTab === "editProfile" ? styles.active_main_tab : ""
                  }
                  onClick={() => {
                    setActiveTab("editProfile");
                    setShowPlanPayment(false);
                  }}
                >
                  <a>Edit Profile</a>
                </li>
              ) : (
                <li onClick={handleLoginButtonClick}>
                  <a>Edit Profile</a>
                </li>
              )}
              {localStorageData !== undefined ? (
                <li
                  className={
                    activeTab === "myProducts" ? styles.active_main_tab : ""
                  }
                  onClick={() => {
                    setActiveTab("myProducts");
                    setShowPlanPayment(false);
                  }}
                >
                  <a>My Products</a>
                </li>
              ) : (
                <li onClick={handleLoginButtonClick}>
                  <a>My Products</a>
                </li>
              )}
              {localStorageData !== undefined ? (
                <li
                  className={
                    activeTab === "myPlans" ? styles.active_main_tab : ""
                  }
                  onClick={() => {
                    setActiveTab("myPlans");
                    setShowPlanPayment(false);
                  }}
                >
                  <a>My Plans</a>
                </li>
              ) : (
                <li onClick={handleLoginButtonClick}>
                  <a>My Plans</a>
                </li>
              )}
              {localStorageData !== undefined ? (
                <li
                  className={
                    activeTab === "referEarn" ? styles.active_main_tab : ""
                  }
                  onClick={() => {
                    setActiveTab("referEarn");
                    setShowPlanPayment(false);
                  }}
                >
                  <a>Refer & Earn</a>
                </li>
              ) : (
                <li onClick={handleLoginButtonClick}>
                  <a>Refer & Earn</a>
                </li>
              )}
              {localStorageData !== undefined ? (
                <li
                  className={
                    activeTab === "insights" ? styles.active_main_tab : ""
                  }
                  onClick={() => {
                    setActiveTab("insights");
                    setShowPlanPayment(false);
                  }}
                >
                  <a>Insights</a>
                </li>
              ) : (
                <li onClick={handleLoginButtonClick}>
                  <a>Insights</a>
                </li>
              )}
            </ul>
          </div>
          <LoginPopup
            show={showLogin}
            onSignupClick={handleSignupButtonClick}
            onSendOtpClick={handleSendOtpButtonClick}
            onClose={handleClose}
            setLoginformData={setLoginformData}
            loginFormData={loginFormData}
          />
          <SignupPopup
            show={showSignup}
            onClose={handleClose}
            onSendOtpClick={handleSendOtpButtonClick}
            onLoginClick={handleLoginButtonClick}
            setFormData={setFormData}
            formData={formData}
          />
          <OtpPopup
            show={showOtp}
            onClose={handleClose}
            setShowLogin={setShowLogin}
            setShowSignup={setShowSignup}
            setShowOtp={setShowOtp}
            formData={formData}
            loginFormData={loginFormData}
          />
          <div className={styles.my_account_tab_content_container}>
            {activeTab === "editProfile" && <PersonalProfileEdit />}
            {activeTab === "myProducts" && <LiveProduct />}
            {activeTab === "myPlans" && (
              <>
                {!showPlanPayment && (
                  <MyPlans
                    setPlanPaymentData={setPlanPaymentData}
                    setShowPlanPayment={setShowPlanPayment}
                  />
                )}
                {showPlanPayment && (
                  <PlanPayment
                    planPaymentData={planPaymentData}
                    setShowPlanPayment={setShowPlanPayment}
                  />
                )}
              </>
            )}
            {activeTab === "referEarn" && <ReferAndEarn />}
            {activeTab === "insights" && <Insights />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
