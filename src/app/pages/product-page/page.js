"use client";

import Image from "next/image";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Sidebar from "@/app/_components/sidebar";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { Togglesubcategories } from "@/feature/SubcatagoriesId";

const ProductPage = () => {
  const dispatch = useDispatch();

  const selectedSubCategories = useSelector(
    (state) => state.subcatagoriesid.value
  );
  const selectedCategory = useSelector((state) => state.categoryId.value);
  const searchParams = useSearchParams();
  const search = searchParams.get("categoryId");
  const router = useRouter();
  const autocompleteRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [activeButton, setActiveButton] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [displayedProductsCount, setDisplayedProductsCount] = useState(8);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [totalPages, setTotalPages] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState([]);

  // Update filters when Value (selected subcategories) changes
  useEffect(() => {
    if (selectedCategory) {
      const updatedFilters = [
        {
          id: selectedCategory?.id,
          name: selectedCategory?.name,
          type: "category",
        },
        ...selectedSubCategories.map((subCategory) => ({
          id: subCategory.id,
          name: `${subCategory.name}`,
          type: "subCategory",
        })),
      ];
      setFilters(updatedFilters);
    }
  }, [selectedSubCategories, search, selectedCategory]);

  const handleClearAll = () => {
    setFilters(filters.filter((item) => item.type === "category"));
  };

  const handleRemoveFilter = (subCat) => {
    setFilters((prevFilters) =>
      prevFilters.filter((filter) => filter.id === subCat.id)
    );
    dispatch(Togglesubcategories({ id: subCat.id, name: subCat.title }));
  };

  //  productlist
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}products/listProducts/?limit=${displayedProductsCount}&page=${currentPage}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data.results);
        setTotalPages(Math.ceil(data.count / displayedProductsCount));
        setNextPageUrl(data.next);

        // Calculate total pages
        const totalCount = data.count;
        const pages = Math.ceil(totalCount / displayedProductsCount);
        setTotalPages(pages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts();
  }, [currentPage, displayedProductsCount]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}products/filterProducts/?limit=${displayedProductsCount}&page=${currentPage}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (selectedSubCategories.length > 0) {
          const filteredProducts = data.results.filter((product) => {
            const ID = product?.sub_category;
            return selectedSubCategories.includes(ID);
          });
          setProducts(filteredProducts);
        } else {
          setProducts(data.results);
        }

        // Update total pages and next page URL
        setTotalPages(Math.ceil(data.count / displayedProductsCount));
        setNextPageUrl(data.next);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts();
  }, [currentPage, displayedProductsCount, selectedSubCategories]);

  const handleNextPage = () => {
    if (nextPageUrl) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePagenum = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextnextPage = () => {
    if (nextPageUrl) {
      setCurrentPage(totalPages); // Set currentPage to the last page
    }
  };

  const handlePrevprevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(1); // Set currentPage to the first page
    }
  };

  const loadMoreProducts = () => {
    setDisplayedProductsCount((prevCount) => prevCount + 2);
  };

  useEffect(() => {
    // Filter products based on search query
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  useEffect(() => {
    // Check if geolocation is supported by the browser
    if ("geolocation" in navigator) {
      // Get the user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Retrieve latitude and longitude from the position object
          const { latitude, longitude } = position.coords;
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const allProductsDisplayed = displayedProductsCount >= products.length;
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

  const getHeartFillColor = (productId) => {
    return selectedProducts.includes(productId) ? "red" : "currentColor";
  };

  // Function to determine the number of products to display based on viewport width
  const calculateDisplayedProducts = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      // Mobile view
      return 6;
    } else {
      // Desktop view
      return displayedProductsCount;
    }
  }, [displayedProductsCount]);

  // Event listener to update displayed products count when viewport size changes
  useEffect(() => {
    const handleResize = () => {
      setDisplayedProductsCount(calculateDisplayedProducts());
    };

    // Check if window is defined (i.e., in the browser environment)
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [calculateDisplayedProducts]);

  function truncateTitle(title) {
    const words = title.split(" ");
    if (words.length > 2) {
      return words.slice(0, 2).join(" ") + "...";
    } else {
      return title;
    }
  }

  useEffect(() => {
    setInputValue(location);
  }, [location]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
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

  useEffect(() => {
    const initializeAutocomplete = () => {
      const google = window.google;
      const autocomplete = new google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          types: ["geocode"], // Restrict the autocomplete to addresses
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.log("Place details not found for the input: ", place);
          return;
        }
        const { city, state } = parseAddress(place.formatted_address);
        setInputValue(`${city}, ${state}`);
      });
    };

    const googleScript = document.createElement("script");
    googleScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCo6hADtCP66Co3u3RSb9YMuaS6dF0uB0o&libraries=places`;
    googleScript.onload = initializeAutocomplete;
    window.document.body.appendChild(googleScript);

    return () => {
      window.document.body.removeChild(googleScript);
    };
  }, []);

  return (
    <main className="product-page d-flex ">
      <div>
        <Sidebar subcategory={search} />
      </div>
      <section className="w-100">
        <div className=" w-100">
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
              placeholder="Search Location"
              value={inputValue}
              onChange={handleInputChange}
              ref={autocompleteRef}
            ></input>
          </div>

          <div className="filternames">
            {filters.map((filter) => (
              <div className="fiter1" key={filter.id}>
                <p>{filter.name}</p>
                {filter.type === "subCategory" && (
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => handleRemoveFilter(filter)}
                  >
                    <path
                      d="M12.5 4L4.5 12"
                      stroke="#046BFB"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.5 4L12.5 12"
                      stroke="#046BFB"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            ))}
            <div className="fiterclear" onClick={handleClearAll}>
              <p>Clear all filter</p>
            </div>
          </div>

          <div className="popularproduct">
            <div className="">
              <div className="productmain d-flex align-items-center  flex-wrap">
                {products.length &&
                  products.slice(0, displayedProductsCount).map((data) => {
                    return (
                      <div
                        key={data.id}
                        onClick={() => productHandler(data.id)}
                        className="product1"
                      >
                        <Image
                          id="productimg"
                          src={data.primary_image}
                          alt="product"
                          width={300}
                          height={200}
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
                          <p>{truncateTitle(data.title)}</p>
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
                            <button>Rent</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {/* 
              {window.innerWidth < 768 && (
                <div className="loadmore">
                  {!allProductsDisplayed && (
                    <button onClick={loadMoreProducts}>Load more</button>
                  )}
                </div>
              )} */}
            </div>
          </div>
          {/* {products.length > 0 ? ( */}
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item" onClick={handlePrevprevPage}>
                <a className="page-link" aria-label="Previous">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.7266 12L12.6666 11.06L9.61329 8L12.6666 4.94L11.7266 4L7.72663 8L11.7266 12Z"
                      fill="#525252"
                    />
                    <path
                      d="M7.33332 12L8.27332 11.06L5.21998 8L8.27331 4.94L7.33331 4L3.33332 8L7.33332 12Z"
                      fill="#525252"
                    />
                  </svg>
                </a>
              </li>

              <li className="page-item" onClick={handlePrevPage}>
                <a className="page-link" aria-label="Previous">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.06 12L11 11.06L7.94667 8L11 4.94L10.06 4L6.06 8L10.06 12Z"
                      fill="#525252"
                    />
                  </svg>
                </a>
              </li>

              {/* Render page numbers */}
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  className={`page-item ${
                    i + 1 === activeButton ? "active" : ""
                  }`}
                  key={i}
                >
                  <a
                    className={`page-link ${
                      i + 1 === currentPage ? "active" : ""
                    }`}
                    onClick={() => handlePagenum(i + 1)}
                  >
                    {i + 1}
                  </a>
                </li>
              ))}

              <li className="page-item" onClick={handleNextPage}>
                <a className="page-link" aria-label="Next">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.94 4L6 4.94L9.05333 8L6 11.06L6.94 12L10.94 8L6.94 4Z"
                      fill="#525252"
                    />
                  </svg>
                </a>
              </li>
              <li className="page-item" onClick={handleNextnextPage}>
                <a className="page-link" aria-label="Next">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.27337 4L3.33337 4.94L6.38671 8L3.33337 11.06L4.27337 12L8.27337 8L4.27337 4Z"
                      fill="#525252"
                    />
                    <path
                      d="M8.66668 4L7.72668 4.94L10.78 8L7.72668 11.06L8.66668 12L12.6667 8L8.66668 4Z"
                      fill="#525252"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
          {/* ) : (
            <p className="no-product-found">No products found.</p>
          )} */}
        </div>
      </section>
    </main>
  );
};

// export default ProductPage;

const ProductDPageWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductPage />
    </Suspense>
  );
};

export default ProductDPageWithSuspense;
