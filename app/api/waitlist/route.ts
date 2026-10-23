import { NextResponse } from "next/server"
import { z } from "zod"
import {
  CAN_TYPES,
  PACKS,
  PACK_IDS,
  PRICE_VARIANTS,
  amountToCents,
  canTypeById,
  centsToAmount,
  cleanTrackingValue,
  launchPriceCents,
  normalizeEmail,
  packPriceCents,
  parseUtm,
  singleBandCents,
  type CanTypeId,
  type PackId,
  type PriceVariant,
} from "@/lib/pricing"

const CAN_TYPE_IDS = CAN_TYPES.map((item) => item.id) as [CanTypeId, ...CanTypeId[]]

const bodySchema = z.object({
  email: z.string().max(320),
  pack: z.enum(PACK_IDS),
  priceVariant: z.enum(PRICE_VARIANTS),
  canType: z.enum(CAN_TYPE_IDS),
  price: z.number().finite(),
  referrer: z.string().max(2000).nullable().optional(),
  utm: z.record(z.string().max(200), z.string().max(500)).optional(),
})

const MAX_BODY_CHARS = 10_000

export async function POST(request: Request) {
  let json: unknown
  try {
    const text = await request.text()
    if (text.length === 0 || text.length > MAX_BODY_CHARS) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 })
    }
    json = JSON.parse(text) as unknown
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 })
  }

  const email = normalizeEmail(parsed.data.email)
  if (!email) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 })
  }

  const pack: PackId = parsed.data.pack
  const priceVariant: PriceVariant = parsed.data.priceVariant
  const shelfCents = packPriceCents(pack, priceVariant)
  if (amountToCents(parsed.data.price) !== shelfCents) {
    return NextResponse.json({ ok: false, error: "price_mismatch" }, { status: 400 })
  }

  const can = canTypeById(parsed.data.canType)
  if (!can) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 })
  }

  const referrer =
    cleanTrackingValue(parsed.data.referrer, 2000) ??
    cleanTrackingValue(request.headers.get("referer"), 2000) ??
    null

  const utm = parseUtm(parsed.data.utm ?? {})

  const record = {
    event: "flexiband_waitlist_reservation",
    timestamp: new Date().toISOString(),
    email,
    pack,
    quantity: PACKS[pack].quantity,
    unitPrice: centsToAmount(shelfCents),
    singleBandPrice: centsToAmount(singleBandCents(priceVariant)),
    launchPrice: centsToAmount(launchPriceCents(shelfCents)),
    priceVariant,
    canType: can.label,
    referrer,
    utm,
  }

  console.log(JSON.stringify(record))

  return NextResponse.json({ ok: true })
}
