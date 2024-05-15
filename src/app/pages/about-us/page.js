"use client"
import Image from 'next/image';
import { useState } from 'react';
import card_1 from "../../../../public/assets/aboutUs/about_1.png";
import card_2 from "../../../../public/assets/aboutUs/about_2.png";
import card_3 from "../../../../public/assets/aboutUs/about_3.png";
import card_4 from "../../../../public/assets/aboutUs/about_4.png";
import card_5 from "../../../../public/assets/aboutUs/about_5.png";
import about_img from "../../../../public/assets/aboutUs/about_img.png";
import feature_img from "../../../../public/assets/aboutUs/feature_img.png";
import feature_1 from "../../../../public/assets/icons/feature_1.svg";
import feature_2 from "../../../../public/assets/icons/feature_2.svg";
import feature_3 from "../../../../public/assets/icons/feature_3.svg";
import feature_4 from "../../../../public/assets/icons/feature_4.svg";
import feature_5 from "../../../../public/assets/icons/feature_5.svg";
import feature_6 from "../../../../public/assets/icons/feature_6.svg";
import styles from "./about.module.css";

const AboutUs = () => {
  const [activeButton, setActiveButton] = useState(1);
  const handleButtonClick = (buttonNumber) => {
    setActiveButton(buttonNumber);
  };

  return (
    <main>
      <div className="container-lg p-0 mb-4">
        <div className={`${styles.about_wrapper}`}>
          <div className={`${styles.about_rentalspool}`}>
            <h4 className='text-center'><span className={`${styles.about_span}`}>About</span><span className={`${styles.rentalspool_span}`}>RentalsPool</span></h4>
            <div>
              <p className='text-center'>Are you tired of overloading your space with items you rarely use? Or do you find yourself
                in need of tools, equipment, or unique items for short-term use?</p>
              <p className='text-center'>RentalsPool is here to change the way you rent and share items! <br />
                A platform that brings people together to give and take items on rent, making life more
                convenient and affordable for everyone.</p>
              <p className='text-center'>At RentalsPool, we believe in the power of sharing, reducing waste, generating side income,
                and strengthening communities.</p>
            </div>
          </div>
          <div className={`text-center ${styles.why_choose_section}`}>
            <Image className={`${styles.about_img}`} src={about_img} alt="about us" height={100} width={100} layout="responsive" />
            <h4 className={`text-center ${styles.section_heading}`}>Why Choose RentalsPool?</h4>
            <div className={`row justify-content-center ${styles.why_choose_section_row}`}>
              <div className={`col-lg-4 col-6 ${styles.single_card_col}`}>
                <div className={`text-center ${styles.single_card}`}>
                  <Image src={card_1} width="99.53" height="100" alt='Easy' />
                  <h4>Easy and Affordable</h4>
                  <p>Need something for a short time?<br></br>Why to buy it? With RentalsPool, you can rent items at a fraction of the cost.</p>
                </div>
              </div>
              <div className={`col-lg-4 col-6 ${styles.single_card_col}`}>
                <div className={`text-center ${styles.single_card}`}>
                  <Image src={card_2} width="99.53" height="100" alt='Variety' />
                  <h4>Variety of Items</h4>
                  <p>From tools and gadgets to party supplies and camping gear, find a wide range of items that fulfill your needs here with us.</p>
                </div>
              </div>
              <div className={`col-lg-4 col-6 ${styles.single_card_col}`}>
                <div className={`text-center ${styles.single_card}`}>
                  <Image src={card_3} width="99.53" height="100" alt='Earn' />
                  <h4>Earn Extra</h4>
                  <p>Are you using your items rarely?<br />Join with us on RentalsPool and earn some extra money by renting them out when you&apos;re not using them.</p>
                </div>
              </div>
              <div className={`col-lg-4 col-6 mb-0 ${styles.single_card_col}`}>
                <div className={`text-center ${styles.single_card}`}>
                  <Image src={card_4} width="99.53" height="100" alt='Community' />
                  <h4>Community Building</h4>
                  <p>Join a growing community of renters and owners who believe in sustainable consumption and collaborative living. Discover new connections while sharing resources.</p>
                </div>
              </div>
              <div className={`col-lg-4 col-6 mb-0 ${styles.single_card_col}`}>
                <div className={`text-center ${styles.single_card}`}>
                  <Image src={card_5} width="99.53" height="100" alt='Sustainability' />
                  <h4>Sustainability</h4>
                  <p>Let’s utilize the unused! And promote sustainable living by sharing.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`position-relative ${styles.feature_rentalspool_section}`}>
            <h4 className={`text-center ${styles.section_heading}`}>Features of RentalsPool</h4>
            <p className={`text-center ${styles.section_des}`}>RentalsPool is designed keeping you in mind, offering a range of innovative features that make renting and sharing items at ease. With our user-friendly interface and cutting-edge technology, you&apos;ll experience a new level of convenience and flexibility.</p>
            <div className={`row ${styles.feature_rentalspool_row}`}>
              <div className={`col-xl-4 col-md-6 ${styles.feature_rentalspool_col}`}>
                <div className={`d-flex justify-content-end ${styles.feature_wrapper}`}>
                  <div className={`${styles.feature_description}`}>
                    <h4>Search and Filters</h4>
                    <p>Easily find the items you&apos;re looking for, our smart search and advanced filters will guide you. Filter by category, location, availability, and more to pinpoint your perfect rental.</p>
                  </div>
                  <div className={`${styles.feature_img}`}>
                    <Image src={feature_1} alt='feature_1' />
                  </div>
                </div>
                <div className={`d-flex justify-content-end ${styles.feature_wrapper}`}>
                  <div className={`${styles.feature_description}`}>
                    <h4>Easy Listing</h4>
                    <p>Listing your items is quick and effortless. Upload a photo, add a description, set your price, and you are ready to go for RentalsPool community to discover.</p>
                  </div>
                  <div className={`${styles.feature_img}`}>
                    <Image src={feature_2} alt='feature_2' />
                  </div>
                </div>
                <div className={`d-flex justify-content-end ${styles.feature_wrapper}`}>
                  <div className={`${styles.feature_description}`}>
                    <h4>Valuable Insights</h4>
                    <p>With our Insights dashboard, you can track the performance of your item.Track the number of users who have viewed your items and see the trends over time.</p>
                  </div>
                  <div className={`${styles.feature_img}`}>
                    <Image src={feature_3} alt='feature_3' />
                  </div>
                </div>
              </div>
              <div className={`col-lg-4 d-xl-block d-none position-relative p-0 text-center ${styles.feature_rentalspool_col}`}>
                <Image className={`${styles.feature_img_center}`} src={feature_img} alt='feature_img' />
                <div className={`${styles.bg_circle}`}></div>
              </div>
              <div className={`col-xl-4 col-md-6 ${styles.feature_rentalspool_col}`}>
                <div className={`d-flex justify-content-end flex-row-reverse ${styles.feature_wrapper}`}>
                  <div className={`${styles.feature_description}`}>
                    <h4 className='text-start'>Notifications</h4>
                    <p className='text-start'>Stay informed and never miss a beat out. Receive instant notifications for booking requests, messages, and updates on your rentals.</p>
                  </div>
                  <div className={`${styles.feature_img}`}>
                    <Image src={feature_4} alt='feature_4' />
                  </div>
                </div>
                <div className={`d-flex justify-content-end flex-row-reverse ${styles.feature_wrapper}`}>
                  <div className={`${styles.feature_description}`}>
                    <h4 className='text-start'>Instant Messaging</h4>
                    <p className='text-start'>Stay connected with seamless in-app messaging. Communicate with other users to inquire easily, discuss about items in details, ask questions, and make reservation.</p>
                  </div>
                  <div className={`${styles.feature_img}`}>
                    <Image src={feature_5} alt='feature_5' />
                  </div>
                </div>
                <div className={`d-flex justify-content-end flex-row-reverse ${styles.feature_wrapper}`}>
                  <div className={`${styles.feature_description}`}>
                    <h4 className='text-start'>Responsive Support</h4>
                    <p className='text-start'>Have a question or need assistance? Our support team is here to help you along the way, ensuring a smooth and hassle-free rental experience.</p>
                  </div>
                  <div className={`${styles.feature_img}`}>
                    <Image src={feature_6} alt='feature_6' />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-lg">
            <div className=" howitswork">
              <div className="d-flex align-items-center justify-content-center flex-column">
                <h1>Let&rsquo;s see How Its Works</h1>
                <p>
                  RentalsPool is designed keeping you in mind, offering a range of
                  innovative features that make renting and sharing items at ease.
                  With our user-friendly interface and cutting-edge technology,
                  you&apos;ll experience a new level of convenience and flexibility.
                </p>
              </div>
              <div>
                <div className="menu">
                  <div className="clientrent">
                    <div
                      onClick={() => handleButtonClick(1)}
                      className={activeButton === 1 ? "rental" : "default"}
                    >
                      <p> Renter</p>
                    </div>

                    <div
                      onClick={() => handleButtonClick(2)}
                      className={activeButton === 2 ? "owner" : "default"}
                    >
                      <p> Owner</p>
                    </div>
                  </div>
                </div>
                {activeButton === 1 && (
                  <div className="renterdiv d-flex align-items-center justify-content-center gap-3">
                    <div className="renterwork animate__animated animate__flipInY">
                      <svg
                        id="firstrentaldiv"
                        width="292"
                        height="278"
                        viewBox="0 0 292 278"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M221.301 277.089H55.5327C24.9154 277.089 0 252.15 0 221.505V55.5838C0 24.9383 24.9154 0 55.5327 0H221.301C251.919 0 276.834 24.9383 276.834 55.5838V124.242L291.106 138.527L276.834 152.812V221.47C276.834 252.15 251.919 277.089 221.301 277.089ZM55.5327 5.29205C27.8182 5.29205 5.28718 27.8438 5.28718 55.5838V221.505C5.28718 249.245 27.8182 271.797 55.5327 271.797H221.301C249.016 271.797 271.547 249.245 271.547 221.505V150.668L283.642 138.562L271.547 126.456V55.5838C271.547 27.8438 249.016 5.29205 221.301 5.29205H55.5327Z"
                          fill="#046BFB"
                        />
                      </svg>
                      <div className="workitem">
                        <Image
                          src="/assets/mask2.png"
                          width={50}
                          height={50}
                          alt="mask2"
                        />
                        <p className="work_item_heading">Select an Item</p>
                        <p className="work_item_content">
                          Browse the extensive collection of items available for
                          rent. Use our smart search and filters and choose the item
                          you want to rent and view its details, photos, and
                          pricing.
                        </p>
                      </div>
                    </div>

                    <div className="renterwork animate__animated animate__flipInY">
                      <svg
                        id="firstrentaldiv"
                        width="292"
                        height="278"
                        viewBox="0 0 292 278"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M276.938 124.242V55.5838C276.938 24.9383 252.022 0 221.405 0H55.6364C25.0191 0 0.103699 24.9383 0.103699 55.5838V126.421L12.1986 138.527L0.103699 150.633V221.47C0.103699 252.116 25.0191 277.054 55.6364 277.054H221.405C252.022 277.054 276.938 252.116 276.938 221.47V152.847L291.21 138.562L276.938 124.242ZM271.651 150.668V221.505C271.651 249.245 249.12 271.797 221.405 271.797H55.6364C27.9219 271.797 5.39088 249.245 5.39088 221.505V152.847L19.6628 138.562L5.39088 124.277V55.5838C5.39088 27.8438 27.9219 5.29205 55.6364 5.29205H221.405C249.12 5.29205 271.651 27.8438 271.651 55.5838V126.421L283.746 138.527L271.651 150.668Z"
                          fill="#046BFB"
                        />
                        <path
                          d="M0.103699 130.537V146.552L8.08633 138.527L0.103699 130.537Z"
                          fill="#046BFB"
                        />
                      </svg>

                      <div className="workitem">
                        <Image
                          src="/assets/mask3.png"
                          width={50}
                          height={50}
                          alt="mask3"
                        />
                        <p className="work_item_heading">Send Inquiry</p>
                        <p className="work_item_content">
                          Send a rental request to the owner by checking the
                          item&rsquo;s availability on the calendar and select the
                          dates when you need to rent the item.
                        </p>
                      </div>
                    </div>

                    <div className="renterwork animate__animated animate__flipInY">
                      <svg
                        id="firstrentaldiv"
                        width="292"
                        height="278"
                        viewBox="0 0 292 278"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M276.938 124.242V55.5838C276.938 24.9383 252.022 0 221.405 0H55.6364C25.0191 0 0.103699 24.9383 0.103699 55.5838V126.421L12.1986 138.527L0.103699 150.633V221.47C0.103699 252.116 25.0191 277.054 55.6364 277.054H221.405C252.022 277.054 276.938 252.116 276.938 221.47V152.847L291.21 138.562L276.938 124.242ZM271.651 150.668V221.505C271.651 249.245 249.12 271.797 221.405 271.797H55.6364C27.9219 271.797 5.39088 249.245 5.39088 221.505V152.847L19.6628 138.562L5.39088 124.277V55.5838C5.39088 27.8438 27.9219 5.29205 55.6364 5.29205H221.405C249.12 5.29205 271.651 27.8438 271.651 55.5838V126.421L283.746 138.527L271.651 150.668Z"
                          fill="#046BFB"
                        />
                        <path
                          d="M0.103699 130.537V146.552L8.08633 138.527L0.103699 130.537Z"
                          fill="#046BFB"
                        />
                      </svg>

                      <div className="workitem">
                        <Image
                          src="/assets/mask4.png"
                          width={50}
                          height={50}
                          alt="mask4"
                        />
                        <p className="work_item_heading">Chat with Owner</p>
                        <p className="work_item_content">
                          Discuss rental duration, pricing, and any other terms with
                          owners in the chat. Reach an agreement that suits both the
                          parties and Make a deal as per your convenience.
                        </p>
                      </div>
                    </div>

                    <div className="renterwork animate__animated animate__flipInY">
                      <svg
                        id="firstrentaldiv"
                        width="293"
                        height="278"
                        viewBox="0 0 277 278"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M221.373 0H55.6042C24.9869 0 0.0714722 24.9383 0.0714722 55.5838V126.421L12.1663 138.527L0.0714722 150.633V221.47C0.0714722 252.116 24.9869 277.054 55.6042 277.054H221.373C251.99 277.054 276.906 252.116 276.906 221.47V55.5838C276.906 24.9383 251.99 0 221.373 0ZM271.653 221.505C271.653 249.245 249.122 271.797 221.408 271.797H55.6387C27.9242 271.797 5.39318 249.245 5.39318 221.505V152.847L19.6651 138.562L5.39318 124.277V55.5838C5.39318 27.8438 27.9242 5.29205 55.6387 5.29205H221.373C249.087 5.29205 271.618 27.8438 271.618 55.5838V221.505H271.653Z"
                          fill="#046BFB"
                        />
                        <path
                          d="M0.0714722 130.537V146.552L8.08862 138.527L0.0714722 130.537Z"
                          fill="#046BFB"
                        />
                      </svg>

                      <div className="workitem">
                        <Image
                          src="/assets/mask.png"
                          width={50}
                          height={50}
                          alt="mask"
                        />
                        <p className="work_item_heading">Enjoy Renting</p>
                        <p className="work_item_content">
                          Pickup the item, use it as your own, and when you&apos;re
                          done, return it as per deal with owner.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeButton === 2 && (
                  <div className="renterdiv d-flex align-items-center justify-content-center gap-3">
                    <div className="renterwork animate__animated animate__flipInY">
                      <svg
                        id="firstrentaldiv"
                        width="292"
                        height="278"
                        viewBox="0 0 292 278"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M221.301 277.089H55.5327C24.9154 277.089 0 252.15 0 221.505V55.5838C0 24.9383 24.9154 0 55.5327 0H221.301C251.919 0 276.834 24.9383 276.834 55.5838V124.242L291.106 138.527L276.834 152.812V221.47C276.834 252.15 251.919 277.089 221.301 277.089ZM55.5327 5.29205C27.8182 5.29205 5.28718 27.8438 5.28718 55.5838V221.505C5.28718 249.245 27.8182 271.797 55.5327 271.797H221.301C249.016 271.797 271.547 249.245 271.547 221.505V150.668L283.642 138.562L271.547 126.456V55.5838C271.547 27.8438 249.016 5.29205 221.301 5.29205H55.5327Z"
                          fill="#EF6239"
                        />
                      </svg>

                      <div className="workitem">
                        <Image
                          src="/assets/mask6.png"
                          width={50}
                          height={50}
                          alt="mask6"
                        />
                        <p className="work_item_heading">List an Item</p>
                        <p className="work_item_content">
                          List your items by uploading clear photos, adding a
                          detailed description, price for renting, rentals’ rules,
                          pickup location, and more other relevant details.
                        </p>
                      </div>
                    </div>

                    <div className="renterwork animate__animated animate__flipInY">
                      <svg
                        id="firstrentaldiv"
                        width="292"
                        height="278"
                        viewBox="0 0 292 278"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M276.938 124.242V55.5838C276.938 24.9383 252.022 0 221.405 0H55.6365C25.0192 0 0.10376 24.9383 0.10376 55.5838V126.421L12.1986 138.527L0.10376 150.633V221.47C0.10376 252.116 25.0192 277.054 55.6365 277.054H221.405C252.022 277.054 276.938 252.116 276.938 221.47V152.847L291.21 138.562L276.938 124.242ZM271.651 150.668V221.505C271.651 249.245 249.12 271.797 221.405 271.797H55.6365C27.922 271.797 5.39094 249.245 5.39094 221.505V152.847L19.6629 138.562L5.39094 124.277V55.5838C5.39094 27.8438 27.922 5.29205 55.6365 5.29205H221.405C249.12 5.29205 271.651 27.8438 271.651 55.5838V126.421L283.746 138.527L271.651 150.668Z"
                          fill="#EF6239"
                        />
                        <path
                          d="M0.10376 130.537V146.552L8.0864 138.527L0.10376 130.537Z"
                          fill="#EF6239"
                        />
                      </svg>

                      <div className="workitem">
                        <Image
                          src="/assets/mask7.png"
                          width={50}
                          height={50}
                          alt="mask7"
                        />
                        <p className="work_item_heading">Receive Requests</p>
                        <p className="work_item_content">
                          Once your product is listed, you&rsquo;ll start receiving
                          rental requests from interested renters. Notifications
                          will keep you informed about new requests.
                        </p>
                      </div>
                    </div>

                    <div className="renterwork animate__animated animate__flipInY">
                      <svg
                        id="firstrentaldiv"
                        width="293"
                        height="278"
                        viewBox="0 0 293 278"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M277.802 124.242V55.5838C277.802 24.9383 252.886 0 222.269 0H56.5005C25.8832 0 0.967773 24.9383 0.967773 55.5838V126.421L13.0626 138.527L0.967773 150.633V221.47C0.967773 252.116 25.8832 277.054 56.5005 277.054H222.269C252.886 277.054 277.802 252.116 277.802 221.47V152.847L292.074 138.562L277.802 124.242ZM272.515 150.668V221.505C272.515 249.245 249.984 271.797 222.269 271.797H56.5005C28.7859 271.797 6.25493 249.245 6.25493 221.505V152.847L20.5269 138.562L6.25493 124.277V55.5838C6.25493 27.8438 28.7859 5.29205 56.5005 5.29205H222.269C249.984 5.29205 272.515 27.8438 272.515 55.5838V126.421L284.61 138.527L272.515 150.668Z"
                          fill="#EF6239"
                        />
                        <path
                          d="M0.967773 130.537V146.552L8.95038 138.527L0.967773 130.537Z"
                          fill="#EF6239"
                        />
                      </svg>

                      <div className="workitem">
                        <Image
                          src="/assets/mask4.png"
                          width={50}
                          height={50}
                          alt="mask4"
                        />
                        <p className="work_item_heading">Chat with Renter</p>
                        <p className="work_item_content">
                          Discuss rental duration, pricing, and any other terms with
                          renters in the chat. Reach an agreement that suits both
                          parties and make a deal as per your convenience.
                        </p>
                      </div>
                    </div>

                    <div className="renterwork animate__animated animate__flipInY">
                      <svg
                        id="firstrentaldiv"
                        width="293"
                        height="278"
                        viewBox="0 0 277 278"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M221.373 0H55.6042C24.9869 0 0.0714722 24.9383 0.0714722 55.5838V126.421L12.1663 138.527L0.0714722 150.633V221.47C0.0714722 252.116 24.9869 277.054 55.6042 277.054H221.373C251.99 277.054 276.906 252.116 276.906 221.47V55.5838C276.906 24.9383 251.99 0 221.373 0ZM271.653 221.505C271.653 249.245 249.122 271.797 221.408 271.797H55.6387C27.9242 271.797 5.39318 249.245 5.39318 221.505V152.847L19.6651 138.562L5.39318 124.277V55.5838C5.39318 27.8438 27.9242 5.29205 55.6387 5.29205H221.373C249.087 5.29205 271.618 27.8438 271.618 55.5838V221.505H271.653Z"
                          fill="#EF6239"
                        />
                        <path
                          d="M0.0714722 130.537V146.552L8.08862 138.527L0.0714722 130.537Z"
                          fill="#EF6239"
                        />
                      </svg>

                      <div className="workitem">
                        <Image
                          src="/assets/mask5.png"
                          width={50}
                          height={50}
                          alt="mask5"
                        />
                        <p className="work_item_heading">Enjoy Earning</p>
                        <p className="work_item_content">
                          As per the deal, rent your stuff, collect the payment from
                          renters, and enjoy your earnings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AboutUs;
