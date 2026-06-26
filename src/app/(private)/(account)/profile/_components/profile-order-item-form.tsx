"use client";

import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useOrderItemForm } from "../_hooks/use-order-item-form";
import type { OrderChangeFeedback } from "../_lib/order-change-feedback";
import { ORDER_ITEM_OPTION_NONE } from "../_lib/order-item-form";
import type { OrderDetailItem } from "../_queries/order-details";

interface ProfileOrderItemFormProps {
	customerEmail: string | null;
	idPrefix: string;
	item?: OrderDetailItem;
	mode: "add" | "edit";
	onApplied: () => void;
	onCancel: () => void;
	onResult: (feedback: OrderChangeFeedback) => void;
	orderId: string;
	submitLabel: string;
}

const fieldLabelClassName =
	"text-[11px] font-bold tracking-[0.12em] text-slate-400 uppercase";

export function ProfileOrderItemForm({
	customerEmail,
	idPrefix,
	item,
	mode,
	onApplied,
	onCancel,
	onResult,
	orderId,
	submitLabel,
}: ProfileOrderItemFormProps) {
	const {
		fillings,
		form: {
			control,
			formState: { errors },
			register,
		},
		isLoadingFillings,
		isLoadingProducts,
		isLoadingSizes,
		isSubmitting,
		onSubmit,
		products,
		selectedProductId,
		sizes,
		submitError,
	} = useOrderItemForm({
		customerEmail,
		item,
		mode,
		onApplied,
		onResult,
		orderId,
	});

	const productFieldId = `${idPrefix}-product`;
	const sizeFieldId = `${idPrefix}-size`;
	const fillingFieldId = `${idPrefix}-filling`;
	const quantityFieldId = `${idPrefix}-quantity`;
	const noteFieldId = `${idPrefix}-note`;

	const showSizes = Boolean(selectedProductId) && sizes.length > 0;
	const showFillings = Boolean(selectedProductId) && fillings.length > 0;

	return (
		<form onSubmit={onSubmit} noValidate className="mt-3 space-y-3">
			<div className="space-y-1.5">
				<label htmlFor={productFieldId} className={fieldLabelClassName}>
					Produto
				</label>
				<Controller
					control={control}
					name="productId"
					render={({ field }) => (
						<Select
							value={field.value || undefined}
							onValueChange={field.onChange}
							disabled={isLoadingProducts || products.length === 0}
						>
							<SelectTrigger id={productFieldId} className="w-full">
								<SelectValue
									placeholder={
										isLoadingProducts
											? "Carregando produtos…"
											: "Selecione um produto"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{products.map((product) => (
									<SelectItem key={product.id} value={product.id}>
										{product.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
				{errors.productId ? (
					<p className="text-[11px] text-rose-500">
						{errors.productId.message}
					</p>
				) : null}
			</div>

			{showSizes ? (
				<div className="space-y-1.5">
					<label htmlFor={sizeFieldId} className={fieldLabelClassName}>
						Tamanho
					</label>
					<Controller
						control={control}
						name="productSizeId"
						render={({ field }) => (
							<Select
								value={field.value || ORDER_ITEM_OPTION_NONE}
								onValueChange={field.onChange}
								disabled={isLoadingSizes}
							>
								<SelectTrigger id={sizeFieldId} className="w-full">
									<SelectValue placeholder="Selecione um tamanho" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={ORDER_ITEM_OPTION_NONE}>
										Sem tamanho
									</SelectItem>
									{sizes.map((size) => (
										<SelectItem key={size.id} value={size.id}>
											{size.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				</div>
			) : null}

			{showFillings ? (
				<div className="space-y-1.5">
					<label htmlFor={fillingFieldId} className={fieldLabelClassName}>
						Recheio
					</label>
					<Controller
						control={control}
						name="productFillingId"
						render={({ field }) => (
							<Select
								value={field.value || ORDER_ITEM_OPTION_NONE}
								onValueChange={field.onChange}
								disabled={isLoadingFillings}
							>
								<SelectTrigger id={fillingFieldId} className="w-full">
									<SelectValue placeholder="Selecione um recheio" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={ORDER_ITEM_OPTION_NONE}>
										Sem recheio
									</SelectItem>
									{fillings.map((filling) => (
										<SelectItem key={filling.id} value={filling.id}>
											{filling.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				</div>
			) : null}

			<div className="space-y-1.5">
				<label htmlFor={quantityFieldId} className={fieldLabelClassName}>
					Quantidade
				</label>
				<Input
					id={quantityFieldId}
					type="number"
					min={1}
					max={99}
					variant="subtle"
					inputMode="numeric"
					{...register("quantity", { valueAsNumber: true })}
				/>
				{errors.quantity ? (
					<p className="text-[11px] text-rose-500">{errors.quantity.message}</p>
				) : null}
			</div>

			<div className="space-y-1.5">
				<label htmlFor={noteFieldId} className={fieldLabelClassName}>
					Observação
				</label>
				<textarea
					id={noteFieldId}
					rows={2}
					placeholder="Ex: Sem lactose, escrever 'Parabéns'…"
					className="w-full rounded-[0.9rem] border border-[#e8e1e1] bg-[#fffdfb] px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
					{...register("note")}
				/>
				{errors.note ? (
					<p className="text-[11px] text-rose-500">{errors.note.message}</p>
				) : null}
			</div>

			{submitError ? (
				<p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">
					{submitError}
				</p>
			) : null}

			<div className="flex items-center justify-end gap-2">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="rounded-full text-slate-500 hover:text-slate-700"
					onClick={onCancel}
					disabled={isSubmitting}
				>
					Cancelar
				</Button>
				<Button
					type="submit"
					size="sm"
					className="rounded-full bg-[#ff4b61] text-white hover:bg-rose-600 disabled:opacity-70"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Salvando…" : submitLabel}
				</Button>
			</div>
		</form>
	);
}
