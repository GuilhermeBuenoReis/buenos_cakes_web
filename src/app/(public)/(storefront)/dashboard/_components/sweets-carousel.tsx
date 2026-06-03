"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect } from "react";
import { CarouselIndicators } from "@/app/(public)/(storefront)/dashboard/_components/carousel-indicators";
import { useDashboardHeroProducts } from "../_hooks/use-dashboard-catalog";

const SLIDE_INTERVAL_MS = 5000;

const MotionImage = motion.create(Image);

function clampActiveIndex(index: number, imagesLength: number) {
	const maxIndex = Math.max(0, imagesLength - 1);

	return Math.min(Math.max(index, 0), maxIndex);
}

function getNextSlideIndex(currentIndex: number, imagesLength: number) {
	if (imagesLength <= 1) {
		return 0;
	}

	return (currentIndex + 1) % imagesLength;
}

export function SweetsCarousel() {
	const { carouselImages } = useDashboardHeroProducts();
	const [activeIndex, setActiveIndex] = useQueryState(
		"activeIndex",
		parseAsInteger.withDefault(0),
	);
	const safeActiveIndex = clampActiveIndex(activeIndex, carouselImages.length);
	const activeImage = carouselImages[safeActiveIndex];

	useEffect(() => {
		if (carouselImages.length <= 1) {
			return;
		}

		function handleIntervalTick() {
			setActiveIndex((currentIndex) =>
				getNextSlideIndex(
					clampActiveIndex(currentIndex, carouselImages.length),
					carouselImages.length,
				),
			);
		}

		const intervalId = window.setInterval(
			handleIntervalTick,
			SLIDE_INTERVAL_MS,
		);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [carouselImages.length, setActiveIndex]);

	if (!activeImage) {
		return (
			<div className="relative mx-auto h-64 w-full max-w-lg overflow-hidden rounded-[26px] bg-slate-100 sm:h-78" />
		);
	}

	return (
		<div className="relative mx-auto h-64 w-full max-w-lg overflow-hidden rounded-[26px] bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 p-3 shadow-[0_24px_52px_-30px_rgba(15,23,42,0.55)] sm:h-78">
			<div className="absolute inset-0 rounded-[26px] border border-white/70" />
			<AnimatePresence mode="wait">
				<MotionImage
					alt={activeImage.alt}
					animate={{ opacity: 1, scale: 1, x: 0 }}
					className="relative h-full w-full rounded-[22px] object-cover"
					exit={{ opacity: 0, scale: 1.04, x: -24 }}
					fill
					initial={{ opacity: 0, scale: 0.98, x: 24 }}
					key={activeImage.src}
					sizes="(max-width: 1024px) 100vw, 560px"
					src={activeImage.src}
					transition={{ duration: 0.6, ease: "easeInOut" }}
				/>
			</AnimatePresence>
			<CarouselIndicators carouselImages={carouselImages} />
		</div>
	);
}
