
"use client";
import styles from "./profile.module.css"
import PersonalProfileEdit from "../../_components/profileEditCompo/editProfile/personalProfile/personalProfileEdit";
import LiveProduct from "../../_components/profileEditCompo/myProduct/liveProduct/liveProduct"
import MyPlans from "../../_components/profileEditCompo/myPlans/myPlans";
import ReferAndEarn from "../../_components/profileEditCompo/referAndEarn/referAndEarn"
import Insights from "../../_components/profileEditCompo/insights/insights"
import PromotProduct from "../../_components/profileEditCompo/myProduct/promotProduct/promotProduct"
import PromotProductPayment from "../../_components/profileEditCompo/myProduct/promotProductPayment/promotProductPayment"
import PlanPayment from "../../_components/profileEditCompo/myPlans/planPayment/planPayment"
import { useState } from "react";

const Profile = () => {

    const [activeTab, setActiveTab] = useState('editProfile');
    const [showPlanPayment, setShowPlanPayment] = useState(false);
    const [planPaymentData, setPlanPaymentData] = useState(null);

    return (
        <div className={styles.my_account_profile_container} style={{ margin: "40px 0px" }}>
            <div className={styles.edit_profile_sub_container}>
                <div className={styles.my_account_heading_container}>
                    <h1>My Account</h1>
                </div>

                <div className={styles.my_account_tab_container}>
                    <div className={styles.my_account_tab_options_container}>
                        <ul>
                            <li className={activeTab === 'editProfile' ? styles.active_main_tab : ''} onClick={() => setActiveTab('editProfile')}><a>Edit Profile</a></li>
                            <li className={activeTab === 'myProducts' ? styles.active_main_tab : ''} onClick={() => setActiveTab('myProducts')}><a>My Products</a></li>
                            <li className={activeTab === 'myPlans' ? styles.active_main_tab : ''} onClick={() => setActiveTab('myPlans')}><a>My Plans</a></li>
                            <li className={activeTab === 'referEarn' ? styles.active_main_tab : ''} onClick={() => setActiveTab('referEarn')}><a>Refer & Earn</a></li>
                            <li className={activeTab === 'insights' ? styles.active_main_tab : ''} onClick={() => setActiveTab('insights')}><a>Insights</a></li>
                        </ul >
                    </div >
                    <div className={styles.my_account_tab_content_container}>
                        {/* <PromotProduct /> */}
                        {/* <PromotProductPayment /> */}
                        {/* <InsightsTwo /> */}
                        {activeTab === 'editProfile' && <PersonalProfileEdit />}
                        {activeTab === 'myProducts' && <LiveProduct />}
                        {activeTab === 'myPlans' && <>
                            {!showPlanPayment && <MyPlans setPlanPaymentData={setPlanPaymentData} setShowPlanPayment={setShowPlanPayment} />}
                            {showPlanPayment && <PlanPayment planPaymentData={planPaymentData} setShowPlanPayment={setShowPlanPayment}/>}
                        </>}
                        {activeTab === 'referEarn' && <ReferAndEarn />}
                        {activeTab === 'insights' && <Insights />}
                    </div>
                    {/* <div className={styles.my_account_tab_content_container}>
                        <div className={styles.edit_profile_container}>

                            <div id="edit_profile" className={`${styles.active_main_content} ${styles.main_tab_content}`}>

                                <div className={styles.edit_profile_heading_container}>
                                    <h2>Edit Profile</h2>
                                </div>

                                <div className={styles.edit_profile_tab_container}>
                                    <div className={styles.edit_profile_tab_options}>
                                        <div className={styles.toggle_switch}>
                                            <input type="radio" name="profile_type" id="personal" checked="" />
                                            <label className={`${styles.toggle} ${styles.personal} ${styles.toggle_left}`}>Personal</label>

                                            <input type="radio" name="profile_type" id="business" />
                                            <label className={`${styles.toggle} ${styles.toggle_right} ${styles.business}`}>Business</label>

                                            <div className={styles.toggle_slider}></div>
                                        </div >
                                    </div >

                                    <div className={styles.edit_profile_tab_content} >
                                        <div className={styles.my_account_content_section} id="personal" >
                                            <div className={styles.user_image_container} >
                                                <img src="/assets/profile.png" alt="" style={{ width: "100px", height: "100px", borderRadius: "50%", margin: "20px 0px " }} />
                                            </div>

                                            <form id="edit_account_form">
                                                <div className={styles.all_field_container}>
                                                    <div className={styles.half_field_container}>
                                                        <label for="full_name">Full Name</label>
                                                        <input type="text" name="full_name" placeholder="Parita Budheliya" />
                                                    </div>

                                                    <div className={styles.half_field_container}>
                                                        <label for="phone_number">Phone Number</label>
                                                        <input type="text" name="phone_number" placeholder="+91 98989 85858" />
                                                    </div>

                                                    <div className={styles.half_field_container}>
                                                        <label for="date_of_birth">Date of Birth</label>
                                                        <input type="date" name="date_of_birth" />
                                                    </div>

                                                    <div className={`${styles.half_field_container} ${styles.gender_radio_container}`}>
                                                        <label for="gender">Gender</label>

                                                        <label for="male">
                                                            <input type="radio" name="gender" value="Male" />
                                                            <span className={styles.checkmark}></span>
                                                            Male</label>

                                                        <label for="female">
                                                            <input type="radio" name="gender" value="Female" />
                                                            <span className={styles.checkmark}></span>
                                                            Female</label>

                                                        <label for="other">
                                                            <input type="radio" name="gender" value="Other" />
                                                            <span className={styles.checkmark}></span>
                                                            Other</label>
                                                    </div>

                                                    <div className={`${styles.half_field_container} ${styles.address_field}`} >
                                                        <label for="address">Address</label>
                                                        <textarea name="address" placeholder="10 Laxmi Nagar, Surat 395004, Gujarat"></textarea>
                                                        <button type="submit" name="save" className={` ${styles.blue_btn} ${styles.small_btn}`} > Edit</button >
                                                    </div >
                                                </div >

                                                <div className={styles.form_btn_container} >
                                                    <button type="submit" name="save" className={styles.blue_btn} > Save</button >
                                                    <button type="button" name="discard" className={styles.transparent_btn} > Discard</button >
                                                </div >
                                            </form >
                                        </div >
                                    </div >
                                </div >
                            </div >

                            <div id="my_product" className={styles.main_tab_content} ></div >
                            <div id="my_plans" className={styles.main_tab_content}  ></div >
                            <div id="refer_earn" className={styles.main_tab_content}  ></div >
                            <div id="insight" className={styles.main_tab_content}  ></div >
                        </div >
                    </div > */}
                </div >
            </div >
        </div >
    )
}

export default Profile;