import { reissueAccessTokenApi } from "@/lib/api/auth";
import { isTokenExpired } from "@/lib/utils/jwtUtils";
import { loadAccessToken, removeAccessToken, saveAccessToken } from "@/lib/utils/localStorage";

let reissuePromise: Promise<string | null> | null = null;

const getValidAccessToken = (): string | null => {
	const accessToken = loadAccessToken();
	if (!accessToken) {
		return null;
	}

	if (isTokenExpired(accessToken)) {
		removeAccessToken();
		return null;
	}

	return accessToken;
};

export const clearSession = () => {
	removeAccessToken();
};

export const reissueAccessTokenIfPossible = async (): Promise<string | null> => {
	if (reissuePromise) {
		return reissuePromise;
	}

	reissuePromise = (async () => {
		try {
			const response = await reissueAccessTokenApi();
			const nextAccessToken = response.data.accessToken;

			if (!nextAccessToken) {
				clearSession();
				return null;
			}

			saveAccessToken(nextAccessToken);
			return nextAccessToken;
		} catch {
			clearSession();
			return null;
		} finally {
			reissuePromise = null;
		}
	})();

	return reissuePromise;
};

export const ensureSessionToken = async (): Promise<string | null> => {
	const validAccessToken = getValidAccessToken();
	if (validAccessToken) {
		return validAccessToken;
	}

	return reissueAccessTokenIfPossible();
};
