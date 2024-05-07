import React from "react";
import SubHeader from "../../_components/SubHeader";
import Sidebar from "../../_components/sidebar";

const layout = ({ children }) => {
  return (
    <div className="container">
      {/* <SubHeader /> */}
      <div className="d-flex mt-5">
        {/* <Sidebar /> */}
        {children}
      </div>
    </div>
  );
};

export default layout;
