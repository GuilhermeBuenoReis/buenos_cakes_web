import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { getE2EStableImageSrc } from "@/lib/e2e-stable-image";
import { cn } from "@/lib/utils";

interface CartSheetArtworkProps {
	alt: string;
	className?: string;
	src?: string;
}

export function CartSheetArtwork({
	alt,
	className,
	src,
}: CartSheetArtworkProps) {
	return (
		<div
			className={cn(
				"relative size-18 shrink-0 overflow-hidden rounded-[18px] border border-slate-100 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.07)]",
				className,
			)}
		>
			{src ? (
				<Image
					alt={alt}
					className="object-cover"
					fill
					sizes="72px"
					src={getE2EStableImageSrc(src)}
				/>
			) : (
				<div className="flex size-full items-center justify-center bg-rose-50 text-rose-400">
					<ShoppingBag className="size-5" />
				</div>
			)}
		</div>
	);
}
