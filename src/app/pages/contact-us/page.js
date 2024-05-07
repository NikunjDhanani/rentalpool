"use client"
import Image from "next/image";
import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "", // Add last name field
    email: "",
    contact_no: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}users/contact_us/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          first_name: "",
          last_name: "", // Reset last name field
          email: "",
          contact_no: "",
          message: "",
        });
      } else {
        console.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="contactus-container">
        <h2 className="contactus-heading">Contact Us</h2>
        <hr className="contact-btm-hr" />
        <div className="row">
          <div className="col-lg-4 col-12">
            <div className="callus-div row">
              <div className="col-12 col-sm-6 col-lg-12">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <Image
                    src="/assets/icons/icons-phone.png"
                    height={30}
                    width={30}
                    alt="call"
                  />
                  <a>Call to us</a>
                </div>
                <p>We are available 24/7, 7 days a week. phone: +91 </p>
              </div>
              <hr />
              <div className="col-12 col-sm-6 col-lg-12">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <Image
                    src="/assets/icons/icons-mail.png"
                    height={30}
                    width={30}
                    alt="email"
                  />
                  <a>Write to us</a>
                </div>
                <p>
                  Fill out our form and we will contact you as soon as possible
                  or mailing us on Email: support@rentalspool.com
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-12 mt-4 mt-lg-0">
            <div className="contact-form">
              <form
                onSubmit={handleSubmit}
                className="row g-3 justify-content-center"
              >
                <div className="col-md-6">
                  <label htmlFor="fullname" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastname" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="contactnumber" className="form-label">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="contact_no"
                    value={formData.contact_no}
                    onChange={handleChange}
                    placeholder="Contact Number"
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="inputEmail4" className="form-label">
                    Email ID
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email ID"
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="message" className="form-label">
                    Your Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Your Message"
                  ></textarea>
                </div>
                <div className="col-12 contact-submit">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
