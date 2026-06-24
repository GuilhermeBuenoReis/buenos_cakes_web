"use client";

import { MapPin, Plus } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { type ProfileAddress, profileAddresses } from "../_lib/profile-content";
import { ProfileAddressCard } from "./profile-address-card";
import { ProfileAddressSheet } from "./profile-address-sheet";

interface ProfileAddressesCardProps {
	addresses?: readonly ProfileAddress[];
	userId: string;
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
					<ProfileAddressCard address={address} key={address.id} />
				))}
			</div>

			<ProfileAddressSheet address={editingAddress} userId={userId} />
		</section>
	);
}
