"use client";

import React, { useState } from 'react';

export default function ContactPage() {
    const [status, setStatus] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Thank you! Your message has been sent successfully.");
        // Normally an API call goes here
    };

    return (
        <>
            <div className="bg-white min-h-screen">

                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Contact Information</h2>
                            <p className="text-gray-500 mb-8">
                                Fill out the form and our team will get back to you within 24 hours. 
                                Or simply reach out to us directly through the information below.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <div className="shrink-0 bg-indigo-100 rounded-full p-3 shadow-inner">
                                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4 text-base text-gray-700 font-medium">support@viradev.com</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="shrink-0 bg-indigo-100 rounded-full p-3 shadow-inner">
                                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4 text-base text-gray-700 font-medium">+855 97 3056 747</div>
                                </div>
                                <div className="flex items-start">
                                    <div className="shrink-0 bg-indigo-100 rounded-full p-3 shadow-inner">
                                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4 text-base text-gray-700 font-medium">House 67, Street 067<br/>Sangkat Boeng Salang, Phnom Penh</div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-md p-8 sm:p-10 border border-slate-100">
                            {status ? (
                                <div className="rounded-md bg-green-50 p-6 border border-green-200 text-center">
                                    <div className="flex justify-center mb-4">
                                        <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent</h3>
                                    <p className="text-green-600">{status}</p>
                                    <button 
                                        onClick={() => setStatus("")}
                                        className="mt-6 text-sm font-medium text-green-700 hover:text-green-800 underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <div className="mt-1">
                                            <input type="text" name="name" id="name" required className="py-3 px-4 block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-lg outline-none focus:ring-2 border" placeholder="Chamreun Vira" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <div className="mt-1">
                                            <input id="email" name="email" type="email" required className="py-3 px-4 block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-lg border outline-none focus:ring-2" placeholder="virachamreun@gmail.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                        <div className="mt-1">
                                            <textarea id="message" name="message" rows={4} required className="py-3 px-4 block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-lg border outline-none focus:ring-2" placeholder="How can we help you?"></textarea>
                                        </div>
                                    </div>
                                    <div>
                                        <button type="submit" className="w-full justify-center py-3 px-6 border border-transparent shadow-md shadow-indigo-500/20 text-base font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
