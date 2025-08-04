import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  ArcElement,
} from "chart.js";

import SideNav from "./SideNav";
import TopNav from "./topNav";
import { auth, db } from "../firebase/config";
import { get, ref } from "firebase/database";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function HealthProgress() {
  const [weightData, setWeightData] = useState([]);
  const [bmiData, setBmiData] = useState([]);
  const [tdeeData, setTdeeData] = useState([]);
  const [workoutPlan, setWorkoutPlan] = useState("");
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const weightRef = ref(db, `users/${userId}/weightEntries`);
      const snapshot = await get(weightRef);

      if (snapshot.exists()) {
        const data = snapshot.val();

        const weightEntries = [];
        const bmiEntries = [];
        const tdeeEntries = [];

        Object.entries(data).forEach(([date, entry]) => {
          if (entry.weight !== undefined)
            weightEntries.push({ date, weight: entry.weight });
          if (entry.bmi !== undefined)
            bmiEntries.push({ date, bmi: entry.bmi });
          if (entry.tdee !== undefined)
            tdeeEntries.push({ date, tdee: entry.tdee });
        });

        const sortedWeights = weightEntries.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        const sortedBmi = bmiEntries.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        const sortedTdee = tdeeEntries.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setWeightData(sortedWeights);
        setBmiData(sortedBmi);
        setTdeeData(sortedTdee);

        const generated = generateMilestones(sortedWeights, sortedBmi);
        setMilestones(generated);
      }
    };

    fetchMetrics();
  }, []);

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const profileRef = ref(db, `users/${userId}/profile`);
      const snapshot = await get(profileRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setWorkoutPlan(data.workoutPlan?.toLowerCase() || "");
      }
    };

    fetchWorkoutPlan();
  }, []);

  
  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) {
      
      return "Underweight";
    }
    if (bmi < 24.9) {
      
      return "Normal";
    }
    if (bmi < 29.9) {
      
      return "Overweight";
    }

    return "Obese";
  };

  const generateMilestones = (weightData, bmiData) => {
    const milestones = [];

    if (weightData.length > 0) {
      milestones.push({
        date: weightData[0].date,
        label: `Started at ${weightData[0].weight}kg`,
      });

      let lastMilestoneWeight = weightData[0].weight;

      weightData.forEach(({ date, weight }) => {
        if (Math.abs(weight - lastMilestoneWeight) >= 5) {
          milestones.push({
            date,
            label: `Reached ${weight}kg`,
          });
          lastMilestoneWeight = weight;
        }
      });
    }

    if (bmiData.length > 0) {
      let prevCategory = getBmiCategory(bmiData[0].bmi);

      bmiData.forEach(({ date, bmi }) => {
        const category = getBmiCategory(bmi);
        if (category !== prevCategory) {
          milestones.push({
            date,
            label: `BMI status changed to ${category}`,
          });
          prevCategory = category;
        }
      });
    }

    return milestones.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const weightChartData = {
    labels: weightData.map((e) => e.date),
    datasets: [
      {
        label: "Weight (Kg)",
        data: weightData.map((e) => e.weight),
        borderColor: "#3b82f6",
        tension: 0.4,
        pointBackgroundColor: "#1d4ed8",
      },
    ],
  };

  const bmiChartData = {
    labels: bmiData.map((e) => e.date),
    datasets: [
      {
        label: "BMI (Body Mass Index)",
        data: bmiData.map((e) => e.bmi),
        borderColor: "#10b981",
        tension: 0.4,
        pointBackgroundColor: "#059669",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: { title: { display: true, text: "Value" } },
      x: { title: { display: true, text: "Date" } },
    },
  };

  const latestTdee =
    tdeeData.length > 0 ? tdeeData[tdeeData.length - 1].tdee : null;

  let adjustedCalories = latestTdee;
  if (latestTdee && workoutPlan) {
    switch (workoutPlan) {
      case "bulking":
        adjustedCalories = Math.round(latestTdee * 1.15);
        break;
      case "cutting":
        adjustedCalories = Math.round(latestTdee * 0.85);
        break;
      case "fatloss":
        adjustedCalories = Math.round(latestTdee - 500);
        break;
      default:
        adjustedCalories = latestTdee;
    }
  }

  const carbs = adjustedCalories ? Math.round((adjustedCalories * 0.5) / 4) : 0;
  const protein = adjustedCalories
    ? Math.round((adjustedCalories * 0.2) / 4)
    : 0;
  const fats = adjustedCalories ? Math.round((adjustedCalories * 0.3) / 9) : 0;

  const tdeeChartData = {
    labels: ["Carbs (g)", "Protein (g)", "Fats (g)"],
    datasets: [
      {
        label: "Daily Intake",
        data: [carbs, protein, fats],
        backgroundColor: ["#fbbf24", "#3b82f6", "#f87171"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const tdeeChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <>
      <TopNav />
      <div className="sideNavFix">
        <SideNav />
      </div>

      <div className="chartsDiv">
        <div className="charts weightChat">
          <h3
            className="ChartHeading"
            style={{ textAlign: "start", color: "black" }}
          >
            Weight
          </h3>
          <Line data={weightChartData} options={chartOptions} />
        </div>

        <div className="charts bmiChat">
          <h3
            className="ChartHeading"
            style={{ textAlign: "start", color: "black" }}
          >
            BMI
          </h3>
          <Line data={bmiChartData} options={chartOptions} />
        </div>

        <div
          className="charts tdeeChart"
          style={{ maxWidth: 400, margin: "auto" }}
        >
          <h3
            className="ChartHeading"
            style={{ textAlign: "start", color: "black" }}
          >
            Daily Food Intake
          </h3>
          <Pie data={tdeeChartData} options={tdeeChartOptions} />
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Estimated Total Daily Energy Expenditure:{" "}
            <strong>{latestTdee ? `${latestTdee} kcal` : "N/A"}</strong>
          </p>
        </div>

        <div className="charts foonInTake">
          <h3
            className="ChartHeading"
           style={{ marginTop: "10px" }}>
            Estimated Total Daily Energy Expenditure:{" "}
            <strong>
              {adjustedCalories ? `${adjustedCalories} kcal` : "N/A"}
            </strong>
          </h3>

          <h2>Your Daily Nutrition Should Contain:</h2>
          <p>Carbs: {carbs}g</p>
          <p>Protein: {protein}g</p>
          <p>Fats: {fats}g</p>

          {/* <h2>
            BMICategory: <p>{bmiData.bmi || "none"}</p>
          </h2> */}
        </div>

         <div className="charts milestones" style={{ marginTop: 40,  overflow:"scroll"}}>
        <h3>Progress Milestones</h3>
        {milestones.length === 0 && <p>No milestones yet.</p>}
        <ul>
          {milestones.map(({ date, label }) => (
            <li key={date}>
              <strong>{new Date(date).toLocaleDateString()}:</strong> {label}
            </li>
          ))}
        </ul>
      </div>
      </div>

     
    </>
  );
}
