"use client";

import React from 'react';

export default function AboutPage() {
    return (
        <>
            <div className="bg-white min-h-screen text-gray-800">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Our Story</h2>
                            <p className="mt-4 text-lg text-gray-500">
                                Founded in 2026, ViraDev started with a simple idea: making online shopping accessible and reliable for everyone. What began as a small operation has grown into a premier destination for thousands of happy customers.
                            </p>
                            <p className="mt-4 text-lg text-gray-500">
                                We rigorously source our products, ensuring that everything you buy meets our high standards for quality. Your satisfaction is our absolute priority.
                            </p>
                        </div>
                        <div className="relative h-80 rounded-md overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                                alt="Storefront"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="bg-slate-50 py-16 sm:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-base text-orange-500 font-semibold tracking-wide uppercase">Core Values</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                What Drives Us
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                { title: "Quality First", desc: "We never compromise on the quality of our products or our service." },
                                { title: "Customer Success", desc: "We measure our success by the happiness and satisfaction of our shoppers." },
                                { title: "Innovation", desc: "We constantly improve our platform to bring you a modern shopping experience." }
                            ].map((val, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
