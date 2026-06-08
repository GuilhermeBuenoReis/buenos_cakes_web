import { ArrowLeft, CheckCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CheckoutConfirmActionsProps {
	confirmLabel?: string;
	confirmDisabled?: boolean;
	errorMessage?: string | null;
	helperText?: string;
	onConfirm?: () => Promise<void> | void;
}

export function CheckoutConfirmActions({
	confirmLabel = "Confirmar Pedido",
	confirmDisabled = false,
	errorMessage = null,
	helperText = "Confira os dados acima antes de avançar para a confirmação visual.",
	onConfirm,
}: CheckoutConfirmActionsProps) {
	return (
		<div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-200 flex flex-col gap-4 rounded-[1.75rem] border border-[#ebe3e3] bg-[#fffdfa] p-4 shadow-[0_20px_48px_-38px_rgba(15,23,42,0.16)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
			<Link
				className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-rose-500"
				href="/checkout/payment"
			>
				<ArrowLeft className="size-4" />
				Voltar para pagamento
			</Link>

			<div className="space-y-2 sm:text-right">
				<Button
					className="h-12 rounded-full bg-[#d45470] px-7 text-white shadow-[0_22px_42px_-24px_rgba(212,84,112,0.5)] transition-transform duration-300 hover:scale-[1.01] hover:bg-[#c74a65]"
					disabled={confirmDisabled}
					onClick={onConfirm}
					type="button"
				>
					{confirmLabel}
					<CheckCheck className="size-4" />
				</Button>
				<p className="text-xs leading-5 text-slate-500">{helperText}</p>
				{errorMessage ? (
					<p className="text-xs font-semibold leading-5 text-rose-600">
						{errorMessage}
					</p>
				) : null}
			</div>
		</div>
	);
}
