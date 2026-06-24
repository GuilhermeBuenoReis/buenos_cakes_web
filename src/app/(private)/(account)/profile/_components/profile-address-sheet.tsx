"use client";

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
import { useProfileAddressForm } from "../_hooks/use-profile-address-form";
import type { ProfileAddress } from "../_lib/profile-content";
import { ProfileSheetField } from "./profile-sheet-field";

interface ProfileAddressSheetProps {
	address?: ProfileAddress;
	userId: string;
}

export function ProfileAddressSheet({
	address,
	userId,
}: ProfileAddressSheetProps) {
	const {
		form: {
			formState: { errors },
			register,
		},
		handleClose,
		isEditing,
		isOpen,
		isSubmitting,
		onSubmit,
		submitError,
	} = useProfileAddressForm({ address, userId });

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<SheetContent className="flex flex-col gap-0 overflow-y-auto sm:max-w-md">
				<SheetHeader className="border-b border-slate-100 px-6 pb-4 pt-6">
					<SheetTitle className="text-xl font-black tracking-tight text-slate-950">
						{isEditing ? "Editar endereço" : "Novo endereço"}
					</SheetTitle>
					<SheetDescription className="text-sm text-slate-500">
						{isEditing
							? "Atualize os dados do endereço abaixo."
							: "Preencha os dados do novo endereço."}
					</SheetDescription>
				</SheetHeader>

				<form
					onSubmit={onSubmit}
					noValidate
					className="flex flex-1 flex-col gap-5 px-6 py-6"
				>
					<div className="grid grid-cols-2 gap-4">
						<ProfileSheetField
							className="col-span-2"
							error={errors.label?.message}
							htmlFor="addr-label"
							label="Nome do endereço"
						>
							<Input
								id="addr-label"
								variant="subtle"
								placeholder="Casa, Trabalho…"
								{...register("label")}
							/>
						</ProfileSheetField>

						<ProfileSheetField
							className="col-span-2"
							error={errors.recipientName?.message}
							htmlFor="addr-recipient"
							label="Destinatário"
						>
							<Input
								id="addr-recipient"
								variant="subtle"
								placeholder="Nome de quem receberá"
								autoComplete="name"
								{...register("recipientName")}
							/>
						</ProfileSheetField>

						<ProfileSheetField
							className="col-span-2"
							error={errors.street?.message}
							htmlFor="addr-street"
							label="Rua / Avenida"
						>
							<Input
								id="addr-street"
								variant="subtle"
								placeholder="Rua das Flores"
								autoComplete="street-address"
								{...register("street")}
							/>
						</ProfileSheetField>

						<ProfileSheetField
							error={errors.houseNumber?.message}
							htmlFor="addr-number"
							label="Número"
						>
							<Input
								id="addr-number"
								variant="subtle"
								placeholder="123"
								{...register("houseNumber")}
							/>
						</ProfileSheetField>

						<ProfileSheetField
							error={errors.complement?.message}
							htmlFor="addr-complement"
							label="Complemento"
						>
							<Input
								id="addr-complement"
								variant="subtle"
								placeholder="Apto, Bloco…"
								{...register("complement")}
							/>
						</ProfileSheetField>

						<ProfileSheetField
							error={errors.city?.message}
							htmlFor="addr-city"
							label="Cidade"
						>
							<Input
								id="addr-city"
								variant="subtle"
								placeholder="São Paulo"
								autoComplete="address-level2"
								{...register("city")}
							/>
						</ProfileSheetField>

						<ProfileSheetField
							error={errors.state?.message}
							htmlFor="addr-state"
							label="Estado"
						>
							<Input
								id="addr-state"
								variant="subtle"
								placeholder="SP"
								maxLength={2}
								autoComplete="address-level1"
								className="uppercase"
								{...register("state")}
							/>
						</ProfileSheetField>

						<ProfileSheetField
							className="col-span-2"
							error={errors.zipCode?.message}
							htmlFor="addr-zip"
							label="CEP"
						>
							<Input
								id="addr-zip"
								variant="subtle"
								placeholder="00000-000"
								autoComplete="postal-code"
								inputMode="numeric"
								{...register("zipCode")}
							/>
						</ProfileSheetField>

						<ProfileSheetField
							className="col-span-2"
							error={errors.reference?.message}
							htmlFor="addr-reference"
							label="Referência"
						>
							<Input
								id="addr-reference"
								variant="subtle"
								placeholder="Portão azul, próximo ao mercado…"
								{...register("reference")}
							/>
						</ProfileSheetField>
					</div>

					{submitError && (
						<p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
							{submitError}
						</p>
					)}

					<SheetFooter className="mt-auto px-0 pb-0">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-12 w-full rounded-full bg-[#ff4b61] text-white shadow-[0_20px_36px_-24px_rgba(255,75,97,0.6)] hover:bg-rose-600 disabled:opacity-70"
						>
							{isSubmitting
								? "Salvando..."
								: isEditing
									? "Salvar alterações"
									: "Adicionar endereço"}
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
