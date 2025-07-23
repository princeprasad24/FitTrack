import React, { useState } from "react";
import TopNav from "./topNav";
import SideNav from "./SideNav";

import { auth, db } from "../firebase/config";
import { ref, set } from "firebase/database";

export default function UserData({ onSubmitUserData }) {
  const [userData, setUserData] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
    typeofWorkout: "",
    weightTarget: "",
    workoutPlan: "",
  });

  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const ageNum = Number(userData.age);
  const heightNum = Number(userData.height);
  const weightNum = Number(userData.weight);
  
  if (!ageNum || !heightNum || !weightNum) {
    alert(" age, height, and weight should be valid numeric values.");
    return;
  }

  const heightMeters = heightNum / 100;
  const bmi = (weightNum / (heightMeters * heightMeters)).toFixed(2);
  let bmr;

  if (userData.gender === "male") {
    bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
  } else if (userData.gender === "female") {
    bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
  } else {
    alert("Please select a valid gender.");
    return;
  }

  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const activityFactor = activityFactors[userData.typeofWorkout] || 1.2;
  const tdee = Math.round(bmr * activityFactor);

  const dataToSave = {
    ...userData,
    bmi,
    tdee,
  };

  try {
    const userId = auth.currentUser?.uid || `guest_${Date.now()}`;

    
    const userRef = ref(db, `users/${userId}/profile`);
    await set(userRef, dataToSave);

    
    const today = new Date().toISOString().split("T")[0];
    const weightRef = ref(db, `users/${userId}/weightEntries/${today}`);
    await set(weightRef, {
      weight: weightNum,
      bmi: bmi,
      tdee : tdee,
    });

    setSubmittedData(dataToSave);
    onSubmitUserData(dataToSave);
    alert("Data saved");
  } catch (err) {
    console.error(err);
    alert("Failed to save data.");
  }
};


  return (
    <div className="userDataPage">
      <TopNav />

      <div className="sideNavFix">
        <SideNav />
      </div>

      <div className="userSection">
        <h2 className="userHeading">User Health Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label className="inputLabel">Gender:</label>
            <select
              className="inputField"
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="inputGroup">
            <label className="inputLabel">Age (years):</label>
            <input
              className="inputField"
              type="number"
              name="age"
              value={userData.age}
              onChange={handleChange}
              required
              placeholder="e.g., 25"
              min="1"
            />
          </div>

          <div className="inputGroup">
            <label className="inputLabel">Height (cm):</label>
            <input
              className="inputField"
              type="number"
              name="height"
              value={userData.height}
              onChange={handleChange}
              required
              placeholder="e.g., 170"
              min="30"
            />
          </div>

          <div className="inputGroup">
            <label className="inputLabel">Weight (kg):</label>
            <input
              className="inputField"
              type="number"
              name="weight"
              value={userData.weight}
              onChange={handleChange}
              required
              placeholder="e.g., 65"
              min="1"
            />
          </div>

          <div className="inputGroup">
            <label className="inputLabel">Activity Level:</label>
            <select
              className="inputField"
              name="typeofWorkout"
              value={userData.typeofWorkout}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="sedentary">Sedentary (little/no exercise)</option>
              <option value="light">Light (1-3 days/week)</option>
              <option value="moderate">Moderate (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
              <option value="veryActive">
                Very Active (physical job + daily workout)
              </option>
            </select>
          </div>

          <div className="inputGroup">
            <label className="inputLabel">Type of workout:</label>
            <select
              className="inputField"
              name="workoutPlan"
              value={userData.workoutPlan}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="bulking">Bulking</option>
              <option value="cutting">Cutting</option>
              <option value="fatLoss">Fat Loss</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="inputGroup">
            <label className="inputLabel">Target Weight (kg):</label>
            <input
              className="inputField"
              type="number"
              name="weightTarget"
              value={userData.weightTarget}
              onChange={handleChange}
              required
              placeholder="e.g., 70"
              max={userData.weight  - 1}
            />
          </div>

          <button type="submit" className="submitButton">
            Submit
          </button>
        </form>

        {submittedData && (
          <div className="resultSection" style={{ marginTop: "20px" }}>
            <h3>Submitted User Data:</h3>
            <p>
              <strong>Gender:</strong> {submittedData.gender}
            </p>
            <p>
              <strong>Age:</strong> {submittedData.age}
            </p>
            <p>
              <strong>Height:</strong> {submittedData.height} cm
            </p>
            <p>
              <strong>Weight:</strong> {submittedData.weight} kg
            </p>
            <p>
              <strong>Activity Level:</strong> {submittedData.typeofWorkout}
            </p>
            <p>
              <strong>Workout Plan:</strong> {submittedData.workoutPlan}
            </p>
            <p>
              <strong>Target Weight:</strong> {submittedData.weightTarget} kg
            </p>
            <p>
              <strong>BMI:</strong> {submittedData.bmi}
            </p>
            <p>
              <strong>TDEE:</strong> {submittedData.tdee} kcal/day
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
