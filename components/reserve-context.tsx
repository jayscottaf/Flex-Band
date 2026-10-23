"use client"

import * as React from "react"
import type { PackId, PriceVariant, UtmParams } from "@/lib/pricing"

export type ReserveContextValue = {
  priceVariant: PriceVariant
  utm: UtmParams
  selectedPack: PackId
  setSelectedPack: (pack: PackId) => void
  openReserve: () => void
}

const ReserveContext = React.createContext<ReserveContextValue | null>(null)

export function ReserveContextProvider({
  value,
  children,
}: {
  value: ReserveContextValue
  children: React.ReactNode
}) {
  return <ReserveContext.Provider value={value}>{children}</ReserveContext.Provider>
}

export function useReserve() {
  const value = React.useContext(ReserveContext)
  if (!value) {
    throw new Error("useReserve must be used within ReserveProvider")
  }
  return value
}
