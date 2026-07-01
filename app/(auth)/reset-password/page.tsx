"use client";

import { authService } from "@/services/auth-service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";

const ResetPasswordPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && isNaN(Number(value))) return;

    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split("");
      if (pasted.some(char => isNaN(Number(char)))) return;
      
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move focus to the previous input if backspace is pressed on an empty input
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pasteData.some(char => isNaN(Number(char)))) return;
    
    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasteData.length - 1, 5)]?.focus();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.resetPassword({ otp: finalOtp, newPassword });
      toast.success("Password reset successfully!");
      router.push("/sign-in");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-slate-50">
      <div className="w-full flex items-center justify-center p-4 sm:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h2>
              <p className="text-slate-500 text-sm">
                Enter the OTP sent to your email and set your new password.
              </p>
            </div>
            
            <form onSubmit={handleResetPassword} className="space-y-8">
              {/* OTP Section */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3 text-center">
                  Enter 6-Digit OTP
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-slate-400 text-xs uppercase tracking-wider font-medium">New Password Details</span>
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-orange-500/20"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
