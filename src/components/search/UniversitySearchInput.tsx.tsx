"use client";

import React, { ChangeEvent } from "react";

import { Search } from "lucide-react";

interface UniversitySearchInputProps {
  value: string;
  onChange: (q: string) => void;
  placeholder?: string;
}

export default function UniversitySearchInput({ value, onChange, placeholder = "" }: UniversitySearchInputProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}
