import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
	cleanup();
});

function resolveMockHref(href: unknown) {
	if (typeof href === "string") {
		return href;
	}

	if (href && typeof href === "object" && "pathname" in href) {
		return (href as { pathname?: string }).pathname ?? "";
	}

	return "";
}

vi.mock("next/image", () => ({
	default: ({
		alt,
		fill: _fill,
		priority: _priority,
		src,
		...props
	}: React.ImgHTMLAttributes<HTMLImageElement> & {
		fill?: boolean;
		priority?: boolean;
		src: string;
	}) => {
		// biome-ignore lint/performance/noImgElement: testing mock for next/image
		return <img alt={alt} src={src} {...props} />;
	},
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		back: vi.fn(),
		forward: vi.fn(),
		prefetch: vi.fn(),
		push: vi.fn(),
		refresh: vi.fn(),
		replace: vi.fn(),
	}),
	usePathname: () => "/",
	useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
	default: ({
		href,
		children,
		...props
	}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: unknown }) => {
		return (
			<a href={resolveMockHref(href)} {...props}>
				{children}
			</a>
		);
	},
}));

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

class ResizeObserverMock {
	disconnect() {}
	observe() {}
	unobserve() {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
	writable: true,
	value: ResizeObserverMock,
});

Object.defineProperty(globalThis, "PointerEvent", {
	writable: true,
	value: MouseEvent,
});

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
	writable: true,
	value: vi.fn(),
});

Object.defineProperty(HTMLElement.prototype, "hasPointerCapture", {
	writable: true,
	value: vi.fn(() => false),
});

Object.defineProperty(HTMLElement.prototype, "setPointerCapture", {
	writable: true,
	value: vi.fn(),
});

Object.defineProperty(HTMLElement.prototype, "releasePointerCapture", {
	writable: true,
	value: vi.fn(),
});
