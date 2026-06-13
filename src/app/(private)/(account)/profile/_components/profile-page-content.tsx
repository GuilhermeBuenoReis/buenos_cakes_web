import type {
	ProfileAddress,
	ProfileCustomer,
	ProfileOrder,
} from "../_lib/profile-content";
import { ProfileAddressesCard } from "./profile-addresses-card";
import { ProfilePersonalInfoCard } from "./profile-personal-info-card";
import { ProfileRecentOrders } from "./profile-recent-orders";
import { ProfileSidebar } from "./profile-sidebar";

interface ProfilePageContentProps {
	addresses: ProfileAddress[];
	customer: ProfileCustomer;
	orders: ProfileOrder[];
	userId: string;
}

export function ProfilePageContent({
	addresses,
	customer,
	orders,
	userId,
}: ProfilePageContentProps) {
	return (
		<section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#f8f5f6,#f4f2f1)] p-4 sm:p-5 lg:p-6">
			<h1 className="sr-only">Meu Perfil</h1>

			<div className="pointer-events-none absolute -left-16 top-16 h-52 w-52 rounded-full bg-rose-200/20 blur-3xl" />
			<div className="pointer-events-none absolute right-0 top-0 h-60 w-60 rounded-full bg-[#f7d3a1]/18 blur-3xl" />

			<div className="relative grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
				<ProfileSidebar customer={customer} />

				<div className="space-y-6">
					<ProfilePersonalInfoCard customer={customer} userId={userId} />
					<ProfileRecentOrders orders={orders} />
					<ProfileAddressesCard addresses={addresses} userId={userId} />
				</div>
			</div>
		</section>
	);
}
