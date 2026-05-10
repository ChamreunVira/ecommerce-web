export interface Product {
    id: string,
    userId: string;
    name: string;
    description: string;
    price: number;
    offerPrice: number;
    image: string[],
    date: number;
}