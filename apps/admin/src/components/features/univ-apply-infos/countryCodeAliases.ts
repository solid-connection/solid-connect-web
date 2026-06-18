import { COUNTRY_CODE_BY_NAME } from "./countryCodeConstants";

export function resolveCountryCode(value: string): string {
	return COUNTRY_CODE_BY_NAME[value.trim()] ?? value;
}

export function isValidCountryCode(resolvedValue: string): boolean {
	return /^[A-Z]{2}$/.test(resolvedValue);
}

function parseMarkdownRow(line: string): string[] {
	let stripped = line.trim();
	if (stripped.startsWith("|")) stripped = stripped.slice(1);
	if (stripped.endsWith("|")) stripped = stripped.slice(0, -1);
	return stripped.split("|").map((cell) => cell.trim());
}

export function preprocessMarkdownCountryCodes(markdown: string, columnMappings: Record<string, string>): string {
	const lines = markdown.trim().split("\n");
	if (lines.length < 3) return markdown;

	const headers = parseMarkdownRow(lines[0]);

	const countryCodeIndices = headers.reduce<number[]>((acc, header, i) => {
		if (columnMappings[header] === "universityCountryCode") acc.push(i);
		return acc;
	}, []);

	if (countryCodeIndices.length === 0) return markdown;

	const ESCAPED_PIPE = "\x00";
	const processedLines = lines.map((line, lineIndex) => {
		if (lineIndex === 0 || lineIndex === 1) return line;
		const hasLeadingPipe = line.trim().startsWith("|");
		const cells = line.replace(/\\\|/g, ESCAPED_PIPE).split("|");
		countryCodeIndices.forEach((colIndex) => {
			const cellIndex = hasLeadingPipe ? colIndex + 1 : colIndex;
			if (cells[cellIndex] !== undefined) {
				const cellValue = cells[cellIndex].replaceAll(ESCAPED_PIPE, "|").trim();
				cells[cellIndex] = ` ${resolveCountryCode(cellValue)} `;
			}
		});
		return cells.map((c) => c.replaceAll(ESCAPED_PIPE, "\\|")).join("|");
	});

	return processedLines.join("\n");
}
