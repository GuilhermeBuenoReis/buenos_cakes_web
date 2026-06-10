"use client";

import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { updateUser } from "@/api/backend/routes/update-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	formatCpfCnpj,
	formatPhone,
	stripMask,
} from "@/lib/format-document";
import type { ProfileCustomer } from "../_lib/profile-content";

interface ProfileEditSheetProps {
	customer: ProfileCustomer;
	userId: string;
}

export function ProfileEditSheet({ customer, userId }: ProfileEditSheetProps) {
	const router = useRouter();
	const [modal, setModal] = useQueryState("modal", parseAsString);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const rawCpf = customer.cpf === "Não informado" ? "" : customer.cpf;
	const rawPhone = customer.phone === "Não informado" ? "" : customer.phone;

	const [cpfValue, setCpfValue] = useState(
		rawCpf ? formatCpfCnpj(rawCpf) : "",
	);
	const [phoneValue, setPhoneValue] = useState(
		rawPhone ? formatPhone(rawPhone) : "",
	);

	const isOpen = modal === "edit-profile";

	useEffect(() => {
		if (isOpen) {
			setCpfValue(rawCpf ? formatCpfCnpj(rawCpf) : "");
			setPhoneValue(rawPhone ? formatPhone(rawPhone) : "");
			setError(null);
		}
	}, [isOpen, rawCpf, rawPhone]);

	function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
		const digits = stripMask(e.target.value);
		if (digits.length > 14) return;
		setCpfValue(digits ? formatCpfCnpj(digits) : "");
	}

	function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
		const digits = stripMask(e.target.value);
		if (digits.length > 11) return;
		setPhoneValue(digits ? formatPhone(digits) : "");
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const formData = new FormData(event.currentTarget);
		const name = (formData.get("name") as string).trim();
		const email = (formData.get("email") as string).trim();
		const cpfRaw = stripMask(cpfValue) || null;
		const phoneRaw = stripMask(phoneValue) || null;

		try {
			await updateUser({
				userId,
				name,
				email,
				cpf: cpfRaw,
				phone: phoneRaw,
			});
			setModal(null);
			router.refresh();
		} catch {
			setError("Ocorreu um erro ao atualizar o perfil. Tente novamente.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Sheet open={isOpen} onOpenChange={(v) => !v && setModal(null)}>
			<SheetContent className="flex flex-col gap-0 overflow-y-auto sm:max-w-md">
				<SheetHeader className="border-b border-slate-100 px-6 pb-4 pt-6">
					<SheetTitle className="text-xl font-black tracking-tight text-slate-950">
						Editar Perfil
					</SheetTitle>
					<SheetDescription className="text-sm text-slate-500">
						Atualize suas informações pessoais abaixo.
					</SheetDescription>
				</SheetHeader>

				<form
					onSubmit={handleSubmit}
					className="flex flex-1 flex-col gap-5 px-6 py-6"
				>
					<div className="space-y-1.5">
						<label
							htmlFor="edit-name"
							className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
						>
							Nome completo
						</label>
						<Input
							id="edit-name"
							name="name"
							variant="subtle"
							defaultValue={customer.fullName}
							required
							autoComplete="name"
						/>
					</div>

					<div className="space-y-1.5">
						<label
							htmlFor="edit-email"
							className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
						>
							E-mail
						</label>
						<Input
							id="edit-email"
							name="email"
							type="email"
							variant="subtle"
							defaultValue={customer.email}
							required
							autoComplete="email"
						/>
					</div>

					<div className="space-y-1.5">
						<label
							htmlFor="edit-phone"
							className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
						>
							Telefone
						</label>
						<div className="relative">
							<span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 select-none text-sm font-semibold text-slate-400">
								+55
							</span>
							<Input
								id="edit-phone"
								name="phone"
								type="tel"
								variant="subtle"
								value={phoneValue}
								onChange={handlePhoneChange}
								placeholder="(11) 99999-9999"
								autoComplete="tel"
								className="pl-12"
								inputMode="numeric"
							/>
						</div>
						<p className="text-[11px] text-slate-400">
							Celular: (11) 99999-9999 · Fixo: (11) 9999-9999
						</p>
					</div>

					<div className="space-y-1.5">
						<label
							htmlFor="edit-cpf"
							className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
						>
							CPF / CNPJ
						</label>
						<Input
							id="edit-cpf"
							name="cpf"
							variant="subtle"
							value={cpfValue}
							onChange={handleCpfChange}
							placeholder="000.000.000-00"
							inputMode="numeric"
						/>
						<p className="text-[11px] text-slate-400">
							CPF: 000.000.000-00 · CNPJ: 00.000.000/0000-00
						</p>
					</div>

					{error && (
						<p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
							{error}
						</p>
					)}

					<SheetFooter className="mt-auto px-0 pb-0">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-12 w-full rounded-full bg-[#ff4b61] text-white shadow-[0_20px_36px_-24px_rgba(255,75,97,0.6)] hover:bg-rose-600 disabled:opacity-70"
						>
							{isSubmitting ? "Salvando..." : "Salvar alterações"}
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
