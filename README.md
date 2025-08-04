# Fitness Tracker Web App

A modern and responsive fitness tracking web application built with **React**, **Firebase**, and **Chart.js**. This app helps users monitor and improve their health by tracking BMI, TDEE, and weight progress over time.

## Features

- User Authentication (Email/Password and Google sign-in via Firebase)
- Track BMI (Body Mass Index)
- Calculate TDEE (Total Daily Energy Expenditure)
- Visualize progress with responsive charts
- Save and update user profile information
- Responsive sidebar with mobile-friendly hamburger toggle
- Clean, professional UI inspired by EverydayHealth.com

## Technologies Used

- React (with Hooks)
- Firebase Authentication & Realtime Database
- Chart.js (via react-chartjs-2)
- CSS (custom, responsive)
- React Router DOM


## Getting Started

### Prerequisites

- Node.js and npm installed
- Firebase project set up

### Installation

1. Clone the repository:

   git clone https://github.com/your-username/fitness-tracker.git
   cd fitness-tracker
Install dependencies:
npm install


Set up Firebase:

Create a project in Firebase Console

Enable Authentication (Email/Password and Google)

Create a firebase/config.js file and add your Firebase config:

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

4.Run the app:
npm start 
    or
npm run dev
