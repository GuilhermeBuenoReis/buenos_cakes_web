import type {
	ApiOrderChange,
	OrderAdjustmentStatus,
	OrderChangeStatus,
} from "@/api/backend/schemas/order-change";
import type { ApiPayment } from "@/api/backend/schemas/payment";
import { formatPrice } from "@/lib/format-price";

export type OrderChangeTone = "info" | "success" | "warning";

export interface OrderChangeFeedback {
	adjustmentStatusLabel: string | null;
	checkoutUrl: string | null;
	difference: string;
	isApplied: boolean;
	message: string;
	newTotal: string;
	paymentLabel: string | null;
	previousTotal: string;
	requiresAdditionalPayment: boolean;
	status: OrderChangeStatus;
	title: string;
	tone: OrderChangeTone;
}

const adjustmentStatusLabels: Record<OrderAdjustmentStatus, string> = {
	canceled: "Cancelado",
	confirmed: "Confirmado",
	pending: "Pendente",
};

const paymentStatusLabels: Record<ApiPayment["status"], string> = {
	canceled: "Cancelado",
	failed: "Falhou",
	paid: "Pago",
	pending: "Pendente",
	processing: "Processando",
	refunded: "Reembolsado",
};

function buildPaymentLabel(payment: ApiPayment | null | undefined) {
	if (!payment) {
		return null;
	}

	return `${formatPrice(payment.amount)} • ${paymentStatusLabels[payment.status]}`;
}

export function buildOrderChangeFeedback(
	change: ApiOrderChange,
): OrderChangeFeedback {
	const base = {
		adjustmentStatusLabel: change.adjustment
			? adjustmentStatusLabels[change.adjustment.status]
			: null,
		checkoutUrl: change.checkoutUrl ?? null,
		difference: formatPrice(Math.abs(change.difference)),
		newTotal: formatPrice(change.newTotal),
		paymentLabel: buildPaymentLabel(change.payment),
		previousTotal: formatPrice(change.previousTotal),
		status: change.status,
	};

	if (change.status === "requires_additional_payment") {
		return {
			...base,
			isApplied: false,
			message:
				"A alteração aumentou o valor do pedido e precisa de um pagamento complementar para ser confirmada.",
			requiresAdditionalPayment: true,
			title: "Pagamento complementar necessário",
			tone: "warning",
		};
	}

	if (change.status === "refund_required") {
		return {
			...base,
			isApplied: false,
			message:
				"A alteração reduziu o valor do pedido e gerou um reembolso, que será processado pela equipe.",
			requiresAdditionalPayment: false,
			title: "Reembolso necessário",
			tone: "info",
		};
	}

	return {
		...base,
		isApplied: true,
		message: "A alteração do pedido foi aplicada com sucesso.",
		requiresAdditionalPayment: false,
		title: "Alteração aplicada",
		tone: "success",
	};
}
