"use client"
import Image from "next/image";
import React, { useState } from "react";

const ChatBox = () => {

    return (
        <div className="container">
            <div className="row gx-2 mt-3">
                <div className="contactus-container col-3">
                    <h5 className="fw-bold">Chat Box</h5>
                </div>
                <div className="contactus-container col-9">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <img className="user-image" src="/assets/userImage.png" alt="User" />
                            <span className="user-name">Divya Patel</span>
                        </div>
                        <div className="d-flex">
                            <span>
                                <div className="product-name">Black slik dotted...</div>
                                <span className="product-amount">$ 1500/</span><span className="rent-day">day</span>
                            </span>
                            <button className="btn btn-request-review">Request Review</button>
                        </div>
                    </div>
                    <div className="chat-box">
                        <div className="chat-part">
                            <div className="incomeing-message">Lorem ipsum dolor sit amet</div>
                            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
