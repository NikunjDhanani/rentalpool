import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";
import styles from "./planPayment.module.css"
import { useState } from "react";

const PlanPayment = () => {
    const [openModal, setOpenModal] = useState(false);

    const handleOpenPromoModal = () => {
        setOpenModal(true)
    }

    const handleClose = () => setOpenModal(false);

    return (
        <>
            <div className={styles.my_account_tab_content_container}>
                <div className={styles.edit_profile_container}>
                    <div className={styles.main_tab_content}>
                        <div className={styles.edit_profile_tab_container}>
                            <div className={styles.backBtnDiv}>
                                <button className={styles.backBtn}><img src="/assets/profileEdit/back.png" />Back</button>
                            </div>
                            <div>
                                <div className={styles.planContainer} style={{ background: "#FFECDD" }}>
                                    <div className={styles.planTitleDescriptionDiv}>
                                        <h3 className={styles.mainTitleForPlan}>7 Days</h3>
                                        <p className={styles.planDescription}>Reach up to 2 times more customers</p>
                                    </div>
                                    <div className={styles.planPriceDiv}>
                                        <div className={styles.planPriceDivContainer}>
                                            <div className={styles.pricingDiv}>
                                                <p className={styles.pricingPercent}>40% off</p>
                                                <p className={styles.offerPricing}>₹ 200
                                                </p>
                                            </div>
                                            <p className={styles.price}>₹ 120</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.couponInputDiv}>
                                    <input type="text" placeholder="Enter Coupon Code" className={styles.planApplyCouponInput} />
                                    <input type="submit" name="Apply" className={styles.planApplyCouponSubmit} onClick={handleOpenPromoModal} />
                                    <div className={styles.couponInputCheckboxDiv}>
                                        <input type="checkbox" />
                                        <label>Use my RP Coins<p>Available : 20</p></label>
                                    </div>
                                </div>
                                <div className={styles.coinTotalDetailDiv}>
                                    <p className={styles.availableCoinTitle}>Total Amount</p>
                                    <div className={styles.coinTotalTitleDiv}>
                                        <p>Base Amount</p>
                                        <p>₹ 200</p>
                                    </div>
                                    <div className={styles.coinTotalTitleDiv}>
                                        <p>Discount</p>
                                        <p>-₹ 40</p>
                                    </div>
                                    <div className={styles.coinTotalTitleDiv}>
                                        <p>Coupon Discount</p>
                                        <p>0</p>
                                    </div>
                                    <div className={styles.coinTotalTitleDiv}>
                                        <p>RP Coins</p>
                                        <p>0</p>
                                    </div>
                                    <div className={styles.coinTotalDiv}>
                                        <p>Total</p>
                                        <p>₹ 160</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <button className={styles.blue_btn}>Pay ₹160</button>
                                </div>
                            </div>
                        </div >
                    </div >
                </div >
            </div>
            <Modal show={openModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className={styles.modal_title}>Promocodes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {[...new Array(3)].map((_, i) => {
                        return (
                            <div key={i}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className={styles.promo_title}>SAVE50</p>
                                        <p className="mb-0">Get 50% discount on your all payments</p>
                                    </div>
                                    <div>
                                        <button className={styles.applyBtn}>Apply</button>
                                    </div>
                                </div>
                               {i !== 2  && <div className={styles.seprator}/>}
                            </div>
                        )
                    })}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default PlanPayment;