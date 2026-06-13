"use client";
import { assets } from "@/assets/assets";

import OrderSummary from "@/components/OrderSummary";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";

const CartPage = () => {
  const { products, getTotalCart, cartItems } = useAppContext();

  return (
    <>
      <section className="app-container py-14 flex gap-10">
        <div className="w-full flex flex-col">
          <div className="w-full flex items-center justify-between">
            <h1 className="md:text-2xl text-xl text-gray-500 font-semibold">
              Your <span className="text-orange-500">Cart</span>
            </h1>
            <p className="md:text-2xl text-xl text-gray-500 font-medium">
              {getTotalCart()} Item
            </p>
          </div>

          <hr className="mt-4 text-gray-300" />

          <table className="mt-4 table-auto border-collapse min-w-full">
            <thead className="text-left">
              <tr className="*:text-gray-500/90 *:font-normal">
                <th className="font-medium md:px-3 px-1">Product Details</th>
                <th className="font-medium md:px-3 px-1">Price</th>
                <th className="font-medium md:px-3 px-1">Quantity</th>
                <th className="font-medium md:px-3 px-1">Subtotal</th>
              </tr>
            </thead>
            <tbody className="text-left">{}</tbody>
          </table>
          <Link href="/all-product">
            <button className="flex items-center mt-8 text-orange-500 cursor-pointer">
              <Image
                src={assets.arrow_right_icon_colored}
                alt="arrow-icon"
                className="mr-2"
              />
              Continue Shopping
            </button>
          </Link>
        </div>
        <OrderSummary />
      </section>
    </>
  );
};

export default CartPage;
