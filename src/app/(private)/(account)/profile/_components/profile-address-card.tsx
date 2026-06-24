import type { ProfileAddress } from "../_lib/profile-content";
import { ProfileAddressCardActions } from "./profile-address-card-actions";

interface ProfileAddressCardProps {
	address: ProfileAddress;
}

export function ProfileAddressCard({ address }: ProfileAddressCardProps) {
	return (
		<article className="flex flex-col rounded-[1.6rem] border border-[#f2e5e7] bg-[#fffafa] p-5">
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
					<p className="text-sm leading-6 text-slate-600">{address.line2}</p>
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

			<ProfileAddressCardActions address={address} />
		</article>
	);
}
