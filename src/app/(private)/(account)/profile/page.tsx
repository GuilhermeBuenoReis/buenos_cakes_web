import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
	fetchCurrentUser,
	listOrderItemsByOrder,
	listUserAddresses,
	listUserOrders,
} from "@/api/backend/profile";
import type { ApiAddress } from "@/api/backend/schemas/address";
import type { ApiOrder, ApiOrderStatus } from "@/api/backend/schemas/order";
import type { ApiOrderItem } from "@/api/backend/schemas/order-item";
import type { ApiUser } from "@/api/backend/schemas/user";
import { getServerBackendAuthHeaders } from "@/api/backend/server-auth";
import { dayjs } from "@/lib/dayjs";
import { ProfilePageContent } from "./_components/profile-page-content";
import {
	getProfileDisplayName,
	type ProfileAddress,
	type ProfileCustomer,
	type ProfileOrder,
} from "./_lib/profile-content";

export const metadata: Metadata = {
	title: "Meu Perfil | Buenos'Cakes",
};

const orderStatusLabels: Record<ApiOrderStatus, string> = {
	canceled: "Cancelado",
	completed: "Concluído",
	confirmed: "Confirmado",
	pending: "Pendente",
	preparing: "Preparando",
	ready: "Pronto",
};

function toProfileCustomer(user: ApiUser): ProfileCustomer {
	return {
		cpf: user.cpf ?? "Não informado",
		displayName: getProfileDisplayName(user.name),
		email: user.email,
		fullName: user.name,
		memberSince: `Cliente desde ${dayjs(user.createdAt).format("YYYY")}`,
		phone: user.phone ?? "Não informado",
	};
}

function toProfileAddress(address: ApiAddress): ProfileAddress {
	return {
		badge: address.isDefault ? "Principal" : "Salvo",
		city: address.city,
		complement: address.complement ?? null,
		details: address.reference ?? address.complement ?? "Endereço cadastrado.",
		houseNumber: address.houseNumber,
		id: address.id,
		isDefault: address.isDefault,
		label: address.label,
		line1: `${address.street}, ${address.houseNumber}`,
		line2: `${address.city} • ${address.state}, ${address.zipCode}`,
		recipientName: address.recipientName,
		reference: address.reference ?? null,
		state: address.state,
		street: address.street,
		zipCode: address.zipCode,
	};
}

function getOrderItemsSummary(orderItems: ApiOrderItem[]) {
	const quantity = orderItems.reduce((total, item) => total + item.quantity, 0);

	if (quantity === 0) {
		return "Pedido sem itens cadastrados.";
	}

	return `${quantity} item${quantity > 1 ? "s" : ""} confirmado${quantity > 1 ? "s" : ""}.`;
}

function toProfileOrder(
	order: ApiOrder,
	orderItems: ApiOrderItem[],
): ProfileOrder {
	return {
		dateLabel: dayjs(order.createdAt).format("DD/MM/YYYY"),
		id: `order-${order.id}`,
		items: [],
		itemsSummary: getOrderItemsSummary(orderItems),
		number: `#${order.id.slice(0, 8).toUpperCase()}`,
		orderId: order.id,
		scheduledAt: order.pickupScheduledAt ?? null,
		status: orderStatusLabels[order.status],
		statusTone: order.status,
		total: order.total,
	};
}

async function safeListUserAddresses(
	userId: string,
	headers: Awaited<ReturnType<typeof getServerBackendAuthHeaders>>,
) {
	try {
		const response = await listUserAddresses({ userId }, { headers });

		return response.addresses.map(toProfileAddress);
	} catch {
		return [];
	}
}

async function safeListUserOrders(
	userId: string,
	headers: Awaited<ReturnType<typeof getServerBackendAuthHeaders>>,
) {
	try {
		const response = await listUserOrders({ page: 1, userId }, { headers });
		const ordersByMostRecent = [...response.orders].sort(
			(firstOrder, secondOrder) =>
				dayjs(secondOrder.createdAt).valueOf() -
				dayjs(firstOrder.createdAt).valueOf(),
		);
		const orderItemsByOrder = await Promise.all(
			ordersByMostRecent.map(async (order) => {
				try {
					const itemsResponse = await listOrderItemsByOrder(
						{ orderId: order.id },
						{ headers },
					);

					return itemsResponse.orderItems;
				} catch {
					return [];
				}
			}),
		);

		return ordersByMostRecent.map((order, index) =>
			toProfileOrder(order, orderItemsByOrder[index] ?? []),
		);
	} catch {
		return [];
	}
}

export default async function ProfilePage() {
	const headers = await getServerBackendAuthHeaders();

	try {
		const { user } = await fetchCurrentUser({ headers });
		const [addresses, orders] = await Promise.all([
			safeListUserAddresses(user.id, headers),
			safeListUserOrders(user.id, headers),
		]);

		return (
			<ProfilePageContent
				addresses={addresses}
				customer={toProfileCustomer(user)}
				orders={orders}
				userId={user.id}
			/>
		);
	} catch {
		redirect("/sign-in");
	}
}
