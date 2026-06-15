"use client";
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderSuccessPage() {

    const params = useParams();
    const orderId = params.orderId;

    return (
        <div className="app-container min-h-[60vh] flex items-center justify-center py-12">
            <div className="bg-white p-10 rounded-lg border border-slate-100 max-w-lg w-full text-center space-y-6">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-3">Payment Successful!</h1>
                    <p className="text-slate-500 leading-relaxed">Thank you for your purchase. We've received your payment and your order is currently being processed.</p>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-5 rounded-lg text-sm text-slate-600 space-y-3 mx-auto mt-6">
                    <div className="flex justify-between items-center text-base">
                        <span>Order ID:</span>
                        <span className="font-bold text-slate-900">#{orderId}</span>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/" className="px-6 py-3 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 transition flex-1">
                        Continue Shopping
                    </Link>
                    <Link href={`/profile/orders/${orderId}`} className="px-6 py-3 font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition flex-1">
                        View Orders
                    </Link>
                </div>
            </div>
        </div>
    );
}
