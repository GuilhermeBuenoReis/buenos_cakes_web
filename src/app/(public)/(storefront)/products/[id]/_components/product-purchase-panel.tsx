"use client";

import { Minus, Plus, ShoppingBasket, Star, Truck } from "lucide-react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCartSheet } from "@/contexts/cart-sheet-context";
import { formatPrice } from "@/lib/format-price";
import { useProductDetails } from "../_context/product-details-context";

export function ProductPurchasePanel() {
	const { addItem } = useCartSheet();
	const {
		fillings,
		fullStars,
		message,
		product,
		quantity,
		selectedFilling,
		selectedFillingId,
		selectedSizeId,
		selectedSizeLabel,
		selectedUnitPrice,
		setFilling,
		setMessage,
		setQuantity,
		setSize,
		sizeOptions,
	} = useProductDetails();

	function handleAddToCart() {
		const trimmedMessage = message.trim();
		const highlightParts = [selectedSizeLabel, selectedFilling.label];

		if (trimmedMessage) {
			highlightParts.push("Com mensagem");
		}

		addItem({
			highlight: highlightParts.join(" • "),
			id: [product.id, selectedSizeId, selectedFillingId, trimmedMessage]
				.filter(Boolean)
				.join("::"),
			image: product.image,
			name: product.name,
			note: trimmedMessage || null,
			productFillingId: selectedFillingId || null,
			productId: product.id,
			productSizeId: selectedSizeId || null,
			quantity,
			unitPrice: selectedUnitPrice,
		});
	}

	function handleSizeSelection(sizeId: string) {
		setSize(sizeId);
	}

	function handleFillingValueChange(nextFilling: string) {
		setFilling(nextFilling);
	}

	function handleMessageChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setMessage(event.target.value);
	}

	function handleDecreaseQuantityClick() {
		setQuantity(quantity - 1);
	}

	function handleIncreaseQuantityClick() {
		setQuantity(quantity + 1);
	}

	return (
		<div className="space-y-3.5 rounded-[24px] border border-white/70 bg-white/76 p-3.5 shadow-[0_22px_48px_-34px_rgba(190,24,93,0.28)] backdrop-blur-sm sm:space-y-4 sm:p-4.5">
			<div className="space-y-2.5">
				<div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 sm:text-xs">
					<div className="flex items-center gap-0.5 text-rose-500">
						{["star-1", "star-2", "star-3", "star-4", "star-5"].map(
							(starId, index) => (
								<Star
									key={starId}
									className={`h-3.5 w-3.5 ${
										index < fullStars ? "fill-current" : "text-rose-200"
									}`}
								/>
							),
						)}
					</div>
					<span>({product.reviews} avaliacoes)</span>
				</div>

				<div className="space-y-0.5">
					<h1 className="max-w-md text-[1.9rem] font-black leading-[1.02] tracking-tight text-[#23161b] sm:text-[2.15rem]">
						{product.name}
					</h1>
					<p className="text-[1.65rem] font-black tracking-tight text-rose-500 sm:text-[1.85rem]">
						{formatPrice(selectedUnitPrice)}
					</p>
				</div>
			</div>

			<div className="space-y-2.5">
				<p className="text-[11px] font-extrabold tracking-[0.12em] text-rose-400 uppercase">
					Escolha o tamanho
				</p>
				<div className="grid gap-2 sm:grid-cols-3">
					{sizeOptions.map((size) => {
						const isActive = size.id === selectedSizeId;

						function handleSizeButtonClick() {
							handleSizeSelection(size.id);
						}

						return (
							<button
								type="button"
								key={size.id}
								aria-pressed={isActive}
								onClick={handleSizeButtonClick}
								className={`rounded-[18px] border px-3 py-2 text-left transition ${
									isActive
										? "border-rose-400 bg-rose-50 shadow-[0_14px_30px_-24px_rgba(244,63,94,0.8)]"
										: "border-slate-200 bg-slate-50/80 hover:border-rose-200 hover:bg-white"
								}`}
							>
								<p className="text-[0.95rem] font-bold text-slate-800">
									{size.label}
								</p>
								<p className="text-[11px] font-medium text-slate-500">
									{size.servings ||
										formatPrice(product.price + size.priceDelta)}
								</p>
							</button>
						);
					})}
				</div>
			</div>

			<div className="space-y-2.5">
				<p className="text-[11px] font-extrabold tracking-[0.12em] text-rose-400 uppercase">
					Recheio extra
				</p>
				<Select
					value={selectedFillingId}
					onValueChange={handleFillingValueChange}
				>
					<SelectTrigger
						aria-label="Selecionar recheio extra"
						className="h-10 w-full rounded-[18px] border-slate-200 bg-slate-50 px-3.5 text-left text-[13px] text-slate-700"
					>
						<SelectValue placeholder="Selecione um recheio" />
					</SelectTrigger>
					<SelectContent className="rounded-[18px] border-slate-200">
						{fillings.map((filling) => (
							<SelectItem key={filling.id} value={filling.id}>
								{filling.priceDelta > 0
									? `${filling.label} (+${formatPrice(filling.priceDelta)})`
									: filling.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2.5">
				<div className="flex items-center justify-between gap-3">
					<p className="text-[11px] font-extrabold tracking-[0.12em] text-rose-400 uppercase">
						Mensagem personalizada
					</p>
					<span className="text-[11px] font-medium text-slate-400">
						{message.length}/50
					</span>
				</div>
				<textarea
					aria-label="Mensagem personalizada"
					value={message}
					onChange={handleMessageChange}
					placeholder="Ex: Feliz aniversario, Maria!"
					className="min-h-20 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
				/>
			</div>

			<div className="space-y-2.5 pt-1">
				<div className="flex flex-col gap-2.5 sm:flex-row">
					<div className="flex h-11 items-center justify-between rounded-[18px] border border-slate-200 bg-slate-50 px-2 sm:w-24">
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label="Diminuir quantidade"
							className="h-6.5 w-6.5 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-500"
							onClick={handleDecreaseQuantityClick}
						>
							<Minus className="h-3 w-3" />
						</Button>
						<Input
							aria-label="Quantidade"
							readOnly
							value={quantity}
							className="h-auto border-0 bg-transparent px-0 text-center text-[13px] font-bold text-slate-900 shadow-none focus-visible:ring-0"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label="Aumentar quantidade"
							className="h-6.5 w-6.5 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-500"
							onClick={handleIncreaseQuantityClick}
						>
							<Plus className="h-3 w-3" />
						</Button>
					</div>

					<Button
						type="button"
						className="h-11 flex-1 rounded-[18px] text-[13px] shadow-[0_18px_35px_-24px_rgba(244,63,94,0.8)]"
						onClick={handleAddToCart}
					>
						<ShoppingBasket className="h-4 w-4" />
						Adicionar ao Carrinho
					</Button>
				</div>

				<p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 sm:justify-start">
					<Truck className="h-3 w-3" />
					Entrega gratis para pedidos acima de {formatPrice(200)}
				</p>
			</div>
		</div>
	);
}
