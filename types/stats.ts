import { RecentOrder } from "./order";

export interface RevenueByMonth {
    month: number;
    revenue: number;
    orders: number
}

export interface TrendCategory {
    id: number;
    name: string;
    revenue: number;
}

export interface DashboardStats {
    revenueByMonths: RevenueByMonth[];
    trendCategories: TrendCategory[];
    recentOrders: RecentOrder[]; 
}