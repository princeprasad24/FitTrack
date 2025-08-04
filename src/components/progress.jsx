import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip, 
  Legend,
  Title,
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
  Title,
  Tooltip,
  Legend
);

export default function HealthProgress() {
  const [weightData, setWeightData] = useState([]);
  const [bmiData, setBmiData] = useState([]);
  const [tdeeData, setTdeeData] = useState([]);

  const [workoutPlan, setWorkoutPlan] = useState([]);

  useEffect(() => {
    const fetchWeight = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const weightRef = ref(db, `users/${userId}/weightEntries`);
      const snapshot = await get(weightRef);

      if (snapshot.exists()) {
        const data = snapshot.val();

        const weightEntries = Object.entries(data)
          .map(([date, entry]) => ({ date, weight: entry.weight }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        const bmiEntries = Object.entries(data)
          .map(([date, entry]) => ({ date, bmi: entry.bmi }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        const tdeeEntries = Object.entries(data)
          .map(([data, entry]) => ({ data, tdee: entry.tdee }))
          .sort((a, b) => new Date(a.data) - new Date(b.date));

        setTdeeData(tdeeEntries);

        setWeightData(weightEntries);
        setBmiData(bmiEntries);
      }
    };

    fetchWeight();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const weightRef = ref(db, `users/${userId}/profile`);
      const snapshot = await get(weightRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setWorkoutPlan(data.workoutPlan?.toLowerCase());
      }
    };

    fetch();
  }, []);

//   const generateMilestones = (weightData, bmiData) => {
//   const milestones = [];

//   if (weightData.length > 0) {
//     milestones.push({
//       date: weightData[0].date,
//       label: `Started at ${weightData[0].weight}kg`,
//     });

//     let lastMilestoneWeight = weightData[0].weight;

//     weightData.forEach(({ date, weight }) => {
//       if (Math.abs(weight - lastMilestoneWeight) >= 5) {
//         milestones.push({
//           date,
//           label: `Reached ${weight}kg`,
//         });
//         lastMilestoneWeight = weight;
//       }
//     });
//   }

//   if (bmiData.length > 0) {
//     let prevCategory = getBmiCategory(bmiData[0].bmi);

//     bmiData.forEach(({ date, bmi }) => {
//       const category = getBmiCategory(bmi);
//       if (category !== prevCategory) {
//         milestones.push({
//           date,
//           label: `BMI status changed to ${category}`,
//         });
//         prevCategory = category;
//       }
//     });
//   }

//   return milestones.sort((a, b) => new Date(a.date) - new Date(b.date));
// };

// const getBmiCategory = (bmi) => {
//   if (bmi < 18.5) return "Underweight";
//   if (bmi < 24.9) return "Normal";
//   if (bmi < 29.9) return "Overweight";
//   return "Obese";
// };


  const weightChartData = {
    labels: weightData.map((e) => e.date),
    datasets: [
      {
        label: "Weight (Kg)",
        data: weightData.map((e) => e.weight),
        fill: false,
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
        fill: false,
        borderColor: "#10b981",
        tension: 0.4,
        pointBackgroundColor: "#059669",
      },
    ],
  };

  const weightChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        title: { display: true, text: "Weight (kg)" },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
  };

  const bmiChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        title: { display: true, text: "BMI" },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
  };

  const latestTdee =
    tdeeData.length > 0 ? tdeeData[tdeeData.length - 1].tdee : null;

  const carbs = latestTdee ? Math.round((latestTdee * 0.5) / 4) : 0;
  const protein = latestTdee ? Math.round((latestTdee * 0.2) / 4) : 0;
  const fats = latestTdee ? Math.round((latestTdee * 0.3) / 9) : 0;

  let calories = latestTdee;

  if (calories && workoutPlan) {
    switch (workoutPlan) {
      case "bulking":
        calories = Math.round(latestTdee * 1.15);
        break;
      case "cutting":
        calories = Math.round(latestTdee * 0.85);
        break;
      case "fatLoss":
        calories = Math.round(latestTdee - 500);
        break;
      default:
        calories = latestTdee;
    }
  }

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
          <Line data={weightChartData} options={weightChartOptions} />
        </div>
        <div className="charts bmiChat">
          <h3
            className="ChartHeading"
            style={{ textAlign: "start", color: "black" }}
          >
            BMI
          </h3>
          <Line data={bmiChartData} options={bmiChartOptions} />
        </div>
      </div>

      <div className="foonInTake">
        <h3 style={{ marginTop: "10px" }}>
          Estimated Total Daily Energy Expenditure:
          <span>
            <strong>{calories} kcal</strong>
          </span>
        </h3>
        <h2>Your Daily Nutrition Should Contain</h2>
        <p>carbs : {carbs}g</p>
        <p>protein : {protein}g</p>
        <p>fats : {fats}g</p>
      </div>

    
    </>
  );
}
