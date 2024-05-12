/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ClearSubCategory,
  Togglesubcategories,
} from "@/feature/SubcatagoriesId";
import { Togglesortby } from "@/feature/Sortproductbyid";
import { useRouter, useSearchParams } from "next/navigation";
import { TogglesCategories } from "@/feature/CategoryId";

const Sidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCategoryId = searchParams.get("categoryId");

  const dispatch = useDispatch();

  const selectedSubCategories = useSelector(
    (state) => state.subcatagoriesid.value
  );
  const selectedCategory = useSelector((state) => state.categoryId.value);
  // const sortby = useSelector((state) => state.SortbyID.value);

  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);

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
    if (queryCategoryId && categories.length) {
      const tempCategory = categories.find(
        (item) => +item.id === +queryCategoryId
      );
      dispatch(
        TogglesCategories({ id: tempCategory.id, name: tempCategory.title })
      );
    }
  }, [queryCategoryId, categories]);

  const handleCategorySelect = (category) => {
    dispatch(ClearSubCategory());
    dispatch(TogglesCategories({ id: category.id, name: category.title }));
  };

  const StoresubCatagoriesId = (subCategory) => {
    dispatch(
      Togglesubcategories({ id: subCategory.id, name: subCategory.title })
    );
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
                className="btn"
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
                  .map((category) => {
                    return (
                      <li
                        key={category.id}
                        className={`${
                          +selectedCategory?.id === +category.id
                            ? "filter-div1-current"
                            : ""
                        }`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category.title}
                      </li>
                    );
                  })}
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
                className="btn"
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
                    .find((category) => +category.id === +selectedCategory.id)
                    ?.sub_categories?.slice(
                      0,
                      showAllSubcategories ? categories.length : 5
                    )
                    .map((subCategory) => {
                      const isSelected = selectedSubCategories.findIndex(
                        (item) => +item.id === +subCategory.id
                      );

                      return (
                        <div key={subCategory.id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`checkbox-${subCategory.id}`}
                            onClick={() => StoresubCatagoriesId(subCategory)}
                            checked={isSelected !== -1}
                          />
                          <label
                            htmlFor="flexCheckDefault"
                            className={`form-check-label mt-0 ${
                              isSelected !== -1 ? "filter-div1-current" : ""
                            }`}
                          >
                            {subCategory.title}
                          </label>
                        </div>
                      );
                    })}
                </div>
              )}
              {selectedCategory &&
                !showAllSubcategories &&
                categories.find(
                  (category) => category.id === selectedCategory.id
                )?.sub_categories?.length > 5 && (
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
