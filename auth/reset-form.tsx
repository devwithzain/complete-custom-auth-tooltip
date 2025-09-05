"use client";
import Image from "next/image";
import { formimg } from "@/public";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	emailSchema,
	codeSchema,
	resetPasswordSchema,
	TresetPasswordFormData,
	TEmailSchema,
} from "@/schemas";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
	const router = useRouter();
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [email, setEmail] = useState("");
	const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const [code, setCode] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);

	// Step 1: Email Form
	const {
		register: registerEmail,
		handleSubmit: handleEmailSubmit,
		formState: { isSubmitting: isEmailSubmitting, errors: emailErrors },
	} = useForm({ resolver: zodResolver(emailSchema) });

	// Step 2: Code Form
	const {
		handleSubmit: handleCodeSubmit,
		setValue: setCodeValue,
		formState: { errors: codeErrors },
	} = useForm({
		resolver: zodResolver(codeSchema),
		defaultValues: { code: "" },
	});

	// Step 3: Password Form
	const {
		register: registerPassword,
		handleSubmit: handlePasswordSubmit,
		formState: { isSubmitting: isPasswordSubmitting, errors: passwordErrors },
	} = useForm<TresetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { password: "" },
	});

	// Email submit
	const onEmailSubmit = async (data: TEmailSchema) => {
		const res = await fetch("/api/auth/send-reset-code", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		const body = await res.json();
		if (res.ok && body.success) {
			setEmail(data.email);
			toast.success("Code sent to your email!");
			setStep(2);
		} else {
			toast.error(body.error || "Failed to send code");
		}
	};

	// Code input logic
	const handleChange = (idx: number, value: string) => {
		if (/^\d?$/.test(value)) {
			const newDigits = [...codeDigits];
			newDigits[idx] = value;
			setCodeDigits(newDigits);
			setCodeValue("code", newDigits.join(""));
			if (value && idx < 5) {
				inputRefs.current[idx + 1]?.focus();
			}
		}
	};

	// Backspace
	const handleKeyDown = (
		idx: number,
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Backspace" && !codeDigits[idx] && idx > 0) {
			inputRefs.current[idx - 1]?.focus();
		}
	};

	// Code submit
	const onCodeSubmit = async (data: { code: string }) => {
		setIsVerifying(true);
		const res = await fetch("/api/auth/verify-reset-code", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, code: data.code }),
		});
		const body = await res.json();
		setIsVerifying(false);
		if (res.ok && body.success) {
			setCode(data.code);
			toast.success("Code verified!");
			setStep(3);
		} else {
			toast.error(body.error || "Invalid code");
		}
	};

	// Password submit
	const onPasswordSubmit = async (data: TresetPasswordFormData) => {
		console.log(data);
		const res = await fetch("/api/auth/reset-password", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, code, password: data.password }),
		});
		const body = await res.json();
		console.log(body);
		if (res.ok && body.success) {
			toast.success("Password changed!");
			router.push("/login");
		} else {
			toast.error(body.error || "Failed to change password");
		}
	};

	return (
		<motion.div
			initial={{ y: "115%" }}
			animate={{ y: "0%" }}
			transition={{ duration: 1, ease: "easeInOut" }}
			className="w-[60%] h-[80vh] bg-[#04031b] rounded-xl py-5 relative">
			<div className="w-full h-full flex justify-between items-center pl-5">
				<div className="w-1/2 h-full pointer-events-none">
					<Image
						src={formimg}
						alt="fromImage"
						className="w-full h-full object-cover rounded-xl"
					/>
				</div>
				<div className="w-1/2 flex items-center justify-center">
					<div className="w-full px-10 flex justify-center flex-col gap-5">
						{step === 1 && (
							<form
								onSubmit={handleEmailSubmit(onEmailSubmit)}
								className="w-full flex flex-col gap-8">
								<h1 className="subHeading text-white font-bold leading-tight tracking-tight montserrat mb-2">
									Enter your Email
								</h1>
								<input
									{...registerEmail("email")}
									type="email"
									placeholder="Email"
									className="w-full h-16 text-white text-xl rounded-lg bg-[#23213a] border border-[#726c8e] px-4 montserrat outline-none focus:border-[#3920BA] focus:ring-1 placeholder:text-[#726c8e]"
								/>
								{emailErrors.email && (
									<span className="text-red-500 text-sm montserrat">
										{emailErrors.email.message}
									</span>
								)}
								<button
									type="submit"
									className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer montserrat"
									disabled={isEmailSubmitting}>
									{isEmailSubmitting ? (
										<Loader2 className="animate-spin mx-auto" />
									) : (
										"Send Code"
									)}
								</button>
							</form>
						)}

						{step === 2 && (
							<form
								onSubmit={handleCodeSubmit(onCodeSubmit)}
								className="w-full flex flex-col gap-8">
								<h1 className="subHeading text-white font-bold leading-tight tracking-tight montserrat mb-2">
									Enter 6-digit Code
								</h1>
								<div className="w-full flex gap-3">
									{codeDigits.map((digit, idx) => (
										<input
											key={idx}
											type="text"
											inputMode="numeric"
											maxLength={1}
											value={digit}
											onChange={(e) => handleChange(idx, e.target.value)}
											onKeyDown={(e) => handleKeyDown(idx, e)}
											ref={(ref) => { inputRefs.current[idx] = ref; }}
											className="w-full h-16 text-center text-white text-2xl rounded-lg bg-[#23213a] border border-[#726c8e] placeholder:text-[#726c8e] montserrat outline-none focus:border-[#3920BA] focus:ring-1"
											placeholder="-"
											autoFocus={idx === 0}
										/>
									))}
								</div>
								{codeErrors.code && (
									<span className="text-red-500 text-sm montserrat">
										{codeErrors.code.message}
									</span>
								)}
								<button
									type="submit"
									className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer montserrat"
									disabled={isVerifying || codeDigits.some((d) => !d)}>
									{isVerifying ? (
										<Loader2 className="animate-spin mx-auto" />
									) : (
										"Verify Code"
									)}
								</button>
							</form>
						)}

						{step === 3 && (
							<form
								onSubmit={handlePasswordSubmit(onPasswordSubmit)}
								className="w-full flex flex-col gap-8">
								<h1 className="subHeading text-white font-bold leading-tight tracking-tight montserrat mb-2">
									Enter New Password
								</h1>
								<input
									{...registerPassword("password")}
									type="password"
									placeholder="New Password"
									className="w-full h-16 text-white text-xl rounded-lg bg-[#23213a] border border-[#726c8e] px-4 montserrat outline-none focus:border-[#3920BA] focus:ring-1 placeholder:text-[#726c8e]"
								/>
								{passwordErrors.password && (
									<span className="text-red-500 text-sm montserrat">
										{passwordErrors.password.message}
									</span>
								)}
								<button
									type="submit"
									className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer montserrat"
									disabled={isPasswordSubmitting}>
									{isPasswordSubmitting ? (
										<Loader2 className="animate-spin mx-auto" />
									) : (
										"Reset Password"
									)}
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}
