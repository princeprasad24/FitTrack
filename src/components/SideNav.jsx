import React, { useState } from "react";
import { FaHome, FaUser, FaChartBar, FaInfoCircle, FaBars } from "react-icons/fa";
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
     <div className="hamburger" style={{ display: open ? "none" : "flex" }} onClick={toggleMenu}>
  <FaBars />
</div>


      <aside className={`sidebar ${open ? "show" : ""}`}>
        <nav className="nav">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "navItem active" : "navItem"
              }
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
