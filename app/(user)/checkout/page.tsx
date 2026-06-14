"use client";

import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import React, { EventHandler, useEffect, useState } from 'react';
import BAKONG_LOGO from "@/assets/bakong_logo.png"
import { toast } from 'react-toastify';
import { shippingAddressService } from '@/services/shipping-address-service';
import { ShippingAddress } from '@/types/shipping-address';
import { orderService } from '@/services/order-service';
import { paymentService } from '@/services/payment-service';
import { Payment } from '@/types/payment';
import QrCodeModal from '@/components/QrCodeModal';
import { PaymentStatus } from '@/constant/constant';
import { cartService } from '@/services/cart-service';

export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState("KHQR_BAKONG");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [payment, setPayment] = useState<Payment | null>(null);

    const { cartItems, router } = useAppContext();

    const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([
        // {
        //     id: 1,
        //     fullName: "",
        //     phone: "",
        //     addressLine: "",
        //     city: "",
        //     default: false
        // }
    ]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(1);
    const [isCreatingAddress, setIsCreatingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: "",
        phone: "",
        addressLine: "",
        province: "",
        city: "",
        country: "Cabodia",
        isDefault: false
    }
    );

    const shippingFee = 0.00;
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

    const handleGenerateQrCode = async (orderId: number) => {
        try {
            const response = await paymentService.create(orderId);
            if (response.success) {
                setPayment(response.data)
                console.log(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlePlaceOrder = async (e: any) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            toast.warning("កន្ត្រកទំនិញរបស់អ្នកទទេរ!");
            return;
        }

        const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);
        if (!selectedAddress && !isCreatingAddress) {
            toast.warning("Please select or create a shipping address.");
            return;
        }

        try {
            setLoading(true);
            const response = await orderService.create({
                shippingAddressId: selectedAddress?.id || 1,
                paymentMethod: paymentMethod,
                note: note
            });
            if (response.success) {
                handleGenerateQrCode(response.data.orderId);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleShippingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value.toLowerCase().includes("phnom penh")) {
            setNewAddress((prev) => ({ ...prev, city: value }));
        }
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    }

    const handleCreateShippingAddress = async () => {
        try {
            setLoading(true);
            const response = await shippingAddressService.create(newAddress);
            if (response.success) {
                handleFetchShippingAddress();
                setIsCreatingAddress(true);
                toast.success("Success to create shipping address.");
            }
        } catch (e: any) {
            console.log("Faild to create shipping address: ", e.message);
        } finally {
            setLoading(false);
        }
    }

    const handleFetchShippingAddress = async () => {
        try {
            const response = await shippingAddressService.getAll();
            if (response.success) {
                const defaultAddress = response.data.filter(address => address.default);
                setSavedAddresses(defaultAddress);
            }
        } catch (e: any) {
            console.log("Fails to load shipping address: ", e.message);
        }
    }

    useEffect(() => {
        if (!payment?.transactionId) return;
        const interval = setInterval(async () => {
            try {
                const response = await paymentService.checkStatus(payment.transactionId);
                if (response.success) {
                    if (response.data.status === PaymentStatus.PAID) {
                        clearInterval(interval);

                        toast.success("Payment successfully.");

                        setPayment(null);

                        await cartService.clearCart();

                        router.push(`/checkout/${payment.orderId}/success`);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }, 5000);
        return () => clearInterval(interval)
    }, [payment]);

    useEffect(() => {
        handleFetchShippingAddress();
        return () => new AbortController().abort();
    }, [])

    return (
        <>
            <div className="app-container">
                <section className="max-w-7xl mx-auto py-8">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-2 space-y-6">

                            <div className="bg-white p-6 rounded-md border border-slate-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold flex items-center text-gray-700">
                                        <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                                        Shipping Address
                                    </h2>
                                    {!isCreatingAddress && (
                                        <button
                                            type="button"
                                            onClick={() => setIsCreatingAddress(true)}
                                            className="text-sm text-orange-600 font-medium hover:underline"
                                        >
                                            + Add New Address
                                        </button>
                                    )}
                                </div>

                                {!isCreatingAddress ? (
                                    <div className="space-y-4">
                                        {savedAddresses.map((addr, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'bg-slate-100/50 border-slate-200' : 'border-gray-200'}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            checked={selectedAddressId === addr.id}
                                                            readOnly
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="font-bold text-gray-800">{addr.fullName}</span>
                                                        <span className="text-gray-400">|</span>
                                                        <span className="text-gray-600">{addr.phone}</span>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm text-gray-600 ml-6">
                                                    {addr.addressLine}, {addr.city}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name <span className='text-rose-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={newAddress.fullName}
                                                onChange={handleShippingAddressChange}
                                                className="form-control w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded focus:outline-orange-500"
                                                placeholder="ឆុន ប៊ុនឈាន"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Phone <span className='text-rose-500'>*</span></label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={newAddress.phone}
                                                onChange={handleShippingAddressChange}
                                                className="form-control w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded focus:outline-orange-500"
                                                placeholder="012345678"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">City/Province <span className='text-rose-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="province"
                                                value={newAddress.province}
                                                onChange={handleShippingAddressChange}
                                                className="form-control w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded focus:outline-orange-500"
                                                placeholder="Phnom Penh"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Address Line <span className='text-rose-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="addressLine"
                                                value={newAddress.addressLine}
                                                onChange={handleShippingAddressChange}
                                                className="form-control w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded focus:outline-orange-500"
                                                placeholder="House No., Street, Sangkat..."
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsCreatingAddress(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCreateShippingAddress()}
                                                disabled={loading}
                                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition"
                                            >
                                                Save Address
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Note (Optional)</label>
                                    <textarea
                                        rows={2}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="e.g., Please call before delivery..."
                                        className="form-control w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded focus:outline-orange-500"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-md border border-slate-100">
                                <h2 className="text-lg font-bold mb-4 flex items-center text-gray-700">
                                    <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                    Payment Method
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div onClick={() => setPaymentMethod('KHQR_BAKONG')} className={`border-0 select-none p-4 rounded-md flex items-center cursor-pointer transition ${paymentMethod === 'KHQR_BAKONG' ? 'outline-2 outline-orange-500' : 'border-slate-200'}`}>
                                        <Image className='w-20 object-cover' src={BAKONG_LOGO} alt='bakong_logo' />
                                        <div>
                                            <span className="block font-medium text-slate-800">BAKONG KHQR</span>
                                            <span className="text-xs text-gray-500">ទូទាត់ភ្លាមៗតាម App ធនាគារ</span>
                                        </div>
                                    </div>
                                    <label className={`border-0 select-none p-4 rounded-md flex items-center cursor-pointer transition ${paymentMethod === 'CASH_ON_DELIVERY' ? 'outline-2 outline-orange-500' : 'border-slate-200'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="CASH_ON_DELIVERY"
                                            checked={paymentMethod === 'CASH_ON_DELIVERY'}
                                            onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                                            className="w-5 h-5 cursor-pointer"
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
                                className="btn btn-primary w-full mt-6 py-3 font-bold flex items-center justify-center gap-2 hover:bg-orange-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                Checkout
                            </button>
                        </div>
                    </div>
                </section>

                {/* modal */}
                {payment?.qrString && <QrCodeModal qrString={payment.qrString} amount={payment.amount} currency={payment.currency} expiresAt={payment.expiresAt} onClose={() => setPayment(null)} />}

            </div>
        </>
    );
}
