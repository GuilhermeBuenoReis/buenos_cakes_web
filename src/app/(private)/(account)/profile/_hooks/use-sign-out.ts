"use client";

import { clearAuthSession } from "@/lib/auth/browser-session";
import { authRedirects } from "@/lib/auth/session-config";
import { navigateToPath } from "@/lib/client-navigation";

export function useSignOut() {
	function signOut() {
		clearAuthSession();
		navigateToPath(authRedirects.unauthenticated);
	}

	return { signOut };
}
