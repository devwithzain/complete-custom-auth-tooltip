import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import QRCode from "qrcode";

async function getSetup() {
	const user = await getCurrentUser();
	if (!user) redirect("/login");
	const fresh = await prisma.user.findUnique({ where: { id: user.id } });
	return fresh!;
}

export default async function SecurityPage() {
	const user = await getSetup();
	let qrDataUrl: string | null = null;
	if (!user.twoFactorEnabled) {
		// Ask server for TOTP provisioning via API (but also show a placeholder until verified)
	}

	return (
		<main className="container">
			<div className="card space-y-4">
				<h1 className="text-2xl font-semibold">Security</h1>
				<div className="space-y-2">
					<div className="p-4 border rounded-xl">
						<h2 className="font-medium">Two‑Factor Authentication (TOTP)</h2>
						{user.twoFactorEnabled ? (
							<form
								action="/api/auth/2fa/disable"
								method="post"
								className="space-y-2">
								<p className="text-sm text-gray-600">2FA is enabled.</p>
								<button className="btn">Disable 2FA</button>
							</form>
						) : (
							<form
								action="/api/auth/2fa/setup"
								method="post"
								className="space-y-2">
								<p className="text-sm text-gray-600">
									Protect your account with an authenticator app.
								</p>
								<button className="btn">Begin setup</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
