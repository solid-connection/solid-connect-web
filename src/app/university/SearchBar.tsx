"use client";

import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

// --- 아이콘 컴포넌트 ---
const SearchIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clipRule="evenodd"
    ></path>
  </svg>
);

// --- Props 타입 정의 ---
interface SearchBarProps {
  name: string;
  register: UseFormRegister<FieldValues>;
  placeholder: string;
}

// --- SearchBar 컴포넌트 ---
const SearchBar: React.FC<SearchBarProps> = ({ name, register, placeholder }) => {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white p-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
        {...register(name)}
      />
      <div className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400">
        <SearchIcon />
      </div>
    </div>
  );
};

export default SearchBar;
