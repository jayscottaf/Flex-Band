"use client"

import * as React from "react"
import { ReserveModal } from "@/components/reserve-modal"
import { ReserveContextProvider, type ReserveContextValue } from "@/components/reserve-context"
import { trackEvent } from "@/components/track-event"
import { centsToAmount, DEFAULT_PACK, packPriceCents, type PackId, type PriceVariant, type UtmParams } from "@/lib/pricing"

export function ReserveProvider({
  priceVariant,
  utm,
  children,
}: {
  priceVariant: PriceVariant
  utm: UtmParams
  children: React.ReactNode
}) {
  const [selectedPack, setSelectedPack] = React.useState<PackId>(DEFAULT_PACK)
  const [open, setOpen] = React.useState(false)

  const openReserve = React.useCallback(() => {
    trackEvent("buy_click", {
      pack: selectedPack,
      price: centsToAmount(packPriceCents(selectedPack, priceVariant)),
      priceVariant,
    })
    setOpen(true)
  }, [priceVariant, selectedPack])

  const value = React.useMemo<ReserveContextValue>(
    () => ({
      priceVariant,
      utm,
      selectedPack,
      setSelectedPack,
      openReserve,
    }),
    [openReserve, priceVariant, selectedPack, utm],
  )

  return (
    <ReserveContextProvider value={value}>
      {children}
      <ReserveModal open={open} onOpenChange={setOpen} />
    </ReserveContextProvider>
  )
}
