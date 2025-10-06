import React, { useRef, useState, useEffect } from "react";
import "../styles/Home.css";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/productcarousel.css";
import HowItWorks from "./howitworks";
import Excellence from "./excellence";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 Products from backend
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/price-list-admin");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);



  // Form state for booking form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    message: "",
  });

  // Manual scroll
  const scroll = (direction) => {
    if (!scrollRef.current || products.length === 0) return;
    const cardWidth = scrollRef.current.firstChild.offsetWidth + 16;
    const newIndex =
      direction === "left"
        ? (currentIndex - 1 + products.length) % products.length
        : (currentIndex + 1) % products.length;

    scrollRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: "smooth",
    });

    setCurrentIndex(newIndex);
  };

  // Auto-scroll
  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      scroll("right");
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, products]);

  const [pincode, setPincode] = useState("");
  const [available, setAvailable] = useState(null); // null = not checked
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkPincode = async (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode.");
      setAvailable(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/pincodes/check/${pincode}`);
      if (!response.ok) throw new Error("Failed to check pincode availability");
      const data = await response.json();
      setAvailable(!!data.available);
    } catch (err) {
      setError(err.message || "Error checking pincode");
      setAvailable(null);
    } finally {
      setLoading(false);
    }
  };


  // Form input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quotation request");
      }

      alert("Your booking has been submitted successfully!");
      setFormData({ name: "", phone: "", address: "", message: "" }); // Reset form
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="home-container"
        id="home-bg"
        style={{
          backgroundImage: `url("/assets/homepage_bg.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        {/* Left side content */}
        <div className="home-left">
          <span className="tagline">Student-Led E-Waste Collection Initiative</span>
          <h1 className="home-title">Turn Your E-Waste Into Cash</h1>
          <p className="home-subtitle">
            Responsible e-waste collection with fair pricing. We collect and refurbish your electronic devices while putting money back in your pocket.
          </p>
          <div className="button-group">
            <button className="btn-pricing" onClick={() => navigate("/pricing")}>
              <span className="icon">₹</span> View Pricing
            </button>
            <a
              href="https://wa.me/917075255742"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <FaWhatsapp className="whatsapp-icon" /> Chat With Us
            </a>
          </div>
        </div>

        {/* Right side booking form */}
        <div className="booking-box">
          <h2>Know Your E-Waste Value</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              name="address"
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Request for Quotation</button>
          </form>
        </div>
      </div>

      {/* Product Carousel Section */}
      <div className="carousel-section">
        {/* Quote + Image */}
        <div className="carousel-header">
          <div className="quote-text">
            <h2>Sell or Donate your E-Waste</h2>
            <p>Help the world become cleaner and greener by recycling responsibly.</p>
          </div>
          <div className="quote-img">
            <img src="/assets/recyle.png" alt="Recycle Awareness" />
          </div>
        </div>

        {/* Carousel */}
        <div className="carousel-container">
          <h2 className="carousel-title">Our Price List</h2>
          <div className="carousel-wrapper">
            <button className="arrow left" onClick={() => scroll("left")}>
              ❮
            </button>

            <div className="carousel-cards" ref={scrollRef}>
              {products.length > 0 ? (
                products.slice(0, 6).map((item) => (
                  <div key={item.id} className="carousel-card">
                    <img
                      src={item.image_url}
                      alt={item.item_name}
                      className="carousel-img"
                    />
                    <h3 className="carousel-name">{item.item_name}</h3>
                    <p className="carousel-price">
                      ₹{item.min_price} - ₹{item.max_price} Per KG
                    </p>
                  </div>
                ))
              ) : (
                <p>Loading products...</p>
              )}
            </div>

            <button className="arrow right" onClick={() => scroll("right")}>
              ❯
            </button>
          </div>

          {/* View All Button with navigate */}
          <button className="view-all-btn" onClick={() => navigate("/pricing")}>
            View All
          </button>
        </div>
      </div>

      {/* Pincode Checker Section */}
     {/* Pincode Checker Section */}
<div className="pincode-checker-section">
  <h2>Check Your Pincode</h2>
  <form onSubmit={checkPincode} className="pincode-form">
    <input
      type="text"
      maxLength={6}
      placeholder="Enter your pincode"
      value={pincode}
      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
      required
    />
    <button type="submit" className="verify-btn" disabled={loading}>
      {loading ? "Checking..." : "Check Availability"}
    </button>
  </form>
  {error && <p className="error-text">{error}</p>}
  {available === true && !error && (
    <p className="available-text">Pickup is available in your area!</p>
  )}
  {available === false && !error && (
    <p className="not-available-text">Sorry, pickup is not available in your area.</p>
  )}
</div>

      {/* Other Sections */}
      <section className="why-ecobyte">
        <h2>Why EcoByte?</h2>
        <div className="why-grid">
          <div className="why-card">
            <span>♻️</span>
            <h3>Eco-Friendly</h3>
            <p>Every action you take reduces waste and protects the planet.</p>
          </div>
          <div className="why-card">
            <span>💰</span>
            <h3>Best Value</h3>
            <p>Earn more with our fair and transparent pricing system.</p>
          </div>
          <div className="why-card">
            <span>🚛</span>
            <h3>Easy Pickup</h3>
            <p>Schedule hassle-free doorstep pickups anytime.</p>
          </div>
          <div className="why-card">
            <span>🎓</span>
            <h3>Student Driven</h3>
            <p>Powered by young innovators & guided by expert mentors.</p>
          </div>
        </div>
      </section>

      <Excellence />
    </>
  );
}
