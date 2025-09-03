"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formimg } from "@/public";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AtSign, KeyRound, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetFormSchema, TresetFormData } from "@/schemas";
import { reset, verifyPasswordResetCode } from "@/action/reset";

export default function ResetForm() {
	const router = useRouter();
	const [code, setCode] = useState("");
	const [email, setEmail] = useState("");
	const [showCodeForm, setShowCodeForm] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<TresetFormData>({
		resolver: zodResolver(resetFormSchema),
	});

	const onSubmits = async (data: TresetFormData) => {
		const response = await reset(data);
		setEmail(data.email);
		if (response?.error) {
			toast.error(response.error);
		}
		if (response?.success) {
			toast.success(response.success);
			setShowCodeForm(true);
		}
	};

	const onVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!code) {
			toast.error("Please provide code");
			return;
		}

		const res = await verifyPasswordResetCode(email, code);

		if (res.success) {
			toast.success("Code verified! Redirecting...");
			router.push(`/new-password?code=${code}`);
		} else {
			toast.error(res.message || "Invalid code");
		}
	};

	return (
		<motion.div
			initial={{ y: "115%" }}
			animate={{ y: "0%" }}
			transition={{ duration: 1, ease: "easeInOut" }}
			className="w-[70%] bg-[#04031b] py-5 rounded-lg relative">
			<div className="w-full flex justify-between items-center">
				<div className="w-1/2 pointer-events-none pl-5">
					<Image
						src={formimg}
						alt="formimg"
						className="w-full object-cover rounded-lg"
						width={800}
						height={400}
						priority
					/>
				</div>
				<div className="w-1/2 flex items-center justify-center">
					<div className="w-full px-10 flex justify-center flex-col gap-5">
						{!showCodeForm ? (
							<>
								<div className="flex flex-col gap-2">
									<h1 className="text-[30px] text-white font-medium leading-tight tracking-tight">
										Forgot password
									</h1>
									<p className="sub-paragraph text-white font-medium leading-tight tracking-tight">
										Enter you&apos;r email address to recive password reset
										code.
									</p>
								</div>
								<form
									onSubmit={handleSubmit(onSubmits)}
									className="flex flex-col gap-5">
									<div className="flex flex-col gap-5">
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
											<span className="text-red-500 text-sm">
												{errors.email.message}
											</span>
										)}
									</div>
									<input
										type="submit"
										value={`${isSubmitting ? "Loading..." : "Send reset email"}`}
										className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer"
										disabled={isSubmitting}
									/>
								</form>
							</>
						) : (
							<>
								<div className="flex flex-col gap-2">
									<h1 className="text-[30px] text-white font-medium leading-tight tracking-tight">
										Enter Reset Code
									</h1>
									<p className="sub-paragraph text-white font-medium leading-tight tracking-tight">
										Please enter the 6-digit code sent to your email.
									</p>
								</div>
								<form
									onSubmit={onVerifyCode}
									className="flex flex-col gap-5">
									<div className="flex flex-col gap-5">
										<div className="w-full flex items-center bg-[#3c375269] rounded-lg p-4 focus-within:border-[#3920BA] focus-within:border-[1px] focus-within:ring-1">
											<KeyRound className="text-[#6D6980] mr-3" />
											<input
												type="text"
												autoComplete="none"
												maxLength={6}
												placeholder="Enter 6-digit code"
												onChange={(e) => setCode(e.target.value)}
												className="bg-transparent text-white placeholder:text-[#6D6980] focus:outline-none outline-none w-full montserrat"
											/>
										</div>
									</div>
									<button
										type="submit"
										className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer">
										Verify Code
									</button>
								</form>
							</>
						)}
						<div>
							<Link
								href="/sign-in"
								className="text-sm text-[#ADABB8] font-normal leading-tight tracking-tight hover:underline absolute right-4 top-4 bg-[#2f1d88] rounded-md p-3">
								<X size={30} />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
