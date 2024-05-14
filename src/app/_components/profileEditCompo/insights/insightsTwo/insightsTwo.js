import Image from "next/image";

const InsightsTwo = () => {

    const data = [{
        img: "/assets/profileEdit/promotProduct.png",
        title: "Red lehnga with...",
        price: "1500"
    }]

    return (
        <div className={styles.my_account_tab_content_container}>
            <div className={styles.edit_profile_container}>
                <div className={styles.main_tab_content}>
                    <div className={styles.edit_profile_tab_container}>
                        <div className={styles.backBtnDiv}>
                            <button className={styles.backBtn}>
                                <Image src="/assets/profileEdit/back.png" alt="back" height={8} width={13} />{" "}
                                Back
                            </button>
                        </div>
                        {/* <h2 className={styles.referAndEarnTitle}>Promote your product</h2>
                        <p className={styles.promotProductDescription}>Reach more customers and rent more!</p> */}
                        {data.map((product, index) => (
                            <div className={styles.promotProductImgDescDiv} key={index}>
                                <div className={styles.promotProductImg}>
                                    <Image src={product.img} alt="product" height={40} width={40} />
                                </div>
                                <h3 className={styles.productTitle}>{product.title}</h3>
                            </div>
                        ))}
                        <div>
                            <div className={styles.coinTotalDetailDiv}>
                                <p className={styles.availableCoinTitle}>Overview</p>
                                <div className={styles.coinTotalTitleDiv}>
                                    <p>Product Views</p>
                                    <p>300</p>
                                </div>
                                <div className={styles.coinTotalTitleDiv}>
                                    <p>Favorites</p>
                                    <p>10</p>
                                </div>
                                <div className={styles.coinTotalDiv}>
                                    <p>Chat Initiated</p>
                                    <p>03</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InsightsTwo;
