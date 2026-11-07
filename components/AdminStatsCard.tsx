import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React, { ReactNode } from 'react';

export type StatCard = {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  caption: string;
  icon: ReactNode;
  accent: string;
};

const AdminStatsCard: React.FC<{ item: StatCard }> = ({ item }) => {
  const TrendIcon = item.trend === 'up' ? ArrowUpRight : ArrowDownRight;
  const trendClass = item.trend === 'up' ? 'text-emerald-600' : 'text-rose-600';
  return (
    <article
      key={item.label}
      className="min-w-0 overflow-hidden rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200/80 sm:p-5"
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className={`shrink-0 rounded-lg p-2 ring-1 sm:p-2.5 ${item.accent}`}>{item.icon}</div>
        <span className={`inline-flex min-w-0 items-center gap-1 text-xs font-semibold sm:text-sm ${trendClass}`}>
          <TrendIcon size={16} />
          <span className="truncate">{item.change}</span>
        </span>
      </div>
      <div className="mt-5 min-w-0">
        <p className="text-sm font-medium leading-5 text-slate-500">{item.label}</p>
        <h3 className="mt-2 truncate text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">{item.value}</h3>
        <p className="mt-1 break-words text-xs leading-5 text-slate-500 sm:text-sm">{item.caption}</p>
      </div>
    </article>
  );
};

export default AdminStatsCard;
