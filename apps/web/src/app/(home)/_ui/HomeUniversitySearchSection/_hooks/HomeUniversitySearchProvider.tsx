"use client";

import { createContext, type ReactNode, useContext } from "react";
import useSearchState from "./useHomeUniversitySearch";

const SearchContext = createContext<ReturnType<typeof useSearchState> | null>(null);

export const HomeUniversitySearchProvider = ({ children }: { children: ReactNode }) => {
  const search = useSearchState();
  return <SearchContext.Provider value={search}>{children}</SearchContext.Provider>;
};

export const useHomeUniversitySearch = () => {
  const search = useContext(SearchContext);
  if (!search) throw new Error("Home search must be rendered inside HomeUniversitySearchProvider");
  return search;
};
