import styles from "./draftProduct.module.css"

const DraftProduct = () => {

    const data = [{
        img: "/assets/profileEdit/product_img.png",
        title: "Red lehnga with...",
        price: "1500"
    }, {
        img: "/assets/profileEdit/product_img.png",
        title: "Red lehnga with...",
        price: "1500"
    }]

    return (
        <div className={styles.my_account_tab_content_container}>
            <div className={styles.edit_profile_container}>

                <div className={styles.main_tab_content}>

                    {/* <div className={styles.edit_profile_heading_container}>
                        <h2>My Products</h2>
                    </div> */}

                    <div className={styles.edit_profile_tab_container}>
                        {/* <div className={styles.edit_profile_tab_options}>
                            <button className={styles.personalBtn}>Live Products</button>
                            <button className={styles.businessBtn}>In Draft</button>
                        </div > */}
                        <div className={styles.myProductMainDiv}>
                            {data.map((product, index) => (
                                <div key={index} className={styles.productContainer}>
                                <div className={styles.productImgDiv}>
                                    <img src={product.img} alt={product.title} className={styles.productImage} />
                                </div>
                                <div className={styles.productdescriptionWithBtn}>
                                    <div className={styles.productTitleWithDesc}>
                                        <h3 className={styles.productTitle}>{product.title}</h3>
                                        <p className={styles.productPrice}>RS {product.price}<span>/day</span></p>
                                    </div>
                                    <div className={styles.productBtnDiv}>
                                        <button className={styles.editBtn}>Edit</button>
                                        <button className={styles.deleteBtn}>Delete</button>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div >
                </div >
            </div >
        </div >
    )
}

export default DraftProduct;