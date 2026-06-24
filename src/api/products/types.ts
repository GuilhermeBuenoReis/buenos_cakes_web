export interface ProductCustomizationOption {
	id: string;
	isDefault: boolean;
	label: string;
	priceDelta: number;
	sortOrder: number;
}

export interface ProductSizeOption extends ProductCustomizationOption {
	code: string;
	servings: string;
}

export interface ProductFillingOption extends ProductCustomizationOption {}

export interface Product {
	category: string;
	categoryId?: string;
	description: string;
	fillings?: ProductFillingOption[];
	id: string;
	image: string;
	name: string;
	popularity: number;
	price: number;
	rating: number;
	reviews: number;
	sizes?: ProductSizeOption[];
	slug?: string;
}

export type GetProductsResponse = Product[];

export interface GetProductByIdRequest {
	id: Product["id"];
}

export type GetProductByIdResponse = Product | null;
