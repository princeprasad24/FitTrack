import React from "react";
import { FaHome, FaUser, FaChartBar, FaInfoCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function SideNav() {
  const menu = [
    { path: "/", label: "Dashboard", icon: <FaHome /> },
    { path: "/userdata", label: "UserData", icon: <FaUser /> },
    { path: "/progress", label: "Progress", icon: <FaChartBar /> },
    { path: "/about", label: "About", icon: <FaInfoCircle /> },
  ];

  return (
    <aside className="sidebar">
      <nav className="nav">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "navItem active" : "navItem"
            }
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
