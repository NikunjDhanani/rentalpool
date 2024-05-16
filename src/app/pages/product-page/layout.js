"use client";
import SubHeader from "../../_components/SubHeader";
import Page from '../product-page/page';

const layout = () => {

  return (
    <div className="container-lg">
      <SubHeader />
      <div className="d-flex">
        <Page />
      </div>
    </div>
  );
};

export default layout;
