import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Step 1: Request OTP
  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (data.success) {
        alert("OTP sent successfully!");
        setStep("otp");
      } else if (data.message === "User not found, please sign up") {
        alert("User not found. Please sign up first.");
        navigate("/SchedulePickup");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error. Please try again.");
    }
    setLoading(false);
  };

  // ✅ Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/profile");
        window.location.reload();
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          {step === "phone" ? "Welcome Back " : "Verify OTP "}
        </h2>
        <p className="login-subtitle">
          {step === "phone"
            ? "Enter your mobile number to receive an OTP"
            : "Enter the 6-digit OTP sent to your phone"}
        </p>

        {step === "phone" ? (
          <>
            <input
              type="tel"
              className="login-input"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
            />
            <button
              className="login-btn"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <p className="signup-prompt">
              Don&apos;t have an account?{" "}
              <span
                className="signup-link"
                onClick={() => navigate("/SchedulePickup")}
              >
                Sign up
              </span>
            </p>
          </>
        ) : (
          <>
            <input
              type="number"
              className="login-input"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
            />
            <button
              className="login-btn"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <p
              className="resend-otp"
              onClick={handleSendOtp}
              style={{ cursor: "pointer" }}
            >
              Resend OTP
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
