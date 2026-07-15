export interface Promotion {
    id: number;
    code: string;
    type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
    value: number;
    minimumOrder: number;
    usageCount: number;
    usageLimit: number;
    status: "SCHEDULED" | "ACTIVE" | "PAUSED" | "EXPIRED" | "DISABLED";
    startAt: string;
    expiryAt: string;
}