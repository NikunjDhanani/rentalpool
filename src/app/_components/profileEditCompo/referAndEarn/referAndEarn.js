"use client";

import React, { useEffect, useState } from "react";
import styles from "./referAndEarn.module.css";
import axios from "axios";

const ReferAndEarn = () => {

    const [coins, setCoins] = useState()

    useEffect(() => {
        axios({
            url: `${process.env.NEXT_PUBLIC_BASE_URL}users/coins_info/`,
            method: "GET",
        })
            .then((res) => {
                setCoins(res.data)
            })
            .catch((err) => {
                console.error(err);
            })
    }, []);


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
                                        <img src="/assets/profileEdit/friends.png" width={"100%"} />
                                    </div>
                                    <p className={styles.coinDescription}>By using your  referral code,
                                        your friend gets 10 RP coins.
                                        (1 RP Coin = 1 INR)</p>
                                </div>
                            </div>
                            <div className={styles.coinDetailDiv}>
                                <div className={styles.friendsAndYouGetCoinDiv}>
                                    <h3 className={styles.coinTitle}>You Get</h3>
                                    <div className={styles.vectorImgTwo}>
                                        <img src="/assets/profileEdit/you.png" width={"100%"} />
                                    </div>
                                    <p className={styles.coinDescription}>You also get 1o RP coins.
                                        (1 RP Coin = 1 INR)</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.codeDiv}>
                            <p className={styles.codeTitle}>Your Code</p>
                            <p className={styles.code}>PAR7MVTSE</p>
                            <img src="/assets/profileEdit/copy.svg" className={styles.copyBtn} />
                            <img src="/assets/profileEdit/Share.svg" className={styles.shareBtn} />
                        </div>
                        <div className={styles.coinTotalDetailDiv}>
                            <p className={styles.availableCoinTitle}>Available Coins</p>
                            <div className={styles.coinTotalTitleDiv}>
                                <p>Earned Coins</p>
                                <p>10</p>
                            </div>
                            <div className={styles.coinTotalTitleDiv}>
                                <p>Used Coins</p>
                                <p>0</p>
                            </div>
                            <div className={styles.coinTotalDiv}>
                                <p>Total</p>
                                <p>10</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};


export default ReferAndEarn;