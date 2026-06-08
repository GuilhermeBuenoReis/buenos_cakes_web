"use client";

import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	defaultProfileCustomer,
	type ProfileCustomer,
} from "../_lib/profile-content";

interface ProfilePersonalInfoCardProps {
	customer?: ProfileCustomer;
}

export function ProfilePersonalInfoCard({
	customer = defaultProfileCustomer,
}: ProfilePersonalInfoCardProps) {
	const personalInfoItems = [
		{ label: "Nome completo", value: customer.fullName },
		{ label: "E-mail", value: customer.email },
		{ label: "Telefone", value: customer.phone },
		{ label: "CPF", value: customer.cpf },
	] as const;

	return (
		<section
			className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/94 p-6 shadow-[0_28px_70px_-52px_rgba(15,23,42,0.2)] sm:p-7"
			id="profile-personal-info"
		>
			<div className="pointer-events-none absolute right-0 top-0 size-40 rounded-full bg-rose-100/45 blur-3xl" />

			<div className="relative">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<h2 className="text-2xl font-black tracking-tight text-slate-950">
						Informações Pessoais
					</h2>

					<Button
						aria-label="Editar perfil"
						className="h-10 rounded-full border border-rose-200 bg-white px-4 text-rose-500 shadow-none disabled:border-rose-200 disabled:bg-white disabled:text-rose-500 disabled:opacity-100"
						disabled
						size="sm"
						type="button"
						variant="outline"
					>
						<PencilLine className="size-4" />
						Editar Perfil
					</Button>
				</div>

				<div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
					{personalInfoItems.map((item) => {
						return (
							<div className="space-y-1.5" key={item.label}>
								<p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
									{item.label}
								</p>
								<p className="text-base font-semibold text-slate-900">
									{item.value}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
