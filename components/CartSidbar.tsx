import { useAppContext } from "@/context/AppContext";
import { cartService } from "@/services/cart-service";
import { Cart, CartItem } from "@/types/cart";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type CartSidbarType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartSidbar: React.FC<CartSidbarType> = ({ open, setOpen }) => {
  const { handleAddProductToCart, refreshCart } = useAppContext();
  const [cart, setCart] = useState<Partial<Cart>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  const syncCart = (nextCart: Cart) => {
    setCart(nextCart);
    setCartItems(nextCart.cartItems || []);
  };

  const handleIncreaseQuantity = async (item: CartItem) => {
    try {
      setUpdatingItemId(item.id);
      await handleAddProductToCart(item.productId, 1);
      const response = await cartService.getAll();
      if (response.success) {
        syncCart(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDeleteCartItem = async (cartItemId: number) => {
    try {
      setUpdatingItemId(cartItemId);
      const response = await cartService.removeItem(cartItemId);
      if (response.success) {
        syncCart(response.data);
        await refreshCart();
        toast.success("Deleted cart item from cart successfully.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  useEffect(() => {
    if (!open) return;

    let isCurrent = true;

    const fetchCart = async () => {
      try {
        const response = await cartService.getAll();
        if (response.success && isCurrent) {
          syncCart(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCart();

    return () => {
      isCurrent = false;
    };
  }, [open]);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-slate-950/30 transition-opacity duration-300 data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-8 sm:pl-12">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform border-l border-slate-200 bg-white transition duration-300 ease-out data-closed:translate-x-full"
            >
              <div className="flex h-full flex-col bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border border-orange-100 bg-orange-50 text-orange-500">
                      <ShoppingBag size={20} />
                    </span>
                    <div>
                      <DialogTitle className="text-base font-semibold text-slate-950">
                        Shopping cart
                      </DialogTitle>
                      <p className="text-sm text-slate-500">
                        {cartItems.length} item{cartItems.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    aria-label="Close cart"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5">
                  {cartItems.length > 0 ? (
                    <ul role="list" className="divide-y divide-slate-200">
                      {cartItems.map((item) => (
                        <li key={item.id} className="flex gap-4 py-5">
                          <Link
                            href={`/product/${item.productId}`}
                            onClick={() => setOpen(false)}
                            className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                          >
                            <Image
                              className="h-full w-full object-cover"
                              src={`http://localhost:8080/api/v1/uploads/${item.productImage}`}
                              alt={item.productName}
                              width={100}
                              height={100}
                              unoptimized
                            />
                          </Link>

                          <div className="min-w-0 flex-1">
                            <div className="flex gap-3">
                              <div className="min-w-0 flex-1">
                                <Link
                                  href={`/product/${item.productId}`}
                                  onClick={() => setOpen(false)}
                                  className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-orange-600"
                                >
                                  {item.productName}
                                </Link>
                                <p className="mt-1 text-sm text-slate-500">
                                  {formatCurrency(item.finalPrice)} each
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-slate-950">
                                {formatCurrency(item.subtotal)}
                              </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex h-8 items-center rounded-md border border-slate-200 bg-white">
                                <button
                                  type="button"
                                  disabled
                                  className="flex h-full w-8 cursor-not-allowed items-center justify-center text-slate-300"
                                  aria-label="Decrease quantity"
                                  title="Quantity decrease needs a cart update API"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleIncreaseQuantity(item)}
                                  disabled={updatingItemId === item.id}
                                  className="flex h-full w-8 items-center justify-center text-slate-500 hover:bg-slate-50 disabled:cursor-wait disabled:text-slate-300"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteCartItem(item.id)}
                                disabled={updatingItemId === item.id}
                                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-wait disabled:text-slate-300"
                                aria-label={`Remove ${item.productName}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-orange-100 bg-orange-50 text-orange-500">
                        <ShoppingBag size={22} />
                      </div>
                      <p className="font-semibold text-slate-900">
                        Your cart is empty
                      </p>
                      <p className="mt-1 max-w-64 text-sm text-slate-500">
                        Add products to your cart and they will appear here.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 px-5 py-5">
                  <div className="flex items-center justify-between text-base font-semibold text-slate-950">
                    <p>Subtotal</p>
                    <p>{formatCurrency(cart.totalAmount || 0)}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Shipping and taxes are calculated at checkout.
                  </p>

                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="mt-5 flex h-11 items-center justify-center rounded-md bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Checkout
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-3 flex h-10 w-full items-center justify-center rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Continue shopping
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CartSidbar;

function formatCurrency(value: number) {
  return `$${Number(value || 0).toFixed(2)}`;
}
