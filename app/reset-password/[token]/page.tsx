"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/schemas";
import type { z } from "zod";
import AuthCard from "@/components/AuthCard";
import { useParams } from "next/navigation";
import { useState } from "react";

type FormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
	const params = useParams<{ token: string }>();
	const [message, setMessage] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { token: String(params.token) },
	});

	const onSubmit = async (data: FormValues) => {
		setMessage(null);
		const res = await fetch("/api/auth/reset-password", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		const json = await res.json();
		if (!res.ok) setMessage(json.error || "Something went wrong");
		else window.location.href = "/login";
	};

	return (
		<AuthCard title="Set a new password">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-3">
				<input
					type="hidden"
					{...register("token")}
				/>
				<div>
					<label className="label">New password</label>
					<input
						className="input"
						{...register("password")}
						type="password"
					/>
					{errors.password && (
						<p className="error">{errors.password.message}</p>
					)}
				</div>
				<button
					className="btn w-full"
					disabled={isSubmitting}>
					{isSubmitting ? "Please wait…" : "Reset password"}
				</button>
				{message && <p className="text-sm mt-2">{message}</p>}
			</form>
		</AuthCard>
	);
}
