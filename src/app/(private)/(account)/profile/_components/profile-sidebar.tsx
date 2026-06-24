"use client";

import { LogOut, MapPin, Package2, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
	defaultProfileCustomer,
	getProfileInitials,
	type ProfileCustomer,
} from "../_lib/profile-content";

const profileNavigationItems = [
	{
		href: "#profile-personal-info",
		icon: UserRound,
		isActive: true,
		label: "Meu Perfil",
	},
	{
		href: "#profile-orders",
		icon: Package2,
		isActive: false,
		label: "Meus Pedidos",
	},
	{
		href: "#profile-addresses",
		icon: MapPin,
		isActive: false,
		label: "Endereços",
	},
] as const;

interface ProfileSidebarProps {
	customer?: ProfileCustomer;
}

export function ProfileSidebar({
	customer = defaultProfileCustomer,
}: ProfileSidebarProps) {
	return (
		<aside className="rounded-[2rem] border border-white/70 bg-white/92 p-5 shadow-[0_28px_70px_-50px_rgba(15,23,42,0.18)] backdrop-blur-sm sm:p-6">
			<div className="flex items-center gap-3">
				<Avatar
					aria-label={`Avatar de ${customer.displayName}`}
					className="size-15 ring-2 ring-white shadow-[0_16px_34px_-24px_rgba(15,23,42,0.4)]"
				>
					<AvatarFallback className="bg-[#ff4b61] text-base font-black text-white">
						{getProfileInitials(customer.displayName)}
					</AvatarFallback>
				</Avatar>

				<div className="min-w-0">
					<h2 className="truncate text-lg font-black tracking-tight text-slate-950">
						{customer.displayName}
					</h2>
					<p className="text-sm text-slate-500">{customer.memberSince}</p>
				</div>
			</div>

			<nav aria-label="Seções do perfil" className="mt-6 space-y-2">
				{profileNavigationItems.map((item) => {
					const Icon = item.icon;

					return (
						<a
							key={item.label}
							className={cn(
								"flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition",
								item.isActive
									? "bg-[#ff4b61] text-white shadow-[0_20px_36px_-24px_rgba(255,75,97,0.8)]"
									: "text-slate-600 hover:bg-[#fff5f6] hover:text-rose-500",
							)}
							href={item.href}
						>
							<Icon className="size-4" />
							<span>{item.label}</span>
						</a>
					);
				})}
			</nav>

			<div className="mt-6 border-t border-[#efe7e7] pt-5">
				<button
					aria-disabled="true"
					className="flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-rose-500 opacity-80"
					disabled
					title="A saída da conta será conectada quando o fluxo de autenticação estiver pronto."
					type="button"
				>
					<LogOut className="size-4" />
					<span>Sair</span>
				</button>
			</div>
		</aside>
	);
}
