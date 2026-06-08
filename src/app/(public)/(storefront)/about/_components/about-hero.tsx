import Image from "next/image";
import { getE2EStableImageSrc } from "@/lib/e2e-stable-image";

const aboutHeroImageUrl =
	"https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1600&q=80";

export function AboutHero() {
	return (
		<section className="relative overflow-hidden rounded-[2rem] bg-[#23161b]">
			<div className="absolute inset-0">
				<Image
					alt="Confeiteira da Buenos'Cakes em seu ateliê"
					className="h-full w-full object-cover"
					fill
					priority
					sizes="100vw"
					src={getE2EStableImageSrc(aboutHeroImageUrl)}
				/>
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(35,22,27,0.28),rgba(35,22,27,0.72))]" />
			</div>

			<div className="relative px-6 py-18 text-center text-white sm:px-10 sm:py-22 lg:px-16 lg:py-28">
				<div className="mx-auto max-w-3xl space-y-4">
					<span className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-white/90 backdrop-blur-sm">
						Sobre a Buenos'Cakes
					</span>

					<h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
						Nossa Doce História
					</h1>

					<p className="mx-auto max-w-2xl text-sm leading-7 text-white/82 sm:text-base">
						Uma jornada guiada pela paixão por confeitaria artesanal, cuidado
						humano e pela vontade de transformar encontros em memórias que
						permanecem.
					</p>
				</div>
			</div>
		</section>
	);
}
