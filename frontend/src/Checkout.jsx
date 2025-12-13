import React, { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles/checkout.css";

// Helper to resolve image URLs
const resolveImageUrl = (url) => {
  if (!url) return "/snaps/placeholder.png";
  if (url.startsWith("/uploads")) return `http://localhost:5000${url}`;
  if (url.startsWith("http")) return url;
  return url;
};

export default function Checkout() {
  const { items, clear } = useContext(CartContext);
  const { token } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Form data
  const [formData, setFormData] = useState({
    // Shipping
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    // Billing
    billingSame: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
      if (!formData.email.trim()) newErrors.email = "Email required";
      if (!formData.email.includes("@"))
        newErrors.email = "Valid email required";
      if (!formData.phone.trim()) newErrors.phone = "Phone required";
    }

    if (stepNum === 2) {
      if (!formData.address.trim()) newErrors.address = "Address required";
      if (!formData.city.trim()) newErrors.city = "City required";
      if (!formData.state.trim()) newErrors.state = "State required";
      if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code required";
      if (!formData.country.trim()) newErrors.country = "Country required";

      if (!formData.billingSame) {
        if (!formData.billingAddress.trim())
          newErrors.billingAddress = "Address required";
        if (!formData.billingCity.trim())
          newErrors.billingCity = "City required";
        if (!formData.billingState.trim())
          newErrors.billingState = "State required";
        if (!formData.billingZipCode.trim())
          newErrors.billingZipCode = "Zip code required";
        if (!formData.billingCountry.trim())
          newErrors.billingCountry = "Country required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      // Summary data ready
      setStep(4);
    }
  };

  const handleConfirm = async () => {
    try {
      // Prepare order data
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        billing: formData.billingSame
          ? {
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
            }
          : {
              address: formData.billingAddress,
              city: formData.billingCity,
              state: formData.billingState,
              zipCode: formData.billingZipCode,
              country: formData.billingCountry,
            },
        items: items.map((it) => ({
          product: it._id,
          name: it.name,
          image: it.image || it.imageUrl || (it.images && it.images[0]) || "",
          price: it.price,
          quantity: it.quantity || 1,
        })),
        subtotal,
        tax: Number(tax),
        total: Number(grandTotal),
        status: "pending",
      };

      // Send to backend (auth required)
      const res = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to place order");
      }
      const created = await res.json();

      // For now, just show success and clear cart
      clear();
      navigate("/profile", { state: { orderId: created._id } });
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  // Redirect if cart is empty
  if (!items || items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="empty-cart-msg">
          <h2>Your cart is empty</h2>
          <p>Add some sweets before checking out!</p>
          <button className="btn-primary" onClick={() => navigate("/sweets")}>
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const subtotal = total;
  const tax = (subtotal * 0.1).toFixed(2); // 10% tax
  const grandTotal = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        {/* Progress Stepper */}
        <div className="progress-stepper">
          <div
            className={`step ${step >= 1 ? "active" : ""} ${
              step > 1 ? "completed" : ""
            }`}
          >
            <span className="step-num">1</span>
            <span className="step-label">Contact</span>
          </div>
          <div className="step-line"></div>
          <div
            className={`step ${step >= 2 ? "active" : ""} ${
              step > 2 ? "completed" : ""
            }`}
          >
            <span className="step-num">2</span>
            <span className="step-label">Address</span>
          </div>
          <div className="step-line"></div>
          <div
            className={`step ${step >= 3 ? "active" : ""} ${
              step > 3 ? "completed" : ""
            }`}
          >
            <span className="step-num">3</span>
            <span className="step-label">Review</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 4 ? "active" : ""}`}>
            <span className="step-num">4</span>
            <span className="step-label">Confirm</span>
          </div>
        </div>

        <div className="checkout-wrap">
          {/* Main Form */}
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Contact Info */}
              {step === 1 && (
                <section className="form-section">
                  <h2>Contact Information</h2>
                  <p className="section-desc">
                    We'll use this to send you updates about your order.
                  </p>

                  <div className="form-group full">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className={errors.email ? "input-error" : ""}
                    />
                    {errors.email && (
                      <span className="error-msg">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className={errors.firstName ? "input-error" : ""}
                      />
                      {errors.firstName && (
                        <span className="error-msg">{errors.firstName}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className={errors.lastName ? "input-error" : ""}
                      />
                      {errors.lastName && (
                        <span className="error-msg">{errors.lastName}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className={errors.phone ? "input-error" : ""}
                    />
                    {errors.phone && (
                      <span className="error-msg">{errors.phone}</span>
                    )}
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary"
                    >
                      Continue to Address
                    </button>
                  </div>
                </section>
              )}

              {/* Step 2: Address Info */}
              {step === 2 && (
                <section className="form-section">
                  <h2>Shipping Address</h2>
                  <p className="section-desc">
                    Where should we send your sweet box?
                  </p>

                  <div className="form-group full">
                    <label>Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St"
                      className={errors.address ? "input-error" : ""}
                    />
                    {errors.address && (
                      <span className="error-msg">{errors.address}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className={errors.city ? "input-error" : ""}
                      />
                      {errors.city && (
                        <span className="error-msg">{errors.city}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        className={errors.state ? "input-error" : ""}
                      />
                      {errors.state && (
                        <span className="error-msg">{errors.state}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className={errors.zipCode ? "input-error" : ""}
                      />
                      {errors.zipCode && (
                        <span className="error-msg">{errors.zipCode}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="United States"
                        className={errors.country ? "input-error" : ""}
                      />
                      {errors.country && (
                        <span className="error-msg">{errors.country}</span>
                      )}
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="divider"></div>
                  <h3>Billing Address</h3>

                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="billingSame"
                      checked={formData.billingSame}
                      onChange={handleInputChange}
                      id="billingSame"
                    />
                    <label htmlFor="billingSame">
                      Same as shipping address
                    </label>
                  </div>

                  {!formData.billingSame && (
                    <>
                      <div className="form-group full">
                        <label>Street Address</label>
                        <input
                          type="text"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          placeholder="123 Main St"
                          className={errors.billingAddress ? "input-error" : ""}
                        />
                        {errors.billingAddress && (
                          <span className="error-msg">
                            {errors.billingAddress}
                          </span>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>City</label>
                          <input
                            type="text"
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleInputChange}
                            placeholder="New York"
                            className={errors.billingCity ? "input-error" : ""}
                          />
                          {errors.billingCity && (
                            <span className="error-msg">
                              {errors.billingCity}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label>State</label>
                          <input
                            type="text"
                            name="billingState"
                            value={formData.billingState}
                            onChange={handleInputChange}
                            placeholder="NY"
                            className={errors.billingState ? "input-error" : ""}
                          />
                          {errors.billingState && (
                            <span className="error-msg">
                              {errors.billingState}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Zip Code</label>
                          <input
                            type="text"
                            name="billingZipCode"
                            value={formData.billingZipCode}
                            onChange={handleInputChange}
                            placeholder="10001"
                            className={
                              errors.billingZipCode ? "input-error" : ""
                            }
                          />
                          {errors.billingZipCode && (
                            <span className="error-msg">
                              {errors.billingZipCode}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label>Country</label>
                          <input
                            type="text"
                            name="billingCountry"
                            value={formData.billingCountry}
                            onChange={handleInputChange}
                            placeholder="United States"
                            className={
                              errors.billingCountry ? "input-error" : ""
                            }
                          />
                          {errors.billingCountry && (
                            <span className="error-msg">
                              {errors.billingCountry}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary"
                    >
                      Review Order
                    </button>
                  </div>
                </section>
              )}

              {/* Step 3: Order Review */}
              {step === 3 && (
                <section className="form-section">
                  <h2>Review Your Order</h2>

                  <div className="review-box">
                    <h3>Contact Information</h3>
                    <p>
                      <strong>
                        {formData.firstName} {formData.lastName}
                      </strong>
                    </p>
                    <p>{formData.email}</p>
                    <p>{formData.phone}</p>
                  </div>

                  <div className="review-box">
                    <h3>Shipping Address</h3>
                    <p>{formData.address}</p>
                    <p>
                      {formData.city}, {formData.state} {formData.zipCode}
                    </p>
                    <p>{formData.country}</p>
                  </div>

                  {!formData.billingSame && (
                    <div className="review-box">
                      <h3>Billing Address</h3>
                      <p>{formData.billingAddress}</p>
                      <p>
                        {formData.billingCity}, {formData.billingState}{" "}
                        {formData.billingZipCode}
                      </p>
                      <p>{formData.billingCountry}</p>
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary"
                    >
                      Continue to Checkout
                    </button>
                  </div>
                </section>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <section className="form-section">
                  <h2>Confirm Order</h2>
                  <p className="section-desc">
                    Ready to place your order? Click below to proceed.
                  </p>

                  <div className="confirmation-notice">
                    <h3>✓ Order Summary</h3>
                    <p>
                      You're about to order{" "}
                      <strong>{items.length} item(s)</strong> for
                    </p>
                    <p className="order-total">₹{grandTotal}</p>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="btn-primary btn-large"
                    >
                      Place Order
                    </button>
                  </div>
                </section>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="order-summary">
            <h3>Order Summary</h3>

            <div className="summary-items">
              {items.map((item) => (
                <div key={item._id} className="summary-item">
                  <img
                    src={resolveImageUrl(
                      item.image ||
                        item.imageUrl ||
                        (item.images && item.images[0])
                    )}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src = "/snaps/placeholder.png";
                    }}
                  />
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Qty: {item.quantity || 1}</p>
                  </div>
                  <p className="item-price">
                    ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (10%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="total-row total-grand">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <div className="trust-badges">
              <p>✓ Secure Checkout</p>
              <p>✓ Free Shipping Over ₹500</p>
              <p>✓ 100% Fresh Guarantee</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
