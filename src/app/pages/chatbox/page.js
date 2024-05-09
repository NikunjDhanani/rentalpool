"use client"
import React from "react";

const ChatBox = () => {

    return (
        <div className="container-lg">
            <div className="mt-3 d-flex justify-content-between">
                <div className="contactus-container p-0 message-sender-side">
                    <h5 className="chat-box-header-name">Chat Box</h5>
                    <div className="message-sender-list">
                        <div className="message-sender d-flex justify-content-between align-items-center px-2 py-1">
                            <div className="d-flex align-items-center">
                                <img className="user-image" src="/assets/userImage.png" alt="User" />
                                <div className="px-2">
                                    <div className="user-name-sender">Divya Patel</div>
                                    <div className="product-name-sender">Blue Demin Jacket</div>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="message-time">12:25 PM</div>
                                <div>
                                    <div className="total-send-message d-flex justify-content-center align-items-center">99+</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contactus-container chat-box-side">
                    <div className="d-flex justify-content-between align-items-center chat-box-header">
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
                            <div className="d-flex justify-content-end">
                                <span className="bydefault-message">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad.</span>
                            </div>
                            <div className="d-flex">
                                <span className="incomeing-message">Lorem ipsum dolor sit amet</span>
                            </div>
                            <div className="d-flex justify-content-end">
                                <span className="sending-message">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad.</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <input
                                    type="text"
                                    placeholder="Type your Message"
                                    className="chat-box-message-input"
                                />
                                <div className="send-message">
                                    <img className="send-message-arrow" src="/assets/SendMassage.png" alt="Message" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ChatBox;
