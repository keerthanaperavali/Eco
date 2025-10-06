import React, { useState } from "react";
import "../styles/address.css";

const BookNow = () => {
  const [form, setForm] = useState({
    pincode: "",
    city: "",
    location: "",
    landmark: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Prepare data for backend (only address info, no user info here)
    const addressData = {
      pincode: form.pincode,
      city: form.city,
      location: form.location,
      landmark: form.landmark,
      full_address: form.address,
    };

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User is not authenticated. Please login.");
      }

      const response = await fetch("http://localhost:5000/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Failed to save address");
      }

      const data = await response.json();

      setSuccessMessage(`Address saved successfully for ${data.data.user_name}!`);
      setForm({
        pincode: "",
        city: "",
        location: "",
        landmark: "",
        address: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booknow-container">
      <form className="address-form" onSubmit={handleSubmit}>
        <label>Pincode</label>
        <input
          type="text"
          name="pincode"
          placeholder="Enter Pincode"
          value={form.pincode}
          onChange={handleChange}
          required
        />

        <label>City</label>
        <select name="city" value={form.city} onChange={handleChange} required>
          <option value="">Select City</option>
          <option value="Vijayawada">Vijayawada</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Chennai">Chennai</option>
        </select>

        <label>Location</label>
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          required
        >
          <option value="">Select Location</option>
          <option value="Benz Circle">Benz Circle</option>
          <option value="Madhapur">Madhapur</option>
          <option value="Gachibowli">Gachibowli</option>
        </select>

        <label>Landmark</label>
        <input
          type="text"
          name="landmark"
          placeholder="Enter Landmark"
          value={form.landmark}
          onChange={handleChange}
          required
        />

        <label>Flat No, Block No, Apartment Name, Street</label>
        <textarea
          name="address"
          placeholder="Enter Address"
          value={form.address}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Address"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </form>
    </div>
  );
};

export default BookNow;
