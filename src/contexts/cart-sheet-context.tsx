"use client";

import { parseAsBoolean, useQueryState } from "nuqs";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
} from "react";

export interface CartSheetItemData {
	highlight: string;
	id: string;
	image: string;
	name: string;
	note?: string | null;
	productFillingId?: string | null;
	productId?: string;
	productSizeId?: string | null;
	quantity: number;
	unitPrice: number;
}

interface AddCartSheetItemInput extends Omit<CartSheetItemData, "quantity"> {
	quantity?: number;
}

interface CartSheetContextValue {
	items: CartSheetItemData[];
	hasItems: boolean;
	itemCount: number;
	isOpen: boolean;
	shipping: number;
	subtotal: number;
	total: number;
	addItem: (item: AddCartSheetItemInput) => void;
	clearItems: () => void;
	decreaseQuantity: (itemId: string) => void;
	increaseQuantity: (itemId: string) => void;
	removeItem: (itemId: string) => void;
	setIsOpen: (nextOpen: boolean) => void;
}

const SHIPPING_COST = 0;

function clampQuantity(quantity: number) {
	return Math.max(1, quantity);
}

const CartSheetContext = createContext<CartSheetContextValue | null>(null);

interface CartSheetProviderProps extends PropsWithChildren {
	initialItems?: CartSheetItemData[];
}

export function CartSheetProvider({
	children,
	initialItems = [],
}: CartSheetProviderProps) {
	const [isOpen, setCartOpen] = useQueryState(
		"cart",
		parseAsBoolean.withDefault(false),
	);
	const [items, setItems] = useState<CartSheetItemData[]>(initialItems);

	function setIsOpen(nextOpen: boolean) {
		void setCartOpen(nextOpen);
	}

	function addItem(item: AddCartSheetItemInput) {
		const nextQuantity = clampQuantity(item.quantity ?? 1);

		setItems((currentItems) => {
			const existingItem = currentItems.find(
				(currentItem) => currentItem.id === item.id,
			);

			if (!existingItem) {
				return [{ ...item, quantity: nextQuantity }, ...currentItems];
			}

			return currentItems.map((currentItem) =>
				currentItem.id === item.id
					? {
							...currentItem,
							quantity: currentItem.quantity + nextQuantity,
						}
					: currentItem,
			);
		});
		setIsOpen(true);
	}

	function increaseQuantity(itemId: string) {
		setItems((currentItems) =>
			currentItems.map((item) =>
				item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
			),
		);
	}

	function decreaseQuantity(itemId: string) {
		setItems((currentItems) =>
			currentItems.map((item) =>
				item.id === itemId
					? { ...item, quantity: clampQuantity(item.quantity - 1) }
					: item,
			),
		);
	}

	function removeItem(itemId: string) {
		setItems((currentItems) =>
			currentItems.filter((item) => item.id !== itemId),
		);
	}

	function clearItems() {
		setItems([]);
		setIsOpen(false);
	}

	const itemCount = items.reduce((total, item) => total + item.quantity, 0);
	const subtotal = items.reduce(
		(total, item) => total + item.unitPrice * item.quantity,
		0,
	);
	const total = subtotal + SHIPPING_COST;

	return (
		<CartSheetContext.Provider
			value={{
				addItem,
				clearItems,
				decreaseQuantity,
				hasItems: items.length > 0,
				increaseQuantity,
				itemCount,
				isOpen,
				items,
				removeItem,
				setIsOpen,
				shipping: SHIPPING_COST,
				subtotal,
				total,
			}}
		>
			{children}
		</CartSheetContext.Provider>
	);
}

export function useCartSheet() {
	const context = useContext(CartSheetContext);

	if (!context) {
		throw new Error("useCartSheet must be used within CartSheetProvider.");
	}

	return context;
}
