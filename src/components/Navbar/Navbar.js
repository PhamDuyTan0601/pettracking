import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../utils/api";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">🐾 Pet Tracker</Link>
      </div>

      <div className="navbar-links">
        <Link to="/dashboard" className="nav-link">
          🏠 Dashboard
        </Link>
        <Link to="/add-pet" className="nav-link">
          ➕ Add Pet
        </Link>
        <Link to="/devices" className="nav-link">
          📱 Devices
        </Link>
      </div>

      <div className="navbar-user">
        {user.name && (
          <span className="user-greeting">👋 Hello, {user.name}</span>
        )}
        <button onClick={handleLogout} className="btn-logout">
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
