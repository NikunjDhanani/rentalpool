"use client";

import Image from "next/image";
import styles from "./referAndEarn.module.css";

const ReferAndEarn = () => {
  const userData =
    localStorage.getItem("profile") &&
    JSON.parse(localStorage.getItem("profile"));
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.my_account_tab_content_container}>
      <div className={styles.edit_profile_container}>
        <div className={styles.main_tab_content}>
          <div className={styles.edit_profile_heading_container}>
            <h2>Refer & Earn </h2>
          </div>
          <div className={styles.edit_profile_tab_container} style={{ position: "relative" }}>
            <h2 className={styles.referAndEarnTitle}>Invite Friends & Earn</h2>
            <div className={styles.coinDetainMainDiv}>
              <div className={styles.coinDetailDiv}>
                <div className={styles.friendsAndYouGetCoinDiv}>
                  <h3 className={styles.coinTitle}>Friends Get</h3>
                  <div className={styles.vectorImgOne}>
                    <Image src="/assets/profileEdit/friends.png" alt="profile" layout="responsive" width={100} height={100} />
                  </div>
                  <p className={styles.coinDescription}>
                    By using your referral code, your friend gets 10 RP coins.
                    (1 RP Coin = 1 INR)
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
                    You also get 1o RP coins. (1 RP Coin = 1 INR)
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
    </div>
  );
};

export default ReferAndEarn;
