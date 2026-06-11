export interface Product {
    id: number,
    userId: string;
    categoryId: number;
    categoryName: string;
    username: string;
    name: string;
    description: string;
    price: number;
    discount: number;
    qty: number;
    images: string[],
    updatedAt: string;
    createdAt: string;
}