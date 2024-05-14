"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeButton, setActiveButton] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [displayedProductsCount, setDisplayedProductsCount] = useState(8);

  const handleButtonClick = (buttonNumber) => {
    setActiveButton(buttonNumber);
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  //  categories list
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}products/listCategories/`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        var latitude = localStorage.getItem("latitude");
        var longitude = localStorage.getItem("longitude");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}products/filterProducts/?location=${latitude},${longitude}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const firstEightProducts = data.results;
        setProducts(firstEightProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts();
  }, []);

  const getHeartFillColor = (productId) => {
    return selectedProducts.includes(productId) ? "red" : "currentColor";
  };

  // Function to determine the number of products to display based on viewport width
  const calculateDisplayedProducts = useCallback(() => {
    // Check if window is defined before accessing it
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        // Mobile view
        return 6;
      } else {
        // Desktop view
        return displayedProductsCount;
      }
    }
  }, [displayedProductsCount]);

  // Event listener to update displayed products count when viewport size changes
  useEffect(() => {
    const handleResize = () => {
      setDisplayedProductsCount(calculateDisplayedProducts());
    };

    // Check if window is defined before adding event listeners
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      // Clean up the event listener
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [calculateDisplayedProducts, setDisplayedProductsCount]);

  let callProductHandler = true;
  const toggleHeartColor = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
    callProductHandler = false; // Set to false to prevent productHandler from being called
  };

  const productHandler = (item) => {
    if (callProductHandler) {
      const id = encodeURIComponent(item);
      router.push(`/pages/product-details?query=${id}`);
    }
  };

  const handleCategoryClick = (categoryId) => {
    let myModalEl = document.querySelector(".modal-backdrop");
    myModalEl && myModalEl.remove();
    router.push(`/pages/product-page?categoryId=${categoryId}`);
  };

  const handleProfile = async () => {
    const authToken = localStorage.getItem("authToken");
    axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}users/myProfile/`,
      method: "GET",
      headers: {
        Authorization: `Token ${authToken}`,
      },
    })
      .then((response) => {
        localStorage.setItem("profile", JSON.stringify(response.data));
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
      });
  };

  const handleStartNowImage = async () => {
    const authToken = localStorage.getItem("authToken");
    axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}products/getHomePosters/`,
      method: "GET",
      headers: {
        Authorization: `Token ${authToken}`,
      },
    })
      .then((response) => {
        console.log(response, 'responseresponse')
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
      });
  };

  useEffect(() => {
    handleProfile();
    handleStartNowImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      {/* Section Start Now */}
      <div className="start_now_page">
        <div className="container-lg">
          <div className="row d-flex align-items-center justify-content-center py-5">
            <div className="col-lg-6 col-12 order-lg-1 order-2">
              <div className="rent_text_main_page">
                Rent <span className="book_text_main_page"> Books</span>
                <br />
                with RentalsPool
              </div>
              <div className="rentalspool_details_main_page">Get what you need, Rent what you have, All through Rentalspool!</div>
              <button className="start_now_btn bg-primary">
                Start Now{" "}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 16L19.2929 12.7071C19.6834 12.3166 19.6834 11.6834 19.2929 11.2929L16 8M19 12L5 12"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="col-lg-6 col-12 text-center order-lg-2 order-1">
              <Image
                src="/assets/Home/slider1.png"
                alt="img"
                className="first_page_poster"
                width={100}
                height={100}
                layout="responsive"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Section top Categories */}
      <div className="container-lg mt-5">
        <div
          className="d-flex align-items-center justify-content-between categoriesheader"
          data-bs-target="#exampleModalToggle"
          data-bs-toggle="modal"
        >
          <span className="top_categories_header">Top Categories</span>
          <button>
            View all{" "}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.2502 11.0002L13.7199 8.53045C14.0129 8.23755 14.0129 7.76266 13.7199 7.46976L11.2502 5.00003M13.5003 8.0001L2.5 8.00011"
                stroke="#046BFB"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="categoriesitems d-flex align-items-center overflow-scroll mt-3">
          {categories?.map((category) => (
            <div
              key={category?.id}
              className="items"
              onClick={() => handleCategoryClick(category?.id)}
            >
              <Image
                src={category?.icon}
                alt="categoriesicon"
                width={100}
                height={100}
                layout="responsive"
              />
              <p key={category?.id}>{category?.title}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Section Popular Products */}
      <div className="container-lg mt-5">
        <div className="d-flex align-items-center justify-content-between categoriesheader">
          <span className="top_categories_header">Popular Products</span>
          <Link href="/pages/product-page">
            {" "}
            <button>
              View all{" "}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2502 11.0002L13.7199 8.53045C14.0129 8.23755 14.0129 7.76266 13.7199 7.46976L11.2502 5.00003M13.5003 8.0001L2.5 8.00011"
                  stroke="#046BFB"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </Link>
        </div>
        <div className="productMainCard d-flex align-items-center justify-content-left flex-wrap mt-3">
          {products?.length === 0 ? (
            <p className="no-product-found">Oops! It seems we couldn&apos;t find a matching product near by your location. Please stay connected with RentalsPool to make it better.</p>
          ) : (
            products && products.slice(0, displayedProductsCount).map((data) => (
              <div
                key={data.id}
                className="product_card"
                onClick={() => productHandler(data.id)}
              >
                <Image
                  src={data.primary_image}
                  alt="product"
                  className="product_image_for_popular_products"
                  width={100}
                  height={100}
                  layout="responsive"
                />
                <div
                  className="favoutite"
                  onClick={() => toggleHeartColor(data.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill={getHeartFillColor(data.id)}
                    className="bi bi-heart-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                    />
                  </svg>
                </div>
                <div className="product-description">
                  <p>{capitalizeFirstLetter(data.title)}</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="prices">
                      <h5>
                        <span>Rs {data.rent_per_day}</span>/day
                      </h5>
                      <h6>
                        {" "}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 10.4167C20 15.8445 13.6 21.5 12 21.5C10.4 21.5 4 15.8445 4 10.4167C4 6.04441 7.58172 2.5 12 2.5C16.4183 2.5 20 6.04441 20 10.4167Z"
                            stroke="#717171"
                            strokeWidth="1.5"
                          />
                          <circle
                            cx="3"
                            cy="3"
                            r="3"
                            transform="matrix(-1 0 0 1 15 7)"
                            stroke="#717171"
                            strokeWidth="1.5"
                          />
                        </svg>
                        {data.seller.address}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Section adds */}
      <div className="container-lg">
        <div className="homeads">
          <div className="ad11">
            <div className="overlay-container" />
            <div className="banner-text">
              <h4>
                Experience the allure of Indian fashion with our curated
                collection
              </h4>
              <a className="btn btn-primary text-white btn-xs" href="/products">
                Shop Now <i className="fi-rs-arrow-small-right"></i>
              </a>
            </div>
          </div>
          <div className="ad11">
            <div className="overlay-container" />
            <div className="banner-text">
              <h4>
                Experience the allure of Indian fashion with our curated
                collection
              </h4>
              <a className="btn btn-primary text-white btn-xs" href="/products">
                Shop Now <i className="fi-rs-arrow-small-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Section How Its Works */}
      {/* <div className="container-lg">
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
            <div>
              {activeButton === 1 && (
                <div className="renterdiv d-flex align-items-center justify-content-center gap-5">
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
                      <h5>Select an Item</h5>
                      <p>
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
                      <h5>Send Inquiry</h5>
                      <p>
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
                      <h5>Chat with Owner</h5>
                      <p>
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
                      <h5>Enjoy Renting</h5>
                      <p>
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
                      <h5>List an Item</h5>
                      <p>
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
                      <h5>Receive Requests</h5>
                      <p>
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
                      <h5>Chat with Renter</h5>
                      <p>
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
                      <h5>Enjoy Earning</h5>
                      <p>
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
      </div> */}
      {/* Section why choose us */}
      <div className="whychooseus container-lg mt-5">
        <h1 className="mb-3">Why choose us?</h1>
        <p>Ready to experience the future of renting?</p>
        <p>Download the RentalsPool and embark on a journey of convenience,</p>
        <p>sustainability, and community empowerment.</p>
        <div className="d-flex align-items-center justify-content-around w-100 mt-4 whychooseussection">
          <div className="mainwhy">
            <div className="why1">
              <div className="why11">
                <Image src="/assets/why.png" width={40} height={40} alt="why" />
              </div>
            </div>
            <h6>Easy and Affordable</h6>
          </div>
          <div className="mainwhy">
            <div className="why1">
              <div className="why11">
                <Image src="/assets/why.png" width={40} height={40} alt="why" />
              </div>
            </div>
            <h6>Variety of Items</h6>
          </div>
          <div className="mainwhy">
            <div className="why1">
              <div className="why11">
                <Image src="/assets/why.png" width={40} height={40} alt="why" />
              </div>
            </div>
            <h6>Earn Extra</h6>
          </div>
          <div className="mainwhy">
            <div className="why1">
              <div className="why11">
                <Image src="/assets/why.png" width={40} height={40} alt="why" />
              </div>
            </div>
            <h6>Community Building</h6>
          </div>
          <div className="mainwhy">
            <div className="why1">
              <div className="why11">
                <Image src="/assets/why.png" width={40} height={40} alt="why" />
              </div>
            </div>
            <h6>Sustainability</h6>
          </div>
        </div>
      </div>
      {/* Section Download Application */}
      <div className="container-lg my-5">
        <div className="appinstall">
          <div className="app-1">
            <p>For better experience,</p>
            <p> Download the RentalsPool app now</p>
          </div>
          <div className="app-2">
            <h3>Install app now</h3>
            <div className="appicons">
              <Image
                src="/assets/footer/playstore.png"
                width={130}
                height={38}
                alt="playstore"
              />
              <Image
                src="/assets/footer/appstor.png"
                width={130}
                height={38}
                alt="appstor"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Modal Top Categories */}
      <div
        class="modal modalcategories fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <span class="top_categories_header">Top Categories</span>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div class="modal-body">
              <div className="d-flex category_modal_card">
                {categories?.map((category) => (
                  <div
                    key={category?.id}
                    className="category_modal"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <Image
                      src={category?.icon}
                      alt="categoriesicon"
                      className="categories_icon_modal"
                      width={100}
                      height={100}
                      layout="responsive"
                    />
                    <span key={category?.id}>{category?.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
