import React, { useContext } from "react";
import TopNav from "./topNav";
import SideNav from "./SideNav";
import { auth } from "../firebase/config";
import { AuthContext } from "../firebase/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

export default function Home({ userHealthData }) {
  const { user, loading } = useContext(AuthContext);
  const showName = user ? user.displayName || user.email : "Guest";
  const navigate = useNavigate();

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading User...</p>;
  }

  console.log(userHealthData);
 
  return (
    <>
      <TopNav />
      <div className="sideNavFix">
        <SideNav />
      </div>
      <div className="page">
        <section className="welcomeSection">
          <h1 className="heading">Welcome {showName}</h1>
          {user && (
            <p className="email">
              <FaEnvelope />
              {user.email}
            </p>
          )}
          <div className="subheading">
            <p>
              Here, you can monitor your progress and track your daily exercise
              goals.
            </p>
          </div>
          <div>
            {!userHealthData ? <button className="button" onClick={() => navigate("/progress")}>
              Check Progress
            </button> : <button className="button" onClick={() => navigate("/userdata")}>
              Add Data
            </button> }
            <button className="button" onClick={() => auth.signOut()}>
              Sign Out
            </button>
          </div>
        </section>
      </div>

      {/* <div className="showUserData">
        {userHealthData ? (
          <>
          <p style={{color:"black"}}>Got</p>
          </>
        ) : (
          <>
            <p>No Data found .</p>
            <button className="button" onClick={() => navigate("/userdata")}>
              add data
            </button>
          </>
        )}
      </div> */}

      <div className="userInfo"></div>
    </>
  );
}
