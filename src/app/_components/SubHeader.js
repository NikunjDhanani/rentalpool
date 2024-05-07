"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { Togglesubcategories } from "@/feature/SubcatagoriesId";

const SubHeader = () => {
  const dispatch = useDispatch();
  const Value = useSelector((state) => state.subcatagoriesid.value);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);

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

  const StoresubCatagoriesId = (subCategoryID) => {
    dispatch(Togglesubcategories(subCategoryID));
  };

  const toggleShowAllCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const toggleShowAllSubcategories = () => {
    setShowAllSubcategories(!showAllSubcategories);
  };
  return (
    <main>
      <section className="container">
        <div className="subheader">
          <ol className="mb-0">
            <li>
              <a href="/">
                Home{" "}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.7 2.99987L10.3306 7.23559C10.7158 7.68498 10.7158 8.3481 10.3306 8.79749L6.7 13.0332"
                    stroke="#757575"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a href="#">
                Women’ wear{" "}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.7 2.99987L10.3306 7.23559C10.7158 7.68498 10.7158 8.3481 10.3306 8.79749L6.7 13.0332"
                    stroke="#757575"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </li>
            <li aria-current="page">Traditional</li>
          </ol>
          <button
            className="btn"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight2"
            aria-controls="offcanvasRight2"
          >
            <Image id="filterproduct" src="/assets/filter.svg" alt="filter" height={20} width={20} />
          </button>
        </div>
      </section>

      <div className="filterbar">
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasRight2"
          aria-labelledby="offcanvasRightLabel"
        >
          <div className="offcanvas-header">
            <div>
              <svg
              data-bs-dismiss="offcanvas"
              aria-label="Close"
                width="17"
                height="10"
                viewBox="0 0 17 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.99997 1L1.70708 4.29289C1.31655 4.68342 1.31655 5.31658 1.70708 5.70711L4.99997 9M1.99997 5.00001L16 5.00001"
                  stroke="#525252"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>Filters</span>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="desk-sidebar">
              <div className="desk-sidebar-div1">
                <div className="d-inline-flex w-100">
                  <div className="d-flex align-items-center justify-content-between w-100 mt-2">
                    <p className="mb-0">By Category</p>
                    <button
                      className="btn "
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseExample"
                      aria-expanded="false"
                      aria-controls="collapseExample"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 0.999999L7.21905 6.33061C7.66844 6.7158 8.33156 6.7158 8.78095 6.33061L15 1"
                          stroke="#717171"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="collapse show" id="collapseExample">
                  <div className="card card-body border-0 p-0 filter-div1">
                    <ul className="list-unstyled mb-0">
                    {categories
                  .slice(0, showAllCategories ? categories.length : 5)
                  .map((category) => (
                    <li
                      key={category.id}
                      className={`${selectedCategory === category.id ? 'filter-div1-current' : ''}`}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      {category.title}
                    </li>
                  ))}
                {!showAllCategories && categories.length > 5 && (
                  <span onClick={toggleShowAllCategories}>See all</span>
                )}
                </ul>
                  </div>
                </div>
              </div>

              <div className="desk-sidebar-div2">
                <div className="d-inline-flex w-100">
                  <div className="d-flex align-items-center justify-content-between w-100 mt-2">
                    <p className="mb-0">By Sub-Category</p>
                    <button
                      className="btn "
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseExample2"
                      aria-expanded="false"
                      aria-controls="collapseExample2"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 0.999999L7.21905 6.33061C7.66844 6.7158 8.33156 6.7158 8.78095 6.33061L15 1"
                          stroke="#717171"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="collapse show" id="collapseExample2">
                  <div className="card card-body border-0 p-0 filter-div2">
                    {selectedCategory && (
                <div>
                  {categories
                    .find((category) => category.id === selectedCategory)
                    ?.sub_categories?.slice(
                      0,
                      showAllSubcategories ? categories.length : 5
                    )
                    .map((subCategory) => (
                      <div key={subCategory.id} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          onClick={() => StoresubCatagoriesId(subCategory.id)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          {subCategory.title}
                        </label>
                      </div>
                    ))}
                </div>
              )}
              {selectedCategory &&
                !showAllSubcategories &&
                categories.find((category) => category.id === selectedCategory)
                  ?.sub_categories?.length > 5 && (
                  <span onClick={toggleShowAllSubcategories}>See all</span>
                )}
                  </div>
                </div>
              </div>

              <div className="desk-sidebar-div2">
                <div className="d-inline-flex w-100">
                  <div className="d-flex align-items-center justify-content-between w-100 mt-2">
                    <p className="mb-0">Sort by</p>
                    <button
                      className="btn "
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseExample3"
                      aria-expanded="false"
                      aria-controls="collapseExample3"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 0.999999L7.21905 6.33061C7.66844 6.7158 8.33156 6.7158 8.78095 6.33061L15 1"
                          stroke="#717171"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="collapse show" id="collapseExample3">
                  <div className="card card-body border-0 p-0 filter-div2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        defaultChecked
                      />
                      <label
                        className="form-check-label"
                        for="flexCheckDefault"
                      >
                        Most Popular
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckdefaultChecked"
                      />
                      <label
                        className="form-check-label"
                        for="flexCheckdefaultChecked"
                      >
                        Low to High
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label
                        className="form-check-label"
                        for="flexCheckDefault"
                      >
                        High to Low
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="desk-sidebar-div2">
                <div className="d-inline-flex w-100">
                  <div className="d-flex align-items-center justify-content-between w-100 mt-2">
                    <p className="mb-0">Example1</p>
                    <button
                      className="btn "
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseExample4"
                      aria-expanded="false"
                      aria-controls="collapseExample4"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 0.999999L7.21905 6.33061C7.66844 6.7158 8.33156 6.7158 8.78095 6.33061L15 1"
                          stroke="#717171"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="collapse" id="collapseExample4">
                  <div className="card card-body border-0 p-0 filter-div2">
                    <ul className="list-unstyled mb-0">
                      <li>Example</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="applyandclearfilter">
                <button>Apply</button>
                <button>Clear all</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubHeader;
