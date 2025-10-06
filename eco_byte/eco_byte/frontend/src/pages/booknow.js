import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/booknow.css";
import Steps from "../components/Steps";

const BookNow = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const savedAddresses = [
    { id: 1, label: "Home - 123 Main St" },
    { id: 2, label: "Office - 456 Work Ave" },
  ];

  // Function to map snake_case bookingDetails to camelCase formData,
  // and map address label back to savedAddresses id for radio select
  const mapBookingDetailsToFormData = (details) => {
    if (!details) return null;

    const selectedAddressId =
      savedAddresses.find((addr) => addr.label === details.address)?.id || "";

    return {
      areaType: details.area_type || "",
      orderType: details.order_type || "",
      selectedAddressId: selectedAddressId,
      alternateNumber: details.alternate_number || "",
      scrapType: details.scrap_type || "",
      pickupDate: details.pickup_date || "",
    };
  };

  const initialData = mapBookingDetailsToFormData(location.state?.formData) || {
    areaType: "",
    orderType: "",
    selectedAddressId: "",
    alternateNumber: "",
    scrapType: "",
    pickupDate: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    if (e.target.name === "alternateNumber") {
      const val = e.target.value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, alternateNumber: val }));
      setErrors((prev) => ({ ...prev, alternateNumber: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.areaType) newErrors.areaType = "Please select Area type.";
    if (!formData.orderType) newErrors.orderType = "Please select Order type.";
    if (!formData.selectedAddressId)
      newErrors.selectedAddressId = "Please select Address.";
    if (!formData.alternateNumber)
      newErrors.alternateNumber = "Alternate number required.";
    else if (!/^[6-9]\d{9}$/.test(formData.alternateNumber))
      newErrors.alternateNumber = "Enter valid 10-digit phone number.";
    if (!formData.scrapType.trim())
      newErrors.scrapType = "Scrap type required.";
    if (!formData.pickupDate) newErrors.pickupDate = "Pickup date required.";
    else if (formData.pickupDate < today)
      newErrors.pickupDate = "Pickup date cannot be in the past.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedAddressObj = savedAddresses.find(
      (addr) => addr.id === Number(formData.selectedAddressId)
    );

    const payload = {
      area_type: formData.areaType,
      order_type: formData.orderType,
      address: selectedAddressObj ? selectedAddressObj.label : "",
      alternate_number: formData.alternateNumber,
      scrap_type: formData.scrapType,
      pickup_date: formData.pickupDate,
      status: "incomplete",
    };

    navigate("/booking-confirmation", { state: { bookingDetails: payload } });
  };

  return (
    <div className="booknow-bg">
      <div className="booknow-center">
        {/* <Steps activeStep={2} /> */}

        <form className="booknow-form" onSubmit={handleSubmit} noValidate>
          <div className="address-header">
            <h2>Pick Up Details</h2>
            <a href="/address" className="add-address">
              Add new address
            </a>
          </div>

          <div className="form-group">
            <label>Area Type</label>
            <div className="pickup-options">
              {["Residential", "Commercial"].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="areaType"
                    value={type}
                    checked={formData.areaType === type}
                    onChange={handleChange}
                  />{" "}
                  {type}
                </label>
              ))}
            </div>
            {errors.areaType && <p className="error">{errors.areaType}</p>}
          </div>

          <div className="form-group">
            <label>Order Type</label>
            <div className="pickup-options">
              {["Sell", "Donate"].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="orderType"
                    value={type}
                    checked={formData.orderType === type}
                    onChange={handleChange}
                  />{" "}
                  {type}
                </label>
              ))}
            </div>
            {errors.orderType && <p className="error">{errors.orderType}</p>}
          </div>

          <div className="form-group">
            <label>Select Address</label>
            {savedAddresses.map((addr) => (
              <label key={addr.id} style={{ display: "block", marginBottom: "6px" }}>
                <input
                  type="radio"
                  name="selectedAddressId"
                  value={addr.id}
                  checked={Number(formData.selectedAddressId) === addr.id}
                  onChange={handleChange}
                />{" "}
                {addr.label}
              </label>
            ))}
            {errors.selectedAddressId && <p className="error">{errors.selectedAddressId}</p>}
          </div>

          <div className="form-group">
            <label>Alternate Number</label>
            <input
              type="text"
              name="alternateNumber"
              placeholder="Alternate Number"
              value={formData.alternateNumber}
              onChange={handleChange}
              maxLength={10}
              inputMode="numeric"
            />
            {errors.alternateNumber && <p className="error">{errors.alternateNumber}</p>}
          </div>

          <div className="form-group">
            <label>Scrap type</label>
            <textarea
              name="scrapType"
              placeholder="Scrap"
              value={formData.scrapType}
              onChange={handleChange}
              rows={3}
            />
            {errors.scrapType && <p className="error">{errors.scrapType}</p>}
          </div>

          <div className="form-group">
            <label>Pick up Date</label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              min={today}
              onChange={handleChange}
            />
            {errors.pickupDate && <p className="error">{errors.pickupDate}</p>}
          </div>

          <button type="submit" className="submit-btn">Submit</button>

          <p className="booking-note">
            <strong>Note:</strong> We request you maintain a minimum of 10 KG
            (or 100 rupees) in scrap. Please review our{" "}
            <a href="/Pricing" rel="noopener noreferrer">Scrap price list</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookNow;
