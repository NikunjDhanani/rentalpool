"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ReactStarRating from "react-star-ratings-component";
import { io } from "socket.io-client";
import styles from "../../_components/profileEditCompo/myPlans/planPayment/planPayment.module.css";
import Image from "next/image";

const ChatBox = () => {
    const [senderMessageDetails, setSenderMessageDetails] = useState([]);
    const [senderUserDerails, setSenderUserDerails] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [numberOfSelectedStar, setNumberOfSelectedStar] = useState(0);
    const [textValue, setTextValue] = useState('');
    const [textMessage, setTextMessage] = useState('');

    const [chatMessage, setChatMessage] = useState('');

    const authToken = localStorage.getItem("authToken");

    const handleClose = () => setOpenModal(false);

    const handleChange = (event) => {
        setTextValue(event.target.value);
    };

    const handleTypeMessage = (event) => {
        setTextMessage(event.target.value);
    };

    const handleSendMessage = async () => {
        try {
            const response = await axios({
                url: `${process.env.NEXT_PUBLIC_BASE_URL}products/sendMessage/`,
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: {
                    message: textMessage,
                    inquiry_id: senderUserDerails?.id,
                    receiver_user_id: senderUserDerails?.whoAmI === 'buyer' ? senderUserDerails?.seller?.id : senderUserDerails?.buyer?.id
                },
            });
            if (response.data.amount > 0) {
                handlePayment(response.data);
            } else {
                handlePaymentCreateZeroOrder(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendReview = async () => {
        try {
            const response = await axios({
                url: `${process.env.NEXT_PUBLIC_BASE_URL}products/submitProductReview/`,
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: {
                    stars: numberOfSelectedStar,
                    message: textValue,
                    product: senderUserDerails?.product?.id
                },
            });
            if (response) {
                setOpenModal(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onConnect = () => {
        console.log("Connect")
    }

    useEffect(() => {
        const socket = io('wss://rentalspool.com/ws/chat/43/', {
            autoConnect: false
        });

        socket.connect();
        socket.on('connect', onConnect);
        socket.on('error', (error) => {
            console.error('Socket connection error:', error);
        });

        // Emit the message to the server
        socket.emit('fetch_old_chat', {
            command: 'fetch_old_chat',
            user_id: 43
        });

        socket.on('fetchallchat', (data) => {
            setChatMessage(data.message);
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);



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
                setSenderMessageDetails(res.data);
                setSenderUserDerails(res.data[0])
            })
            .catch((err) => {
                console.error(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    function isTodayOrFuture(dateString) {
        const givenDate = new Date(dateString);
        const today = new Date();
        // Remove the time component for comparison
        givenDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        // Check if the given date is today or in the future
        return givenDate > today;
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
                                        <Image
                                            className="user-image"
                                            src={data[key].image ? data[key].image : "/assets/userImage.png"}
                                            alt="User"
                                            width={100}
                                            height={100}
                                            layout="responsive"
                                        />
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
                            <Image
                                className="user-image"
                                src={
                                    senderUserDerails?.whoAmI === 'buyer'
                                        ? senderUserDerails?.seller?.image
                                            ? senderUserDerails?.seller?.image
                                            : "/assets/userImage.png"
                                        : senderUserDerails?.buyer?.image
                                            ? senderUserDerails?.buyer?.image
                                            : "/assets/userImage.png"
                                }
                                alt="User"
                                width={100}
                                height={100}
                                layout="responsive"
                            />
                            <span className="user-name">{senderUserDerails?.whoAmI === 'buyer' ? senderUserDerails?.seller?.name : senderUserDerails?.buyer?.name}</span>
                        </div>
                        <div className="d-flex">
                            <span>
                                <div className="product-name">{senderUserDerails?.product?.title}</div>
                                <span className="product-amount">$ 1500/</span><span className="rent-day">day</span>
                            </span>
                            <button className="btn btn-request-review" onClick={() => setOpenModal(true)} disabled={!isTodayOrFuture(new Date(senderUserDerails?.last_date))}>{senderUserDerails?.whoAmI === 'buyer' ? 'Give Review' : 'Request Review'}</button>
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
                                    value={textMessage}
                                    onChange={handleTypeMessage}
                                />
                                <div className="send-message" onClick={handleSendMessage}>
                                    <Image
                                        className="send-message-arrow"
                                        src="/assets/SendMassage.png"
                                        alt="Message"
                                        width={100}
                                        height={100}
                                        layout="responsive"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={openModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className={styles.modal_title}>Give Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center rate_your_experience">Rate your experience</div>
                    <div className="text-center">
                        <ReactStarRating
                            numberOfStar={5}
                            numberOfSelectedStar={numberOfSelectedStar}
                            colorFilledStar="#E7B66B"
                            colorEmptyStar="#525252"
                            starSize="40px"
                            spaceBetweenStar="8px"
                            disableOnSelect={false}
                            onSelectStar={val => setNumberOfSelectedStar(val)}
                        />
                    </div>
                    <div className="write_a_review my-2">Write a Review</div>
                    <textarea className="form-control" id="feedback" rows="5" maxlength="2000" placeholder="Additional Comments..." value={textValue} onChange={handleChange}></textarea>
                    <div className="text-end max_2000_characters mt-2">Max. 2000 characters</div>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <button className="submit_review_btn" onClick={handleSendReview}>Submit Review</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ChatBox;
