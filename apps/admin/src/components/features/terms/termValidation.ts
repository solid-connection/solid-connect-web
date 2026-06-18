const TERM_NAME_PATTERN = /^\d{4}-\d$/;

export function normalizeTermName(value: string): string | null {
	const normalized = value.trim();
	return TERM_NAME_PATTERN.test(normalized) ? normalized : null;
}
