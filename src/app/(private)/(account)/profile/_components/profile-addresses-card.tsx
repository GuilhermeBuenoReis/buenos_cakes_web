"use client";

import { MapPin } from "lucide-react";
import { type ProfileAddress, profileAddresses } from "../_lib/profile-content";

interface ProfileAddressesCardProps {
	addresses?: readonly ProfileAddress[];
}

export function ProfileAddressesCard({
	addresses = profileAddresses,
}: ProfileAddressesCardProps) {
	return (
		<section
			className="rounded-[2rem] border border-white/70 bg-white/94 p-6 shadow-[0_28px_70px_-52px_rgba(15,23,42,0.2)] sm:p-7"
			id="profile-addresses"
		>
			<div className="flex items-center gap-3">
				<div className="flex size-11 items-center justify-center rounded-[1rem] bg-[#fff1f3] text-rose-500">
					<MapPin className="size-5" />
				</div>
				<div>
					<h2 className="text-2xl font-black tracking-tight text-slate-950">
						Endereços salvos
					</h2>
					<p className="text-sm text-slate-500">
						Referências prontas para agilizar novas entregas e retiradas.
					</p>
				</div>
			</div>

			<div className="mt-6 grid gap-4 xl:grid-cols-2">
				{addresses.length === 0 ? (
					<article className="rounded-[1.6rem] border border-dashed border-[#ddd3d3] bg-[#fcfaf8] p-5 text-sm leading-6 text-slate-500 xl:col-span-2">
						Nenhum endereço salvo no backend ainda.
					</article>
				) : null}

				{addresses.map((address) => {
					return (
						<article
							className="rounded-[1.6rem] border border-[#f2e5e7] bg-[#fffafa] p-5"
							key={address.label}
						>
							<div className="flex items-start justify-between gap-4">
								<div>
									<h3 className="text-lg font-black tracking-tight text-slate-950">
										{address.label}
									</h3>
									<p className="mt-1 text-sm leading-6 text-slate-600">
										{address.line1}
									</p>
									<p className="text-sm leading-6 text-slate-600">
										{address.line2}
									</p>
								</div>

								<span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-rose-500 uppercase shadow-sm">
									{address.badge}
								</span>
							</div>

							<p className="mt-4 text-sm leading-6 text-slate-500">
								{address.details}
							</p>
						</article>
					);
				})}
			</div>
		</section>
	);
}
