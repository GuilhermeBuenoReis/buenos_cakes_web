export const E2E_STABLE_IMAGE_SRC =
	"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export function shouldUseE2EStableImages() {
	return process.env.NEXT_PUBLIC_E2E_STABLE_IMAGES === "1";
}

export function getE2EStableImageSrc(src: string): string;
export function getE2EStableImageSrc(src: undefined): undefined;
export function getE2EStableImageSrc(src: string | undefined) {
	if (!src || !shouldUseE2EStableImages()) {
		return src;
	}

	return E2E_STABLE_IMAGE_SRC;
}
