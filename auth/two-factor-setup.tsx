"use client";
import { useState, useEffect } from "react";

export function TwoFactorSetupForm({ onSuccess }: { onSuccess?: () => void }) {
	const [qr, setQr] = useState("");
	const [secret, setSecret] = useState("");
	const [token, setToken] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/auth/2fa/setup", { method: "POST" })
			.then((res) => res.json())
			.then((data) => {
				setQr(data.qr);
				setSecret(data.secret);
				setLoading(false);
			});
	}, []);

	const handleVerify = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage("");
		const res = await fetch("/api/auth/2fa/verify", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token }),
		});
		const data = await res.json();
		if (data.success) {
			setMessage("2FA enabled!");
			onSuccess?.();
		} else {
			setMessage(data.error || "Invalid code, try again.");
		}
	};

	if (loading) return <div>Loading 2FA setup...</div>;

	return (
		<div className="space-y-3">
			<p className="text-sm">Scan this QR code in your authenticator app:</p>
			<img
				src={qr}
				alt="2FA QR code"
				style={{ width: 250 }}
			/>
			<p className="text-sm">
				Or enter this secret manually:{" "}
				<span className="font-mono">{secret}</span>
			</p>
			<form
				onSubmit={handleVerify}
				className="space-y-2">
				<label className="block text-sm">Enter code from your app:</label>
				<input
					type="text"
					value={token}
					onChange={(e) => setToken(e.target.value)}
					placeholder="123456"
					className="input"
					autoFocus
					required
				/>
				<button
					type="submit"
					className="btn">
					Verify & Enable
				</button>
			</form>
			{message && <div className="text-sm text-red-500">{message}</div>}
		</div>
	);
}
