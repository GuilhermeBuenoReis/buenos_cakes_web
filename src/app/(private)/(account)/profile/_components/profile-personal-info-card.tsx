"use client";

import { Mail, PencilLine } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
	formatCpfCnpj,
	formatPhone,
	stripMask,
} from "@/lib/format-document";
import {
	defaultProfileCustomer,
	type ProfileCustomer,
} from "../_lib/profile-content";
import { ProfileEditSheet } from "./profile-edit-sheet";

interface ProfilePersonalInfoCardProps {
	customer?: ProfileCustomer;
	userId: string;
}

function displayPhone(raw: string) {
	const digits = stripMask(raw);
	return digits.length >= 10 ? formatPhone(digits) : raw;
}

function displayCpfCnpj(raw: string) {
	const digits = stripMask(raw);
	return digits.length >= 11 ? formatCpfCnpj(digits) : raw;
}

export function ProfilePersonalInfoCard({
	customer = defaultProfileCustomer,
	userId,
}: ProfilePersonalInfoCardProps) {
	const [, setModal] = useQueryState("modal", parseAsString);

	const hasPhone = customer.phone && customer.phone !== "Não informado";
	const hasCpf = customer.cpf && customer.cpf !== "Não informado";

	const fields = [
		{ label: "Nome completo", value: customer.fullName, isEmail: false },
		{ label: "E-mail", value: customer.email, isEmail: true },
		{
			label: "Telefone",
			value: hasPhone ? displayPhone(customer.phone) : "Não informado",
			isEmail: false,
		},
		{
			label: "CPF / CNPJ",
			value: hasCpf ? displayCpfCnpj(customer.cpf) : "Não informado",
			isEmail: false,
		},
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
						onClick={() => setModal("edit-profile")}
						className="h-10 rounded-full border border-rose-200 bg-white px-4 text-rose-500 shadow-none hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
						size="sm"
						type="button"
						variant="outline"
					>
						<PencilLine className="size-4" />
						Editar Perfil
					</Button>
				</div>

				<div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
					{fields.map((field) => {
						const isEmpty =
							!field.value || field.value === "Não informado";

						if (field.isEmail && !isEmpty) {
							return (
								<div className="min-w-0 space-y-1.5" key={field.label}>
									<p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
										{field.label}
									</p>

									<HoverCard openDelay={200} closeDelay={100}>
										<HoverCardTrigger asChild>
											<p className="max-w-full cursor-default truncate text-base font-semibold text-slate-900">
												{field.value}
											</p>
										</HoverCardTrigger>

										<HoverCardContent
											align="start"
											className="w-auto max-w-xs rounded-2xl border border-rose-100/60 bg-white px-4 py-3 shadow-[0_16px_40px_-20px_rgba(15,23,42,0.18)]"
										>
											<div className="flex items-center gap-2.5">
												<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-rose-50">
													<Mail className="size-3.5 text-rose-500" />
												</span>
												<p className="break-all text-sm font-semibold text-slate-800">
													{field.value}
												</p>
											</div>
										</HoverCardContent>
									</HoverCard>
								</div>
							);
						}

						return (
							<div className="min-w-0 space-y-1.5" key={field.label}>
								<p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
									{field.label}
								</p>
								<p
									className={
										isEmpty
											? "text-base font-medium italic text-slate-400"
											: "text-base font-semibold text-slate-900"
									}
								>
									{isEmpty ? "Não informado" : field.value}
								</p>
							</div>
						);
					})}
				</div>
			</div>

			<ProfileEditSheet customer={customer} userId={userId} />
		</section>
	);
}
