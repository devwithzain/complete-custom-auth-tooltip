"use client";
import type { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestResetSchema } from "@/lib/schemas";
import AuthCard from "@/components/AuthCard";

type FormValues = z.infer<typeof requestResetSchema>;

export default function ForgotPasswordPage() {
	const [message, setMessage] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(requestResetSchema),
	});

	const onSubmit = async (data: FormValues) => {
		setMessage(null);
		const res = await fetch("/api/auth/request-password-reset", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		const json = await res.json();
		if (!res.ok) setMessage(json.error || "Something went wrong");
		else setMessage("If the email exists, a reset link has been sent.");
	};

	return (
		<AuthCard title="Forgot password">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-3">
				<div>
					<label className="label">Email</label>
					<input
						className="input"
						{...register("email")}
						type="email"
					/>
					{errors.email && <p className="error">{errors.email.message}</p>}
				</div>
				<button
					className="btn w-full"
					disabled={isSubmitting}>
					{isSubmitting ? "Please wait…" : "Send reset link"}
				</button>
				{message && <p className="text-sm mt-2">{message}</p>}
			</form>
		</AuthCard>
	);
}
