import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("Home");
  const { getCartTotal, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate()
  const handleLogout =()=>{
    setToken(null)
    localStorage.removeItem("token")
    navigate("/")
  }
  const handleOrder =()=>{
    navigate("/myorders")
  }
  return (
    <>
      <div className="navbar">
        <Link to="/">
          <img src={assets.logo} alt="" className="logo" />
        </Link>
        <ul className="navbar-menu">
          <Link
            to="/"
            onClick={() => setMenu("Home")}
            className={menu === "Home" ? "active" : ""}
          >
            Home
          </Link>
          <a
            href="#explore-menu"
            onClick={() => setMenu("Menu")}
            className={menu === "Menu" ? "active" : ""}
          >
            Menu
          </a>
          <a
            href="#app-download"
            onClick={() => setMenu("Modile-app")}
            className={menu === "Modile-app" ? "active" : ""}
          >
            Modile-app
          </a>
          <a
            href="#footer"
            onClick={() => setMenu("Contact-us")}
            className={menu === "Contact-us" ? "active" : ""}
          >
            Contact-us
          </a>
        </ul>
        <div className="navbar-right">
          <img src={assets.search_icon} alt="navbar-right" />
          <div className="navbar-search-icon">
            <Link to="/cart">
              <img src={assets.basket_icon} alt="" />
            </Link>
            <div className={getCartTotal() === 0 ? "" : "dot"}></div>
          </div>
          {!token ? (
            <button onClick={() => setShowLogin(true)}>Login</button>
          ) : (
            <div className="navbar-profile">
              <img src={assets.profile_icon} alt="" />
              <ul className="navbar-profile-dropdown">
                <li onClick={handleOrder}><img src={assets.bag_icon} alt="" />Order</li>
                <hr />
                <li onClick={handleLogout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Navbar;
