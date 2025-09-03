"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Socials() {
	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-center gap-4">
				<span className="w-full h-[2px] bg-[#6D6980]/30 rounded-lg" />
				<div className="min-w-fit">
					<p className="text-[#6D6980] text-sm">Or login with</p>
				</div>
				<span className="w-full h-[2px] bg-[#6D6980]/30 rounded-lg" />
			</div>
			<div className="flex items-center justify-between gap-5">
				<button
					onClick={() => {}}
					className="w-full flex items-center gap-2 justify-center bg-[#3A364D] text-white text-lg tracking-tight leading-tight rounded-lg p-4">
					<FcGoogle size={22} />
					Google
				</button>
				<button
					onClick={() => {}}
					className="w-full flex items-center gap-2 justify-center bg-[#3A364D] text-white text-lg tracking-tight leading-tight rounded-lg p-4">
					<FaGithub size={22} />
					Github
				</button>
			</div>
		</div>
	);
}
