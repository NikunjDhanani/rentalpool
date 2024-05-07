"use client"
import Image from "next/image";
import React, { useState } from "react";

const ChatBox = () => {

    return (
        <div className="container">
            <div className="row gx-2">
                <div className="contactus-container col-3">
                    <h5 className="fw-bold">Chat Box</h5>
                </div>
                <div className="contactus-container col-9">
                    <div className="d-flex">
                        <span className="user-name">Divya Patel</span>
                        <span>
                            <div className="product-name">Black slik dotted...</div>
                            <div>$ 1500/day</div>
                        </span>
                        <button className="btn btn-request-review">Request Review</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
