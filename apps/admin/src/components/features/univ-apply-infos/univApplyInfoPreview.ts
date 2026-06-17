import type { UnivApplyInfoImportResponse } from "@/lib/api/admin";
import { preprocessMarkdownCountryCodes } from "./countryCodeAliases";

export interface PreviewCell {
	header: string;
	field: string;
	value: string;
}

export interface PreviewRow {
	rowNumber: number;
	cellsByField: Record<string, PreviewCell>;
}

export function parseMarkdownRow(line: string): string[] {
	const ESCAPED_PIPE = "\x00";
	let stripped = line.trim().replace(/\\\|/g, ESCAPED_PIPE);
	if (stripped.startsWith("|")) stripped = stripped.slice(1);
	if (stripped.endsWith("|")) stripped = stripped.slice(0, -1);
	return stripped.split("|").map((cell) => cell.trim().replaceAll(ESCAPED_PIPE, "|"));
}

export function buildPreviewRows(markdown: string, columnMappings: Record<string, string>): PreviewRow[] {
	const processed = preprocessMarkdownCountryCodes(markdown, columnMappings);
	const lines = processed.trim().split("\n");
	if (lines.length < 3) return [];

	const rawHeaders = parseMarkdownRow(lines[0]);

	return lines.slice(2).map((line, rowIndex) => {
		const cells = parseMarkdownRow(line);
		const row: PreviewRow = {
			rowNumber: rowIndex + 1,
			cellsByField: {},
		};

		rawHeaders.forEach((header, i) => {
			const field = columnMappings[header];
			if (field && cells[i] !== undefined) {
				row.cellsByField[field] = {
					header,
					field,
					value: cells[i],
				};
			}
		});

		return row;
	});
}

export function buildFailedCellMessages(importResult: UnivApplyInfoImportResponse | null): Map<string, string> {
	const failedCellMessages = new Map<string, string>();

	importResult?.failedRows.forEach((row) => {
		row.errors.forEach((error) => {
			const message = error.message || row.reason;
			if (error.header) {
				failedCellMessages.set(`${row.rowNumber}:header:${error.header}`, message);
			}
			if (error.field) {
				failedCellMessages.set(`${row.rowNumber}:field:${error.field}`, message);
			}
		});
	});

	return failedCellMessages;
}

export function getPreviewCellError(
	failedCellMessages: Map<string, string>,
	row: PreviewRow,
	field: string,
): string | undefined {
	const cell = row.cellsByField[field];
	return (
		failedCellMessages.get(`${row.rowNumber}:field:${field}`) ??
		(cell?.header ? failedCellMessages.get(`${row.rowNumber}:header:${cell.header}`) : undefined)
	);
}
