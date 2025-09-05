import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Role } from "@/lib/generated/prisma";
import { getCurrentUser } from "@/lib/session";

export default async function SellerDashboard() {
	const user = await getCurrentUser();
	if (!user || user.role !== Role.SELLER) redirect("/login");

	const sessions = await prisma.session.findMany({
		where: { userId: user.id },
		orderBy: { lastUsed: "desc" },
	});

	const devices = sessions.map((session) => ({
		id: session.id,
		device: session.userAgent || "Unknown device",
		ip: session.ip || "Unknown IP",
		location: "Unknown location",
		lastActive: session.lastUsed.toLocaleString(),
		current: false,
	}));

	return (
		<main className="container">
			<div className="card space-y-4">
				<h1 className="text-2xl font-semibold">Dashboard</h1>
				<p className="text-sm text-gray-600">
					Signed in as <b>{user.email}</b>
				</p>

				<div className="flex gap-3">
					<Link
						className="btn"
						href="/settings/security">
						Security settings
					</Link>
					<form
						action="/api/auth/logout"
						method="post">
						<button
							className="btn"
							type="submit">
							Logout
						</button>
					</form>
				</div>
			</div>

			<div className="card mt-6">
				<h2 className="text-xl font-semibold mb-4">Device Login Tracking</h2>
				<div className="space-y-3">
					{devices.map((d) => (
						<div
							key={d.id}
							className="flex items-center justify-between border rounded-md p-3 text-sm">
							<div>
								<p className="font-medium">{d.device}</p>
								<p className="text-gray-600">IP: {d.ip}</p>
								<p className="text-gray-500">Last active: {d.lastActive}</p>
							</div>
							<div className="flex items-center gap-2">
								{d.current ? (
									<span className="text-green-600 text-xs font-medium">
										Current device
									</span>
								) : (
									<form
										method="post"
										action={`/api/auth/logout-device?id=${d.id}`}>
										<button
											className="btn bg-red-500 text-white px-3 py-1 rounded-md text-xs"
											type="submit">
											Logout
										</button>
									</form>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
