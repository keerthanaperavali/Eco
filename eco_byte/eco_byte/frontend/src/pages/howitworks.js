import React, { useState, useRef } from "react";
import { FaCalendarAlt, FaTruck, FaGift, FaRecycle, FaLeaf } from "react-icons/fa";
import "../styles/howitworks.css"; // Assuming you have a CSS file for styling

const steps = [
  { id: 1, title: "Schedule Pickup", icon: <FaCalendarAlt />, description: ["Convenient Booking: Choose your preferred date and time for e-waste collection.", "Easy Process: Share details of the items you want to recycle."] },
  { id: 2, title: "We Collect", icon: <FaTruck />, description: ["Doorstep Service: Our team arrives at your location to collect e-waste.", "Safe Handling: Items are carefully packed and transported."] },
  { id: 3, title: "Get Rewards", icon: <FaGift />, description: ["Instant Value: Receive cash, vouchers, or reward points for your e-waste.", "Transparent Process: Rewards are based on item type and weight."] },
  { id: 4, title: "Recycle Safely", icon: <FaRecycle />, description: ["Eco-Friendly: E-waste is sent to authorized recycling facilities.", "Responsible Disposal: Harmful materials are treated safely."] },
  { id: 5, title: "Greener Future", icon: <FaLeaf />, description: ["Sustainable Impact: Help reduce pollution and protect natural resources.", "Your Contribution: Every step counts towards a cleaner planet."] }
];

export default function Steps() {
  const [progress, setProgress] = useState(0);
  const lineRef = useRef();
  const isMobile = window.innerWidth <= 768;

  const updateProgress = (clientX, clientY) => {
    const rect = lineRef.current.getBoundingClientRect();
    let percent;
    if (isMobile) {
      percent = ((clientY - rect.top) / rect.height) * 100;
    } else {
      percent = ((clientX - rect.left) / rect.width) * 100;
    }
    percent = Math.max(0, Math.min(100, percent));
    setProgress(percent);
  };

  const handleMouseMove = (e) => {
    updateProgress(e.clientX, e.clientY);
  };

  const handleTouchMove = (e) => {
    if (e.touches[0]) {
      updateProgress(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Find the active step based on progress
  const activeStep = Math.floor(progress / (100 / (steps.length - 1)));

  return (
    <div
      className="steps-container"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <h2 className="steps-heading">Execution Flow</h2>
      <div
        className={`steps-line${isMobile ? " vertical" : ""}`}
        ref={lineRef}
      >
        <div
          className="steps-progress"
          style={
            isMobile
              ? { height: `${progress}%` }
              : { width: `${progress}%` }
          }
        ></div>

        {steps.map((step, idx) => {
          const stepPercent = (idx / (steps.length - 1)) * 100;
          const isActive = idx === activeStep;
          const isPassed = idx < activeStep;
          return (
            <div
              key={step.id}
              className={`step-number${isActive ? " active" : ""}${isPassed ? " passed" : ""}`}
              style={
                isMobile
                  ? { top: `${stepPercent}%`, left: 0 }
                  : { left: `${stepPercent}%`, top: 0 }
              }
            >
              <span className="circle">{idx + 1}</span>
            </div>
          );
        })}
      </div>

      <div className="steps-items">
        {steps.map((step, i) => (
          <div className={`step${i === activeStep ? " active" : ""}`} key={step.id}>
            <div className="step-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <ul>
              {step.description.map((text, j) => (
                <li key={j}>{text}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
