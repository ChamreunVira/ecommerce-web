import { Product } from "./product";

export interface Category {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    products: Product[];
}