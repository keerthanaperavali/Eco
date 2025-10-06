// src/pages/ServicesPage.js
import React from "react";
import "../styles/services.css";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa"; 
import HowItWorks from "./howitworks";


function ServicesPage() {
  // ✅ Ensure scroll-to-top on button click
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Turning Waste Into Worth</h1>
        <p>
          EcoByte helps you recycle, earn, and contribute to a greener planet.
        </p>
        <Link to="/pricing" onClick={handleScrollTop} className="cta-btn">
          Get Started
        </Link>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-text">
          <h2>Who We Are?</h2>
          <p>
            EcoByte is more than just a recycling initiative — it’s a{" "}
            <strong>student-led startup</strong> where young minds take the lead
            in driving innovation, awareness, and sustainable practices.
            Guided and supported by mentors and staff, our student team ensures
            that every idea turns into real environmental impact.
          </p>
          <p>
            We’re redefining recycling by making it{" "}
            <strong>simple, rewarding, and impactful</strong>. Through
            technology and eco-friendly practices, we give every piece of scrap
            a meaningful purpose — while empowering individuals, businesses, and
            communities to build a greener tomorrow together.
          </p>
          <ul>
            <li>Transparent Pricing</li>
            <li>Hassle-Free Pickup</li>
            <li>Measurable Environmental Impact</li>
            <li>Student-Driven Innovation with Staff Support</li>
          </ul>
        </div>
        <div className="about-img">
          <img src="/assets/about.png" alt="About EcoByte" />
        </div>
      </section>

            <HowItWorks />


      {/* Why EcoByte Section */}
      

      {/* Who Can Sell Section */}
      <section className="who-section">
        <h2>Who Can Sell Scrap to Us?</h2>
        <div className="who-cards">
          {[
            {
              title: "Households",
              icon: "🏠",
              desc: "Sell your daily recyclables easily.",
              img: "/assets/house.png",
            },
            {
              title: "Businesses",
              icon: "🏢",
              desc: "Bulk waste & eWaste solutions.",
              img: "/assets/business.png",
            },
            {
              title: "Students",
              icon: "🎓",
              desc: "Earn pocket money & recycle responsibly.",
              img: "/assets/student.png",
            },
            {
              title: "Institutions",
              icon: "🏫",
              desc: "Large-scale eWaste handling.",
              img: "/assets/institute.png",
            },
          ].map((item, index) => (
            <div key={index} className="who-card">
              <div className="who-card-inner">
                {/* Front */}
                <div className="who-card-front">
                  <span className="who-icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                {/* Back */}
                <div className="who-card-back">
                  <img src={item.img} alt={item.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Donate eWaste Section */}
      <section className="donate-section">
        <h2>Donate eWaste</h2>
        <p>
          Join our mission! Together, we’ve saved{" "}
          <span className="impact">120+ tons</span> of eWaste from landfills.
        </p>
        <Link to="/booknow" onClick={handleScrollTop} className="cta-btn">
          Donate Now
        </Link>
      </section>

      {/* EcoByte Difference Section */}
      <section className="difference-section">
        <h2>The EcoByte Difference</h2>
        <p>See how your small action creates a big impact 🌍</p>
        <div className="difference-cards">
          <div className="diff-card">
            <div className="before">
              🗑️ <h3>Before</h3>
              <p>E-waste dumped, polluting landfills</p>
            </div>
            <div className="after">
              ♻️ <h3>After EcoByte</h3>
              <p>Recycled safely, creating reusable materials</p>
            </div>
          </div>

          <div className="diff-card">
            <div className="before">
              🌳 <h3>Before</h3>
              <p>Trees cut for new resources</p>
            </div>
            <div className="after">
              🌱 <h3>After EcoByte</h3>
              <p>Resources saved, nature protected</p>
            </div>
          </div>

          <div className="diff-card">
            <div className="before">
              ⚡ <h3>Before</h3>
              <p>Energy wasted in raw production</p>
            </div>
            <div className="after">
              🔋 <h3>After EcoByte</h3>
              <p>Energy conserved through reuse</p>
            </div>
          </div>

          <div className="diff-card">
            <div className="before">
              💧 <h3>Before</h3>
              <p>Water wasted in processing</p>
            </div>
            <div className="after">
              💦 <h3>After EcoByte</h3>
              <p>Liters of water saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Be the Change. Start Recycling Today.</h2>
        <div className="cta-buttons">
          <Link to="/pricing" onClick={handleScrollTop} className="cta-btn">
            Sell Scrap
          </Link>
          <Link to="/booknow" onClick={handleScrollTop} className="cta-btn">
            Donate eWaste
          </Link>
          {/* <Link to="/chat" onClick={handleScrollTop} className="cta-btn chat-btn">
            💬 Chat With Us
          </Link> */}
          <a
                        href="https://wa.me/917075255742"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-btn chat-btn"
                      >
                        <FaWhatsapp className="whatsapp-icon" /> Chat With Us
                      </a>
        </div>
      </section>
    </div>
  );
}

export default ServicesPage;
