import { Currency } from "@/constant/constant";
import React, { useEffect, useState } from "react";
import QRCode from "react-qrcode-logo";
import { X, Timer } from "lucide-react";

type QrCodeModalType = {
  qrString: string;
  currency: Currency;
  amount: number;
  expiresAt?: string;
  onClose: () => void;
};

const QrCodeModal: React.FC<QrCodeModalType> = ({
  qrString,
  currency,
  amount,
  expiresAt,
  onClose,
}) => {
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

  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="fixed z-999 inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
      <div className="relative bg-white rounded-lg overflow-hidden flex flex-col items-center max-w-lg w-full animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white/50 hover:bg-white text-gray-700 hover:text-red-500 rounded-full p-2 transition-all z-20 shadow-sm"
        >
          <X size={24} />
        </button>

        <div className="w-full py-12 p-4 flex flex-col items-center justify-center">

          {/* qr container */}
          <div className="relative flex flex-col items-center justify-center group">
            <img
              width={400}
              className="object-cover drop-shadow-md rounded-md"
              src="https://bakong.nbc.gov.kh/en/images/qr/BKRTKHPPXXX.png"
              alt="bakong-cover"
            />
            <div className="z-10 absolute mb-14 bg-white p-1.5 rounded-xl shadow-inner">
              <QRCode logoPadding={0} ecLevel="L" size={160} value={qrString} />
            </div>
            <div className="absolute z-20 -mb-62.5 *:text-center">
              <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
                Chamreun Vira
              </h1>
              <p className="text-slate-800 font-sm">vira_chamreun@bkrt</p>
            </div>
          </div>

          <div className="mt-4 text-center w-full">
            <div>
              <p className="text-lg text-slate-800 font-medium">Total: <span className="text-xl text-emerald-500">{currency === 'USD' && '$'} {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency === "KHR" && "៛"}</span></p>
              <p className="text-sm">{timeFormatted}</p>
            </div>
            <div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;
