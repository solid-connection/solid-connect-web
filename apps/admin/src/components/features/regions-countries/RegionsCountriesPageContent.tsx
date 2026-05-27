"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type AdminCollection, adminApi, type CountryResponse, type RegionResponse } from "@/lib/api/admin";

const toOptionalString = (value: string | number | null | undefined) => {
	if (value === null || value === undefined) return undefined;
	const normalized = String(value).trim();
	return normalized.length > 0 ? normalized : undefined;
};

const toDisplayText = (value: string | number | null | undefined) => toOptionalString(value) ?? "-";

const normalizeCollection = <T,>(data: AdminCollection<T> | undefined) => {
	if (!data) return [];
	if (Array.isArray(data)) return data;
	return data.content ?? data.data ?? data.items ?? data.result ?? [];
};

const getRegionCode = (region: RegionResponse) => toOptionalString(region.code);
const getRegionName = (region: RegionResponse) => toOptionalString(region.koreanName ?? region.name);
const getCountryCode = (country: CountryResponse) => toOptionalString(country.code);
const getCountryName = (country: CountryResponse) => toOptionalString(country.koreanName ?? country.name);

const getCountryRegionCode = (country: CountryResponse) => {
	if (typeof country.region === "string") {
		return toOptionalString(country.region);
	}

	return toOptionalString(country.regionCode ?? country.region?.code ?? country.region?.regionCode);
};

