import React, { useState, useEffect } from "react";
import "../styles/SchedulePickup.css";
import { useNavigate } from "react-router-dom";
import Steps from "../components/Steps";

const SchedulePickupVerification = () => {
  const navigate = useNavigate();

  // Step control: 'signup' -> 'otp' -> 'done'
  const [verificationStep, setVerificationStep] = useState("signup"); // start at signup
  const [loading, setLoading] = useState(false);

  // Signup/user states
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // OTP states
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("info"); // "error" or "success"

  // Success message after signup complete
  const [successMessage, setSuccessMessage] = useState("");

  // Resend timer effect
  useEffect(() => {
    if (verificationStep === "otp" && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(t => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer, verificationStep]);

  // Check user existence (for signup step)
  const checkUserExists = async (phone) => {
    try {
      const response = await fetch(`http://localhost:5000/api/check-user?phone=${phone}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return data.exists;
    } catch (error) {
      setAlertMsg("Failed to check user existence. Try again.");
      setAlertType("error");
      return null;
    }
  };

  // Handle signup submit (collect info, send OTP, go to OTP screen)
  const handleSignup = async (e) => {
    e.preventDefault();
    setAlertMsg("");
    if (mobile.length !== 10) {
      setAlertMsg("Please enter a valid 10-digit mobile number.");
      setAlertType("error");
      return;
    }
    if (!name.trim()) {
      setAlertMsg("Please enter your name.");
      setAlertType("error");
      return;
    }
    if (!email.trim()) {
      setAlertMsg("Please enter your email.");
      setAlertType("error");
      return;
    }
    setLoading(true);
    const exists = await checkUserExists(mobile);
    if (exists === null) {
      setLoading(false);
      return;
    }
    if (exists) {
      setAlertMsg("User already exists. Please login instead.");
      setAlertType("error");
      setLoading(false);
      return;
    }
    // Send OTP step
    try {
      const res = await fetch("http://localhost:5000/send-otp-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile }),
      });
      const data = await res.json();
      if (data.success) {
        setVerificationStep("otp");
        setResendTimer(60);
        setOtp("");
        setAlertMsg("");
      } else {
        setAlertMsg(data.message || "Failed to send OTP.");
        setAlertType("error");
      }
    } catch {
      setAlertMsg("Failed to send OTP. Try again.");
      setAlertType("error");
    }
    setLoading(false);
  };

  // OTP verify
  const handleVerifyOtpButton = async () => {
    if (otp.length !== 6) {
      setAlertMsg("Please enter the 6-digit OTP.");
      setAlertType("error");
      return;
    }
    setLoading(true);
    setAlertMsg("");
    try {
      const res = await fetch("http://localhost:5000/verify-otp-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile, otp }),
      });
      const data = await res.json();
      if (data.success) {
        // Proceed to actual user creation
        const userResponse = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: mobile, name, email }),
        });
        if (userResponse.ok) {
          setSuccessMessage("User created successfully! Now you can log in with your credentials.");
          setVerificationStep("done");
        } else {
          setAlertMsg("Failed to save user after OTP. Try again.");
          setAlertType("error");
        }
      } else {
        setAlertMsg(data.message || "Invalid or expired OTP.");
        setAlertType("error");
        setOtp("");
      }
    } catch {
      setAlertMsg("Failed to verify OTP. Try again.");
      setAlertType("error");
      setOtp("");
    }
    setLoading(false);
  };

  // Resend OTP logic
  const handleResendOtp = async () => {
    if (resendTimer !== 0) return;
    setLoading(true);
    setAlertMsg("");
    try {
      const res = await fetch("http://localhost:5000/send-otp-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg("OTP resent successfully.");
        setAlertType("success");
        setResendTimer(60);
        setOtp("");
      } else {
        setAlertMsg(data.message || "Failed to resend OTP.");
        setAlertType("error");
      }
    } catch {
      setAlertMsg("Failed to resend OTP. Please try again.");
      setAlertType("error");
    }
    setLoading(false);
  };

  // Render logic
  return (
    <div className="pickup-container">
      {verificationStep === "signup" && (
        <form className="pickup-card" onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          <input
            type="tel"
            className="mobile-input"
            placeholder="Enter your Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            maxLength={10}
            disabled={loading}
          />
          <input
            type="text"
            className="mobile-input"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <input
            type="email"
            className="mobile-input"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{ marginBottom: "24px" }}
          />
          <button className="verify-btn" type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Sign Up & Get OTP"}
          </button>
          {alertMsg && (
            <div
              style={{
                color: alertType === "error" ? "#d04444" : "#39832E",
                marginTop: "11px",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              {alertMsg}
            </div>
          )}
        </form>
      )}

      {verificationStep === "otp" && (
        <div className="pickup-card otp-modal">
          <h2>Verify OTP</h2>
          <div className="info-text">Enter the 6-digit OTP sent to your phone</div>
          <input
            type="text"
            className="mobile-input"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            disabled={loading}
            style={{ marginBottom: 0 }}
          />
          <button
            className="verify-btn"
            onClick={handleVerifyOtpButton}
            disabled={otp.length !== 6 || loading}
            style={{ marginTop: "22px" }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <div
            className="resend-otp"
            onClick={handleResendOtp}
            style={{
              color: resendTimer > 0 ? "#cc6d6d" : "#3056d3",
              cursor: resendTimer === 0 ? "pointer" : "default",
              marginBottom: 0,
              marginTop: "7px",
              pointerEvents: resendTimer > 0 ? "none" : "auto"
            }}
          >
            Resend OTP
          </div>
          {alertMsg && (
            <div
              style={{
                color: alertType === "error" ? "#d04444" : "#39832E",
                marginTop: "15px",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              {alertMsg}
            </div>
          )}
        </div>
      )}

      {verificationStep === "done" && (
        <div className="pickup-card">
          <div
            className="success-msg"
            style={{ marginTop: "20px", textAlign: "center", color: "#39832E", fontWeight: "600" }}
          >
            {successMessage}
          </div>
          <button className="verify-btn" style={{ marginTop: "15px" }} onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default SchedulePickupVerification;
