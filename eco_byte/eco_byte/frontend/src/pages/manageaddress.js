import React, { useState } from "react";
import "../styles/manageaddress.css";
import { FaPlus, FaTrash, FaEdit, FaHome, FaBuilding } from "react-icons/fa";

export default function ManageAddresses() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      details: "Osahan House, Jawaddi Kalan, Ludhiana, Punjab 141002, India",
    },
    {
      id: 2,
      type: "Work",
      details:
        "NCC, Model Town Rd, Pritm Nagar, Model Town, Ludhiana, Punjab 141002, India",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form, setForm] = useState({
    pincode: "",
    city: "",
    location: "",
    landmark: "",
    address: "",
  });

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update address
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAddress) {
      // Update existing address
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id
            ? {
                ...addr,
                type: form.location || "Other",
                details: `${form.address}, ${form.landmark}, ${form.city}, ${form.pincode}`,
              }
            : addr
        )
      );
    } else {
      // Add new address
      const newAddress = {
        id: Date.now(),
        type: form.location || "Other",
        details: `${form.address}, ${form.landmark}, ${form.city}, ${form.pincode}`,
      };
      setAddresses([...addresses, newAddress]);
    }

    // Reset form & modal
    setForm({ pincode: "", city: "", location: "", landmark: "", address: "" });
    setEditingAddress(null);
    setShowModal(false);
  };

  // Delete address
  const handleDelete = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  // Edit address
  const handleEdit = (address) => {
    setEditingAddress(address);
    const detailsArr = address.details.split(",").map((d) => d.trim());
    setForm({
      address: detailsArr[0] || "",
      landmark: detailsArr[1] || "",
      city: detailsArr[2] || "",
      pincode: detailsArr[3] || "",
      location: address.type,
    });
    setShowModal(true);
  };

  return (
    <div className="address-container">
      <div className="header">
        <h2>Manage Addresses</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Address
        </button>
      </div>

      <div className="address-list">
        {addresses.map((address) => (
          <div key={address.id} className="address-card">
            <h3>
              {address.type === "Home" ? <FaHome /> : <FaBuilding />} {address.type}
            </h3>
            <p>{address.details}</p>
            <div className="card-actions">
              <button className="edit-btn" onClick={() => handleEdit(address)}>
                <FaEdit />
              </button>
              <button className="delete-btn" onClick={() => handleDelete(address.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay">
          <div className="booknow-container">
            <h2 className="title">{editingAddress ? "Edit Address" : ""}</h2>
            <form className="address-form" onSubmit={handleSubmit}>
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Enter Pincode"
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
              <select name="location" value={form.location} onChange={handleChange} required>
                <option value="">Select Location</option>
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>

              <label>Landmark</label>
              <input
                type="text"
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                placeholder="Enter Landmark"
                required
              />

              <label>Flat No, Block, Apartment, Street</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter Address"
                required
              ></textarea>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingAddress ? "Update Address" : "Save Address"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAddress(null);
                    setForm({ pincode: "", city: "", location: "", landmark: "", address: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
