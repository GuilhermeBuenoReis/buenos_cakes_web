import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { QueryProvider } from "@/components/application/query-provider";
import { CartSheetProvider } from "@/contexts/cart-sheet-context";
import "./globals.css";

export const metadata: Metadata = {
	title: "Buenos'Cakes",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Suspense fallback={null}>
					<NuqsAdapter>
						<QueryProvider>
							<CartSheetProvider>{children}</CartSheetProvider>
						</QueryProvider>
					</NuqsAdapter>
				</Suspense>
			</body>
		</html>
	);
}
