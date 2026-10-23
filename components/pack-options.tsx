"use client"

import { formatUsd, PACKS, PACK_IDS, packBadge, packPriceCents, perBandCents, savingsLabel } from "@/lib/pricing"
import { useReserve } from "@/components/reserve-context"

export function PackOptions({
  name,
  layout,
}: {
  name: string
  layout: "cards" | "rows"
}) {
  const { priceVariant, selectedPack, setSelectedPack } = useReserve()

  if (layout === "rows") {
    return (
      <fieldset>
        <legend className="text-sm font-semibold text-stone-900">Pack</legend>
        <div className="mt-2 grid gap-2">
          {PACK_IDS.map((id) => {
            const pack = PACKS[id]
            const selected = selectedPack === id
            const badge = packBadge(id, priceVariant)
            return (
              <label
                key={id}
                data-testid={`modal-pack-${id}`}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm ${
                  selected
                    ? "border-emerald-700 bg-emerald-50"
                    : "border-stone-200 bg-white hover:border-stone-400"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name={name}
                    value={id}
                    checked={selected}
                    onChange={() => setSelectedPack(id)}
                    className="size-4 accent-emerald-700"
                  />
                  <span>
                    <span className="font-semibold text-stone-900">{pack.label}</span>
                    {badge ? (
                      <span className="ml-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
                        {badge}
                      </span>
                    ) : null}
                  </span>
                </span>
                <span className="font-semibold tabular-nums text-stone-900">
                  {formatUsd(packPriceCents(id, priceVariant))}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>
    )
  }

  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-stone-900">Choose a pack</legend>
      <div className="grid gap-3 sm:grid-cols-3" role="presentation">
        {PACK_IDS.map((id) => {
          const pack = PACKS[id]
          const selected = selectedPack === id
          const badge = packBadge(id, priceVariant)
          const savings = savingsLabel(id, priceVariant)
          const each = perBandCents(id, priceVariant)
          return (
            <label
              key={id}
              data-testid={`pack-${id}`}
              data-selected={selected ? "true" : "false"}
              className={`flex h-full cursor-pointer flex-col rounded-xl border p-4 outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-700 has-[:focus-visible]:ring-offset-2 ${
                selected
                  ? "border-emerald-700 bg-emerald-50/70 shadow-sm"
                  : "border-stone-200 bg-white hover:border-stone-400"
              }`}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="flex min-h-6 items-center">
                  {badge ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-800 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                      {badge}
                    </span>
                  ) : null}
                </span>
                <input
                  type="radio"
                  name={name}
                  value={id}
                  checked={selected}
                  onChange={() => setSelectedPack(id)}
                  className="mt-0.5 size-4 shrink-0 accent-emerald-700"
                />
              </span>
              <span className="mt-3 text-sm font-medium text-stone-600">{pack.label}</span>
              <span className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-stone-900">
                {formatUsd(packPriceCents(id, priceVariant))}
              </span>
              <span className="mt-1 min-h-5 text-sm tabular-nums text-stone-600">
                {pack.quantity > 1 ? `${formatUsd(each)} per band` : "One band"}
              </span>
              <span className="min-h-5 text-sm font-medium text-emerald-800">{savings ?? ""}</span>
              <span className="mt-auto pt-3 text-sm text-stone-600">{pack.detail}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
