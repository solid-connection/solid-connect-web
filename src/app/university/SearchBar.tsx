"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

const searchSchema = z.object({
  searchText: z.string().min(1, "검색어를 입력해주세요.").max(50, "최대 50자까지 입력 가능합니다."),
});
type SearchFormData = z.infer<typeof searchSchema>;

// --- 아이콘 컴포넌트 ---
const SearchIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clipRule="evenodd"
    ></path>
  </svg>
);

interface SearchBarProps {
  initText?: string;
}
// --- 폼 로직을 관리하는 부모 컴포넌트 ---
const SearchForm = ({ initText }: SearchBarProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema), // 3. useForm에 zodResolver 연동
    defaultValues: {
      searchText: initText || "",
    },
  });

  // 4. 폼 제출 시 실행될 함수
  const onSubmit: SubmitHandler<SearchFormData> = (data) => {
    const queryParams = new URLSearchParams();
    if (data.searchText) {
      queryParams.append("searchText", data.searchText.trim());
    }

    const queryString = queryParams.toString();

    router.push(`/university?${queryString}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="relative mb-2">
        <input
          type="text"
          placeholder={"대학명을 검색해보세요..."}
          className={`w-full border-b bg-white p-3 pl-4 pr-10 outline-none transition-colors ${
            errors.searchText ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
          }`}
          {...register("searchText")}
        />
        <div className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400">
          <SearchIcon />
        </div>
        {errors && errors.searchText && <p className="mt-1 text-sm text-red-600">{errors?.searchText.message}</p>}
      </div>
    </form>
  );
};

export default SearchForm;
