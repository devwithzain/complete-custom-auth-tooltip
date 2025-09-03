"use client";
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
import {
	registerFormSchema,
	TemailVerifyFormData,
	TregisterFormData,
} from "@/schemas";
import { AtSign, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";

export default function RegisterForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const {
		register,
		reset,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<TregisterFormData>({
		resolver: zodResolver(registerFormSchema),
	});

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const onSubmits = async (data: TregisterFormData) => {
		const response = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		const json = await response.json();
		if (response.ok) {
			toast.success(json.success);
			router.push(`/verify?email=${encodeURIComponent(data.email)}`);
		} else {
			toast.error(json.error);
			reset();
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
					<div className="w-full px-10 flex justify-center flex-col gap-8">
						<div className="flex flex-col gap-2">
							<h1 className="subHeading text-white font-bold leading-tight tracking-tight montserrat">
								Create an Account
							</h1>
							<div className="flex items-center gap-2">
								<p className="text-sm  text-[#ADABB8] font-normal leading-tight tracking-tight montserrat">
									Already have an account?
								</p>
								<Link
									href="/login"
									className="text-sm text-[#9887c9] font-normal leading-tight tracking-tight underline montserrat">
									LogIn
								</Link>
							</div>
						</div>
						<form
							onSubmit={handleSubmit(onSubmits)}
							className="flex flex-col gap-5">
							<div className="flex flex-col gap-2">
								<div className="flex flex-col gap-5">
									<div className="flex flex-col gap-2">
										<div
											className={`w-full flex items-center bg-[#3c375269] rounded-lg p-4 focus-within:border-[#3920BA] focus-within:border-[1px] focus-within:ring-1 ${
												errors.name && "border-red-500 border-[1px]"
											}`}>
											<User className="text-[#6D6980] mr-3" />
											<input
												type="text"
												{...register("name")}
												placeholder="Name"
												className={`bg-transparent text-white placeholder:text-[#6D6980] focus:outline-none outline-none w-full montserrat`}
											/>
										</div>
										{errors.name && (
											<span className="text-red-500 text-sm montserrat">
												{errors.name.message}
											</span>
										)}
									</div>
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
							</div>
							<button
								type="submit"
								className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer montserrat"
								disabled={isSubmitting}>
								{isSubmitting ? (
									<Loader2 className="animate-spin mx-auto" />
								) : (
									"Register"
								)}
							</button>
						</form>
						<Socials />
					</div>
				</div>
			</div>
		</motion.div>
	);
}
