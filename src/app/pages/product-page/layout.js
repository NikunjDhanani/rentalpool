"use client";
import React, { useState, useEffect } from "react";
import SubHeader from "../../_components/SubHeader";
import Sidebar from "../../_components/sidebar";
import Page from '../product-page/page'
import { useRouter } from "next/navigation";

const layout = () => {

  return (
    <div className="container">
      <SubHeader />
      <div className="d-flex ">
        {/* <Sidebar  /> */}
       <Page />
      </div>
    </div>
  );
};

export default layout;




