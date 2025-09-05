"use client";

import { useEffect, useState } from "react";
import { UserRole } from "@/lib/auth-utils";

interface RoleGuardProps {
	allowedRoles: UserRole[];
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function RoleGuard({
	allowedRoles,
	children,
	fallback,
}: RoleGuardProps) {
	const [hasAccess, setHasAccess] = useState<boolean | null>(null);

	useEffect(() => {
		async function checkAccess() {
			try {
				const response = await fetch("/api/auth/me");
				if (!response.ok) {
					setHasAccess(false);
					return;
				}

				const user = await response.json();
				setHasAccess(allowedRoles.includes(user.role));
			} catch (error) {
				console.error("Role check error:", error);
				setHasAccess(false);
			}
		}

		checkAccess();
	}, [allowedRoles]);

	if (hasAccess === null) {
		return <div>Loading...</div>;
	}

	if (!hasAccess) {
		return fallback || <div>Access denied. Insufficient permissions.</div>;
	}

	return <>{children}</>;
}

export function AdminOnly({
	children,
	fallback,
}: Omit<RoleGuardProps, "allowedRoles">) {
	return (
		<RoleGuard
			allowedRoles={["ADMIN"]}
			fallback={fallback}>
			{children}
		</RoleGuard>
	);
}

export function SellerOnly({
	children,
	fallback,
}: Omit<RoleGuardProps, "allowedRoles">) {
	return (
		<RoleGuard
			allowedRoles={["SELLER"]}
			fallback={fallback}>
			{children}
		</RoleGuard>
	);
}

export function AdminOrSeller({
	children,
	fallback,
}: Omit<RoleGuardProps, "allowedRoles">) {
	return (
		<RoleGuard
			allowedRoles={["ADMIN", "SELLER"]}
			fallback={fallback}>
			{children}
		</RoleGuard>
	);
}
