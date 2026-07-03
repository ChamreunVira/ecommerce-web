"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  BadgeDollarSign,
  Boxes,
  Clock3,
  CreditCard,
  PackagePlus,
  ShoppingCart,
  Star,
  Truck,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { userService } from "@/services/user-service";
import { orderService } from "@/services/order-service";
import { MONTHS, OrderStatus } from "@/constant/constant";
import AdminStatsCard, { StatCard } from "@/components/AdminStatsCard";
import { RecentOrder } from "@/types/order";
import { DashboardStats, RevenueByMonth } from "@/types/stats";
import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import RevenueChart from "@/components/RevenueChart";
import OrderStatusChart from "@/components/OrderStatusChart";

export type QuickAction = {
  label: string;
  description: string;
  href: string;
  icon: ReactNode;
};

interface CardStats {
  value: number;
  percentage: number;
  trend: "up" | "down";
}

type Statistics = {
  revenue: CardStats;
  order: CardStats;
  customer: CardStats;
  product: CardStats;
};

export default function DashboardPage() {

  const [statistics, setStatistics] = useState<Statistics>(initStats);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const revenueData = dashboardStats?.revenueByMonths ?? [];
  const highestRevenue = revenueData.length > 0
    ? revenueData.reduce((best, item) =>
      item.revenue > best.revenue ? item : best
    )
    : { month: 0, revenue: 0, orders: 0 };

  const orderStatusCounts = {
    pending: dashboardStats?.recentOrders.filter(o => o.status === "PENDING").length ?? 0,
    delivered: dashboardStats?.recentOrders.filter(o => o.status === "DELIVERED").length ?? 0,
    cancelled: dashboardStats?.recentOrders.filter(o => o.status === "CANCELLED").length ?? 0,
    processing: dashboardStats?.recentOrders.filter(o => o.status === "PROCESSING").length ?? 0,
  };

  const { products } = useAppContext();

  const lowStock = products.filter((product) => product.qty < 5).length;

  const stats: StatCard[] = [
    {
      label: "Total revenue",
      value: `$${statistics.revenue.value.toFixed(2)}`,
      change: `${statistics.revenue.percentage.toFixed(2)}`,
      trend: "up",
      caption: "vs. last month",
      icon: <BadgeDollarSign size={22} />,
      accent: "bg-orange-50 text-orange-600 ring-orange-100",
    },
    {
      label: "Orders",
      value: `${statistics.order.value}`,
      change: `${statistics.order.percentage.toFixed(2)}%`,
      trend: statistics.order.trend,
      caption: "412 ready to ship",
      icon: <ShoppingCart size={22} />,
      accent: "bg-sky-50 text-sky-600 ring-sky-100",
    },
    {
      label: "Customers",
      value: `${statistics.customer.value}`,
      change: `${statistics.customer.percentage.toFixed(2)}%`,
      trend: statistics.customer.trend,
      caption: "new and returning",
      icon: <Users size={22} />,
      accent: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    },
    {
      label: "Low stock",
      value: `${statistics.product.value}`,
      change: `${statistics.product.percentage.toFixed(2)}%`,
      trend: statistics.product.trend,
      caption: "items need attention",
      icon: <Boxes size={22} />,
      accent: "bg-rose-50 text-rose-600 ring-rose-100",
    },
  ];

  const refunds = dashboardStats?.recentOrders.filter((order) => order.status === "REFUNDED");
  const totalRefunds = refunds?.reduce((acc, item) => acc + item.totalAmount, 0);
  const collects = dashboardStats?.recentOrders.filter((order) => order.status === "PENDING");
  const totalCollects = collects?.reduce((acc, item) => acc + item.totalAmount, 0);


  const handleFetchDashboardStats = async () => {
    try {
      const response = await http.get<ApiResponse<DashboardStats>>("/stats");
      if (response.status === 200) {
        console.log(response.data.data);
        setDashboardStats(response.data.data);
      }
    } catch (err: any) {
      console.log("Failded to load stats: ", err);
    }
  }

  useEffect(() => {
    let isMounted = true;

    const handleInitStatistics = async () => {
      const [customerResponse, orderResponse] = await Promise.all([
        userService.getAll(),
        orderService.getAllSummary(OrderStatus.PENDING),
      ]);

      if (!isMounted) return;

      const totalCustomer = customerResponse.data.filter((user) =>
        user.roles.includes("ROLE_CUSTOMER"),
      ).length;

      const customer = calculateChange(totalCustomer, 0);

      const totalOrder = orderResponse.data.length;

      const order = calculateChange(totalOrder, 0);

      const totalRevenue = orderResponse.data.reduce((acc, item) => {
        return acc + item.totalAmount;
      }, 0);

      const revenue = calculateChange(totalRevenue, 0);

      setStatistics({
        customer: {
          value: totalCustomer,
          percentage: customer.percentage,
          trend: customer.trend,
        },
        order: {
          value: totalOrder,
          percentage: order.percentage,
          trend: order.trend,
        },
        revenue: {
          value: totalRevenue,
          percentage: revenue.percentage || 0,
          trend: revenue.trend,
        },
        product: {
          value: lowStock,
          percentage: (lowStock / products.length) * 100,
          trend: lowStock < products.length ? "up" : "down",
        },
      });
    };

    handleInitStatistics();

    return () => {
      isMounted = false;
    };
  }, [lowStock, products.length]);

  useEffect(() => {
    let isMounted = true;
    handleFetchDashboardStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="min-h-full bg-slate-50 text-slate-900">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium text-orange-600">Overview</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
              Ecommerce performance
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Analytics for revenue, orders, customers, inventory, and daily
              operations.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <Link
              href="/admin/product"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              <PackagePlus size={18} />
              New product
            </Link>
            <Link
              href="/admin/order"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
            >
              <Clock3 size={18} />
              Pending orders
            </Link>
          </div>
        </div>

        {/* stats card */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, i) => (<AdminStatsCard key={i} item={item} />))}
        </div>

        {/* revenue trend */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.9fr)]">
          <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  Revenue trend
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Monthly revenue with order volume for the current sales
                  period.
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                <p className="text-xs font-medium uppercase text-slate-500">
                  Best month
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">
                  {MONTHS[highestRevenue.month]} ·{" "}
                  {formatCompactCurrency(highestRevenue.revenue)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <RevenueChart data={revenueData} />
            </div>

            <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500">Average revenue</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {revenueData.length > 0
                    ? formatCompactCurrency(revenueData.reduce((s, d) => s + d.revenue, 0) / revenueData.length)
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total orders</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {revenueData.reduce((s, d) => s + d.orders, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Best month</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {MONTHS[highestRevenue.month] || "—"}
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    Order status
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Distribution this period
                  </p>
                </div>
                <Star className="text-amber-500" size={22} />
              </div>
              <div className="mt-4">
                <OrderStatusChart
                  pending={orderStatusCounts.pending}
                  delivered={orderStatusCounts.delivered}
                  cancelled={orderStatusCounts.cancelled}
                  processing={orderStatusCounts.processing}
                />
              </div>
            </article>

            <article className="rounded-lg bg-slate-950 p-5 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Payment summary</h3>
                  <p className="mt-1 text-sm text-slate-300">
                    Ready to settle with providers
                  </p>
                </div>
                <CreditCard className="text-orange-400" size={24} />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Collected</p>
                  <p className="mt-2 text-2xl font-semibold">${totalCollects?.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Refunds</p>
                  <p className="mt-2 text-2xl font-semibold">${totalRefunds?.toFixed(2)}</p>
                </div>
              </div>
            </article>

          </div>
        </div>

        {/* quickActions */}
        <div className="grid gap-6 xl:grid-cols-[minmax(340px,0.85fr)_minmax(0,1.15fr)]">
          <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-950">
              Quick actions
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Common admin tasks for daily operations.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center gap-4 rounded-lg border border-slate-200 p-4 transition hover:border-orange-200 hover:bg-orange-50/60"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:bg-orange-500 group-hover:text-white">
                    {action.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-900">
                      {action.label}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-500">
                      {action.description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  Recent orders
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Latest customer purchases and payment state.
                </p>
              </div>
              <Link
                href="/admin/order"
                className="text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
              <div className="hidden grid-cols-[1fr_1fr_0.8fr_0.8fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500 md:grid">
                <span>Order</span>
                <span>Customer</span>
                <span>Total</span>
                <span>Status</span>
              </div>
              {dashboardStats?.recentOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="grid gap-3 border-t border-slate-100 px-4 py-4 text-sm first:border-t-0 md:grid-cols-[1fr_1fr_0.8fr_0.8fr] md:items-center md:first:border-t"
                >
                  <div className="flex items-start justify-between gap-3 md:block">
                    <div>
                      <p className="font-semibold text-slate-900">{order.orderCode}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {order.createdDate === new Date().toLocaleDateString() ? "Today" : order.createdDate}
                      </p>
                    </div>
                    <span
                      className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1 md:hidden ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:contents">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase text-slate-400 md:hidden">
                        Customer
                      </p>
                      <p className="truncate font-medium text-slate-700">
                        {order.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-slate-400 md:hidden">
                        Total
                      </p>
                      <p className="font-semibold text-slate-950">
                        {order.totalAmount}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`hidden w-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1 md:inline-flex ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function buildChartPoints(data: RevenueByMonth[]) {
  const width = 640;
  const height = 230;
  const padding = 18;

  if (data.length === 0) {
    return {
      width,
      height,
      points: [],
      linePath: "",
      areaPath: "",
    };
  }

  const values = data.map((item) => item.revenue);
  const min = Math.min(...values) * 0.86;
  const max = Math.max(...values) * 1.08;
  const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;
  const rangeY = max - min === 0 ? 1 : max - min;

  const points = data.map((item, index) => {
    const x = data.length > 1 ? padding + index * stepX : width / 2;
    const y =
      height -
      padding -
      ((item.revenue - min) / rangeY) * (height - padding * 2);
    return { ...item, x, y };
  });

  return {
    width,
    height,
    points,
    linePath: points.map((point) => `${point.x},${point.y}`).join(" "),
    areaPath: `${padding},${height - padding} ${points
      .map((point) => `${point.x},${point.y}`)
      .join(" ")} ${width - padding},${height - padding}`,
  };
}

const initStats: Statistics = {
  revenue: {
    value: 0,
    percentage: 0,
    trend: "up",
  },
  order: {
    value: 0,
    percentage: 0,
    trend: "up",
  },
  customer: {
    value: 0,
    percentage: 0,
    trend: "up",
  },
  product: {
    value: 0,
    percentage: 0,
    trend: "up",
  },
};

const quickActions: QuickAction[] = [
  {
    label: "Add product",
    description: "Create inventory item",
    href: "/admin/product",
    icon: <PackagePlus size={20} />,
  },
  {
    label: "Review orders",
    description: "Open pending sales",
    href: "/admin/order",
    icon: <Truck size={20} />,
  },
  {
    label: "Add customer",
    description: "Create user account",
    href: "/admin/user",
    icon: <UserPlus size={20} />,
  },
  {
    label: "Store settings",
    description: "Payment and profile",
    href: "/admin/setting",
    icon: <WalletCards size={20} />,
  },
];

const statusStyles: Record<RecentOrder["status"], string> = {
  PENDING_PAYMENT: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-100",
  SHIPPED: "bg-sky-50 text-sky-700 ring-sky-100",
  CANCELLED: "bg-rose-50 text-rose-700 ring-rose-100",
  DELIVERED: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  PROCESSING: "bg-sky-50 text-sky-700 ring-sky-100",
  REFUNDED: "bg-red-50 text-red-700 ring-red-100"
};

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

const calculateChange = (current: number, previous: number): { percentage: number; trend: "up" | "down" } => {
  if (previous === 0) {
    return {
      percentage: 0,
      trend: "up",
    };
  }

  const percentage = ((current - previous) / previous) * 100;
  const trend = percentage > 0 ? "up" : "down";
  return {
    percentage: Math.abs(percentage),
    trend: trend,
  };
};
