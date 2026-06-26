import { ContactRound } from "lucide-react";
import Link from "next/link";
import { CheckoutCard } from "../../_components/checkout-card";

interface CheckoutCustomerInfoProps {
	customer: {
		email: string;
		fullName: string;
		phone: string;
	};
}

export function CheckoutCustomerInfo({ customer }: CheckoutCustomerInfoProps) {
	return (
		<CheckoutCard className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-150">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex items-start gap-4">
					<div className="flex size-11 items-center justify-center rounded-[1.1rem] border border-[#f0e1e3] bg-[#fff4f5] text-rose-500 shadow-[0_14px_26px_-22px_rgba(212,84,112,0.35)]">
						<ContactRound className="size-4" />
					</div>
					<div className="space-y-1.5">
						<h2 className="text-lg font-extrabold tracking-tight text-slate-900">
							Dados do cliente
						</h2>
						<p className="max-w-xl text-sm leading-6 text-slate-600">
							Confirme os dados de contato usados para identificar a retirada.
						</p>
					</div>
				</div>

				<Link
					className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-rose-500"
					href="/checkout"
				>
					Editar
				</Link>
			</div>

			<div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				<div className="rounded-[1.5rem] border border-[#ece4e4] bg-[#fffdfb] p-4 shadow-[0_16px_32px_-28px_rgba(15,23,42,0.14)]">
					<p className="text-sm font-semibold text-slate-600">Nome</p>
					<p className="mt-2 wrap-break-word text-base font-extrabold leading-7 text-slate-950">
						{customer.fullName || "Não informado"}
					</p>
				</div>
				<div className="rounded-[1.5rem] border border-[#ece4e4] bg-[#fffdfb] p-4 shadow-[0_16px_32px_-28px_rgba(15,23,42,0.14)]">
					<p className="text-sm font-semibold text-slate-600">E-mail</p>
					<p className="mt-2 wrap-break-word text-base font-extrabold leading-7 text-slate-950">
						{customer.email || "Não informado"}
					</p>
				</div>
				<div className="rounded-[1.5rem] border border-[#ece4e4] bg-[#fffdfb] p-4 shadow-[0_16px_32px_-28px_rgba(15,23,42,0.14)] sm:col-span-2 xl:col-span-1">
					<p className="text-sm font-semibold text-slate-600">Telefone</p>
					<p className="mt-2 wrap-break-word text-base font-extrabold leading-7 text-slate-950">
						{customer.phone || "Não informado"}
					</p>
				</div>
			</div>
		</CheckoutCard>
	);
}
