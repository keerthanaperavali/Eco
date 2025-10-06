import "../styles/profile.css";
import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Edit, X } from "lucide-react";
import axios from "axios";

const ProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.user_id; // dynamically from login

  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/users/${userId}`)
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);
      })
      .catch((err) => console.error("❌ Error fetching profile:", err));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:5000/users/${userId}`, formData)
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data)); // keep updated
        setIsModalOpen(false);
      })
      .catch((err) => console.error("❌ Error saving profile:", err));
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <User size={28} className="profile-icon" />
          <div className="name-edit-wrapper" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 className="profile-name">{user.name}</h2>
            <Edit size={18} className="edit-btn" onClick={() => setIsModalOpen(true)} style={{ cursor: "pointer" }} />
          </div>
        </div>
        <p className="profile-email">
          <Mail size={16} /> {user.email}
        </p>
        <p className="profile-phone">
          <Phone size={16} /> {user.phone}
        </p>
      </div>

      {/* Dashboard Section */}
      <div className="dashboard-container">
        <h3 className="dashboard-title">Dashboard</h3>
        <div className="dashboard-grid">
          {["All", "Sell", "Donate", "Cancel", "Upcoming", "Completed"].map((item, index) => (
            <div className="dashboard-card" key={index}>
              <h4>{item}</h4>
              <p>Pickup Request: 0</p>
              <p>Quantity: 0kg</p>
              <p>Amount: ₹0</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <X size={20} onClick={() => setIsModalOpen(false)} style={{ cursor: "pointer" }} />
            </div>
            <div className="modal-body">
              <label>
                Name:
                <input name="name" value={formData.name} onChange={handleChange} />
              </label>
              <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </label>
              <label>
                Phone:
                <input name="phone" value={formData.phone} onChange={handleChange} />
              </label>
            </div>
            <div className="modal-footer">
              <button onClick={handleSave} className="btn btn-primary">Save</button>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
