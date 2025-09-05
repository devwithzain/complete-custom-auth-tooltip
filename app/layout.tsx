import "@/styles/globals.css";
import ToastProvider from "@/providers/toast-provider";

export const metadata = {
	title: "Next.js Auth Starter",
	description: "Custom auth with Prisma, MySQL, Zod, R HF, Resend, TOTP",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<ToastProvider />
				{children}
			</body>
		</html>
	);
}
