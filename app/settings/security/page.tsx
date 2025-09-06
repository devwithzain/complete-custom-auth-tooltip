"use client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/use-current-user";
import { TwoFactorSetupForm } from "@/auth/two-factor-setup";

export default function SecurityPage() {
	const [user, setUser] = useState<any>(null);
	const [showSetup, setShowSetup] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			const currentUser = await getCurrentUser();
			setUser(currentUser);
		};
		fetchUser();
	}, []);

	const disable2FA = async () => {
		try {
			await axios.post("/api/auth/2fa/disable");
			toast.success("Two-factor authentication disabled.");
			window.location.reload();
		} catch (error) {
			toast.error("Failed to disable two-factor authentication.");
		}
	};

	return (
		<main className="w-7xl">
			<div className="card space-y-4">
				<h1 className="text-2xl font-semibold">Security</h1>
				<div className="space-y-2">
					<div className="p-4 border rounded-xl">
						<h2 className="font-medium">Two Factor Authentication (TOTP)</h2>
						{user && user.twoFactorEnabled ? (
							<form
								onSubmit={disable2FA}
								method="post"
								className="space-y-2">
								<p className="text-sm text-gray-600">2FA is enabled.</p>
								<button
									type="submit"
									className="btn">
									Disable 2FA
								</button>
							</form>
						) : showSetup ? (
							<TwoFactorSetupForm onSuccess={() => setShowSetup(false)} />
						) : (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									setShowSetup(true);
								}}
								className="space-y-2">
								<p className="text-sm text-gray-600">
									Protect your account with an authenticator app.
								</p>
								<button
									className="btn"
									type="submit">
									Begin setup
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
