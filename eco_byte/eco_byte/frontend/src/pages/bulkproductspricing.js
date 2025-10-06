import React from "react";
import "../styles/bulkproductspricing.css"; // Import CSS

const Pricing = () => {
  return (
    <div className="pricing-container">
      <h1 className="pricing-title">Affordable E-Waste Recycling Plans</h1>
      <p className="pricing-subtitle">
        Choose a plan that suits your needs — fair, transparent, and eco-friendly pricing.
      </p>

      {/* Pricing Cards */}
      <div className="pricing-cards">
        {/* Card 1 */}
        <div className="card">
          <h2 className="card-title">Basic Plan</h2>
          <p className="card-price">₹50/kg</p>
          <ul className="card-features">
            <li>✔ Free Pickup</li>
            <li>✔ Safe Disposal</li>
            <li>✘ No Cashback</li>
          </ul>
          <button className="card-btn">Choose Plan</button>
        </div>

        {/* Card 2 */}
        <div className="card highlight">
          <h2 className="card-title">Standard Plan</h2>
          <p className="card-price">₹100/kg</p>
          <ul className="card-features">
            <li>✔ Free Pickup</li>
            <li>✔ Safe Disposal</li>
            <li>✔ Cashback Included</li>
          </ul>
          <button className="card-btn">Choose Plan</button>
        </div>

        {/* Card 3 */}
        <div className="card">
          <h2 className="card-title">Premium Plan</h2>
          <p className="card-price">₹150/kg</p>
          <ul className="card-features">
            <li>✔ Free Pickup</li>
            <li>✔ Safe Disposal</li>
            <li>✔ Cashback Included</li>
            <li>✔ Priority Service</li>
          </ul>
          <button className="card-btn">Choose Plan</button>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h3>Start recycling today and earn while saving the planet!</h3>
        <button className="cta-btn">Get a Free Quote →</button>
      </div>
    </div>
  );
};

export default Pricing;