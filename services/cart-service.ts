import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Cart } from "@/types/cart";

class CartService {
    ednpoint: string = "/cart";

    async getAll(): Promise<ApiResponse<Cart>> {
        const response = await http.get(`${this.ednpoint}/items`);
        return response.data;
    }   

    async addToCart(productId: number, quantity: number): Promise<ApiResponse<Cart>> {
        const response = await http.post(`${this.ednpoint}/items`, {
            productId,
            quantity
        });
        return response.data;
    }

    async updateCart(cartId: number , quantity: number): Promise<ApiResponse<Cart>> {
        const response = await http.put(`${this.ednpoint}/items/${cartId}` , {
            quantity
        });
        return response.data;
    }

    async removeItem(cartItemId: number): Promise<ApiResponse<void>> {
      const response = await http.delete(`${this.ednpoint}/items/${cartItemId}`);
      return response.data;
    }


    async clearCart(): Promise<ApiResponse<void>> {
        const response = await http.delete(this.ednpoint);
        return response.data;
    }
}

export const cartService = new CartService();