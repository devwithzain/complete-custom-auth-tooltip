"use client";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { formimg } from "@/public";
import { motion } from "framer-motion";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect } from "react";
import { newVerification } from "@/action/new-verification";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewVerificationForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const onSubmit = useCallback(() => {
		if (!token) {
			toast.error("Token not found!");
			return;
		}

		newVerification(token).then((response) => {
			if (response.success) {
				toast.success(response.success);
				router.push("/sign-in");
			}
			if (response.error) {
				toast.error(response.error);
			}
		});
	}, [token, router]);

	useEffect(() => {
		onSubmit();
	}, [onSubmit]);

	return (
		<motion.div
			initial={{ y: "115%" }}
			animate={{ y: "0%" }}
			transition={{ duration: 1, ease: "easeInOut" }}
			className="w-[70%] bg-[#04031b] py-5 rounded-lg">
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
					<div className="w-full px-10 flex justify-center flex-col gap-8">
						<div className="flex flex-col gap-4">
							<h1 className="text-[40px] text-white font-medium leading-tight tracking-tight">
								Confirm your verification
							</h1>
							<div className="flex items-center gap-2">
								<Link
									href="/sign-in"
									className="text-sm text-[#9887c9] font-normal leading-tight tracking-tight underline">
									Back to LogIn
								</Link>
							</div>
							<div className="flex items-center gap-2">
								<BeatLoader color="white" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
