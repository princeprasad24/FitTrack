import React, { useState } from "react";
import { FaHome, FaUser, FaChartBar, FaInfoCircle, FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function SideNav() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  const menu = [
    { path: "/", label: "Dashboard", icon: <FaHome /> },
    { path: "/userdata", label: "UserData", icon: <FaUser /> },
    { path: "/progress", label: "Progress", icon: <FaChartBar /> },
    { path: "/about", label: "About", icon: <FaInfoCircle /> },
  ];

  return (
    <>
      <div onClick={toggleMenu}>
        {open ? <p className="icon hamburger" style={{padding:"5px", position:"relative", left:"120px", display:"flex", alignItems:"center" , justifyContent:"center", width:"60px"}}><FaTimes/></p> :<span className="hamburger" > < FaBars /></span>}
      </div>

      <aside className={`sidebar ${open ? "show" : ""}`}>
        <nav className="nav">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? "navItem active" : "navItem")}
              onClick={() => setOpen(false)} 
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
