import Link from "next/link";

export default function Home() {
	return (
		<div className="w-full h-screen flex items-center justify-center bg-gray-200">
			<div className="flex items-center gap-2">
				<Link
					className="text-lg text-white font-medium tracking-tight leading-tight bg-black px-4 py-2 rounded-md font-serif"
					href="/login">
					Login
				</Link>
				<Link
					className="text-lg text-white font-medium tracking-tight leading-tight bg-black px-4 py-2 rounded-md font-serif"
					href="/register">
					Register
				</Link>
			</div>
		</div>
	);
}
