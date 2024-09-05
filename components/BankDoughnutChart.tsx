"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
const BankDoughnutChart = ({ banks }: { banks: string[] }) => {
  const data = {
    labels: banks,
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#0179FE", "#4893FF", "#85B7FF", "#BED9FF", "#E9F2FF"],
      },
    ],
  };
  return (
    <div className="max-w-[100px]">
      <Doughnut data={data} options={{
        cutout: "60%",
        plugins: {
            legend: {
                display: false
            }
        }
      }} />
    </div>
  );
};

export default BankDoughnutChart;
