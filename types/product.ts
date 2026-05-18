export interface Product {
    id: string,
    userId: string;
    categoryId: string;
    categoryName: string;
    username: string;
    name: string;
    description: string;
    price: number;
    discount: number;
    image: string[],
    updatedAt: string;
    createdAt: string;
}