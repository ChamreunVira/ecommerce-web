import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatsCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend: number;
  accent: string;
};

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  trend,
  accent,
}) => {
  const isPositive = trend >= 0;

  return (
    <div className="group flex items-center justify-between px-5 py-5 bg-white border border-slate-200 rounded-md transition-all duration-200">

      {/* Icon */}
      <div className={`p-3 rounded-full transition ${accent}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 ml-4">
        <p className="text-[1rem] text-slate-500 font-medium">{label}</p>
        <h1 className="text-2xl font-semibold text-slate-800">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h1>
      </div>

      {/* Trend */}
      <div
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium
        ${isPositive
            ? "text-green-600 bg-green-50"
            : "text-red-600 bg-red-50"
          }`}
      >
        {isPositive ? (
          <TrendingUp size={16} />
        ) : (
          <TrendingDown size={16} />
        )}
        <span>{Math.abs(trend)}%</span>
      </div>
    </div>
  );
};

export default StatsCard;