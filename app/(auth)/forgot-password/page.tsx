"use client";

import { authService } from "@/services/auth-service";
import Link from "next/link";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Mail, ArrowRight, RefreshCw, ShieldCheck, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type Step = "email" | "otp" | "reset" | "done";

const OTP_RESEND_SECONDS = 60;

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

/* ─────────────────────────────────────────────── */

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  // Step 1
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 2
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(OTP_RESEND_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  /* ── countdown timer ── */
  useEffect(() => {
    if (step !== "otp" || countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, countdown]);

  /* ── focus first OTP box when step changes to "otp" ── */
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 80);
    }
  }, [step]);

  const validateEmail = (v: string) => {
    if (!v) return "Email is required.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address.";
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError("");
    setIsSubmitting(true);
    try {
      const res = await authService.forgotPassword({ email });
      if (res?.success) {
        toast.success("OTP sent to your email!");
        setOtp(["", "", "", "", "", ""]);
        setCountdown(OTP_RESEND_SECONDS);
        setStep("otp");
      } else {
        toast.error(res?.message || "Failed to send OTP");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1 && value.length === 6) {
      const chars = value.split("");
      if (chars.some((c) => isNaN(Number(c)))) return;
      const next = ["", "", "", "", "", ""];
      chars.forEach((c, i) => { if (i < 6) next[i] = c; });
      setOtp(next);
      inputRefs.current[5]?.focus();
      return;
    }

    const lastChar = value.substring(value.length - 1);

    if (lastChar && isNaN(Number(lastChar))) return; // Reject non-numbers

    const next = [...otp];
    next[index] = lastChar;
    setOtp(next);

    if (lastChar !== "" && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
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
      setOtp(["", "", "", "", "", ""]);
      setCountdown(OTP_RESEND_SECONDS);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  }, [countdown, email]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) { toast.error("Please enter the complete 6-digit OTP"); return; }
    setIsVerifying(true);
    try {
      const res = await authService.verifyOtp({ email, otp: finalOtp });
      if (res?.success) {
        toast.success("OTP verified!");
        setVerifiedOtp(finalOtp);
        setNewPassword("");
        setConfirmPassword("");
        setStep("reset");
      } else {
        toast.error(res?.message || "Invalid OTP");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const strength = newPassword ? getStrength(newPassword) : null;
  const passwordErrors = {
    tooShort: newPassword.length > 0 && newPassword.length < 8,
    noMatch: confirmPassword.length > 0 && newPassword !== confirmPassword,
  };
  const resetValid = newPassword.length >= 8 && newPassword === confirmPassword;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetValid) return;
    setIsResetting(true);
    try {
      const res = await authService.resetPassword({ email, otp: verifiedOtp, newPassword });
      if (res?.success) {
        toast.success("Password reset successfully!");
        setStep("done");
        setTimeout(() => router.push("/sign-in"), 2000);
      } else {
        toast.error(res?.message || "Failed to reset password");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex text-gray-900 bg-white">
      <div className="w-full flex items-center justify-center p-8 sm:p-12 lg:p-24 shadow-2xl relative z-10 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );


  /* Step 1 */
  if (step === "email") {
    return (
      <PageWrapper>
        <div className="mb-10 text-center lg:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-xl mb-4">
            <Mail size={22} className="text-indigo-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
          <p className="text-gray-500">Enter your email and we'll send a 6-digit OTP to reset your password.</p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(validateEmail(e.target.value)); }}
              onBlur={() => setEmailError(validateEmail(email))}
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all ${emailError ? "border-rose-400 focus:ring-2 focus:ring-rose-100" : "border-gray-200 focus:border-indigo-500"}`}
            />
            {emailError && <p className="mt-1 text-xs text-rose-500">{emailError}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5">
            {isSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending OTP…</> : <>Send Reset OTP <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link href="/sign-in" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Sign In</Link>
        </p>
      </PageWrapper>
    );
  }

  /* Step 2 */
  if (step === "otp") {
    const otpFull = otp.join("").length === 6;
    return (
      <PageWrapper>
        <div className="mb-10 text-center lg:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-xl mb-4">
            <ShieldCheck size={22} className="text-indigo-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
          <p className="text-gray-500">
            We sent a 6-digit code to <span className="font-semibold text-gray-800">{email}</span>.
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center lg:text-left">Enter 6-Digit OTP</label>
            <div className="flex justify-center lg:justify-start gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={2} // Use 2 to allow typing over existing digits, handleOtpChange will take the last char
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  onFocus={(e) => e.target.select()}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold border rounded-lg outline-none transition-all ${digit
                    ? "bg-indigo-50 border-indigo-400 text-indigo-600"
                    : "bg-white border-gray-200 text-slate-800 focus:border-indigo-500"
                    }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center lg:text-left">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">Resend code in <span className="font-semibold text-indigo-500">{countdown}s</span></p>
            ) : (
              <button type="button" onClick={handleResend} disabled={isResending} className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition disabled:opacity-60">
                <RefreshCw size={14} className={isResending ? "animate-spin" : ""} />
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            )}
          </div>

          <button type="submit" disabled={!otpFull || isVerifying} className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5">
            {isVerifying ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying…</> : <>Verify OTP <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Wrong email?{" "}
          <button onClick={() => setStep("email")} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Go back</button>
        </p>
      </PageWrapper>
    );
  }

  /* Step 3 */
  if (step === "reset") {
    return (
      <PageWrapper>
        <div className="mb-10 text-center lg:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-xl mb-4">
            <Lock size={22} className="text-indigo-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">New Password</h2>
          <p className="text-gray-500">Choose a strong password for your account.</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className={`w-full rounded-lg border pr-10 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all ${passwordErrors.tooShort ? "border-rose-400" : "border-gray-200 focus:border-indigo-500"}`}
              />
              <button type="button" tabIndex={-1} onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordErrors.tooShort && <p className="text-xs text-rose-500 mt-1">Password must be at least 8 characters.</p>}
            {newPassword && strength && (
              <div className="mt-2.5 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((bar) => (
                    <div key={bar} className={`h-1.5 flex-1 rounded-full transition-all ${bar <= strength.bars ? strength.color : "bg-gray-100"}`} />
                  ))}
                </div>
                <p className={`text-xs font-medium ${strength.bars === 4 ? "text-emerald-500" : strength.bars === 3 ? "text-blue-500" : strength.bars === 2 ? "text-amber-500" : "text-rose-500"}`}>
                  {strength.label} password
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className={`w-full rounded-lg border pr-10 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all ${passwordErrors.noMatch ? "border-rose-400" : "border-gray-200 focus:border-indigo-500"}`}
              />
              <button type="button" tabIndex={-1} onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordErrors.noMatch && <p className="text-xs text-rose-500 mt-1">Passwords do not match.</p>}
          </div>

          <button type="submit" disabled={!resetValid || isResetting} className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5">
            {isResetting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Updating Password…</> : "Update Password"}
          </button>
        </form>
      </PageWrapper>
    );
  }

  /* Done */
  return (
    <PageWrapper>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-2xl mb-6">
          <CheckCircle size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">All Done!</h2>
        <p className="text-gray-500">Your password has been updated. Redirecting you to sign in…</p>
      </div>
    </PageWrapper>
  );
};

export default ForgotPasswordPage;
