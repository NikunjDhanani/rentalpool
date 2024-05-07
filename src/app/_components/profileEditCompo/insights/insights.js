import styles from "./insights.module.css"
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import InsightsTwo from "./insightsTwo/insightsTwo"
import insightTwoStyles from "./insigntsTwo.module.css"

const Insights = () => {

    const [insightOne, setInsightOne] = useState(true)
    const [insightTwo, setinsightTwo] = useState(false)

    // const data = [{
    //     img: "/assets/profileEdit/product_img.png",
    //     title: "Red lehnga with...",
    //     price: "1500"
    // }, {
    //     img: "/assets/profileEdit/product_img.png",
    //     title: "Red lehnga with...",
    //     price: "1500"
    // }, {
    //     img: "/assets/profileEdit/product_img.png",
    //     title: "Red lehnga with...",
    //     price: "1500"
    // }, {
    //     img: "/assets/profileEdit/product_img.png",
    //     title: "Red lehnga with...",
    //     price: "1500"
    // }, {
    //     img: "/assets/profileEdit/product_img.png",
    //     title: "Red lehnga with...",
    //     price: "1500"
    // }, {
    //     img: "/assets/profileEdit/product_img.png",
    //     title: "Red lehnga with...",
    //     price: "1500"
    // }, {
    //     img: "/assets/profileEdit/product_img.png",
    //     title: "Red lehnga with...",
    //     price: "1500"
    // }, {
    //     img: "/assets/profileEdit/product_img.png",
    //     title: "Red lehnga with...",
    //     price: "1500"
    // }]

    // useEffect((id) => {

    //     axios({
    //         url: `${process.env.NEXT_PUBLIC_BASE_URL}products/getProductInsights/${id}`,
    //         method: "GET", 
    //         headers:{
    //             'Authorization': `Token 29817064d00da77b8cd19585e13e02ad310f45f1`,
    //     // Authorization: `Token ${authToken}`,
    //     'Accept': 'application/json',
    //         }   
    //     })
    //         .then((res) => {
    //             console.log(res.data);
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         })

    // }, []);

    const data = [{
        img: "/assets/profileEdit/promotProduct.png",
        title: "Red lehnga with...",
        price: "1500"
    }]


    const [activeView, setActiveView] = useState('live');
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10; // Set the number of products you want to display per page
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedProductData, setSelectedProductData] = useState(null);

    useEffect(() => {
        loadProducts(currentPage);
    }, [currentPage]);

    const loadProducts = async (page) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}products/myProducts/?page=${page}`);
            const { results, count } = response.data;
            setProducts(results);

            // Calculate the total number of pages based on the count of products and items per page
            const calculatedTotalPages = Math.ceil(count / itemsPerPage);
            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPaginationItems = () => {
        const paginationItems = [];

        paginationItems.push(
            <Pagination.First
                key="first"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
            />
        );

        paginationItems.push(
            <Pagination.Prev
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            />
        );

        for (let i = 1; i <= totalPages; i++) {
            paginationItems.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        paginationItems.push(
            <Pagination.Next
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            />
        );

        paginationItems.push(
            <Pagination.Last
                key="last"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
            />
        );

        return paginationItems;
    };

    const handleViewDetails = async (productId) => {
        setInsightOne(false)
        setinsightTwo(true)
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}products/getProductInsights/${productId}`, {
                headers: {
                    Authorization: 'Token 29817064d00da77b8cd19585e13e02ad310f45f1',
                    Accept: 'application/json',
                },
            });
            setSelectedProductData(response.data);
            setSelectedProductId(productId);
        } catch (error) {
            console.error('Error fetching product insights:', error);
        }
    };

    const backBtnClick = () => {
        setInsightOne(true)
        setinsightTwo(false)
    }

    return (
        <div className={styles.my_account_tab_content_container}>
            <div className={styles.edit_profile_container}>

                <div className={styles.main_tab_content}>

                    <div className={styles.edit_profile_heading_container}>
                        <h2>Insights</h2>
                    </div>
                    {insightOne ? (
                        <div className={styles.edit_profile_tab_container}>
                            {/* <div className={styles.edit_profile_tab_options}>
                            <button className={styles.personalBtn}>Live Products</button>
                            <button className={styles.businessBtn}>In Draft</button>
                        </div > */}
                            <div className={styles.myProductMainDiv}>
                                {products.map((product, index) => (
                                    <div key={index} className={styles.productContainer}>
                                        <div className={styles.productImgDiv}>
                                            <img src={product.primary_image_thumbnail} alt={product.title} className={styles.productImage} />
                                        </div>
                                        <div className={styles.productdescriptionWithBtn}>
                                            <div className={styles.productTitleWithDesc}>
                                                <h3 className={styles.productTitle}>{product.title}</h3>
                                                <p className={styles.productPrice}>RS {product.rent_per_day}<span>/day</span></p>
                                            </div>
                                            <div className={styles.productBtnDiv}>
                                                <div className={styles.insightsIconDiv}><img src="/assets/profileEdit/eye.png" /><span>25</span></div>
                                                <div className={styles.insightsIconDiv}><img src="/assets/profileEdit/heart.png" /><span>25</span></div>
                                                <div className={styles.insightsIconDiv}><img src="/assets/profileEdit/msg.png" /><span>25</span></div>
                                                <button className={styles.viewBtn} onClick={() => handleViewDetails(product.id)}>View</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.paginationContainer}>
                                <Pagination className="d-flex justify-content-center" style={{ gap: 5, marginTop: '30px', marginBottom: '0px' }}>
                                    {renderPaginationItems()}
                                </Pagination>
                            </div>
                        </div >
                    ) : ""}

                    {insightTwo ? (
                        <div>
                            {/* {selectedProductId && selectedProductData && (

                                // <InsightsTwo productId={selectedProductId} productData={selectedProductData} />
                            )} */}

                            <div className={insightTwoStyles.edit_profile_tab_container}>
                                <div className={insightTwoStyles.backBtnDiv}>
                                    <button className={insightTwoStyles.backBtn} onClick={backBtnClick}><img src="/assets/profileEdit/back.png" />Back</button>
                                </div>
                                {/* <h2 className={styles.referAndEarnTitle}>Promote your product</h2>
                        <p className={styles.promotProductDescription}>Reach more customers and rent more!</p> */}
                                {selectedProductData && (
                                    <>
                                        <div className={insightTwoStyles.promotProductImgDescDiv}>
                                            <div className={insightTwoStyles.promotProductImg}>
                                                <img src={selectedProductData.img} />
                                            </div>
                                            <h3 className={insightTwoStyles.productTitle}>{selectedProductData.title}</h3>
                                        </div>

                                        <div className={insightTwoStyles.coinTotalDetailDiv}>
                                            <p className={insightTwoStyles.availableCoinTitle}>Overview</p>
                                            <div className={insightTwoStyles.coinTotalTitleDiv}>
                                                <p>Product Views</p>
                                                <p>{selectedProductData.product_views}</p>
                                            </div>
                                            <div className={insightTwoStyles.coinTotalTitleDiv}>
                                                <p>Favorites</p>
                                                <p>{selectedProductData.favorites}</p>
                                            </div>
                                            <div className={insightTwoStyles.coinTotalDiv}>
                                                <p>Chat Initiated</p>
                                                <p>{selectedProductData.chat_intialized}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
            
                    ) : ""}

        </div >
            </div >
        </div >


    )

}



export default Insights;