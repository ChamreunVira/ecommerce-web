export interface OrderItem {
    orderItemId: number;
    productId: number;
    productName: string;
    imageUrl: string;
    unitPrice: number;
    discountRate: number;
    finalPrice: number;
    quantity: number;
    subtotal: number
}