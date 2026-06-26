import type { CartSheetItemData } from "@/contexts/cart-sheet-context";
import { getInitials } from "@/lib/get-initials";

export interface ProfileCustomer {
	cpf: string;
	displayName: string;
	email: string;
	fullName: string;
	memberSince: string;
	phone: string;
}

export const defaultProfileCustomer: ProfileCustomer = {
	cpf: "***.456.789-**",
	displayName: "Mariana Silva",
	email: "mariana.silva@email.com.br",
	fullName: "Mariana Silva de Oliveira",
	memberSince: "Cliente desde 2023",
	phone: "(11) 98765-4321",
};

export const profileAddresses: ProfileAddress[] = [
	{
		badge: "Principal",
		city: "São Paulo",
		complement: null,
		details: "Referência: portão branco ao lado da floricultura.",
		houseNumber: "184",
		id: "mock-address-1",
		isDefault: true,
		label: "Casa",
		line1: "Rua das Camélias, 184",
		line2: "Jardim Primavera • São Paulo, SP",
		recipientName: "Mariana Silva",
		reference: "Portão branco ao lado da floricultura.",
		state: "SP",
		street: "Rua das Camélias",
		zipCode: "04000-000",
	},
	{
		badge: "Retirada",
		city: "São Paulo",
		complement: null,
		details:
			"Usado com frequência para buscar encomendas já confirmadas no ateliê.",
		houseNumber: "52",
		id: "mock-address-2",
		isDefault: false,
		label: "Boutique",
		line1: "Ateliê Buenos'Cakes • Rua das Amoras, 52",
		line2: "Vila Mariana • São Paulo, SP",
		recipientName: "Mariana Silva",
		reference: null,
		state: "SP",
		street: "Rua das Amoras",
		zipCode: "04101-000",
	},
];

export interface ProfileAddress {
	badge: string;
	city: string;
	complement: string | null;
	details: string;
	houseNumber: string;
	id: string;
	isDefault: boolean;
	label: string;
	line1: string;
	line2: string;
	recipientName: string;
	reference: string | null;
	state: string;
	street: string;
	zipCode: string;
}

export type ProfileOrderStatusTone =
	| "canceled"
	| "completed"
	| "confirmed"
	| "pending"
	| "preparing"
	| "ready";

export interface ProfileOrder {
	dateLabel: string;
	id: string;
	items: CartSheetItemData[];
	itemsSummary?: string;
	number: string;
	orderId: string;
	scheduledAt: string | null;
	status: string;
	statusTone: ProfileOrderStatusTone;
	total: number;
}

export const profileOrders: ProfileOrder[] = [];

export function getProfileDisplayName(fullName: string) {
	const [firstName, lastName] = fullName
		.split(" ")
		.map((part) => part.trim())
		.filter(Boolean);

	return [firstName, lastName].filter(Boolean).join(" ") || fullName;
}

export function getProfileInitials(name: string) {
	return getInitials(name);
}

export function getProfileOrderStatusClassName(
	statusTone: ProfileOrderStatusTone,
) {
	switch (statusTone) {
		case "canceled":
			return "bg-rose-100 text-rose-700";
		case "completed":
			return "bg-slate-100 text-slate-700";
		case "confirmed":
			return "bg-emerald-100 text-emerald-700";
		case "pending":
			return "bg-amber-100 text-amber-700";
		case "preparing":
			return "bg-sky-100 text-sky-700";
		case "ready":
			return "bg-violet-100 text-violet-700";
	}
}

export function getProfileOrderItemsSummary(items: ProfileOrder["items"]) {
	const firstItem = items[0];

	if (!firstItem) {
		return "Pedido sem itens confirmados.";
	}

	const additionalItemsCount = items.length - 1;

	if (additionalItemsCount === 0) {
		return firstItem.name;
	}

	return `${firstItem.name} + ${additionalItemsCount} item${additionalItemsCount > 1 ? "s" : ""}`;
}
