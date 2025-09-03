"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formimg } from "@/public";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, X } from "lucide-react";
import { newPassword } from "@/action/new-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { newPasswordFormSchema, TnewPasswordFormData } from "@/schemas";

export default function NewPasswordForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const code = searchParams.get("code");
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<TnewPasswordFormData>({
		resolver: zodResolver(newPasswordFormSchema),
	});

	const onSubmits = async (data: TnewPasswordFormData) => {
		const response = await newPassword(data, code);
		if (response?.error) {
			toast.error(response.error);
		}
		if (response?.success) {
			toast.success(response.success);
			router.push("/sign-in");
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
						<div className="flex flex-col gap-4">
							<h1 className="text-[30px] text-white font-medium leading-tight tracking-tight">
								Enter new password
							</h1>
						</div>
						<form
							onSubmit={handleSubmit(onSubmits)}
							className="flex flex-col gap-5">
							<div className="flex flex-col gap-5">
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
							</div>
							<input
								type="submit"
								value={`${isSubmitting ? "Loading..." : "Reset password"}`}
								className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer"
								disabled={isSubmitting}
							/>
						</form>
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
