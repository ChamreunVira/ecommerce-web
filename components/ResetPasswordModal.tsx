"use client";

import React, { useState, useEffect } from "react";
import { authService } from "@/services/auth-service";
import { toast } from "react-toastify";
import { X, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ResetPasswordModalProps {
  isOpen: boolean;
  email: string;
  otp: string;
  onClose: () => void;
}

type Strength = { label: string; color: string; bars: number };

function getStrength(password: string): Strength {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-rose-500", bars: 1 };
  if (score === 2) return { label: "Fair", color: "bg-amber-400", bars: 2 };
  if (score === 3) return { label: "Good", color: "bg-blue-500", bars: 3 };
  return { label: "Strong", color: "bg-emerald-500", bars: 4 };
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  email,
  otp,
  onClose,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(false);
    }
  }, [isOpen]);

  const strength = newPassword ? getStrength(newPassword) : null;

  const passwordErrors = {
    tooShort: newPassword.length > 0 && newPassword.length < 8,
    noMatch: confirmPassword.length > 0 && newPassword !== confirmPassword,
  };

  const isValid =
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    try {
      const res = await authService.resetPassword({ email, otp, newPassword });
      if (res?.success) {
        setSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        toast.error(res?.message || "Failed to reset password");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 text-white text-center">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Lock size={26} />
            </div>
          </div>
          <h2 className="text-xl font-bold">Set New Password</h2>
          <p className="text-slate-300 text-sm mt-1">
            Choose a strong password for your account.
          </p>
        </div>

        {/* Close */}
        {!success && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X size={18} />
          </button>
        )}

        <div className="p-6 sm:p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                  <CheckCircle size={36} className="text-emerald-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Password Updated!</h3>
              <p className="text-slate-500 text-sm">
                Redirecting you to sign in…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className={`w-full rounded-xl border pr-10 px-4 py-3 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white outline-none transition-all
                      ${passwordErrors.tooShort
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.tooShort && (
                  <p className="text-xs text-rose-500 mt-1">Password must be at least 8 characters.</p>
                )}

                {/* Strength bar */}
                {newPassword && strength && (
                  <div className="mt-2.5 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            bar <= strength.bars ? strength.color : "bg-slate-100"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${
                      strength.bars === 4 ? "text-emerald-500" :
                      strength.bars === 3 ? "text-blue-500" :
                      strength.bars === 2 ? "text-amber-500" : "text-rose-500"
                    }`}>
                      {strength.label} password
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className={`w-full rounded-xl border pr-10 px-4 py-3 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white outline-none transition-all
                      ${passwordErrors.noMatch
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.noMatch && (
                  <p className="text-xs text-rose-500 mt-1">Passwords do not match.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating Password…
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
