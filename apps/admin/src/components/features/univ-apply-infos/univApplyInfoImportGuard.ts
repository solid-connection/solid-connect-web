interface CanConfirmUnivApplyInfoImportParams {
	previewRowCount: number;
	clientErrorCount: number;
	isPending: boolean;
}

export function canConfirmUnivApplyInfoImport({
	previewRowCount,
	clientErrorCount,
	isPending,
}: CanConfirmUnivApplyInfoImportParams): boolean {
	return previewRowCount > 0 && clientErrorCount === 0 && !isPending;
}
