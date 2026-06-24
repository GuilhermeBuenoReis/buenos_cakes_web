"use client";

import { ShoppingBasket, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { useProductDetails } from "../_context/product-details-context";
import { useAddProductToCart } from "../_hooks/use-add-product-to-cart";
import { ProductFillingSelector } from "./product-filling-selector";
import { ProductMessageField } from "./product-message-field";
import { ProductQuantityStepper } from "./product-quantity-stepper";
import { ProductRatingStars } from "./product-rating-stars";
import { ProductSizeSelector } from "./product-size-selector";

export function ProductPurchasePanel() {
	const { product, selectedUnitPrice } = useProductDetails();
	const { addProductToCart } = useAddProductToCart();

	return (
		<div className="space-y-3.5 rounded-[24px] border border-white/70 bg-white/76 p-3.5 shadow-[0_22px_48px_-34px_rgba(190,24,93,0.28)] backdrop-blur-sm sm:space-y-4 sm:p-4.5">
			<div className="space-y-2.5">
				<ProductRatingStars />

				<div className="space-y-0.5">
					<h1 className="max-w-md text-[1.9rem] font-black leading-[1.02] tracking-tight text-[#23161b] sm:text-[2.15rem]">
						{product.name}
					</h1>
					<p className="text-[1.65rem] font-black tracking-tight text-rose-500 sm:text-[1.85rem]">
						{formatPrice(selectedUnitPrice)}
					</p>
				</div>
			</div>

			<ProductSizeSelector />

			<ProductFillingSelector />

			<ProductMessageField />

			<div className="space-y-2.5 pt-1">
				<div className="flex flex-col gap-2.5 sm:flex-row">
					<ProductQuantityStepper />

					<Button
						type="button"
						className="h-11 flex-1 rounded-[18px] text-[13px] shadow-[0_18px_35px_-24px_rgba(244,63,94,0.8)]"
						onClick={addProductToCart}
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
