import React from "react";
import "../styles/excellence.css";
import { FaPhoneAlt, FaRecycle, FaTruck, FaLeaf } from "react-icons/fa";
import { MdEventAvailable, MdOutlineCampaign, MdOutlineLocationOn } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";

const Excellence = () => {
  const items = [
    { icon: <FaTruck />, text: "Doorstep E-Waste Collection" },
    { icon: <RiMoneyRupeeCircleLine />, text: "Genuine Pricing Based on Product" },
    { icon: <MdEventAvailable />, text: "Free & Hassle-Free Pickup Service" },
    { icon: <FaPhoneAlt />, text: "24/7 Dedicated Customer Support" },
    { icon: <FaRecycle />, text: "Partnered Recycling with Certified Centers" },
    { icon: <MdOutlineCampaign />, text: "Creating Awareness for a Greener India" },
    { icon: <FaLeaf />, text: "Student-Led Innovation for Sustainability" },
    { icon: <MdOutlineLocationOn />, text: "Expanding Collection Points Across the City" },
  ];

  return (
    <div className="excellence">
      <h2 className="excellence-title">Why We Stand Out</h2>
      <div className="excellence-grid">
        {items.map((item, index) => (
          <div key={index} className="excellence-card">
            <div className="icon">{item.icon}</div>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Excellence;
