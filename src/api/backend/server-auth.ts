import "server-only";

import { cookies } from "next/headers";
import type { BackendRouteOptions } from "./http-client";

export async function getServerBackendAuthHeaders(): Promise<
	NonNullable<BackendRouteOptions["headers"]>
> {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		return {};
	}

	return {
		Authorization: `Bearer ${accessToken}`,
	};
}
