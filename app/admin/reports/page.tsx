"use client";
import Link from "next/link";
import { ChevronRight, Home, BarChart2, TrendingUp, ShoppingCart, Users, DollarSign } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { useEffect, useState } from "react";
import { MONTHS } from "@/constant/constant";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);

// const topProducts = [
//   { name: "Wireless Headphones Pro", sales: 312, revenue: 46738 },
//   { name: "USB-C Hub 7-in-1", sales: 245, revenue: 19355 },
//   { name: "Mechanical Keyboard RGB", sales: 198, revenue: 23760 },
//   { name: "Running Shoes X500", sales: 175, revenue: 10413 },
//   { name: "Yoga Mat Pro", sales: 142, revenue: 8946 },
// ];

type RevenueByMonth = {
  month: number;
  revenue: number;
  orders: number;
}

type TopCategory = {
  name: string;
  sales: number;
  revenue: number;
}

export default function ReportsPage() {

  const [months, setMonths] = useState<string[]>([]);
  const [revenue, setRevenue] = useState<number[]>([]);
  const [orders, setOrders] = useState<number[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);

  const totalRevenue = revenue.reduce((s, v) => s + v, 0);
  const totalOrders = orders.reduce((s, v) => s + v, 0);

  const handleFetchReport = async () => {
    try {
      const response = await http.get<ApiResponse<RevenueByMonth[]>>("/report");
      if (response.status === 200) {
        normalizResponse(response.data.data);
      }
    } catch (e: any) {
      console.log("Fails to fetch report: ", e);
    }
  }

  const handleFetchTopCategory = async () => {
    try {
      const response = await http.get<ApiResponse<TopCategory[]>>("/report/top-product");
      if (response.data) {
        setTopCategories(response.data.data);
      }
    } catch (e) {
      console.log("Fials to fech top category: ", e)
    }
  }

  const barData = {
    labels: months,
    datasets: [
      {
        label: "Revenue ($)",
        data: revenue,
        backgroundColor: "rgba(249,115,22,0.8)",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#94a3b8",
        bodyColor: "#f1f5f9",
        callbacks: { label: (ctx: any) => ` $${ctx.parsed.y.toLocaleString()}` },
      },
    },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: { color: "#94a3b8" } },
      y: { grid: { color: "rgba(226,232,240,0.6)" }, border: { display: false }, ticks: { color: "#94a3b8", callback: (v: any) => `$${v}` } },
    },
  };

  const donutData = {
    labels: ["KHQR", "Credit Card", "COD"],
    datasets: [{
      data: [45, 35, 20],
      backgroundColor: ["#f97316", "#60a5fa", "#34d399"],
      borderColor: "#ffffff",
      borderWidth: 3,
      hoverOffset: 5,
    }],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { position: "bottom" as const, labels: { padding: 16, color: "#64748b", font: { size: 12 }, usePointStyle: true } },
      tooltip: {
        backgroundColor: "#0f172a",
        callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed}%` },
      },
    },
  };

  const normalizResponse = (data: RevenueByMonth[]) => {
    const months = data.map((item) => MONTHS[item.month]);
    const revenue = data.map((item) => item.revenue);
    const orders = data.map((item) => item.orders);
    setMonths(months);
    setRevenue(revenue);
    setOrders(orders);
  }


  useEffect(() => {
    handleFetchReport();
    handleFetchTopCategory();
    return () => new AbortController().abort();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-slate-800 transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Reports & Analytics</span>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold text-slate-950 flex items-center gap-2">
          <BarChart2 className="text-orange-500" size={24} /> Reports & Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500">Comprehensive sales, revenue, and customer analytics for this period.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<DollarSign className="text-orange-500" />} accent="bg-orange-50" label="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(1)}`} trend={+14} />
        <StatsCard icon={<ShoppingCart className="text-emerald-500" />} accent="bg-emerald-50" label="Total Orders" value={totalOrders} trend={+8} />
        <StatsCard icon={<Users className="text-sky-500" />} accent="bg-sky-50" label="New Customers" value={0} trend={+5} />
        <StatsCard icon={<TrendingUp className="text-indigo-500" />} accent="bg-indigo-50" label="Conversion Rate" value="0%" trend={+1} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold text-slate-950">Monthly Revenue</h3>
          <p className="mt-1 text-sm text-slate-500">Revenue breakdown across the last 7 months.</p>
          <div className="mt-6 h-72">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold text-slate-950">Payment Methods</h3>
          <p className="mt-1 text-sm text-slate-500">Share of revenue by payment type.</p>
          <div className="mt-6 h-60">
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-lg font-semibold text-slate-950 mb-4">Top Products by Revenue</h3>
        <div className="space-y-4">
          {topCategories.map((p, i) => {
            const maxRevenue = topCategories[0].revenue;
            const pct = (p.revenue / maxRevenue) * 100;
            return (
              <div key={p.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-800">{i + 1}. {p.name}</span>
                  <span className="font-semibold text-slate-950">${p.revenue.toLocaleString()} <span className="text-slate-400 font-normal">({p.sales} sold)</span></span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
