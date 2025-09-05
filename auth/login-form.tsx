"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Socials from "./socials";
import { useState } from "react";
import { formimg } from "@/public";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, TloginFormData } from "@/schemas";
import { AtSign, Eye, EyeOff, Loader2, Lock } from "lucide-react";

export default function LoginForm() {
	const router = useRouter();
	const [twoFACode, setTwoFACode] = useState("");
	const [pending2FA, setPending2FA] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [is2FALoading, setIs2FALoading] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
		reset,
	} = useForm<TloginFormData>({
		resolver: zodResolver(loginFormSchema),
	});

	const onSubmits = async (data: TloginFormData) => {
		try {
			const response = await axios.post("/api/auth/login", data);
			toast.success(response.data.message);
			router.push("/user-dashboard");
		} catch (error: any) {
			if (error?.response?.status === 412 && error?.response?.data?.twoFactor) {
				toast.success("2FA required, please enter your authenticator code.");
				setPending2FA(true);
				reset();
				return;
			}
			if (error?.response?.status === 403) {
				toast.error(error?.response?.data?.message);
				return;
			}
			const msg =
				error?.response?.data?.error ||
				error?.response?.data?.message ||
				error.message ||
				"Login failed";
			toast.error(msg);
		}
	};

	const handle2FAVerify = async (e: React.FormEvent) => {
		e.preventDefault();
		setIs2FALoading(true);
		try {
			const res = await axios.post("/api/auth/2fa/verify", {
				token: twoFACode,
			});
			if (res.data.success) {
				toast.success("2FA verified, logged in!");
				setPending2FA(false);
				setTwoFACode("");
				router.push("/user-dashboard");
			} else {
				toast.error(res.data.error || "Invalid 2FA code");
			}
		} catch (error: any) {
			const msg =
				error?.response?.data?.error ||
				error?.response?.data?.message ||
				error.message ||
				"2FA verification failed";
			toast.error(msg);
		}
		setIs2FALoading(false);
	};

	return (
		<motion.div
			initial={{ y: "115%" }}
			animate={{ y: "0%" }}
			transition={{ duration: 1, ease: "easeInOut" }}
			className="w-[60%] bg-[#04031b] rounded-xl py-5 h-[80vh] relative">
			<div className="w-full h-full flex justify-between items-center">
				<div className="w-1/2 h-full pointer-events-none pl-5">
					<Image
						src={formimg}
						alt="fromImage"
						className="w-full h-full object-cover rounded-lg"
					/>
				</div>
				<div className="w-1/2 flex items-center justify-center">
					<div className="w-full px-10 flex justify-center flex-col gap-8">
						<div className="flex flex-col gap-4">
							<h1 className="subHeading text-white font-bold leading-tight tracking-tight montserrat">
								LogIn
							</h1>
							<div className="flex items-center gap-2">
								<p className="text-sm text-[#ADABB8] font-normal leading-tight tracking-tight montserrat">
									Don&apos;t have an account?
								</p>
								<Link
									href="/register"
									className="text-sm text-[#9887c9] font-normal leading-tight tracking-tight underline montserrat">
									Register
								</Link>
							</div>
						</div>
						{/* Login Form - hide when 2FA step is pending */}
						{!pending2FA && (
							<form
								onSubmit={handleSubmit(onSubmits)}
								className="flex flex-col gap-5">
								<div className="flex flex-col gap-2">
									<div className="flex flex-col gap-5">
										<div className="flex flex-col gap-2">
											<div
												className={`w-full flex items-center bg-[#3c375269] rounded-lg p-4 focus-within:border-[#3920BA] focus-within:border-[1px] focus-within:ring-1 ${
													errors.email && "border-red-500 border-[1px]"
												}`}>
												<AtSign className="text-[#6D6980] mr-3" />
												<input
													type="email"
													{...register("email")}
													placeholder="Email"
													className={`bg-transparent text-white placeholder:text-[#6D6980] focus:outline-none outline-none w-full montserrat`}
												/>
											</div>
											{errors.email && (
												<span className="text-red-500 text-sm montserrat">
													{errors.email.message}
												</span>
											)}
										</div>
										<div className="flex flex-col gap-2">
											<div
												className={`w-full flex items-center bg-[#3c375269] rounded-lg p-4 focus-within:border-[#3920BA] focus-within:border-[1px] focus-within:ring-1 ${
													errors.password && "border-red-500 border-[1px]"
												}`}>
												<Lock className="text-[#6D6980] mr-3" />
												<input
													type={showPassword ? "text" : "password"}
													{...register("password")}
													placeholder="Enter your password"
													className={`bg-transparent text-white placeholder:text-[#6D6980] focus:outline-none outline-none w-full montserrat`}
												/>
												<button
													type="button"
													onClick={togglePasswordVisibility}
													className="ml-2">
													{showPassword ? (
														<EyeOff className="text-[#6D6980]" />
													) : (
														<Eye className="text-[#6D6980]" />
													)}
												</button>
											</div>
											{errors.password && (
												<span className="text-red-500 text-sm montserrat">
													{errors.password.message}
												</span>
											)}
										</div>
									</div>
									<div className="w-full flex items-end justify-end gap-2 mt-2">
										<Link
											href="/reset-password"
											className="text-sm text-[#ADABB8] font-normal leading-tight tracking-tight cursor-pointer">
											forgot password?
										</Link>
									</div>
								</div>
								<button
									type="submit"
									className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer montserrat"
									disabled={isSubmitting}>
									{isSubmitting ? (
										<Loader2 className="animate-spin mx-auto" />
									) : (
										"Log In"
									)}
								</button>
							</form>
						)}
						{/* 2FA Code Form */}
						{pending2FA && (
							<form
								onSubmit={handle2FAVerify}
								className="flex flex-col gap-4 mt-6">
								<label className="text-white font-bold">Enter 2FA Code</label>
								<input
									type="text"
									value={twoFACode}
									onChange={(e) => setTwoFACode(e.target.value)}
									placeholder="6-digit code from app"
									className="bg-[#3c375269] text-white p-4 rounded-lg"
									autoFocus
									required
									maxLength={6}
									inputMode="numeric"
								/>
								<button
									type="submit"
									className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer montserrat"
									disabled={is2FALoading}>
									{is2FALoading ? (
										<Loader2 className="animate-spin mx-auto" />
									) : (
										"Verify 2FA"
									)}
								</button>
							</form>
						)}
						<Socials />
					</div>
				</div>
			</div>
		</motion.div>
	);
}
