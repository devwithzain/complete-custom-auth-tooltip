import { useState } from "react";

export default function TwoFactorVerify() {
	const [code, setCode] = useState("");
	const [message, setMessage] = useState("");

	const handleVerify = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/auth/2fa/verify", {
			method: "POST",
			body: JSON.stringify({ code }),
			headers: { "Content-Type": "application/json" },
		});
		const data = await res.json();
		setMessage(data.success ? "2FA enabled!" : data.error || "Invalid code");
	};

	return (
		<form onSubmit={handleVerify}>
			<input
				type="text"
				value={code}
				onChange={(e) => setCode(e.target.value)}
				placeholder="Enter 2FA code"
			/>
			<button type="submit">Verify 2FA</button>
			{message && <p>{message}</p>}
		</form>
	);
}
