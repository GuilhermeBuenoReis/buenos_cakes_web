import { parseAsInteger, useQueryState } from "nuqs";

interface CarouselImage {
	src: string;
}

interface CarouselIndicatorsProps {
	carouselImages: CarouselImage[];
}

function clampActiveIndex(index: number, maxIndex: number) {
	return Math.min(Math.max(index, 0), maxIndex);
}

export function CarouselIndicators({
	carouselImages,
}: CarouselIndicatorsProps) {
	const [activeIndex, setActiveIndex] = useQueryState(
		"activeIndex",
		parseAsInteger.withDefault(0),
	);

	const safeActiveIndex = clampActiveIndex(
		activeIndex,
		Math.max(0, carouselImages.length - 1),
	);

	function handleSetActiveIndex(index: number) {
		setActiveIndex(index);
	}

	return (
		<div className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
			{carouselImages.map((image, index) => {
				function handleIndicatorClick() {
					handleSetActiveIndex(index);
				}

				return (
					<button
						aria-label={`Ir para imagem ${index + 1}`}
						className={`pointer-events-auto h-2 rounded-full transition-all ${
							index === safeActiveIndex ? "w-5 bg-white" : "w-2 bg-white/60"
						}`}
						key={image.src}
						onClick={handleIndicatorClick}
						type="button"
					/>
				);
			})}
		</div>
	);
}
