export const loadAccessToken = () => {
	try {
		return localStorage.getItem("accessToken");
	} catch (err) {
		console.error("Could not load access token", err);
		return null;
	}
};

export const saveAccessToken = (token: string) => {
	try {
		localStorage.setItem("accessToken", token);
	} catch (err) {
		console.error("Could not save access token", err);
	}
};

export const removeAccessToken = () => {
	try {
		localStorage.removeItem("accessToken");
	} catch (err) {
		console.error("Could not remove access token", err);
	}
};
