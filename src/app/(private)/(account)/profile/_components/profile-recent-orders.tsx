"use client";

import Link from "next/link";
import { parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type ProfileOrder, profileOrders } from "../_lib/profile-content";
import { ProfileOrderDetailsSheet } from "./profile-order-details-sheet";
import { ProfileOrderRow } from "./profile-order-row";
import { ProfileOrdersPagination } from "./profile-orders-pagination";

const ORDERS_PER_PAGE = 5;

interface ProfileRecentOrdersProps {
	customerEmail?: string | null;
	orders?: ProfileOrder[];
}

export function ProfileRecentOrders({
	customerEmail = null,
	orders = profileOrders,
}: ProfileRecentOrdersProps) {
	const [, setParams] = useQueryStates({
		modal: parseAsString,
		orderId: parseAsString,
	});
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
	const safeCurrentPage = Math.min(currentPage, totalPages);
	const pageStartIndex = (safeCurrentPage - 1) * ORDERS_PER_PAGE;
	const paginatedOrders = orders.slice(
		pageStartIndex,
		pageStartIndex + ORDERS_PER_PAGE,
	);

	function handleOpenDetails(order: ProfileOrder) {
		setParams({ modal: "order-details", orderId: order.orderId });
	}

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
					<table className="w-full min-w-120 border-separate border-spacing-y-3">
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
							{paginatedOrders.map((order) => (
								<ProfileOrderRow
									key={order.id}
									onOpenDetails={handleOpenDetails}
									order={order}
								/>
							))}
						</tbody>
					</table>
				</div>
			)}

			{totalPages > 1 ? (
				<ProfileOrdersPagination
					currentPage={safeCurrentPage}
					onPageChange={setCurrentPage}
					totalPages={totalPages}
				/>
			) : null}

			<ProfileOrderDetailsSheet customerEmail={customerEmail} orders={orders} />
		</section>
	);
}
