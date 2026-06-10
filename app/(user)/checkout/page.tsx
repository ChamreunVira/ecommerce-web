"use client";
import Navbar from '@/components/Navbar';
import { useAppContext } from '@/context/AppContext';
import React, { useEffect, useState } from 'react';

export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState("KHQR");
    const [note, setNote] = useState("");

    const { cartItems } = useAppContext();
    console.log(cartItems);

    const [shippingAddress, setShippingAddress] = useState({
        fullName: "ចំរើន​ វីរ៉ា",
        phone: "(097) 3056 747",
        addressLine: "ផ្ទះលេខ 67, ផ្លូវ ០67, សង្កាត់បឹងសាឡាង",
        city: "Phnom Penh"
    });

    const shippingFee = 2.00;
    const subtotal = cartItems.reduce((total, item) => {
        const finalPrice = item.unitPrice * (1 - item.discountRate);
        return total + (finalPrice * item.quantity);
    }, 0);
    const totalAmount = subtotal + shippingFee;

    const orderItems = cartItems.map((item, index) => {
        const finalPrice = item.unitPrice * (1 - item.discountRate);
        return {
            orderItemId: index + 1,
            productId: item.productId,
            productName: item.productName,
            imageUrl: item.productImage,
            unitPrice: item.unitPrice,
            discountRate: item.discountRate,
            finalPrice: finalPrice,
            quantity: item.quantity,
            subtotal: finalPrice * item.quantity
        };
    });

    const handlePlaceOrder = (e: any) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            alert("កន្ត្រកទំនិញរបស់អ្នកទទេរ!");
            return;
        }

        console.log("Order placed:", {
            items: orderItems,
            shippingAddress,
            paymentMethod,
            note,
            totalAmount
        });
    };

    return (
        <>
            <Navbar handleToggleCartSidebar={() => { return false }} />
            <div className="app-container">
                <section className="max-w-7xl mx-auto py-8">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-2 space-y-6">

                            <div className="bg-white p-6 rounded-md border border-slate-100">
                                <h2 className="text-lg font-bold mb-4 flex items-center text-gray-700">
                                    <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                                    Shipping Address
                                </h2>
                                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Username <span className='text-rose-500'>*</span></label>
                                        <input
                                            type="text"
                                            value={shippingAddress.fullName}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                            className="form-control w-full bg-slate-50 border border-slate-200"
                                            placeholder="ឈ្មោះពេញ"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Phone <span className='text-rose-500'>*</span></label>
                                        <input
                                            type="tel"
                                            value={shippingAddress.phone}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                            className="form-control w-full bg-slate-50 border border-slate-200"
                                            placeholder="012345678"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">City/Province <span className='text-rose-500'>*</span></label>
                                        <input
                                            type="text"
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                            className="form-control w-full bg-slate-50 border border-slate-200"
                                            placeholder="Phnom Penh"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Address <span className='text-rose-500'>*</span></label>
                                        <input
                                            type="text"
                                            value={shippingAddress.addressLine}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                                            className="form-control w-full bg-slate-50 border border-slate-200"
                                            placeholder="ផ្ទះលេខ, ផ្លូវ, សង្កាត់..."
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Note</label>
                                        <textarea
                                            rows={2}
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="ឧទាហរណ៍៖ សូមខលមកមុនពេលដឹក..."
                                            className="form-control w-full bg-slate-50 border border-slate-200 focus:outline-orange-500"
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className="bg-white p-6 rounded-md border border-slate-100">
                                <h2 className="text-lg font-bold mb-4 flex items-center text-gray-700">
                                    <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                    Payment Method
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className={`border p-4 rounded-md flex items-center cursor-pointer transition ${paymentMethod === 'KHQR' ? 'border-orange-500 bg-orange-50/10' : 'border-slate-200 hover:border-orange-500'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="KHQR"
                                            checked={paymentMethod === 'KHQR'}
                                            onChange={() => setPaymentMethod('KHQR')}
                                            className="w-5 h-5 accent-orange-500 cursor-pointer"
                                        />
                                        <div className="ml-3">
                                            <span className="block font-medium text-slate-800">ABA KHQR</span>
                                            <span className="text-xs text-gray-500">ទូទាត់ភ្លាមៗតាម App ធនាគារ</span>
                                        </div>
                                    </label>
                                    <label className={`border p-4 rounded-md flex items-center cursor-pointer transition ${paymentMethod === 'CASH_ON_DELIVERY' ? 'border-orange-500 bg-orange-50/10' : 'border-slate-200 hover:border-orange-500'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="CASH_ON_DELIVERY"
                                            checked={paymentMethod === 'CASH_ON_DELIVERY'}
                                            onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                                            className="w-5 h-5 accent-orange-500 cursor-pointer"
                                        />
                                        <div className="ml-3">
                                            <span className="block font-medium text-slate-800">ទូទាត់ពេលទំនិញមកដល់</span>
                                            <span className="text-xs text-gray-500">Cash on Delivery (COD)</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="stick top-0 right-0 bg-white p-6 rounded-md border border-slate-100 h-fit">
                            <h2 className="text-lg font-bold mb-4 text-gray-700">Order Summary</h2>

                            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto mb-4 pr-1">
                                {orderItems.map((item) => {
                                    const finalPrice = item.unitPrice * (1 - item.discountRate);
                                    return (
                                        <div key={item.productId} className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={`http://localhost:8080/api/v1/uploads/${item.imageUrl}`} alt={item.productName} className="w-12 h-12 object-cover rounded border border-slate-100 bg-gray-50" />
                                                <div>
                                                    <h4 className="text-sm font-medium text-slate-800 max-w-40 truncate">{item.productName}</h4>
                                                    <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-900">${(finalPrice * item.quantity).toFixed(2)}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="space-y-2 border-t border-slate-100 pt-4 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-800">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping Fee</span>
                                    <span className="font-medium text-slate-800">${shippingFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-gray-900 border-t border-slate-100 pt-2">
                                    <span>Total</span>
                                    <span className="text-orange-600">${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                className="btn btn-primary w-full mt-6 py-3 font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                បញ្ជាទិញឥឡូវនេះ
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
