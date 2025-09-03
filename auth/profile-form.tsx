import { auth } from "@/auth";

export default async function ProfileForm({ label }: { label: string }) {
	const session = await auth();
	const user = session?.user;
	return (
		<div className="w-[600px] shadow-md bg-[#04031b] rounded-lg p-4">
			<div>
				<p className="text-2xl font-semibold text-center text-white">{label}</p>
			</div>
			<div className="space-y-4 pt-5">
				<div className="bg-[#3A364D] flex flex-row items-center justify-between rounded-lg p-3 shadow-sm">
					<p className="text-white text-sm font-medium">ID</p>
					<p className="truncate text-xs max-w-[180px] font-mono p-1 bg-white rounded-md">
						{user?.id}
					</p>
				</div>
				<div className="bg-[#3A364D] flex flex-row items-center justify-between rounded-lg p-3 shadow-sm">
					<p className="text-white text-sm font-medium">Name</p>
					<p className="truncate text-xs max-w-[180px] font-mono p-1 bg-white rounded-md">
						{user?.name}
					</p>
				</div>
				<div className="bg-[#3A364D] flex flex-row items-center justify-between rounded-lg p-3 shadow-sm">
					<p className="text-white text-sm font-medium">Email</p>
					<p className="truncate text-xs max-w-[180px] font-mono p-1 bg-white rounded-md">
						{user?.email}
					</p>
				</div>
				<div className="bg-[#3A364D] flex flex-row items-center justify-between rounded-lg p-3 shadow-sm">
					<p className="text-white text-sm font-medium">Role</p>
					<p className="truncate text-xs max-w-[180px] font-mono p-1 bg-white rounded-md">
						{user?.role}
					</p>
				</div>

				<div className="bg-[#3A364D] flex flex-row items-center justify-between rounded-lg p-3 shadow-sm">
					<p className="text-white text-sm font-medium">
						Two Factor Authentication
					</p>
					<p
						className={`font-medium text-sm py-[2px] px-1 cursor-pointer rounded-md ${
							user?.isTwoFactorEnabled
								? "bg-green-500 text-white"
								: "bg-red-500 text-white"
						}`}>
						{user?.isTwoFactorEnabled ? "ON" : "OFF"}
					</p>
				</div>
			</div>
		</div>
	);
}
