/** Launch pricing and the ?price= split test. Amounts are integer cents. */

export const PACK_IDS = ["single", "2-pack", "4-pack"] as const
export type PackId = (typeof PACK_IDS)[number]

/** "10" is the $9.99 cell. Missing or unknown values stay on the default $9.99 cell. */
export const PRICE_VARIANTS = ["7", "10", "12", "default"] as const
export type PriceVariant = (typeof PRICE_VARIANTS)[number]

export const CAN_TYPES = [
  { id: "rectangular-13", label: "Rectangular 13-Gal" },
  { id: "round-13", label: "Round 13-Gal" },
  { id: "both-other", label: "Both / Other" },
] as const

export type CanTypeId = (typeof CAN_TYPES)[number]["id"]
export type CanTypeLabel = (typeof CAN_TYPES)[number]["label"]

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const

export type UtmKey = (typeof UTM_KEYS)[number]
export type UtmParams = Partial<Record<UtmKey, string>>

type PackInfo = {
  id: PackId
  label: string
  quantity: number
  detail: string
}

export const PACKS: Record<PackId, PackInfo> = {
  single: {
    id: "single",
    label: "Single Band",
    quantity: 1,
    detail: "One kitchen can",
  },
  "2-pack": {
    id: "2-pack",
    label: "2-Pack",
    quantity: 2,
    detail: "Kitchen + pantry or garage",
  },
  "4-pack": {
    id: "4-pack",
    label: "4-Pack",
    quantity: 4,
    detail: "A band for every can",
  },
}

export const DEFAULT_PACK: PackId = "2-pack"
export const LAUNCH_DISCOUNT = 0.2

const SINGLE_CENTS: Record<PriceVariant, number> = {
  "7": 700,
  "10": 999,
  "12": 1299,
  default: 999,
}

const FIXED_PACK_CENTS: Record<Exclude<PackId, "single">, number> = {
  "2-pack": 1899,
  "4-pack": 3499,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function parsePriceVariant(raw: string | null | undefined): PriceVariant {
  if (raw === "7" || raw === "10" || raw === "12") return raw
  return "default"
}

export function isPackId(value: string): value is PackId {
  return (PACK_IDS as readonly string[]).includes(value)
}

export function canTypeById(id: string): (typeof CAN_TYPES)[number] | undefined {
  return CAN_TYPES.find((item) => item.id === id)
}

export function singleBandCents(variant: PriceVariant): number {
  return SINGLE_CENTS[variant]
}

export function packPriceCents(pack: PackId, variant: PriceVariant): number {
  if (pack === "single") return singleBandCents(variant)
  return FIXED_PACK_CENTS[pack]
}

export function centsToAmount(cents: number): number {
  return Number((cents / 100).toFixed(2))
}

export function amountToCents(amount: number): number {
  return Math.round(amount * 100)
}

export function formatUsd(cents: number): string {
  return centsToAmount(cents).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })
}

export function perBandCents(pack: PackId, variant: PriceVariant): number {
  return Math.round(packPriceCents(pack, variant) / PACKS[pack].quantity)
}

export function savingsCents(pack: PackId, variant: PriceVariant): number {
  const count = PACKS[pack].quantity
  return singleBandCents(variant) * count - packPriceCents(pack, variant)
}

/** Nearest-dollar savings versus buying the same count as singles. Hidden when it would not be a savings. */
export function savingsLabel(pack: PackId, variant: PriceVariant): string | null {
  const saved = savingsCents(pack, variant)
  if (saved < 50) return null
  return `Save $${Math.round(saved / 100)}`
}

export function packBadge(pack: PackId, variant: PriceVariant): string | null {
  if (pack === "2-pack") return "Most Popular"
  if (pack === "4-pack" && perBandCents(pack, variant) < singleBandCents(variant)) {
    return "Best Value"
  }
  return null
}

export function launchPriceCents(shelfCents: number): number {
  return Math.round(shelfCents * (1 - LAUNCH_DISCOUNT))
}

export function normalizeEmail(value: string): string | null {
  const email = value.trim().toLowerCase()
  if (email.length < 3 || email.length > 254) return null
  if (!EMAIL_RE.test(email)) return null
  return email
}

export function cleanTrackingValue(
  value: string | null | undefined,
  max: number,
): string | undefined {
  if (!value) return undefined
  const cleaned = value.replace(/[\u0000-\u001F\u007F]+/g, " ").trim().slice(0, max)
  return cleaned.length > 0 ? cleaned : undefined
}

export function parseUtm(params: Record<string, string | string[] | undefined>): UtmParams {
  const utm: UtmParams = {}
  for (const key of UTM_KEYS) {
    const raw = params[key]
    const value = Array.isArray(raw) ? raw[0] : raw
    const cleaned = cleanTrackingValue(value, 200)
    if (cleaned) utm[key] = cleaned
  }
  return utm
}