export function RegionsCountriesPageContent() {
	const queryClient = useQueryClient();
	const [regionCode, setRegionCode] = useState("");
	const [regionName, setRegionName] = useState("");
	const [countryCode, setCountryCode] = useState("");
	const [countryName, setCountryName] = useState("");
	const [countryRegionCode, setCountryRegionCode] = useState("");
	const [editingRegionCode, setEditingRegionCode] = useState<string | null>(null);
	const [editingRegionName, setEditingRegionName] = useState("");
	const [editingCountryCode, setEditingCountryCode] = useState<string | null>(null);
	const [editingCountryName, setEditingCountryName] = useState("");
	const [editingCountryRegionCode, setEditingCountryRegionCode] = useState("");

	const regionsQuery = useQuery({
		queryKey: ["admin", "regions"],
		queryFn: adminApi.getRegions,
		placeholderData: keepPreviousData,
	});

	const countriesQuery = useQuery({
		queryKey: ["admin", "countries"],
		queryFn: adminApi.getCountries,
		placeholderData: keepPreviousData,
	});

	const regions = useMemo(() => normalizeCollection(regionsQuery.data), [regionsQuery.data]);
	const countries = useMemo(() => normalizeCollection(countriesQuery.data), [countriesQuery.data]);
	const regionOptions = useMemo(
		() =>
			regions
				.map((region) => ({ code: getRegionCode(region), name: getRegionName(region) }))
				.filter((region): region is { code: string; name: string | undefined } => Boolean(region.code)),
		[regions],
	);

	useEffect(() => {
		if (!countryRegionCode && regionOptions[0]?.code) {
			setCountryRegionCode(regionOptions[0].code);
		}
	}, [countryRegionCode, regionOptions]);

	useEffect(() => {
		if (regionsQuery.isError) {
			toast.error("권역 목록을 불러오지 못했습니다.");
		}
	}, [regionsQuery.isError]);

	useEffect(() => {
		if (countriesQuery.isError) {
			toast.error("지역 목록을 불러오지 못했습니다.");
		}
	}, [countriesQuery.isError]);

	const invalidateRegions = async () => {
		await queryClient.invalidateQueries({ queryKey: ["admin", "regions"] });
	};

	const invalidateCountries = async () => {
		await queryClient.invalidateQueries({ queryKey: ["admin", "countries"] });
	};

	const createRegionMutation = useMutation({
		mutationFn: adminApi.createRegion,
		onSuccess: async () => {
			await invalidateRegions();
			setRegionCode("");
			setRegionName("");
			toast.success("권역을 생성했습니다.");
		},
		onError: () => toast.error("권역 생성에 실패했습니다."),
	});

	const updateRegionMutation = useMutation({
		mutationFn: ({ code, koreanName }: { code: string; koreanName: string }) =>
			adminApi.updateRegion(code, { koreanName }),
		onSuccess: async () => {
			await invalidateRegions();
			setEditingRegionCode(null);
			setEditingRegionName("");
			toast.success("권역을 수정했습니다.");
		},
		onError: () => toast.error("권역 수정에 실패했습니다."),
	});

	const deleteRegionMutation = useMutation({
		mutationFn: adminApi.deleteRegion,
		onSuccess: async () => {
			await Promise.all([invalidateRegions(), invalidateCountries()]);
			toast.success("권역을 삭제했습니다.");
		},
		onError: () => toast.error("권역 삭제에 실패했습니다."),
	});

	const createCountryMutation = useMutation({
		mutationFn: adminApi.createCountry,
		onSuccess: async () => {
			await invalidateCountries();
			setCountryCode("");
			setCountryName("");
			setCountryRegionCode(regionOptions[0]?.code ?? "");
			toast.success("지역을 생성했습니다.");
		},
		onError: () => toast.error("지역 생성에 실패했습니다."),
	});

	const updateCountryMutation = useMutation({
		mutationFn: ({ code, koreanName, regionCode }: { code: string; koreanName: string; regionCode: string }) =>
			adminApi.updateCountry(code, { koreanName, regionCode }),
		onSuccess: async () => {
			await invalidateCountries();
			setEditingCountryCode(null);
			setEditingCountryName("");
			setEditingCountryRegionCode("");
			toast.success("지역을 수정했습니다.");
		},
		onError: () => toast.error("지역 수정에 실패했습니다."),
	});

	const deleteCountryMutation = useMutation({
		mutationFn: adminApi.deleteCountry,
		onSuccess: async () => {
			await invalidateCountries();
			toast.success("지역을 삭제했습니다.");
		},
		onError: () => toast.error("지역 삭제에 실패했습니다."),
	});

	const isRegionMutating =
		createRegionMutation.isPending || updateRegionMutation.isPending || deleteRegionMutation.isPending;
	const isCountryMutating =
		createCountryMutation.isPending || updateCountryMutation.isPending || deleteCountryMutation.isPending;

	const handleCreateRegion = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const normalizedCode = regionCode.trim();
		const normalizedName = regionName.trim();

		if (!normalizedCode || !normalizedName) {
			toast.error("권역 코드와 이름을 입력해주세요.");
			return;
		}

		createRegionMutation.mutate({ code: normalizedCode, koreanName: normalizedName });
	};

	const handleCreateCountry = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const normalizedCode = countryCode.trim();
		const normalizedName = countryName.trim();
		const normalizedRegionCode = countryRegionCode.trim();

		if (!normalizedCode || !normalizedName || !normalizedRegionCode) {
			toast.error("지역 코드, 이름, 권역 코드를 입력해주세요.");
			return;
		}

		createCountryMutation.mutate({
			code: normalizedCode,
			koreanName: normalizedName,
			regionCode: normalizedRegionCode,
		});
	};

	const handleStartEditRegion = (region: RegionResponse) => {
		const code = getRegionCode(region);
		if (!code) {
			toast.error("권역 코드를 확인할 수 없습니다.");
			return;
		}

		setEditingRegionCode(code);
		setEditingRegionName(getRegionName(region) ?? "");
	};

	const handleUpdateRegion = (code: string) => {
		const normalizedName = editingRegionName.trim();
		if (!normalizedName) {
			toast.error("권역 이름을 입력해주세요.");
			return;
		}

		updateRegionMutation.mutate({ code, koreanName: normalizedName });
	};

	const handleDeleteRegion = (code: string) => {
		const confirmed = window.confirm(`권역 ${code}를 삭제할까요? 연결된 지역에 영향이 있을 수 있습니다.`);
		if (!confirmed) return;

		deleteRegionMutation.mutate(code);
	};

	const handleStartEditCountry = (country: CountryResponse) => {
		const code = getCountryCode(country);
		if (!code) {
			toast.error("지역 코드를 확인할 수 없습니다.");
			return;
		}

		setEditingCountryCode(code);
		setEditingCountryName(getCountryName(country) ?? "");
		setEditingCountryRegionCode(getCountryRegionCode(country) ?? "");
	};

	const handleUpdateCountry = (code: string) => {
		const normalizedName = editingCountryName.trim();
		const normalizedRegionCode = editingCountryRegionCode.trim();

		if (!normalizedName || !normalizedRegionCode) {
			toast.error("지역 이름과 권역 코드를 입력해주세요.");
			return;
		}

		updateCountryMutation.mutate({ code, koreanName: normalizedName, regionCode: normalizedRegionCode });
	};

	const handleDeleteCountry = (code: string) => {
		const confirmed = window.confirm(`지역 ${code}를 삭제할까요?`);
		if (!confirmed) return;

		deleteCountryMutation.mutate(code);
	};

	return (
		<AdminLayout
			activeMenu="regionsCountries"
			title="권역/지역 관리"
			description="서비스 권역과 국가 지역 코드를 관리합니다."
		>
			<div className="mt-4 grid gap-4 xl:grid-cols-2">
				<section className="rounded-xl border border-k-100 bg-k-0 p-4">
					<div className="flex items-center justify-between gap-3">
						<div>
							<h2 className="typo-sb-9 text-k-900">권역</h2>
							<p className="mt-1 typo-regular-4 text-k-500">예: EUROPE, AMERICAS</p>
						</div>
						<p className="typo-regular-4 text-k-500">총 {regions.length.toLocaleString()}건</p>
					</div>

					<form onSubmit={handleCreateRegion} className="mt-4 grid gap-2 sm:grid-cols-[140px_minmax(0,1fr)_auto]">
						<Input value={regionCode} onChange={(event) => setRegionCode(event.target.value)} placeholder="권역 코드" />
						<Input value={regionName} onChange={(event) => setRegionName(event.target.value)} placeholder="권역 이름" />
						<Button type="submit" disabled={createRegionMutation.isPending}>
							생성
						</Button>
					</form>

					<div className="mt-4 overflow-x-auto rounded-lg border border-k-100">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>코드</TableHead>
									<TableHead>이름</TableHead>
									<TableHead>작업</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{regionsQuery.isLoading ? (
									<TableRow>
										<TableCell colSpan={3} className="text-center typo-regular-4 text-k-500">
											권역을 불러오는 중...
										</TableCell>
									</TableRow>
								) : regionsQuery.isError ? (
									<TableRow>
										<TableCell colSpan={3} className="text-center typo-regular-4 text-[#E22A2D]">
											권역을 불러오지 못했습니다.
										</TableCell>
									</TableRow>
								) : regions.length === 0 ? (
									<TableRow>
										<TableCell colSpan={3} className="text-center typo-regular-4 text-k-500">
											권역이 없습니다.
										</TableCell>
									</TableRow>
								) : (
									regions.map((region, index) => {
										const code = getRegionCode(region);
										const isEditing = Boolean(code && editingRegionCode === code);

										return (
											<TableRow key={code ?? `region-${index}`} className="hover:bg-bg-50">
												<TableCell>{toDisplayText(code)}</TableCell>
												<TableCell>
													{isEditing ? (
														<Input
															value={editingRegionName}
															onChange={(event) => setEditingRegionName(event.target.value)}
														/>
													) : (
														toDisplayText(getRegionName(region))
													)}
												</TableCell>
												<TableCell>
													{isEditing && code ? (
														<div className="flex items-center gap-2">
															<Button
																size="sm"
																onClick={() => handleUpdateRegion(code)}
																disabled={updateRegionMutation.isPending}
															>
																저장
															</Button>
															<Button size="sm" variant="secondary" onClick={() => setEditingRegionCode(null)}>
																취소
															</Button>
														</div>
													) : (
														<div className="flex items-center gap-2">
															<Button
																size="sm"
																variant="secondary"
																onClick={() => handleStartEditRegion(region)}
																disabled={!code}
															>
																수정
															</Button>
															<Button
																size="sm"
																variant="destructive"
																onClick={() => code && handleDeleteRegion(code)}
																disabled={!code || isRegionMutating}
															>
																삭제
															</Button>
														</div>
													)}
												</TableCell>
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
					</div>
				</section>

				<section className="rounded-xl border border-k-100 bg-k-0 p-4">
					<div className="flex items-center justify-between gap-3">
						<div>
							<h2 className="typo-sb-9 text-k-900">지역</h2>
							<p className="mt-1 typo-regular-4 text-k-500">예: AT, US, JP</p>
						</div>
						<p className="typo-regular-4 text-k-500">총 {countries.length.toLocaleString()}건</p>
					</div>

					<form
						onSubmit={handleCreateCountry}
						className="mt-4 grid gap-2 sm:grid-cols-[110px_minmax(0,1fr)_150px_auto]"
					>
						<Input
							value={countryCode}
							onChange={(event) => setCountryCode(event.target.value)}
							placeholder="지역 코드"
						/>
						<Input
							value={countryName}
							onChange={(event) => setCountryName(event.target.value)}
							placeholder="지역 이름"
						/>
						<select
							value={countryRegionCode}
							onChange={(event) => setCountryRegionCode(event.target.value)}
							className="h-9 rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
						>
							<option value="">권역 선택</option>
							{regionOptions.map((region) => (
								<option key={region.code} value={region.code}>
									{region.name ? `${region.name} (${region.code})` : region.code}
								</option>
							))}
						</select>
						<Button type="submit" disabled={createCountryMutation.isPending}>
							생성
						</Button>
					</form>

					<div className="mt-4 overflow-x-auto rounded-lg border border-k-100">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>코드</TableHead>
									<TableHead>이름</TableHead>
									<TableHead>권역</TableHead>
									<TableHead>작업</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{countriesQuery.isLoading ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center typo-regular-4 text-k-500">
											지역을 불러오는 중...
										</TableCell>
									</TableRow>
								) : countriesQuery.isError ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center typo-regular-4 text-[#E22A2D]">
											지역을 불러오지 못했습니다.
										</TableCell>
									</TableRow>
								) : countries.length === 0 ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center typo-regular-4 text-k-500">
											지역이 없습니다.
										</TableCell>
									</TableRow>
								) : (
									countries.map((country, index) => {
										const code = getCountryCode(country);
										const isEditing = Boolean(code && editingCountryCode === code);

										return (
											<TableRow key={code ?? `country-${index}`} className="hover:bg-bg-50">
												<TableCell>{toDisplayText(code)}</TableCell>
												<TableCell>
													{isEditing ? (
														<Input
															value={editingCountryName}
															onChange={(event) => setEditingCountryName(event.target.value)}
														/>
													) : (
														toDisplayText(getCountryName(country))
													)}
												</TableCell>
												<TableCell>
													{isEditing ? (
														<select
															value={editingCountryRegionCode}
															onChange={(event) => setEditingCountryRegionCode(event.target.value)}
															className="h-9 min-w-[150px] rounded-md border border-k-200 bg-k-0 px-3 typo-regular-4 text-k-700 outline-none focus-visible:border-primary"
														>
															<option value="">권역 선택</option>
															{regionOptions.map((region) => (
																<option key={region.code} value={region.code}>
																	{region.name ? `${region.name} (${region.code})` : region.code}
																</option>
															))}
														</select>
													) : (
														toDisplayText(getCountryRegionCode(country))
													)}
												</TableCell>
												<TableCell>
													{isEditing && code ? (
														<div className="flex items-center gap-2">
															<Button
																size="sm"
																onClick={() => handleUpdateCountry(code)}
																disabled={updateCountryMutation.isPending}
															>
																저장
															</Button>
															<Button size="sm" variant="secondary" onClick={() => setEditingCountryCode(null)}>
																취소
															</Button>
														</div>
													) : (
														<div className="flex items-center gap-2">
															<Button
																size="sm"
																variant="secondary"
																onClick={() => handleStartEditCountry(country)}
																disabled={!code}
															>
																수정
															</Button>
															<Button
																size="sm"
																variant="destructive"
																onClick={() => code && handleDeleteCountry(code)}
																disabled={!code || isCountryMutating}
															>
																삭제
															</Button>
														</div>
													)}
												</TableCell>
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
					</div>
				</section>
			</div>
		</AdminLayout>
	);
}
