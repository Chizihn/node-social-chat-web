"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { axiosErrorHandler } from "@/utils/error";
import { toast } from "sonner";
import { token } from "@/utils/session";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";

export default function VerifyEmail() {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // Cooldown timer for resend
  const user = useAuthStore((state) => state.user);
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Start countdown if cooldown is active
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (user?.isVerified) {
      // toast.success("Email already verified!");
      router.push("/feed");
    }
  }, [router, user?.isVerified]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if the current one is filled
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyLoading(true);
    setError("");

    const otpValue = otp.join("");

    const verifyData = {
      email: user?.email,
      token: otpValue,
    };

    try {
      const response = await api.post(`/auth/verify-email`, verifyData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setUser({ ...user, isVerified: true });

      const { message } = response.data;
      toast.success(message);
      setSuccess(true);

      // Redirect after successful verification
      router.push("/complete-profile");
    } catch (err) {
      const errorMessage = axiosErrorHandler(err);
      setError(errorMessage || "Failed to verify email");
      toast.error(errorMessage || "Email verification failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return; // Don't allow resend if cooldown is active

    setResendLoading(true);
    setError("");

    try {
      const response = await api.post(
        `/auth/resend-verify-email`,
        { email: user?.email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data.message || "Verification email sent successfully!"
      );
      setResendCooldown(120); // Set cooldown to 2 minutes (120 seconds)
    } catch (err) {
      const errorMessage = axiosErrorHandler(err);
      setError(errorMessage || "Failed to resend verification email");
      toast.error(errorMessage || "Failed to resend verification email");
    } finally {
      setResendLoading(false);
    }
  };

  // Use an effect to track OTP input completion
  const isOtpComplete = otp.every((digit) => digit.length === 1);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a 6-digit code to your email address
          </p>
        </div>

        {success ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Email verified successfully! Redirecting...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              ))}
            </div>

            <div>
              <button
                type="submit"
                disabled={verifyLoading || !isOtpComplete}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {verifyLoading ? "Verifying..." : "Verify Email"}
              </button>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500 disabled:text-indigo-300 disabled:cursor-not-allowed"
                  onClick={handleResend}
                  disabled={resendLoading || resendCooldown > 0}
                >
                  {resendLoading
                    ? "Sending..."
                    : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Didn't receive a code? Resend"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
