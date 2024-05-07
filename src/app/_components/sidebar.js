"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Togglesubcategories } from "@/feature/SubcatagoriesId";
import { Togglesortby } from "@/feature/Sortproductbyid";
import { useRouter } from "next/navigation";

const Sidebar = ({ subcategory }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const Value = useSelector((state) => state.subcatagoriesid.value);
  // const sortby = useSelector((state) => state.SortbyID.value);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const sortbycheck = [
    { id: "flexCheckDefault", label: "Most Popular", defaultChecked: true },
    { id: "flexCheckdefaultChecked", label: "Low to High" },
    { id: "flexCheckDefaultHigh", label: "High to Low" },
  ];

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


  useEffect(() => {
    console.log('router:', router);
    console.log('router.query:', router.query);
    if (router.query && router.query.categoryId) {
      const { categoryId } = router.query;
      console.log('categoryId:', categoryId);
      setSelectedCategory(categoryId);
    }
  }, [router.query]);



  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const StoresubCatagoriesId = (subCategoryId) => {
    setSelectedSubcategory(subCategoryId);
    dispatch(Togglesubcategories(subCategoryId));
  };

  const StoresorybyId = (subCategoryID) => {
    dispatch(Togglesortby(subCategoryID));
  };

  const toggleShowAllCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const toggleShowAllSubcategories = () => {
    setShowAllSubcategories(!showAllSubcategories);
  };

  return (
    <main className="container sidebarofdesk">
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
                      className={`${selectedCategory === category.id
                          ? "filter-div1-current"
                          : ""
                        }`}

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
                          id={`checkbox-${subCategory.id}`}
                          onClick={() => StoresubCatagoriesId(subCategory.id)}
                          checked={subcategory === subCategory.title}
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
              {sortbycheck.map((checkbox, index) => (
                <div className="form-check" key={index}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id={checkbox.id}
                    defaultChecked={checkbox.defaultChecked}
                    onClick={() => StoresorybyId(checkbox.id)}
                  />
                  <label className="form-check-label" htmlFor={checkbox.id}>
                    {checkbox.label}
                  </label>
                </div>
              ))}
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
      </div>
    </main>
  );
};

export default Sidebar;
