"use client";

import { Pencil, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { deleteAddress } from "@/api/backend/routes/delete-address";
import { setDefaultAddress } from "@/api/backend/routes/set-default-address";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ProfileAddress } from "../_lib/profile-content";

type AddressPendingAction = "idle" | "default" | "delete";

interface ProfileAddressCardActionsProps {
	address: ProfileAddress;
}

export function ProfileAddressCardActions({
	address,
}: ProfileAddressCardActionsProps) {
	const router = useRouter();
	const [, setParams] = useQueryStates({
		modal: parseAsString,
		addressId: parseAsString,
	});
	const [pendingAction, setPendingAction] =
		useState<AddressPendingAction>("idle");

	async function handleSetDefault() {
		setPendingAction("default");
		try {
			await setDefaultAddress({ addressId: address.id });
			router.refresh();
		} finally {
			setPendingAction("idle");
		}
	}

	async function handleDelete() {
		setPendingAction("delete");
		try {
			await deleteAddress({ addressId: address.id });
			router.refresh();
		} finally {
			setPendingAction("idle");
		}
	}

	function handleEdit() {
		setParams({ modal: "edit-address", addressId: address.id });
	}

	return (
		<div className="mt-4 flex items-center gap-2 border-t border-[#f2e5e7] pt-4">
			<div className="flex flex-wrap items-center gap-2">
				{!address.isDefault && (
					<button
						disabled={pendingAction !== "idle"}
						onClick={handleSetDefault}
						className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-bold tracking-wide text-rose-500 uppercase transition hover:bg-rose-100 disabled:opacity-50"
						type="button"
					>
						<Star className="size-3" />
						{pendingAction === "default" ? "Salvando…" : "Tornar principal"}
					</button>
				)}

				<button
					onClick={handleEdit}
					className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold tracking-wide text-slate-500 uppercase transition hover:bg-slate-200"
					type="button"
				>
					<Pencil className="size-3" />
					Editar
				</button>
			</div>

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<button
						disabled={pendingAction !== "idle"}
						className="ml-auto flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-bold tracking-wide text-rose-400 uppercase transition hover:text-rose-600 disabled:opacity-50"
						type="button"
					>
						<Trash2 className="size-3" />
						{pendingAction === "delete" ? "Removendo…" : "Remover"}
					</button>
				</AlertDialogTrigger>
				<AlertDialogContent size="sm">
					<AlertDialogHeader>
						<AlertDialogTitle>Remover endereço</AlertDialogTitle>
						<AlertDialogDescription>
							Tem certeza que deseja remover o endereço{" "}
							<strong className="text-slate-700">{address.label}</strong>? Esta
							ação não pode ser desfeita.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} variant="destructive">
							Remover
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
