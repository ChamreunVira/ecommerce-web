"use client";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const OrderSummary = () => {
  const { products } = useAppContext();

  return (
    <div className="bg-gray-500/5 rounded-sm p-4 max-w-90 w-full">
      <h1 className="text-2xl text-gray-800/90 font-medium">Order Summary</h1>
      <hr className="text-gray-300 my-4" />

      <div className="mb-4">
        <label htmlFor="#" className="text-sm text-gray-600 uppercase">
          Select Address
        </label>
        <input
          type="text"
          placeholder="Select Address"
          className="w-full mt-2 border-0 outline-1 outline-gray-300 px-3 py-1.5"
        />
      </div>

      <div>
        <label htmlFor="#" className="text-sm text-gray-600 uppercase">
          Promo Code
        </label>
        <input
          type="text"
          placeholder="Enter promo code"
          className="w-full mt-2 border-0 outline-1 outline-gray-300 px-3 py-1.5"
        />
        <button className="mt-4 text-white font-medium bg-orange-500 px-8 py-2">
          Apply
        </button>
        <hr className="my-4 text-gray-300" />
        <div className="flex flex-col justify-center space-y-4">
          <div className="flex justify-between">
            <h3>Items 0</h3>
            <h3>$0</h3>
          </div>
          <div className="flex justify-between">
            <h3>Shipping Fee</h3>
            <h3>Free</h3>
          </div>
          <div className="flex justify-between">
            <h3>Tax (2%)</h3>
            <h3>$0</h3>
          </div>
          <hr className="text-gray-300" />
          <div className="flex justify-between">
            <h3 className="text-xl font-medium text-gray-800/90">Total</h3>
            <h3 className="text-xl font-medium text-gray-800/90">$0</h3>
          </div>
        </div>
        <button className="my-4 w-full text-white font-medium bg-orange-500 px-8 py-2">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
