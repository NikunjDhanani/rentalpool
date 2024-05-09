"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoginPopup from "./LoginPopup";
import OtpPopup from "./OtpPopup";
import SignupPopup from "./SignupPopup";

const Header = () => {
  const router = useRouter();
  const autocompleteRef = useRef(null);
  const autocompleteRef2 = useRef(null);
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [openClass, setOpenClass] = useState(false);
  const [location, setLocation] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    agreeToTerms: false,
    referralCode: '',
  });
  const [loginFormData, setLoginformData] = useState({
    phoneNumber: '',
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const localStorageData = localStorage.getItem('authToken');

  const handleLoginButtonClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupButtonClick = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSendOtpButtonClick = () => {
    setShowSignup(false);
    setShowOtp(true);
    setShowLogin(false);
  };

  const handleClose = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowOtp(false);
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem("location");
    if (savedLocation) {
      setLocation(savedLocation);
      setInputValue(savedLocation);
    } else {
      setShowModal(true); // Show modal if location is not saved
    }
  }, []);

  useEffect(() => {
    setInputValue(location);
  }, [location]);

  useEffect(() => {
    const initializeAutocomplete = (ref) => {
      const google = window.google;
      const autocomplete = new google.maps.places.Autocomplete(ref.current, {
        types: ["geocode"], // Restrict the autocomplete to addresses
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.log("Place details not found for the input: ", place);
          return;
        }
        const { city, state } = parseAddress(place.formatted_address);
        setInputValue(`${city}, ${state}`);
        localStorage.setItem("location", `${city}, ${state}`);

        // Get latitude and longitude
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        console.log("Latitude:", lat);
        console.log("Longitude:", lng);
        localStorage.setItem("latitude", lat);
        localStorage.setItem("longitude", lng);

        setShowModal(false);
      });
    };

    const googleScript = document.createElement("script");
    googleScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCo6hADtCP66Co3u3RSb9YMuaS6dF0uB0o&libraries=places`;
    googleScript.onload = () => {
      // Initialize autocomplete with the appropriate ref based on showModal state
      if (showModal) {
        initializeAutocomplete(autocompleteRef2);
      } else {
        initializeAutocomplete(autocompleteRef);
      }
    };
    window.document.body.appendChild(googleScript);

    return () => {
      window.document.body.removeChild(googleScript);
    };
  }, [showModal]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}products/listCategories/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleRemove = () => {
    setOpenClass(!openClass);
  };

  const handleopen = () => {
    setShowModal(true);
  };

  const menuItems = [
    { pathname: "/pages/how-it-work", text: "How it works" },
    { pathname: "/pages/about-us", text: "About us" },
    { pathname: "/pages/contact-us", text: "Contact us" },
  ];


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, handleGeoError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const showPosition = async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);

    console.log(latitude, longitude, "latlong");
    const apiKey = "AIzaSyCo6hADtCP66Co3u3RSb9YMuaS6dF0uB0o"; // Replace with your API key

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      const data = await response.json();

      let city = "";
      let state = "";

      if (data.results && data.results.length > 0) {
        for (let i = 0; i < data.results[0].address_components.length; i++) {
          const component = data.results[0].address_components[i];
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
        }
      }

      const newLocation = `${city}, ${state}`;
      setLocation(newLocation);
      setInputValue(newLocation);

      localStorage.setItem("location", newLocation);
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Error fetching location. Please try again.");
    }
  };

  const handleGeoError = (error) => {
    console.error("Error getting location:", error);
    alert("Error getting location. Please try again.");
  };

  const handleInputChange2 = async (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL
        }products/filterProducts/?search=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSuggestions(data.results);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    setShowSuggestions(false);
    const query = encodeURIComponent(title);
    router.push(`/pages/result-page?query=${query}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Redirect to result page when Enter key is pressed
      router.push(`/result-page?query=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const parseAddress = (formattedAddress) => {
    const addressComponents = formattedAddress.split(",");
    let city = "";
    let state = "";
    // Iterate over address components to find city and state
    for (const component of addressComponents) {
      if (component.trim().match(/^[A-Za-z ]+$/)) {
        // If the component contains only alphabets and spaces, consider it as city or state name
        if (!city) {
          city = component.trim();
        } else if (!state) {
          state = component.trim();
        }
      }
    }
    return { city, state };
  };

  const categoriesPage = (items) => {
    const query = encodeURIComponent(items);
    router.push(`/pages/product-page?query=${query}`);
  };

  function ChatBoxIcon() {
    return (
      <div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.3451 1.32061C16.4807 1.24999 15.4053 1.25 14.0336 1.25H9.96644C8.59472 1.25 7.51929 1.24999 6.65494 1.32061C5.77479 1.39252 5.04769 1.54138 4.38955 1.87671C3.30762 2.42798 2.42798 3.30762 1.87671 4.38955C1.54138 5.04769 1.39252 5.7748 1.32061 6.65494C1.24999 7.51929 1.25 8.59472 1.25 9.96644V14.2283C1.25 16.7256 3.27441 18.75 5.77166 18.75H6.37341C6.62191 18.75 6.79183 19.001 6.69954 19.2317C6.01288 20.9484 7.9899 22.5003 9.49441 21.4257L12.1051 19.5609L12.1543 19.5259C12.8632 19.0264 13.7079 18.7556 14.5751 18.7501L14.6354 18.75H15.3311C16.8797 18.7502 17.8244 18.7504 18.6179 18.5177C20.4971 17.9667 21.9667 16.4971 22.5177 14.6179C22.7504 13.8244 22.7502 12.8798 22.75 11.3312V9.96642C22.75 8.59473 22.75 7.51927 22.6794 6.65494C22.6075 5.77479 22.4586 5.04769 22.1233 4.38955C21.572 3.30762 20.6924 2.42798 19.6104 1.87671C18.9523 1.54138 18.2252 1.39252 17.3451 1.32061ZM5.07054 3.21322C5.48197 3.00359 5.9897 2.87996 6.77708 2.81563C7.57322 2.75058 8.58749 2.75 10 2.75H14C15.4125 2.75 16.4268 2.75058 17.2229 2.81563C18.0103 2.87996 18.518 3.00359 18.9295 3.21322C19.7291 3.62068 20.3793 4.27085 20.7868 5.07054C20.9964 5.48197 21.12 5.9897 21.1844 6.77708C21.2494 7.57322 21.25 8.58749 21.25 10V11.1842C21.25 12.9261 21.2424 13.6363 21.0783 14.1958C20.671 15.5848 19.5848 16.671 18.1958 17.0783C17.6363 17.2424 16.9261 17.25 15.1842 17.25H14.6354L14.5655 17.2501C13.3922 17.2576 12.2493 17.6239 11.2902 18.2997L8.62255 20.2051C8.33709 20.409 7.96197 20.1145 8.09226 19.7888C8.57867 18.5728 7.68311 17.25 6.37341 17.25H5.77166C4.10284 17.25 2.75 15.8972 2.75 14.2283V10C2.75 8.58749 2.75058 7.57322 2.81563 6.77708C2.87996 5.9897 3.00359 5.48197 3.21322 5.07054C3.62068 4.27085 4.27085 3.62068 5.07054 3.21322Z"
            fill="#525252"
          />
          <path
            d="M9 10C9 10.5523 8.55228 11 8 11C7.44772 11 7 10.5523 7 10C7 9.44772 7.44772 9 8 9C8.55228 9 9 9.44772 9 10Z"
            fill="#525252"
          />
          <path
            d="M13 10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10C11 9.44772 11.4477 9 12 9C12.5523 9 13 9.44772 13 10Z"
            fill="#525252"
          />
          <path
            d="M17 10C17 10.5523 16.5523 11 16 11C15.4477 11 15 10.5523 15 10C15 9.44772 15.4477 9 16 9C16.5523 9 17 9.44772 17 10Z"
            fill="#525252"
          />
        </svg>
        <p>ChatBox</p>
      </div>
    );
  }

  return (
    <div>
      {/* desktop nav */}
      <div className="dektopnav">
        <div className="container d-flex align-items-center justify-content-between header">
          <Link href="/">
            {" "}
            <Image
              src="/assets/logo.png"
              width={280}
              height={45.27}
              alt="logo"
            />
          </Link>

          <div className="d-flex ">
            <div>
              <div className="headerinput1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="#046BFB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5 16.9579L21.5 21.958"
                    stroke="#046BFB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <input
                  type="text"
                  placeholder="Search for Products"
                  value={searchQuery}
                  onChange={handleInputChange2}
                  onKeyDown={handleKeyDown}
                ></input>
                <svg
                  id="closesearchbtn"
                  onClick={() => setSearchQuery("")}
                  style={{
                    display: searchQuery ? "block" : "none",
                    cursor: "pointer",
                  }}
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L4 12"
                    stroke="#717171"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 4L12 12"
                    stroke="#717171"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {showSuggestions && searchQuery && (
                <div className="searchproductsuggust">
                  {suggestions.length > 0 ? (
                    <div>
                      {suggestions
                        .filter(
                          (product) =>
                            product.title
                              .toLowerCase()
                              .indexOf(searchQuery.toLowerCase()) !== -1
                        )
                        .map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleSuggestionClick(product.title)}
                          >
                            {product.title}
                          </div>
                        ))}
                      {suggestions.filter(
                        (product) =>
                          product.title
                            .toLowerCase()
                            .indexOf(searchQuery.toLowerCase()) !== -1
                      ).length === 0 && <div>No result found</div>}
                    </div>
                  ) : (
                    <div>No result found</div>
                  )}
                </div>
              )}
            </div>

            <div
              className="headerinput2"
              id="headerinput2"
              onClick={handleopen}
            >
              <svg
                width="24"
                height="24"
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

              <input
                type="text"
                placeholder="Select Location"
                value={inputValue}
                onChange={handleInputChange}
                ref={autocompleteRef2}
              ></input>
              {!location && showModal && (
                <div>
                  <div
                    className={
                      openClass
                        ? "modal fade custom-modal d-none"
                        : "modal fade custom-modal  show d-block"
                    }
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-body">
                          <div>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={handleRemove}
                            ></button>
                            <div>
                              <h2>Select Location</h2>
                              <p>
                                Choose your location to see product which is
                                available to your near by area
                              </p>

                              <div className="headerinput2">
                                <svg
                                  width="24"
                                  height="24"
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

                                <input
                                  type="text"
                                  placeholder="Select Location"
                                  ref={autocompleteRef}
                                ></input>
                              </div>

                              <div
                                className="headermobilesidebar"
                                onClick={handleRemove}
                              >
                                <svg
                                  onClick={getLocation}
                                  id="locationicon2"
                                  width="12"
                                  height="13"
                                  viewBox="0 0 12 13"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_1967_100814)">
                                    <path
                                      d="M6 5.5C4.895 5.5 4 6.395 4 7.5C4 8.605 4.895 9.5 6 9.5C7.105 9.5 8 8.605 8 7.5C8 6.395 7.105 5.5 6 5.5ZM10.47 7C10.24 4.915 8.585 3.26 6.5 3.03V2H5.5V3.03C3.415 3.26 1.76 4.915 1.53 7H0.5V8H1.53C1.76 10.085 3.415 11.74 5.5 11.97V13H6.5V11.97C8.585 11.74 10.24 10.085 10.47 8H11.5V7H10.47ZM6 11C4.065 11 2.5 9.435 2.5 7.5C2.5 5.565 4.065 4 6 4C7.935 4 9.5 5.565 9.5 7.5C9.5 9.435 7.935 11 6 11Z"
                                      fill="#757575"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_1967_100814">
                                      <rect
                                        width="12"
                                        height="12"
                                        fill="white"
                                        transform="translate(0 0.5)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>

                                <p onClick={getLocation}>
                                  Use your current location
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      openClass
                        ? "modal-backdrop fade d-none"
                        : "modal-backdrop fade show"
                    }
                  ></div>
                </div>
              )}
            </div>
          </div>

          <div>
            {localStorageData === undefined &&
              <div className="login_btn" id="login_btn">
                <button onClick={handleLoginButtonClick}>Login</button>
              </div>}
            <LoginPopup
              show={showLogin}
              onSignupClick={handleSignupButtonClick}
              onSendOtpClick={handleSendOtpButtonClick}
              onClose={handleClose}
              setLoginformData={setLoginformData}
              loginFormData={loginFormData}
            />
            <SignupPopup
              show={showSignup}
              onClose={handleClose}
              onSendOtpClick={handleSendOtpButtonClick}
              onLoginClick={handleLoginButtonClick}
              setFormData={setFormData}
              formData={formData}
            />
            <OtpPopup show={showOtp} onClose={handleClose} formData={formData} loginFormData={loginFormData} />
          </div>

          <div className="d-flex align-items-center gap-3 headerusericons">
            <div className="headermenuicon" onClick={() => localStorageData === undefined ? handleLoginButtonClick() : router.push('/pages/favourites')}>
              <Image
                src="/assets/icons/favourite.png"
                width={24}
                height={24}
                alt="favourite"
              />
              <p>Favourite</p>
            </div>
            <div className="headermenuicon" onClick={() => localStorageData === undefined && handleLoginButtonClick()}>
              {localStorageData === undefined ?
                <ChatBoxIcon /> :
                <Link href="/pages/chatbox">
                  <ChatBoxIcon />
                </Link>
              }
            </div>
            <div className="user">
              <div className="user-2">
                <svg
                  width="16"
                  height="19"
                  viewBox="0 0 16 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="4"
                    cy="4"
                    r="4"
                    transform="matrix(-1 0 0 1 12 1)"
                    stroke="#717171"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M1 14.9347C1 14.0743 1.54085 13.3068 2.35109 13.0175V13.0175C6.00404 11.7128 9.99596 11.7128 13.6489 13.0175V13.0175C14.4591 13.3068 15 14.0743 15 14.9347V16.2502C15 17.4376 13.9483 18.3498 12.7728 18.1818L11.8184 18.0455C9.28565 17.6837 6.71435 17.6837 4.18162 18.0455L3.22721 18.1818C2.0517 18.3498 1 17.4376 1 16.2502V14.9347Z"
                    stroke="#717171"
                    strokeWidth="1.5"
                  />
                </svg>
                <p>Profile</p>
              </div>
              <div className="user-menu">
                <div id="profileborder"></div>
                <ul>
                  <li onClick={() => localStorageData === undefined ? handleLoginButtonClick() : router.push('/pages/profile')}>
                    <span>
                      <Image
                        src="/assets/icons/edit.png"
                        width={16}
                        height={16}
                        alt="profile"
                      />
                    </span>{" "}
                    Edit Profile
                  </li>
                  <li onClick={() => localStorageData === undefined ? handleLoginButtonClick() : router.push('/pages/profile')}>
                    <span>
                      <Image
                        src="/assets/icons/features.png"
                        width={16}
                        height={16}
                        alt="profile"
                      />
                    </span>{" "}
                    My Products
                  </li>
                  <li onClick={() => localStorageData === undefined ? handleLoginButtonClick() : router.push('/pages/profile')}>
                    <span>
                      <Image
                        src="/assets/icons/plan.png"
                        width={16}
                        height={16}
                        alt="profile"
                      />
                    </span>{" "}
                    My Plans
                  </li>
                  <li onClick={() => localStorageData === undefined ? handleLoginButtonClick() : router.push('/pages/profile')}>
                    <span>
                      <Image
                        src="/assets/icons/exchange-rate.png"
                        width={16}
                        height={16}
                        alt="profile"
                      />
                    </span>{" "}
                    Refer & Earn
                  </li>
                  <li onClick={() => localStorageData === undefined ? handleLoginButtonClick() : router.push('/pages/profile')} x>
                    <span>
                      <Image
                        src="/assets/icons/insight.png"
                        width={16}
                        height={16}
                        alt="profile"
                      />
                    </span>{" "}
                    Insights
                  </li>
                </ul>
                {localStorageData !== undefined && <button>Log Out</button>}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`header2 ${isSticky ? "sticky" : ""}`}
          style={{
            transition: "background-color 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <div className="container d-flex align-items-center justify-content-between header-2-2">
            <div className="d-flex align-items-center gap-4 ">
              <div className="profile ">
                {" "}
                <div className="bg-primary w-100 profile-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3.5"
                      y="4"
                      width="7"
                      height="7"
                      rx="2.5"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="3.5"
                      y="14"
                      width="7"
                      height="7"
                      rx="2.5"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="13.5"
                      y="4"
                      width="7"
                      height="7"
                      rx="2.5"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="13.5"
                      y="14"
                      width="7"
                      height="7"
                      rx="2.5"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span>All Category</span>
                  <div className="d-flex w-100">
                    <ul className="profile-menu bg-primary">
                      {categories.map((category) => (
                        <li
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          {category.title}
                        </li>
                      ))}

                      {selectedCategory && (
                        <ul className="profile-menu2">
                          {categories
                            .find(
                              (category) => category.id === selectedCategory
                            )
                            .sub_categories.map((subCategory) => (
                              <li
                                key={subCategory.id}
                                onClick={() =>
                                  categoriesPage(subCategory.title)
                                }
                              >
                                {" "}
                                {subCategory.title}
                              </li>
                            ))}
                        </ul>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="Hmenu">
                <Link href="/pages/how-it-work">
                  <p className={activeMenuItem === '/pages/how-it-work' ? 'active' : ''}>
                    How it works
                  </p>
                </Link>
              </div>
              <div className="Hmenu">
                <Link href="/pages/about-us">
                  <p className={activeMenuItem === '/pages/about-us' ? 'active' : ''}>
                    About us
                  </p>
                </Link>
              </div>
              <div className="Hmenu">
                <Link href="/pages/contact-us">
                  <p className={activeMenuItem === '/pages/contact-us' ? 'active' : ''}>
                    Contact Us
                  </p>
                </Link>
              </div>
            </div>

            <Link href="/pages/list-item-page">
              <div className="listitem d-flex align-items-center gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 3.33333L8 12.6667"
                    stroke="#046BFB"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.6667 8L3.33335 8"
                    stroke="#046BFB"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <p>List an item</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* mobile nav */}
      <div className="mobilenav">
        <div
          className={`mobilenavdiv ${isSticky ? "sticky" : ""}`}
          style={{
            transition: "background-color 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <div className="mobilenav-1">
            <button
              className="toggle"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L4 6"
                  stroke="#525252"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M20 12L4 12"
                  stroke="#525252"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M20 18H4"
                  stroke="#525252"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <Link href="/">
              <Image
                src="/assets/logo.png"
                width={150}
                height={25}
                alt="logo"
              />
            </Link>
          </div>

          <div className="mobilenav-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.3451 1.32061C16.4807 1.24999 15.4053 1.25 14.0336 1.25H9.96644C8.59472 1.25 7.51929 1.24999 6.65494 1.32061C5.77479 1.39252 5.04769 1.54138 4.38955 1.87671C3.30762 2.42798 2.42798 3.30762 1.87671 4.38955C1.54138 5.04769 1.39252 5.7748 1.32061 6.65494C1.24999 7.51929 1.25 8.59472 1.25 9.96644V14.2283C1.25 16.7256 3.27441 18.75 5.77166 18.75H6.37341C6.62191 18.75 6.79183 19.001 6.69954 19.2317C6.01288 20.9484 7.9899 22.5003 9.49441 21.4257L12.1051 19.5609L12.1543 19.5259C12.8632 19.0264 13.7079 18.7556 14.5751 18.7501L14.6354 18.75H15.3311C16.8797 18.7502 17.8244 18.7504 18.6179 18.5177C20.4971 17.9667 21.9667 16.4971 22.5177 14.6179C22.7504 13.8244 22.7502 12.8798 22.75 11.3312V9.96642C22.75 8.59473 22.75 7.51927 22.6794 6.65494C22.6075 5.77479 22.4586 5.04769 22.1233 4.38955C21.572 3.30762 20.6924 2.42798 19.6104 1.87671C18.9523 1.54138 18.2252 1.39252 17.3451 1.32061ZM5.07054 3.21322C5.48197 3.00359 5.9897 2.87996 6.77708 2.81563C7.57322 2.75058 8.58749 2.75 10 2.75H14C15.4125 2.75 16.4268 2.75058 17.2229 2.81563C18.0103 2.87996 18.518 3.00359 18.9295 3.21322C19.7291 3.62068 20.3793 4.27085 20.7868 5.07054C20.9964 5.48197 21.12 5.9897 21.1844 6.77708C21.2494 7.57322 21.25 8.58749 21.25 10V11.1842C21.25 12.9261 21.2424 13.6363 21.0783 14.1958C20.671 15.5848 19.5848 16.671 18.1958 17.0783C17.6363 17.2424 16.9261 17.25 15.1842 17.25H14.6354L14.5655 17.2501C13.3922 17.2576 12.2493 17.6239 11.2902 18.2997L8.62255 20.2051C8.33709 20.409 7.96197 20.1145 8.09226 19.7888C8.57867 18.5728 7.68311 17.25 6.37341 17.25H5.77166C4.10284 17.25 2.75 15.8972 2.75 14.2283V10C2.75 8.58749 2.75058 7.57322 2.81563 6.77708C2.87996 5.9897 3.00359 5.48197 3.21322 5.07054C3.62068 4.27085 4.27085 3.62068 5.07054 3.21322Z"
                fill="#525252"
              />
              <path
                d="M9 10C9 10.5523 8.55228 11 8 11C7.44772 11 7 10.5523 7 10C7 9.44772 7.44772 9 8 9C8.55228 9 9 9.44772 9 10Z"
                fill="#525252"
              />
              <path
                d="M13 10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10C11 9.44772 11.4477 9 12 9C12.5523 9 13 9.44772 13 10Z"
                fill="#525252"
              />
              <path
                d="M17 10C17 10.5523 16.5523 11 16 11C15.4477 11 15 10.5523 15 10C15 9.44772 15.4477 9 16 9C16.5523 9 17 9.44772 17 10Z"
                fill="#525252"
              />
            </svg>
            <Image
              src="/assets/icons/profile.png"
              width={24}
              height={24}
              alt="profile"
            />
          </div>
        </div>

        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
        >
          <div className="offcanvas-header">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="headerinput2">
            <svg
              width="24"
              height="24"
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

            <input type="text" placeholder="Select Location"></input>
          </div>

          <div className="headermobilesidebar">
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1967_100814)">
                <path
                  d="M6 5.5C4.895 5.5 4 6.395 4 7.5C4 8.605 4.895 9.5 6 9.5C7.105 9.5 8 8.605 8 7.5C8 6.395 7.105 5.5 6 5.5ZM10.47 7C10.24 4.915 8.585 3.26 6.5 3.03V2H5.5V3.03C3.415 3.26 1.76 4.915 1.53 7H0.5V8H1.53C1.76 10.085 3.415 11.74 5.5 11.97V13H6.5V11.97C8.585 11.74 10.24 10.085 10.47 8H11.5V7H10.47ZM6 11C4.065 11 2.5 9.435 2.5 7.5C2.5 5.565 4.065 4 6 4C7.935 4 9.5 5.565 9.5 7.5C9.5 9.435 7.935 11 6 11Z"
                  fill="#757575"
                />
              </g>
              <defs>
                <clipPath id="clip0_1967_100814">
                  <rect
                    width="12"
                    height="12"
                    fill="white"
                    transform="translate(0 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>

            <p>Use your current location</p>
          </div>
          <hr />

          <div className="sidebarmenu">
            <ul>
              <li data-bs-dismiss="offcanvas" aria-label="Close">
                <Link href="/">Home</Link>{" "}
              </li>
              <li>My Account</li>
              <li>All Categories</li>
              <li>Favorites</li>
            </ul>
            <hr />
            <ul>
              <Link href="/pages/how-it-work"><li>How its work</li></Link>
              <Link href="/pages/about-us"><li>About Us</li></Link>
              <Link href="/pages/contact-us"><li>Contact Us</li></Link>
            </ul>
          </div>
        </div>

        <div className="mobileheader">
          <div>
            <div className="headerinput1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="#046BFB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 16.9579L21.5 21.958"
                  stroke="#046BFB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                type="text"
                placeholder="Search for Products"
                value={searchQuery}
                onChange={handleInputChange2}
                onKeyDown={handleKeyDown}
              ></input>
              <svg
                id="closesearchbtn"
                onClick={() => setSearchQuery("")}
                style={{
                  display: searchQuery ? "block" : "none",
                  cursor: "pointer",
                }}
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L4 12"
                  stroke="#717171"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 4L12 12"
                  stroke="#717171"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {showSuggestions && searchQuery && (
              <div className="searchproductsuggust">
                {suggestions.length > 0 ? (
                  <div>
                    {suggestions
                      .filter(
                        (product) =>
                          product.title
                            .toLowerCase()
                            .indexOf(searchQuery.toLowerCase()) !== -1
                      )
                      .map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSuggestionClick(product.title)}
                        >
                          {product.title}
                        </div>
                      ))}
                    {suggestions.filter(
                      (product) =>
                        product.title
                          .toLowerCase()
                          .indexOf(searchQuery.toLowerCase()) !== -1
                    ).length === 0 && <div>No result found</div>}
                  </div>
                ) : (
                  <div>No result found</div>
                )}
              </div>
            )}
          </div>

          <button>
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.5 3.33325L8.5 12.6666"
                stroke="#046BFB"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.1667 8L3.83333 8"
                stroke="#046BFB"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Link href="/pages/list-item-page"> Add</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
