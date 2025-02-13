import React from "react";
import './Navbar.css'
import { assets } from "../../assets/assets";
const Navbar = () => {
  return (
    <div className="navbar">
      <div>
        <img className="logo" src={assets.logo} alt="" />
      </div>
      <div>
        <img className="profile" src={assets.profile_image} alt="" />
      </div>
    </div>
  );
};

export default Navbar;
