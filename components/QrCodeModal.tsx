import { Currency } from '@/constant/constant';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qrcode-logo';
import { X, Timer } from 'lucide-react';

type QrCodeModalType = {
    qrString: string;
    currency: Currency;
    amount: number;
    expiresAt?: string;
    onClose: () => void;
};

const QrCodeModal: React.FC<QrCodeModalType> = ({ qrString, currency, amount, expiresAt, onClose }) => {
    const [timeLeft, setTimeLeft] = useState<number>(15 * 60);

    useEffect(() => {
        let expireTime = new Date().getTime() + 15 * 60 * 1000;
        if (expiresAt) {
            expireTime = new Date(expiresAt).getTime();
        }

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = expireTime - now;

            if (distance <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
            } else {
                setTimeLeft(Math.floor(distance / 1000));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div className='fixed z-999 inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all'>
            <div className='relative bg-white rounded-lg overflow-hidden flex flex-col items-center max-w-2xl w-full animate-in zoom-in-95 duration-300'>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/50 hover:bg-white text-gray-700 hover:text-red-500 rounded-full p-2 transition-all z-20 shadow-sm"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="w-full bg-linear-to-r from-orange-500 to-orange-400 text-white text-center py-5">
                    <h2 className="text-2xl font-bold tracking-wider">Payment</h2>
                    <p>Acleda, ABA, ChipMong, Amret, MayBank, Brasak etc.
                    </p>
                </div>

                <div className='w-full p-8 flex flex-col items-center justify-center'>
                    {/* Timer */}
                    <div className={`flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full transition-colors ${timeLeft <= 300 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
                        <Timer size={20} />
                        <span className="text-lg">Expires in: {timeFormatted}</span>
                    </div>

                    {/* qr container */}
                    <div className='relative flex flex-col items-center justify-center group'>
                        <img width={400} className='object-cover drop-shadow-xl rounded-xl' src="https://bakong.nbc.gov.kh/en/images/qr/BKRTKHPPXXX.png" alt='bakong-cover' />
                        <div className='z-10 absolute mb-14 bg-white p-1.5 rounded-xl shadow-inner'>
                            <QRCode logoPadding={0} ecLevel='L' size={160} value={qrString} />
                            
                            {/* Scanning Animation */}
                            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                                <div className="w-full h-1 bg-red-500/50 shadow-[0_0_15px_3px_rgba(239,68,68,0.5)] absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                            </div>
                        </div>
                        <div className='absolute z-20 -mb-62.5 *:text-center'>
                            <h1 className="text-xl font-semibold text-gray-800 tracking-wide">Chamreun Vira</h1>
                            <p className='text-slate-800 font-sm'>vira_chamreun@bkrt</p>
                        </div>
                    </div>

                    <div className="mt-10 text-center w-full bg-gray-50 py-4 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500 tracking-widest mb-1 font-medium">Total Amount</p>
                        <p className="text-xl font-semibold text-rose-500">
                            {currency === 'USD' && '$'} {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency === "KHR" && "៛"}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default QrCodeModal;
