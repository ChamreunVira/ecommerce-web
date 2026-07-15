export interface StockItem {
    id: number;
    name: string;
    status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
    category: string;
    qty: number;
    reorderPoint: number;
}