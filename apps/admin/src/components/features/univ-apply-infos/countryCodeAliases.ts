export const COUNTRY_CODE_BY_NAME: Record<string, string> = {
	// 한국어
	오스트리아: "AT",
	호주: "AU",
	아제르바이잔: "AZ",
	브루나이: "BN",
	브라질: "BR",
	캐나다: "CA",
	콜롬비아: "CO",
	스위스: "CH",
	중국: "CN",
	체코: "CZ",
	에스토니아: "EE",
	독일: "DE",
	덴마크: "DK",
	스페인: "ES",
	핀란드: "FI",
	프랑스: "FR",
	영국: "GB",
	아일랜드: "IE",
	홍콩: "HK",
	헝가리: "HU",
	인도네시아: "ID",
	이스라엘: "IL",
	이탈리아: "IT",
	일본: "JP",
	카자흐스탄: "KZ",
	리투아니아: "LT",
	말레이시아: "MY",
	네덜란드: "NL",
	노르웨이: "NO",
	포르투갈: "PT",
	러시아: "RU",
	스웨덴: "SE",
	싱가포르: "SG",
	태국: "TH",
	튀르키예: "TR",
	대만: "TW",
	미국: "US",
	우즈베키스탄: "UZ",
	// 영어 풀 네임
	Austria: "AT",
	Australia: "AU",
	Azerbaijan: "AZ",
	Brunei: "BN",
	Brazil: "BR",
	Canada: "CA",
	Colombia: "CO",
	Switzerland: "CH",
	China: "CN",
	"Czech Republic": "CZ",
	Czechia: "CZ",
	Czech: "CZ",
	Estonia: "EE",
	Germany: "DE",
	Denmark: "DK",
	Spain: "ES",
	Finland: "FI",
	France: "FR",
	"United Kingdom": "GB",
	UK: "GB",
	"Hong Kong": "HK",
	Hungary: "HU",
	Ireland: "IE",
	Indonesia: "ID",
	Israel: "IL",
	Italy: "IT",
	Japan: "JP",
	Kazakhstan: "KZ",
	Lithuania: "LT",
	Malaysia: "MY",
	Netherlands: "NL",
	Norway: "NO",
	Portugal: "PT",
	Russia: "RU",
	Sweden: "SE",
	Singapore: "SG",
	Thailand: "TH",
	Turkey: "TR",
	Türkiye: "TR",
	Taiwan: "TW",
	"United States": "US",
	USA: "US",
	Uzbekistan: "UZ",
};

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
