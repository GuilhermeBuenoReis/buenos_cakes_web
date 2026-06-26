import { dayjs } from "@/lib/dayjs";
import type { ProfileOrderStatusTone } from "./profile-content";

const MINIMUM_EDIT_LEAD_TIME_HOURS = 24;
const EDITABLE_ORDER_STATUSES: ProfileOrderStatusTone[] = ["pending"];

type OrderEditBlockReason = "deadline" | "missing-schedule" | "past" | "status";

const orderEditBlockMessages: Record<OrderEditBlockReason, string> = {
	deadline:
		"Este pedido não pode mais ser editado porque faltam 24 horas ou menos para a entrega/retirada.",
	"missing-schedule":
		"Este pedido não pode ser editado porque não possui data de entrega/retirada definida.",
	past: "Este pedido não pode mais ser editado porque a data de entrega/retirada já passou.",
	status: "Este pedido não pode mais ser editado no status atual.",
};

export interface OrderEditPermission {
	canEdit: boolean;
	hoursUntilFulfillment: number | null;
	reason: string | null;
}

interface CanEditOrderParams {
	scheduledAt: string | null | undefined;
	statusTone: ProfileOrderStatusTone;
}

export function canEditOrder({
	scheduledAt,
	statusTone,
}: CanEditOrderParams): OrderEditPermission {
	if (!EDITABLE_ORDER_STATUSES.includes(statusTone)) {
		return {
			canEdit: false,
			hoursUntilFulfillment: null,
			reason: orderEditBlockMessages.status,
		};
	}

	if (!scheduledAt) {
		return {
			canEdit: false,
			hoursUntilFulfillment: null,
			reason: orderEditBlockMessages["missing-schedule"],
		};
	}

	const scheduledDate = dayjs(scheduledAt);

	if (!scheduledDate.isValid()) {
		return {
			canEdit: false,
			hoursUntilFulfillment: null,
			reason: orderEditBlockMessages["missing-schedule"],
		};
	}

	const hoursUntilFulfillment = scheduledDate.diff(dayjs(), "hour", true);

	if (hoursUntilFulfillment <= 0) {
		return {
			canEdit: false,
			hoursUntilFulfillment,
			reason: orderEditBlockMessages.past,
		};
	}

	if (hoursUntilFulfillment <= MINIMUM_EDIT_LEAD_TIME_HOURS) {
		return {
			canEdit: false,
			hoursUntilFulfillment,
			reason: orderEditBlockMessages.deadline,
		};
	}

	return { canEdit: true, hoursUntilFulfillment, reason: null };
}
