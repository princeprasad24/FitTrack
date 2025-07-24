import React from "react";
import SideNav from "./SideNav";
import TopNav from "./topNav";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

export default function AboutUs() {
  return (
    <>
      <TopNav />
      <div className="sideNavFix">
        <SideNav />
      </div>
      <div className="aboutPage">
        <div className="aboutContainer">
          <h1 className="aboutHeading">About Us</h1>
          <p className="aboutText">
            Welcome to <strong>FitTrack</strong>, your personal companion in
            health and fitness. to's help you monitor your weight, calculate
            your BMI, track TDEE, and follow customized bulking, cutting, or fat
            loss plans.
          </p>
          <p className="aboutText">
            Whether you're trying to build muscle, lose fat, or simply maintain
            a healthy lifestyle, FitTrack provides visual insights and guidance
            to support your journey.
          </p>

          <h2 className="sectionHeading">Versions</h2>
          <p className="aboutText">
            <ul>
              <li>This is second version that i have made. </li>
              <li>first one made wiith HTML/CSS , js , flask</li>
              <li>There will be next version of this one</li>
              <ul>
                <li>that there will workout plan</li>
                <li>
                  based on workout type(bulking , cutting , fat loss) and more
                </li>
              </ul>
            </ul>
          </p>

          <h2 className="sectionHeading">Built Using</h2>
          <p className="aboutText">
            React, Firebase, Chart.js
          </p>

          <h2 className="sectionHeading" >Contact Us</h2>
          <ul className="socialList" style={{display: "flex", flexDirection:"row", gap: "10%" , alignItems: "center", width: "100vw", textDecoration: "none"}}>
            <li>
              <a
                href="https://www.instagram.com/princeprasad_1/profilecard/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
                <FaInstagram />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/prasadgaikawada/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Linkdin <FaLinkedin />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/princeprasad24"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <FaGithub />
              </a>
            </li>
          </ul>

          
        </div>
      </div>
    </>
  );
}
