import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React, { ReactNode } from 'react'

export type StatCard = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  caption: string;
  icon: ReactNode;
  accent: string;
};

const AdminStatsCard: React.FC<{item: StatCard}> = ({item}) => {
    const TrendIcon =
              item.trend === "up" ? ArrowUpRight : ArrowDownRight;
            const trendClass =
              item.trend === "up" ? "text-emerald-600" : "text-rose-600";
    return (
        <article
            key={item.label}
            className="rounded-lg bg-white p-5 shadow-sm   ring-1 ring-slate-200/80"
        >
            <div className="flex items-start justify-between gap-4">
                <div className={`rounded-lg p-2.5 ring-1 ${item.accent}`}>
                    {item.icon}
                </div>
                <span
                    className={`inline-flex items-center gap-1 text-sm font-semibold ${trendClass}`}
                >
                    <TrendIcon size={16} />
                    {item.change}
                </span>
            </div>
            <div className="mt-5">
                <p className="text-sm font-medium text-slate-500">
                    {item.label}
                </p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-950">
                    {item.value}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{item.caption}</p>
            </div>
        </article>
    )
}

export default AdminStatsCard