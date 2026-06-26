import { z } from "zod";

export const ORDER_ITEM_OPTION_NONE = "none";

export const orderItemFormSchema = z.object({
	note: z.string().trim().max(280, "A observação está muito longa."),
	productFillingId: z.string(),
	productId: z.string().min(1, "Selecione um produto."),
	productSizeId: z.string(),
	quantity: z
		.number({ message: "Informe uma quantidade válida." })
		.int("Informe uma quantidade válida.")
		.min(1, "A quantidade mínima é 1.")
		.max(99, "A quantidade máxima é 99."),
});

export type OrderItemFormValues = z.infer<typeof orderItemFormSchema>;

export function toOrderItemOptionId(value: string): string | null {
	if (!value || value === ORDER_ITEM_OPTION_NONE) {
		return null;
	}

	return value;
}

export function fromOrderItemOptionId(
	value: string | null | undefined,
): string {
	return value ?? ORDER_ITEM_OPTION_NONE;
}
