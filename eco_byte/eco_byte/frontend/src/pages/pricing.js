import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pricing.css";

function Pricing() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/price-list-admin");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);



  return (
    <div className="pricing-container">
      <h2 className="pricing-title">Our Price List</h2>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((item) => (
            <div
              key={item.id}
              className="product-card"
            >
              <img src={item.image_url} alt={item.item_name} className="product-img" />
              <h3 className="product-name">{item.item_name}</h3>
              <p className="product-price">
                ₹{item.min_price}-{item.max_price}
              </p>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
}

export default Pricing;
