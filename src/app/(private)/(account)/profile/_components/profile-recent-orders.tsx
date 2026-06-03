"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import {
	getProfileOrderItemsSummary,
	type ProfileOrder,
	type ProfileOrderStatusTone,
	profileOrders,
} from "../_lib/profile-content";

function getOrderStatusClassName(statusTone: ProfileOrderStatusTone) {
	switch (statusTone) {
		case "confirmed":
			return "bg-emerald-100 text-emerald-700";
	}
}

interface ProfileRecentOrdersProps {
	orders?: ProfileOrder[];
}

export function ProfileRecentOrders({
	orders = profileOrders,
}: ProfileRecentOrdersProps) {
	return (
		<section
			className="rounded-[2rem] border border-white/70 bg-white/94 p-6 shadow-[0_28px_70px_-52px_rgba(15,23,42,0.2)] sm:p-7"
			id="profile-orders"
		>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-2xl font-black tracking-tight text-slate-950">
					Pedidos Recentes
				</h2>

				{orders.length > 0 ? (
					<a
						className="text-sm font-semibold text-rose-500 transition hover:text-rose-600"
						href="#profile-orders"
					>
						Ver todos
					</a>
				) : null}
			</div>

			{orders.length === 0 ? (
				<div className="mt-6 rounded-[1.7rem] border border-dashed border-[#ddd3d3] bg-[#fcfaf8] p-5 text-sm leading-6 text-slate-500">
					<p className="text-base font-bold text-slate-900">
						Você ainda não confirmou nenhum pedido.
					</p>
					<p className="mt-2 max-w-2xl">
						Assim que o backend retornar seus pedidos, eles aparecerão aqui com
						status, total e resumo dos itens.
					</p>
					<Button
						asChild
						className="mt-4 rounded-full bg-[#d45470] px-5 text-white shadow-[0_18px_36px_-24px_rgba(212,84,112,0.45)] hover:bg-[#c74a65]"
					>
						<Link href="/products">Explorar catálogo</Link>
					</Button>
				</div>
			) : (
				<div className="mt-6 overflow-x-auto">
					<table className="min-w-[760px] w-full border-separate border-spacing-y-3">
						<thead>
							<tr>
								<th className="px-4 text-left text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
									Pedido #
								</th>
								<th className="px-4 text-left text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
									Data
								</th>
								<th className="px-4 text-left text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
									Status
								</th>
								<th className="px-4 text-left text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
									Total
								</th>
								<th className="px-4 text-right text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
									Ações
								</th>
							</tr>
						</thead>

						<tbody>
							{orders.map((order) => {
								return (
									<tr
										className="rounded-[1.4rem] bg-[#fffaf9] shadow-[0_18px_44px_-42px_rgba(15,23,42,0.28)]"
										id={order.id}
										key={order.id}
									>
										<td className="rounded-l-[1.4rem] px-4 py-4 align-top">
											<p className="text-sm font-black text-rose-500 tabular-nums">
												{order.number}
											</p>
											<p className="mt-1 text-sm text-slate-500">
												{getProfileOrderItemsSummary(order.items)}
											</p>
										</td>
										<td className="px-4 py-4 text-sm font-medium text-slate-600 align-top">
											{order.dateLabel}
										</td>
										<td className="px-4 py-4 align-top">
											<span
												className={cn(
													"inline-flex rounded-full px-3 py-1 text-xs font-bold",
													getOrderStatusClassName(order.statusTone),
												)}
											>
												{order.status}
											</span>
										</td>
										<td className="px-4 py-4 text-sm font-bold text-slate-900 tabular-nums align-top">
											{formatPrice(order.total)}
										</td>
										<td className="rounded-r-[1.4rem] px-4 py-4 text-right align-top">
											<a
												className="text-sm font-semibold text-rose-500 transition hover:text-rose-600"
												href={`#${order.id}`}
											>
												Detalhes
											</a>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
}
