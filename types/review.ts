export interface Review {
    id: number;
    customer: CustomerInfo;
    product: ProductInfo;
    rating: number;
    comment: string;
    status: "PUBLISHED" | "PENDING" | "HIDDEN";
    createdAt: string;
}

type CustomerInfo = {
    id: number;
    name: string;
}

type ProductInfo = {
    id: number;
    name: string;
}