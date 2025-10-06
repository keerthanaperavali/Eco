import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setRole(userObj.role || "user"); // default role user
    }
  }, []);

  const handleCallClick = () => {
    const userConfirmed = window.confirm("Do you want to call this number?");
    if (userConfirmed) {
      window.location.href = "tel:+917075255742";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    setMenuOpen(false);
    setRole(null);
    navigate("/login");
  };

  // Helper navigation functions for dropdown
  const goTo = (path) => {
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <NavLink to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
            <img
              src="/assets/ecobyte_logo1.png"
              alt="EcoByte Logo"
              className="company-logo"
            />
            <span className="company-name">EcoByte</span>
          </NavLink>
        </div>

        {/* Desktop Links */}
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" onClick={() => setMenuOpen(false)}>
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink to="/pricing" onClick={() => setMenuOpen(false)}>
              Pricing
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" onClick={() => setMenuOpen(false)}>
              Services
            </NavLink>
          </li>

          {/* Role-based menus when menu is open */}
          {menuOpen && (
            <>
              {!isLoggedIn ? (
                <>
                  <li>
                    <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                      Login
                    </NavLink>
                  </li>
                </>
              ) : role === "user" ? (
                <>
                  <li>
                    <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/managerequest" onClick={() => setMenuOpen(false)}>
                      Manage Requests
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/manageaddress" onClick={() => setMenuOpen(false)}>
                      Manage Address
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/booknow" onClick={() => setMenuOpen(false)}>
                      Book an Appointment
                    </NavLink>
                  </li>
                  <li>
                    <button className="login-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : role === "admin" ? (
                <>
                  <li>
                    <NavLink to="/user-details-admin" onClick={() => setMenuOpen(false)}>
                      Users Admin
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/quotation-admin" onClick={() => setMenuOpen(false)}>
                      Quotations Admin
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/price-list-admin" onClick={() => setMenuOpen(false)}>
                      Price List Admin
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/pickup-admin" onClick={() => setMenuOpen(false)}>
                      Pickup Admin
                    </NavLink>
                  </li>
                  <li>
                    <button className="login-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : role === "staff" ? (
                <>
                  <li>
                    <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                      Profile
                    </NavLink>
                  </li>
                  {/* Staff Section */}
                  <li>
                    <strong style={{ color: "#224a54", paddingLeft: "10px" }}>Staff Pages</strong>
                    <ul style={{ paddingLeft: "1rem", listStyleType: "disc" }}>
                      <li>
                        <NavLink to="/quotation-admin" onClick={() => setMenuOpen(false)}>
                          Quotation Requests
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/pickup-admin" onClick={() => setMenuOpen(false)}>
                          Pickup Admin
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/booknow" onClick={() => setMenuOpen(false)}>
                          Book an Appointment
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/managerequest" onClick={() => setMenuOpen(false)}>
                          Manage Requests
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/manageaddress" onClick={() => setMenuOpen(false)}>
                          Manage Address
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <button className="login-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : null}
            </>
          )}
        </ul>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {isLoggedIn ? (
            <div
              className="profile-menu"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUserCircle className="icon profile-icon" title="Profile" />
              {dropdownOpen && (
                <ul className="dropdown">
                  {role === "user" ? (
                    <>
                      <li onClick={() => goTo("/profile")}>Profile</li>
                      <li onClick={() => goTo("/managerequest")}>Manage Requests</li>
                      <li onClick={() => goTo("/manageaddress")}>Manage Address</li>
                      <li onClick={() => goTo("/booknow")}>Book an Appointment</li>
                    </>
                  ) : role === "admin" ? (
                    <>
                      <li onClick={() => goTo("/user-details-admin")}>Users Admin</li>
                      <li onClick={() => goTo("/quotation-admin")}>Quotations Admin</li>
                      <li onClick={() => goTo("/price-list-admin")}>Price List Admin</li>
                      <li onClick={() => goTo("/pickup-admin")}>Pickup Admin</li>
                    </>
                  ) : role === "staff" ? (
                    <>
                      <li onClick={() => goTo("/profile")}>Profile</li>
                      <li onClick={() => goTo("/quotation-admin")}>Quotation Requests</li>
                      <li onClick={() => goTo("/pickup-admin")}>Pickup Admin</li>
                      <li onClick={() => goTo("/booknow")}>Book an Appointment</li>
                      <li onClick={() => goTo("/managerequest")}>Manage Requests</li>
                      <li onClick={() => goTo("/manageaddress")}>Manage Address</li>
                    </>
                  ) : null}
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              )}
            </div>
          ) : (
            <NavLink to="/login">
              <button className="login-btn">Login</button>
            </NavLink>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </nav>

      {/* Dark overlay */}
      <div
        className={`overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>
    </>
  );
}
