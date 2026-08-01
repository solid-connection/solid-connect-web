import { reissueAccessTokenApi } from "@/lib/api/auth";
import type { AdminApiEnvironment } from "@/lib/auth/environment";
import { isTokenExpired } from "@/lib/utils/jwtUtils";
import { loadAccessToken, removeAccessToken, saveAccessToken, saveAdminApiEnvironment } from "@/lib/utils/localStorage";

let reissuePromise: Promise<string | null> | null = null;
let sessionVersion = 0;

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
	sessionVersion += 1;
	reissuePromise = null;
	removeAccessToken();
};

/**
 * 어드민 API 환경(stage/prod)을 전환한다. 세션(access token)을 정리한 뒤 새 환경 값을 저장하고,
 * react-query 캐시 등 메모리 상태를 확실히 비우기 위해 전체 페이지 이동으로 리다이렉트한다.
 * redirect는 테스트에서 주입할 수 있도록 매개변수로 분리했다.
 */
export const switchAdminApiEnvironment = (
	next: AdminApiEnvironment,
	redirect: (url: string) => void = (url) => {
		window.location.href = url;
	},
) => {
	clearSession();
	saveAdminApiEnvironment(next);
	redirect("/auth/login");
};

export const reissueAccessTokenIfPossible = async (): Promise<string | null> => {
	if (reissuePromise) {
		return reissuePromise;
	}

	const reissueSessionVersion = sessionVersion;

	reissuePromise = (async () => {
		try {
			const response = await reissueAccessTokenApi();
			const nextAccessToken = response.data.accessToken;

			if (reissueSessionVersion !== sessionVersion) {
				return null;
			}

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
