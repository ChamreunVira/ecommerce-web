"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { authService } from "@/services/auth-service";
import { toast } from "react-toastify";
import { X, RefreshCw, ShieldCheck } from "lucide-react";

interface OtpVerifyModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onVerified: (otp: string) => void;
}

const OTP_RESEND_SECONDS = 60;

const OtpVerifyModal: React.FC<OtpVerifyModalProps> = ({
  isOpen,
  email,
  onClose,
  onVerified,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(OTP_RESEND_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setCountdown(OTP_RESEND_SECONDS);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [isOpen, countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value && isNaN(Number(value))) return;

    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      if (pasted.some((c) => isNaN(Number(c)))) return;
      const next = ["", "", "", "", "", ""];
      pasted.forEach((c, i) => { if (i < 6) next[i] = c; });
      setOtp(next);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
      return;
    }

    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const chars = e.clipboardData.getData("text").slice(0, 6).split("");
    if (chars.some((c) => isNaN(Number(c)))) return;
    const next = ["", "", "", "", "", ""];
    chars.forEach((c, i) => { if (i < 6) next[i] = c; });
    setOtp(next);
    inputRefs.current[Math.min(chars.length - 1, 5)]?.focus();
  };

  const handleResend = useCallback(async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      await authService.forgotPassword({ email });
      toast.success("OTP resent to your email!");
      setCountdown(OTP_RESEND_SECONDS);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  }, [countdown, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp: finalOtp });
      if (res?.success) {
        toast.success("OTP verified!");
        onVerified(finalOtp);
      } else {
        toast.error(res?.message || "Invalid OTP");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const otpFull = otp.join("").length === 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 p-6 text-white text-center">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
          </div>
          <h2 className="text-xl font-bold">Verify OTP</h2>
          <p className="text-orange-100 text-sm mt-1">
            We sent a 6-digit code to <span className="font-semibold text-white">{email}</span>
          </p>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP inputs */}
            <div>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold border rounded-xl outline-none transition-all
                      ${digit
                        ? "bg-orange-50 border-orange-400 text-orange-600 ring-2 ring-orange-100"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Resend */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-slate-500">
                  Resend code in{" "}
                  <span className="font-semibold text-orange-500">{countdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-500 transition disabled:opacity-60"
                >
                  <RefreshCw size={14} className={isResending ? "animate-spin" : ""} />
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!otpFull || isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-200"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerifyModal;
