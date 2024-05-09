"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const ChatBox = () => {
    const [senderMessageDetails, setSenderMessageDetails] = useState([]);
    const [senderUserDerails, setSenderUserDerails] = useState([]);

    const authToken = localStorage.getItem("authToken");

    const socket = io.connect('wss://rentalspool.com/ws/chat/46/');
    console.log("SOCKLET", socket)

    useEffect(() => {
        axios({
            url: `${process.env.NEXT_PUBLIC_BASE_URL}products/myInquiries/`,
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Token ${authToken}`,
            },
        })
            .then((res) => {
                setSenderMessageDetails(res.data)
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    // Function to format date and time
    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleSenderMessageDetails = (data) => {
        setSenderUserDerails(data);
    }

    return (
        <div className="container-lg">
            <div className="mt-3 d-flex justify-content-between">
                <div className="contactus-container p-0 message-sender-side">
                    <h5 className="chat-box-header-name">Chat Box</h5>
                    <div className="message-sender-list">
                        {senderMessageDetails && senderMessageDetails.map((data) => {
                            let key;
                            key = data.whoAmI === 'buyer' ? 'seller' : 'buyer'

                            return (
                                <div key={data.id} className="message-sender d-flex justify-content-between align-items-center px-2 py-1" onClick={() => handleSenderMessageDetails(data)}>
                                    <div className="d-flex align-items-center">
                                        <img className="user-image" src={data[key].image ? data[key].image : "/assets/userImage.png"} alt="User" />
                                        <div className="px-2">
                                            <div className="user-name-sender">{data[key].name}</div>
                                            <div className="product-name-sender">{data.product.title}</div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="message-time">{formatDateTime(data.updated_at)}</div>
                                        {data.unread_messages !== 0 &&
                                            <div>
                                                <div className="total-send-message d-flex justify-content-center align-items-center">{data.unread_messages > 100 ? '99+' : data.unread_messages}</div>
                                            </div>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="contactus-container chat-box-side">
                    <div className="d-flex justify-content-between align-items-center chat-box-header">
                        <div>
                            <img className="user-image" src="/assets/userImage.png" alt="User" />
                            <span className="user-name">{senderUserDerails?.buyer?.name}</span>
                        </div>
                        <div className="d-flex">
                            <span>
                                <div className="product-name">{senderUserDerails?.product?.title}</div>
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
