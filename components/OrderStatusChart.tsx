"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  pending: number;
  delivered: number;
  cancelled: number;
  processing: number;
}

export default function OrderStatusChart({ pending, delivered, cancelled, processing }: Props) {
  const total = pending + delivered + cancelled + processing || 1;

  const data = {
    labels: ["Pending", "Delivered", "Cancelled", "Processing"],
    datasets: [
      {
        data: [pending, delivered, cancelled, processing],
        backgroundColor: [
          "#fbbf24", // amber
          "#34d399", // emerald
          "#f87171", // rose
          "#60a5fa", // sky
        ],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 16,
          color: "#64748b",
          font: { size: 12 },
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#94a3b8",
        bodyColor: "#f1f5f9",
        borderColor: "#1e293b",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx: any) => {
            const pct = ((ctx.parsed / total) * 100).toFixed(1);
            return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
}
