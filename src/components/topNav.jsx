import React from "react";

export default function TopNav() {
  return (
    <nav className="navBar">
      <div className="left">
        <p className="logo">FitnessTracker</p>
      </div>

      {/* Optional navigation center items */}
      {/* <div className="center"> */}
      {/* <a href="/dashboard" className="navItem">Dashboard</a> */}
      {/* <a href="/progress" className="navItem">Progress</a> */}
      {/* </div> */}

      <div className="right">
        <div className="avatarIcon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="#007bff"
            width="100%"
            height="100%"
          >
            <path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
          </svg>
        </div>
      </div>

      
    </nav>
  );
}
