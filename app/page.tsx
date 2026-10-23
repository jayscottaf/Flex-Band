import { Landing } from "@/components/landing"
import { parsePriceVariant, parseUtm } from "@/lib/pricing"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const price = Array.isArray(params.price) ? params.price[0] : params.price

  return <Landing priceVariant={parsePriceVariant(price)} utm={parseUtm(params)} />
}
