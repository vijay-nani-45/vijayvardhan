"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

type SearchContextType = {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}

export default function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("")

  return <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>{children}</SearchContext.Provider>
}
