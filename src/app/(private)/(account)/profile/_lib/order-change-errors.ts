import { getBackendErrorMessage } from "@/api/backend/errors";
import { BackendApiError } from "@/api/backend/http-client";

const ORDER_CHANGE_STATUS_MESSAGES: Record<number, string> = {
	401: "Você precisa estar logado para alterar este pedido.",
	403: "Você não tem permissão para alterar este pedido.",
	404: "Pedido ou item não encontrado.",
	502: "Não foi possível criar o pagamento complementar agora. Tente novamente.",
};

const FALLBACK_MESSAGE =
	"Não foi possível alterar o pedido agora. Tente novamente.";

export function getOrderChangeErrorMessage(error: unknown): string {
	if (error instanceof BackendApiError) {
		if (error.status === 400 || error.status === 409) {
			return error.message || FALLBACK_MESSAGE;
		}

		const mappedMessage = ORDER_CHANGE_STATUS_MESSAGES[error.status];

		if (mappedMessage) {
			return mappedMessage;
		}
	}

	return getBackendErrorMessage(error, FALLBACK_MESSAGE);
}
