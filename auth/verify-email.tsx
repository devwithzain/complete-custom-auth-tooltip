"use client";
import axios from "axios";
import Image from "next/image";
import { formimg } from "@/public";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { emailVerifySchema, TemailVerifyFormData } from "@/schemas";

export default function VerifyEmailForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);

	const {
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors },
	} = useForm<TemailVerifyFormData>({
		resolver: zodResolver(emailVerifySchema),
		defaultValues: { code: "" },
	});

	const handleChange = (idx: number, value: string) => {
		if (/^\d?$/.test(value)) {
			const newDigits = [...codeDigits];
			newDigits[idx] = value;
			setCodeDigits(newDigits);

			setValue("code", newDigits.join(""));

			if (value && idx < 5) {
				inputRefs.current[idx + 1]?.focus();
			}
		}
	};

	const handleKeyDown = (
		idx: number,
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Backspace" && !codeDigits[idx] && idx > 0) {
			inputRefs.current[idx - 1]?.focus();
		}
	};

	const onSubmits = async (data: TemailVerifyFormData) => {
		try {
			const response = await axios.post("/api/auth/verify-email", {
				email,
				code: data.code,
			});
			toast.success(response.data.message);
			router.push("/login");
			router.refresh();
		} catch (error: any) {
			const msg =
				error?.response?.data?.error ||
				error?.response?.data?.message ||
				error.message ||
				"Verification failed";
			toast.error(msg);
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
						<div className="flex flex-col gap-2">
							<h1 className="subHeading text-white font-bold leading-tight tracking-tight montserrat">
								Enter Verification Code
							</h1>
						</div>
						<form
							onSubmit={handleSubmit(onSubmits)}
							className="w-full flex flex-col gap-8">
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
										ref={(ref) => {
											inputRefs.current[idx] = ref;
										}}
										className="w-full h-16 text-center text-white text-2xl rounded-lg bg-[#23213a] border border-[#726c8e] placeholder:text-[#726c8e] montserrat outline-none focus:border-[#3920BA] focus:ring-1"
										placeholder="-"
										autoFocus={idx === 0}
									/>
								))}
							</div>
							{errors.code && (
								<span className="text-red-500 text-sm montserrat">
									{errors.code.message}
								</span>
							)}
							<button
								type="submit"
								className="w-full bg-[#2f1d88] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer montserrat"
								disabled={isSubmitting || codeDigits.some((digit) => !digit)}>
								{isSubmitting ? (
									<Loader2 className="animate-spin mx-auto" />
								) : (
									"Verify Code"
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
