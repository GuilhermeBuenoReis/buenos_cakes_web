"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ApiUser } from "@/api/backend/schemas/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getStoredAuthUser } from "@/lib/auth/browser-session";
import { getInitials } from "@/lib/get-initials";
import { cn } from "@/lib/utils";
import { NavbarCart } from "./navbar-cart";

const navItems = [
	{ label: "Início", href: "/dashboard" },
	{ label: "Produtos", href: "/products" },
	{ label: "Sobre Nós", href: "/about" },
];

function isNavItemActive(pathname: string, href: string) {
	if (href === "/dashboard") {
		return pathname === "/" || pathname === href;
	}

	return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
	const pathname = usePathname();
	const isProfileActive = isNavItemActive(pathname, "/profile");
	const [authUser, setAuthUser] = useState<ApiUser | null>(null);

	useEffect(() => {
		setAuthUser(getStoredAuthUser());
	}, []);

	const initials = authUser ? getInitials(authUser.name) : null;

	return (
		<header className="rounded-2xl bg-white px-6 py-5 shadow-sm sm:px-8">
			<div className="flex items-center justify-between gap-4">
				<Link href="/dashboard" className="flex items-center gap-2.5">
					<div className="text-lg leading-none font-bold tracking-tight">
						<span className="text-[#1f2937]">Buenos</span>
						<span className="text-[#ff4b61]">Cakes</span>
					</div>
				</Link>

				<nav className="hidden items-center gap-11 md:flex">
					{navItems.map(function renderNavItem(item) {
						const isActive = isNavItemActive(pathname, item.href);

						return (
							<Link
								key={item.label}
								href={item.href}
								aria-current={isActive ? "page" : undefined}
								className={
									isActive
										? "text-base font-semibold text-[#ff4b61]"
										: "text-base font-semibold text-[#586274] transition hover:text-[#ff4b61]"
								}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div className="flex items-center gap-5 text-[#4b5563]">
					<NavbarCart />

					<Link
						aria-label="Perfil"
						aria-current={isProfileActive ? "page" : undefined}
						className="rounded-full transition"
						href="/profile"
					>
						<Avatar
							className={cn(
								"size-10 border border-[#f2e7ea] transition hover:border-rose-200",
								isProfileActive && "border-rose-200",
							)}
						>
							<AvatarFallback
								className={cn(
									"text-sm font-bold transition",
									initials
										? "bg-[#ff4b61] font-black text-white"
										: "bg-[#fff6f7] text-[#4b5563]",
								)}
							>
								{initials ?? <User className="h-5 w-5" />}
							</AvatarFallback>
						</Avatar>
					</Link>
				</div>
			</div>
		</header>
	);
}
