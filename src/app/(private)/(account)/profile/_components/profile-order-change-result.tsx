"use client";

import { Button } from "@/components/ui/button";
import { navigateToPath } from "@/lib/client-navigation";
import { cn } from "@/lib/utils";
import type { OrderChangeFeedback } from "../_lib/order-change-feedback";

interface ProfileOrderChangeResultProps {
	feedback: OrderChangeFeedback;
	onDismiss: () => void;
}

const toneClassName: Record<OrderChangeFeedback["tone"], string> = {
	info: "border-sky-200 bg-sky-50 text-sky-800",
	success: "border-emerald-200 bg-emerald-50 text-emerald-800",
	warning: "border-amber-200 bg-amber-50 text-amber-800",
};

export function ProfileOrderChangeResult({
	feedback,
	onDismiss,
}: ProfileOrderChangeResultProps) {
	function handlePayDifference() {
		if (feedback.checkoutUrl) {
			navigateToPath(feedback.checkoutUrl);
		}
	}

	return (
		<section
			aria-live="polite"
			className={cn(
				"space-y-3 rounded-[1.2rem] border px-4 py-3",
				toneClassName[feedback.tone],
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-1">
					<p className="text-sm font-bold">{feedback.title}</p>
					<p className="text-xs leading-5">{feedback.message}</p>
				</div>
				<button
					type="button"
					onClick={onDismiss}
					aria-label="Dispensar aviso da alteração"
					className="text-xs font-bold uppercase tracking-wide opacity-70 transition hover:opacity-100"
				>
					Fechar
				</button>
			</div>

			<dl className="grid grid-cols-3 gap-2 text-center">
				<div>
					<dt className="text-[10px] font-bold uppercase tracking-wide opacity-70">
						Total anterior
					</dt>
					<dd className="text-sm font-bold tabular-nums">
						{feedback.previousTotal}
					</dd>
				</div>
				<div>
					<dt className="text-[10px] font-bold uppercase tracking-wide opacity-70">
						Novo total
					</dt>
					<dd className="text-sm font-bold tabular-nums">
						{feedback.newTotal}
					</dd>
				</div>
				<div>
					<dt className="text-[10px] font-bold uppercase tracking-wide opacity-70">
						{feedback.requiresAdditionalPayment ? "A pagar" : "Diferença"}
					</dt>
					<dd className="text-sm font-bold tabular-nums">
						{feedback.difference}
					</dd>
				</div>
			</dl>

			{feedback.paymentLabel ? (
				<p className="text-xs">
					<span className="font-bold">Pagamento:</span> {feedback.paymentLabel}
				</p>
			) : null}

			{feedback.adjustmentStatusLabel ? (
				<p className="text-xs">
					<span className="font-bold">Reembolso:</span>{" "}
					{feedback.adjustmentStatusLabel}
				</p>
			) : null}

			{feedback.requiresAdditionalPayment && feedback.checkoutUrl ? (
				<Button
					type="button"
					size="sm"
					className="w-full rounded-full bg-[#ff4b61] text-white hover:bg-rose-600"
					onClick={handlePayDifference}
				>
					Pagar diferença
				</Button>
			) : null}

			{feedback.requiresAdditionalPayment && !feedback.checkoutUrl ? (
				<p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">
					A cobrança complementar foi criada, mas não foi possível abrir o link
					de pagamento. Tente novamente.
				</p>
			) : null}
		</section>
	);
}
