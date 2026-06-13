"use client";

import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { type ProfileAddress, profileAddresses } from "../_lib/profile-content";
import { ProfileAddressSheet } from "./profile-address-sheet";

interface ProfileAddressesCardProps {
	addresses?: readonly ProfileAddress[];
	userId: string;
}

interface AddressCardActionsProps {
	address: ProfileAddress;
}

function AddressCardActions({ address }: AddressCardActionsProps) {
	const router = useRouter();
	const [, setParams] = useQueryStates({
		modal: parseAsString,
		addressId: parseAsString,
	});
	const [pendingAction, setPendingAction] = useState<"idle" | "default" | "delete">("idle");

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
						<AlertDialogAction
							onClick={handleDelete}
							variant="destructive"
						>
							Remover
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

export function ProfileAddressesCard({
	addresses = profileAddresses,
	userId,
}: ProfileAddressesCardProps) {
	const [{ modal, addressId }, setParams] = useQueryStates({
		modal: parseAsString,
		addressId: parseAsString,
	});

	const editingAddress =
		modal === "edit-address"
			? (addresses.find((a) => a.id === addressId) ?? undefined)
			: undefined;

	return (
		<section
			className="rounded-[2rem] border border-white/70 bg-white/94 p-6 shadow-[0_28px_70px_-52px_rgba(15,23,42,0.2)] sm:p-7"
			id="profile-addresses"
		>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<div className="flex size-11 items-center justify-center rounded-[1rem] bg-[#fff1f3] text-rose-500">
						<MapPin className="size-5" />
					</div>
					<div>
						<h2 className="text-2xl font-black tracking-tight text-slate-950">
							Endereços salvos
						</h2>
						<p className="text-sm text-slate-500">
							Referências prontas para agilizar entregas e retiradas.
						</p>
					</div>
				</div>

				<Button
					onClick={() => setParams({ modal: "new-address", addressId: null })}
					className="h-10 rounded-full border border-rose-200 bg-white px-4 text-rose-500 shadow-none hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
					size="sm"
					type="button"
					variant="outline"
				>
					<Plus className="size-4" />
					Novo endereço
				</Button>
			</div>

			<div className="mt-6 grid gap-4 xl:grid-cols-2">
				{addresses.length === 0 && (
					<article className="rounded-[1.6rem] border border-dashed border-[#ddd3d3] bg-[#fcfaf8] p-5 text-sm leading-6 text-slate-500 xl:col-span-2">
						Nenhum endereço salvo. Clique em{" "}
						<span className="font-semibold text-rose-500">Novo endereço</span>{" "}
						para adicionar.
					</article>
				)}

				{addresses.map((address) => (
					<article
						className="flex flex-col rounded-[1.6rem] border border-[#f2e5e7] bg-[#fffafa] p-5"
						key={address.id}
					>
						<div className="flex items-start justify-between gap-4">
							<div className="min-w-0">
								<h3 className="text-lg font-black tracking-tight text-slate-950">
									{address.label}
								</h3>
								<p className="mt-0.5 text-sm text-slate-500">
									Para: {address.recipientName}
								</p>
								<p className="mt-2 text-sm leading-6 text-slate-600">
									{address.line1}
								</p>
								<p className="text-sm leading-6 text-slate-600">
									{address.line2}
								</p>
								{address.details && (
									<p className="mt-1 text-sm leading-6 text-slate-400 italic">
										{address.details}
									</p>
								)}
							</div>

							<span
								className={`inline-flex shrink-0 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.14em] uppercase shadow-sm ${
									address.isDefault
										? "bg-rose-500 text-white"
										: "bg-white text-rose-500"
								}`}
							>
								{address.badge}
							</span>
						</div>

						<AddressCardActions address={address} />
					</article>
				))}
			</div>

			<ProfileAddressSheet address={editingAddress} userId={userId} />
		</section>
	);
}
