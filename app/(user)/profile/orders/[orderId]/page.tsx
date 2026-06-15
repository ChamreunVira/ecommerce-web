"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { orderService } from '@/services/order-service';
import { Order } from '@/types/order';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { OrderStatus } from '@/constant/constant';

export default function ViewOrderPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const orderId = params.orderId as string;

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(Number(order));
        }
    }, [orderId]);

    const fetchOrderDetails = async (id: number) => {
        try {
            setLoading(true);
            const response = await orderService.getById(id);
            if (response.success) {
                setOrder(response.data);
            } else {
                toast.error("Failed to load order details.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while loading the order.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING_PAYMENT:
            case OrderStatus.PENDING:
                return "bg-amber-100 text-amber-700";
            case OrderStatus.PROCESSING:
                return "bg-blue-100 text-blue-700";
            case OrderStatus.SHIPPED:
                return "bg-purple-100 text-purple-700";
            case OrderStatus.DELIVERED:
                return "bg-green-100 text-green-700";
            case OrderStatus.CANCELLED:
            case OrderStatus.REFUNDED:
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="app-container py-12 flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="app-container py-12 flex flex-col justify-center items-center min-h-[50vh]">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Order not found</h2>
                <button onClick={() => router.back()} className="text-orange-500 hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="app-container py-8">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Order Details</h1>
                        <p className="text-sm text-slate-500">Order #{order.orderCode || order.orderId} • Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Link href="/" className="px-4 py-2 border border-slate-200 rounded text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                        Back to Shop
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Items List */}
                        <div className="bg-white p-6 rounded-md border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-700 mb-4">Order Items</h2>
                            <div className="divide-y divide-slate-100 space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex gap-4 pt-4 first:pt-0">
                                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded overflow-hidden shrink-0">
                                            <img src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}/${item.imageUrl}`} alt={item.productName} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800 text-sm">{item.productName}</h3>
                                            <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-900">${item.unitPrice?.toFixed(2) || (item.unitPrice * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white p-6 rounded-md border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-700 mb-4">Shipping Info</h2>
                            {order.shippingAddress ? (
                                <div className="text-sm text-slate-600 space-y-1">
                                    <p className="font-semibold text-slate-800">{order.shippingAddress.fullName}</p>
                                    <p>Phone: {order.shippingAddress.phone}</p>
                                    <p>{order.shippingAddress.addressLine}</p>
                                    <p>{order.shippingAddress.city}{order.shippingAddress.province ? `, ${order.shippingAddress.province}` : ''}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No shipping address provided.</p>
                            )}
                            {order.note && (
                                <div className="mt-4 pt-4 border-t border-slate-100 text-sm">
                                    <span className="font-medium text-slate-700">Note: </span>
                                    <span className="text-slate-600">{order.note}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Details */}
                    <div className="space-y-6">
                        {/* Status Widget */}
                        <div className="bg-white p-6 rounded-md border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-700 mb-3">Order Status</h2>
                            <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>
                                {order.status.replace("_", " ")}
                            </span>
                            
                            {order.trackingNumber && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Tracking Number</p>
                                    <p className="text-sm font-semibold text-slate-800">{order.trackingNumber}</p>
                                </div>
                            )}
                        </div>

                        {/* Summary Widget */}
                        <div className="bg-white p-6 rounded-md border border-slate-100 text-sm text-slate-600">
                            <h2 className="text-lg font-bold text-slate-700 mb-4">Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-800">${order.subtotal?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-medium text-slate-800">${order.shippingFee?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between text-base font-bold text-slate-900">
                                    <span>Total Amount</span>
                                    <span className="text-orange-600">${order.totalAmount?.toFixed(2) || '0.00'}</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-slate-50 rounded text-xs flex justify-between items-center">
                                <span>Payment Method</span>
                                <span className="font-semibold text-slate-700">{order.paymentMethod?.replace("_", " ")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
