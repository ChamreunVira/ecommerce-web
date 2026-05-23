export interface Cart {
    id: number;
    userId: number;
    totalItem: number;
    totalAmount: number;
    cartItems: CartItem[];
    updatedAt: string;
}

export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    productImage: string;
    unitPrice: number;
    discountRate: number;
    finalPrice: number;
    quantity: number;
    subtotal: number;
}