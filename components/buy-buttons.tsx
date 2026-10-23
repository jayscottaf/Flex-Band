"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatUsd, PACKS, packPriceCents } from "@/lib/pricing"
import { useReserve } from "@/components/reserve-context"

export function BuyButton({
  className,
  variant = "default",
  testId,
  children,
}: {
  className?: string
  variant?: "default" | "outline"
  testId?: string
  children: React.ReactNode
}) {
  const { openReserve } = useReserve()
  return (
    <Button
      type="button"
      variant={variant}
      onClick={openReserve}
      data-testid={testId}
      className={`cursor-pointer ${className ?? ""}`}
    >
      {children}
    </Button>
  )
}

export function ShopNowButton({ className }: { className?: string }) {
  return (
    <BuyButton
      testId="shop-now"
      className={className ?? "h-10 bg-emerald-700 px-4 text-white hover:bg-emerald-800"}
    >
      <ShoppingCart className="size-4" />
      Shop Now
    </BuyButton>
  )
}

export function GetFlexiBandButton({
  className,
  variant = "default",
  testId = "get-flexi-band",
}: {
  className?: string
  variant?: "default" | "outline"
  testId?: string
}) {
  return (
    <BuyButton testId={testId} variant={variant} className={className}>
      Get Your Flexi-Band Today
    </BuyButton>
  )
}

export function PackReserveButton({ className }: { className?: string }) {
  const { selectedPack, priceVariant } = useReserve()
  const pack = PACKS[selectedPack]
  const price = formatUsd(packPriceCents(selectedPack, priceVariant))

  return (
    <BuyButton
      testId="pack-cta"
      className={`h-auto min-h-12 w-full whitespace-normal bg-emerald-700 px-5 py-3 text-center text-base font-semibold text-white hover:bg-emerald-800 ${className ?? ""}`}
    >
      Reserve {pack.label} — {price}
    </BuyButton>
  )
}
