"use client";

import Image from "next/image";
import styles from "./referAndEarn.module.css";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";

const ReferAndEarn = () => {
  const userData =
    localStorage.getItem("profile") &&
    JSON.parse(localStorage.getItem("profile"));
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [coinInfo, setCoinInfo] = useState();

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        // Clipboard successfully copied
        setModalOpen(false); // Close the modal
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };
  useEffect(() => {
    if (userData) {
      setCurrentUrl(
        `https://app.rentalspool.com/reffer?code=${userData.refferal_code}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getCouponCode = async () => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}users/coins_info/`,
        method: "GET",
      });
      setCoinInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCouponCode();
  }, []);
  return (
    <div className={styles.my_account_tab_content_container}>
      <div className={styles.edit_profile_container}>
        <div className={styles.main_tab_content}>
          <div className={styles.edit_profile_heading_container}>
            <h2>Refer & Earn </h2>
          </div>
          <div
            className={styles.edit_profile_tab_container}
            style={{ position: "relative" }}
          >
            <h2 className={styles.referAndEarnTitle}>Invite Friends & Earn</h2>
            <div className={styles.coinDetainMainDiv}>
              <div className={styles.coinDetailDiv}>
                <div className={styles.friendsAndYouGetCoinDiv}>
                  <h3 className={styles.coinTitle}>Friends Get</h3>
                  <div className={styles.vectorImgOne}>
                    <Image
                      src="/assets/profileEdit/friends.png"
                      alt="profile"
                      layout="responsive"
                      width={100}
                      height={100}
                    />
                  </div>
                  <p className={styles.coinDescription}>
                    By using your referral code, your friend gets{" "}
                    {coinInfo?.coins_allocated_to_new_user} RP coins. (1 RP Coin
                    = 1 INR)
                  </p>
                </div>
              </div>
              <div className={styles.coinDetailDiv}>
                <div className={styles.friendsAndYouGetCoinDiv}>
                  <h3 className={styles.coinTitle}>You Get</h3>
                  <div className={styles.vectorImgTwo}>
                    <Image
                      src="/assets/profileEdit/you.png"
                      alt="profile"
                      width={100}
                      height={100}
                      layout="responsive"
                    />
                  </div>
                  <p className={styles.coinDescription}>
                    You also get {coinInfo?.coins_allocated_to_existing_user} RP
                    coins. (1 RP Coin = 1 INR)
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.codeDiv}>
              <p className={styles.codeTitle}>Your Code</p>
              <p className={styles.code}>{userData?.refferal_code}</p>
              <Image
                src="/assets/profileEdit/copy.svg"
                className={styles.copyBtn}
                alt="profile"
                width={24}
                height={24}
                onClick={() => {
                  handleCopyToClipboard(userData?.refferal_code);
                }}
              />
              <Image
                src="/assets/profileEdit/Share.svg"
                className={styles.shareBtn}
                alt="profile"
                width={24}
                height={24}
                onClick={() => setModalOpen(true)}
              />
            </div>
            <div className={styles.coinTotalDetailDiv}>
              <p className={styles.availableCoinTitle}>Available Coins</p>
              <div className={styles.coinTotalTitleDiv}>
                <p>Earned Coins</p>
                <p>{userData?.coins}</p>
              </div>
              <div className={styles.coinTotalTitleDiv}>
                <p>Used Coins</p>
                <p>{userData?.used_coins}</p>
              </div>
              <div className={styles.coinTotalDiv}>
                <p>Total</p>
                <p>{userData?.total_coins}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <div className="p-4">
          <p>URL: {currentUrl}</p>
          <button
            className={`text-center w-100 d-sm-block mb-lg-0 mb-3 d-none`}
            style={{
              background: "#ffffff",
              border: "1px solid #046BFB",
              color: "#046BFB",
            }}
            onClick={handleCopyToClipboard}
          >
            Copy URL
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ReferAndEarn;
