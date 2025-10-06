import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/booking-confirmation.css";
import Steps from "../components/Steps";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const bookingDetails = location.state?.bookingDetails;

  // Redirect if no booking data
  useEffect(() => {
    if (!bookingDetails) {
      navigate("/booknow");
    }
  }, [bookingDetails, navigate]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // ✅ get logged-in user from localStorage safely
      const userJSON = localStorage.getItem("user");
      const user = userJSON ? JSON.parse(userJSON) : null;

      if (!user) {
        alert("Please log in first to confirm booking");
        navigate("/login");
        return;
      }

      // ✅ merge user info with booking details
      const payload = {
        ...bookingDetails,
        user_id: user.id,
        user_name: user.name,
        user_phone: user.phone,
      };

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Failed to save booking");
        return;
      }

      alert("Pickup Confirmed ✅");
      navigate("/"); // redirect to home or profile page
    } catch (err) {
      alert("Error saving booking: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) {
    return null; // already redirected
  }

  return (
    <div className="confirmation-bg">
      <div className="confirmation-center">
        {/* <Steps activeStep={3} /> */}
        <div className="confirmation-card">
          <h2>Confirm your Pickup Request</h2>
          <div className="section-detail">
            <h4>Pickup Details</h4>
            <table>
              <tbody>
                <tr>
                  <td>🏠 Area Type</td>
                  <td className="confirm-val">{bookingDetails.area_type}</td>
                </tr>
                <tr>
                  <td>📦 Order Type</td>
                  <td className="confirm-val">{bookingDetails.order_type}</td>
                </tr>
                <tr>
                  <td>📱 Alternate Mobile</td>
                  <td className="confirm-val">{bookingDetails.alternate_number}</td>
                </tr>
                <tr>
                  <td>📝 Scrap Type</td>
                  <td className="confirm-val">{bookingDetails.scrap_type}</td>
                </tr>
                <tr>
                  <td>📅 Pickup Date</td>
                  <td className="confirm-val">{bookingDetails.pickup_date}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="confirmation-actions">
            <button
              className="edit-btn"
              onClick={() => navigate("/booknow", { state: { formData: bookingDetails } })}
              disabled={loading}
            >
              Edit
            </button>

            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
