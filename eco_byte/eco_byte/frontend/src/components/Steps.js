import React from "react";
import "../styles/Steps.css"; // Adjust path according to your structure

export default function Steps({ activeStep = 1 }) {
  const steps = [
    "Identity Check",
    "Schedule Info",
    "Booking Summary"
  ];
  return (
    <div className="steps-page-bg">
      <div className="step-progress">
        {steps.map((label, idx) => {
          const num = idx + 1;
          const isActive = activeStep === num;
          return (
            <div key={label} className={`step${isActive ? " active" : ""}`}>
              <div className="step-number">{num}</div>
              <div className="step-label">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
