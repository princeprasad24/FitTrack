import React, { useEffect, useRef, useState } from "react";
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
} from "chart.js";

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

export default function Tdee() {
  const [tdeeData, setTdeeData] = useState([]);
    const chartRef = useRef(null);

  useEffect(() => {
    if(chartRef.current){
        chartRef.current.destroy();
    }
    const fetchWeight = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const weightRef = ref(db, `users/${userId}/weightEntries`);
      const snapshot = await get(weightRef);

      if (snapshot.exists()) {
        const data = snapshot.val();

        
        const tdeeEntries = Object.entries(data)
          .map(([data, entry]) => ({ data, tdee: entry.tdee }))
          .sort((a, b) => new Date(a.data) - new Date(b.date));

        setTdeeData(tdeeEntries);
      }
    };

    fetchWeight();
  }, []);

  const latestTdee =
    tdeeData.length > 0 ? tdeeData[tdeeData.length - 1].tdee : null;

  const carbs = latestTdee ? Math.round((latestTdee * 0.5) / 4) : 0;
  const protein = latestTdee ? Math.round((latestTdee * 0.2) / 4) : 0;
  const fats = latestTdee ? Math.round((latestTdee * 0.3) / 9) : 0;



  const tdeeChartData = {
    labels: ["Carbs (g)", "Protein (g)", "Fats (g)"],
    datasets: [
      {
        label: "Daily In Take",
        data: [carbs, protein, fats],
        backgroundColor: ["#fbbf24", "#3b82f6", "#f87171"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  // -------------------------------


  const tdeeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <>
     
      <div className="chartsDiv">

        <div className="charts tdeeChat" ref={chartRef}>
          <h3
            className="ChartHeading"
            style={{ textAlign: "start", color: "black" }}
          >
            Daily Food InTake
          </h3>

          <Pie key={`tdee=${carbs}-${protein}-${fats}`} data={tdeeChartData} options={tdeeChartOptions} />
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Estimated Total Daily Energy Expenditure:{" "}
            <strong>{latestTdee} kcal</strong>
          </p>
        </div>
      </div>
    </>
  );
}
