"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { axiosErrorHandler } from "@/utils/error";

export default function ResetPassword() {
  const [step, setStep] = useState<number>(1);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const router = useRouter();

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/forgot-password");
    }
  }, [router]);

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;

    setPasswordStrength(strength);
  }, [password]);

  const handleOtpChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    const updatedOtp = [...otp];
    updatedOtp[index] = cleanValue;
    setOtp(updatedOtp);

    if (cleanValue && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length && i < 6; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    if (pasted.length < 6) {
      otpRefs.current[pasted.length]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const otpValue = otp.join("");

    try {
      const response = await fetch("/api/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid OTP");

      setStep(2);
    } catch (err) {
      setError(axiosErrorHandler(err) || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp: otp.join("") }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Reset failed");

      setSuccess(true);
      sessionStorage.removeItem("resetEmail");

      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(axiosErrorHandler(err) || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (): string => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (): string => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto bg-blue-100 p-3 rounded-full">
            {step === 1 ? (
              <Mail className="h-6 w-6 text-blue-600" />
            ) : (
              <Lock className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription className="text-gray-500">
            {step === 1
              ? `Enter the 6-digit code sent to ${email?.replace(
                  /(.{3})(.*)(?=@)/,
                  "$1***"
                )}`
              : "Create a secure password for your account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="ml-2">
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Password reset successful! Redirecting to login...
                </AlertDescription>
              </div>
            </Alert>
          ) : (
            <>
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-50 border-red-200"
                >
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div className="ml-2">
                    <AlertTitle className="text-red-800">Error</AlertTitle>
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {step === 1 ? (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-4">
                    <Label
                      htmlFor="otp-0"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Verification Code
                    </Label>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          ref={(el) => {
                            otpRefs.current[index] = el;
                          }}
                          className="text-center text-xl h-14 w-12 sm:w-14 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ))}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    disabled={loading || otp.some((d) => !d)}
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </Button>
                  <div className="text-sm text-center text-gray-600">
                    Didn&apos;t receive the code?{" "}
                    <Link
                      href="/forgot-password"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Resend code
                    </Link>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-1">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Password Strength</span>
                          <span
                            className={`font-medium ${
                              passwordStrength <= 25
                                ? "text-red-500"
                                : passwordStrength <= 50
                                ? "text-orange-500"
                                : passwordStrength <= 75
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {getStrengthText()}
                          </span>
                        </div>
                        <Progress
                          value={passwordStrength}
                          className={`h-1.5 ${getStrengthColor()}`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">
                        Passwords don&apos;t match
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    disabled={
                      loading ||
                      !password ||
                      !confirmPassword ||
                      password !== confirmPassword
                    }
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="justify-center border-t border-gray-100 pt-4">
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Return to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
