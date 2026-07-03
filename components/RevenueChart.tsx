"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { RevenueByMonth } from "@/types/stats";
import { MONTHS } from "@/constant/constant";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface Props {
  data: RevenueByMonth[];
}

export default function RevenueChart({ data }: Props) {
  const labels = data.map((d) => MONTHS[d.month]);
  const revenues = data.map((d) => d.revenue);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue ($)",
        data: revenues,
        borderColor: "#f97316",
        backgroundColor: (ctx: any) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(249,115,22,0.25)");
          gradient.addColorStop(1, "rgba(249,115,22,0.01)");
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#f97316",
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#f97316",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#94a3b8",
        bodyColor: "#f1f5f9",
        borderColor: "#1e293b",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx: any) => ` $${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#94a3b8",
          font: { size: 12 },
        },
      },
      y: {
        grid: {
          color: "rgba(226,232,240,0.6)",
          drawBorder: false,
        },
        border: { display: false, dash: [5, 5] },
        ticks: {
          color: "#94a3b8",
          font: { size: 12 },
          callback: (value: any) => `$${value}`,
        },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-slate-400">
        No revenue data available yet.
      </div>
    );
  }

  return (
    <div className="h-72">
      <Line data={chartData} options={options} />
    </div>
  );
}
