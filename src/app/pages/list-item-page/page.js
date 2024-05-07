import Image from "next/image";
import Link from "next/link";
import React from "react";

const ListItemPage = () => {
  return (
    <main>
      <div className="container d-flex justify-content-center align-items-center">
        <div className="listitemdiv">
          <h1>We’ve been waiting for you!</h1>
          <h6>Start your earning journey now!</h6>
          <Image
          id="listitemimg"
            src="/assets/home/listitem.png"
            width={386}
            height={252}
            alt="logo"
          />
          <h6>You just 3 steps away for</h6>
          <h4>earning with RentalsPool</h4>

          <div className="d-flex align-items-center justify-content-center">
            <div className="listitem1">
                <Image  src="/assets/home/register.svg" height={50} width={50} alt="register"/> 
                <p><span>Register</span> your business by adding details.</p>
            </div>
            <div className="listitem1">
                <Image  src="/assets/home/engage.svg" height={50} width={50} alt="engage"/>
                <p><span>Engage</span>with potential customers.</p>
            </div>
            <div className="listitem1">
                <Image  src="/assets/home/upload.svg" height={50} width={50} alt="upload"/>
                <p><span>Upload</span>your product for rent.</p>
            </div>
          </div>
          <Link href='/pages/bussiness_details'><button>Join Us</button></Link>
        </div>
      </div>
    </main>
  );
};

export default ListItemPage;
