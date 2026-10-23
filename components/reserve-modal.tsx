"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { PackOptions } from "@/components/pack-options"
import { useReserve } from "@/components/reserve-context"
import { trackEvent } from "@/components/track-event"
import {
  CAN_TYPES,
  centsToAmount,
  formatUsd,
  launchPriceCents,
  normalizeEmail,
  PACKS,
  packPriceCents,
  type CanTypeId,
} from "@/lib/pricing"

const ERROR_COPY: Record<string, string> = {
  invalid_email: "Enter a valid email so we can hold this price.",
  invalid_request: "Check the pack, can type, and email, then try again.",
  invalid_json: "Check the pack, can type, and email, then try again.",
  price_mismatch: "That price is out of date. Refresh the page and reserve again.",
  server_error: "We couldn't save that reservation. Please try again.",
}

export function ReserveModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { priceVariant, utm, selectedPack } = useReserve()
  const [canType, setCanType] = React.useState<CanTypeId | "">("")
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [reservedEmail, setReservedEmail] = React.useState("")

  const shelfCents = packPriceCents(selectedPack, priceVariant)
  const launchCents = launchPriceCents(shelfCents)
  const pack = PACKS[selectedPack]

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) {
      setStatus("idle")
      setErrorMessage(null)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "submitting") return

    const normalized = normalizeEmail(email)
    if (!normalized) {
      setStatus("error")
      setErrorMessage(ERROR_COPY.invalid_email)
      return
    }
    if (!canType) {
      setStatus("error")
      setErrorMessage("Choose the can you use most.")
      return
    }

    setStatus("submitting")
    setErrorMessage(null)

    const price = centsToAmount(shelfCents)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          email: normalized,
          pack: selectedPack,
          priceVariant,
          canType,
          price,
          referrer: document.referrer || null,
          utm,
        }),
      })

      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!response.ok || !payload?.ok) {
        const code = payload?.error ?? "server_error"
        setStatus("error")
        setErrorMessage(ERROR_COPY[code] ?? ERROR_COPY.server_error)
        return
      }

      const can = CAN_TYPES.find((item) => item.id === canType)
      trackEvent("waitlist_submit", {
        pack: selectedPack,
        price,
        canType: can?.label ?? canType,
      })
      setReservedEmail(normalized)
      setStatus("success")
    } catch {
      setStatus("error")
      setErrorMessage("We couldn't reach the reservation service. Try again in a moment.")
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-stone-950/55" />
        <Dialog.Content
          data-testid="reserve-modal"
          className="fixed left-1/2 top-1/2 z-[81] max-h-[min(92vh,44rem)] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl outline-none sm:p-6"
        >
          <div className="flex gap-4 pr-8">
            <img
              src="/flexi-band-hero.png"
              alt=""
              width={96}
              height={96}
              className="size-16 shrink-0 rounded-lg object-cover ring-1 ring-stone-200"
            />
            <div>
              <Dialog.Title className="text-xl font-semibold tracking-tight text-stone-900">
                Reserve Launch Batch 1
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-relaxed text-stone-600">
                Flexi-Band™ Batch 1 is in final silicone molding. No payment is collected today. Leave your email to lock in 20% off the pack you picked.
              </Dialog.Description>
            </div>
          </div>

          {status === "success" ? (
            <div className="mt-6 rounded-xl bg-emerald-50 p-4" data-testid="reserve-success">
              <p className="font-semibold text-emerald-950">Your launch price is reserved.</p>
              <p className="mt-2 text-sm leading-relaxed text-emerald-950">
                {pack.label} at {formatUsd(launchCents)} is held for {reservedEmail} — 20% off the {formatUsd(shelfCents)} shelf price. We&apos;ll email you when Batch 1 is ready to order. Nothing is charged from this page.
              </p>
              <Dialog.Close className="mt-4 inline-flex h-11 cursor-pointer items-center justify-center rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900">
                Close
              </Dialog.Close>
            </div>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={handleSubmit} data-testid="reserve-form" noValidate>
              <PackOptions name="reserve-pack" layout="rows" />

              <fieldset>
                <legend className="text-sm font-semibold text-stone-900">Primary trash can</legend>
                <div className="mt-2 grid gap-2">
                  {CAN_TYPES.map((can) => {
                    const selected = canType === can.id
                    return (
                      <label
                        key={can.id}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${
                          selected
                            ? "border-emerald-700 bg-emerald-50"
                            : "border-stone-200 bg-white hover:border-stone-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="canType"
                          value={can.id}
                          checked={selected}
                          onChange={() => setCanType(can.id)}
                          className="size-4 accent-emerald-700"
                        />
                        <span className="font-medium text-stone-900">{can.label}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <div>
                <label htmlFor="reserve-email" className="text-sm font-semibold text-stone-900">
                  Email
                </label>
                <input
                  id="reserve-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  data-testid="reserve-email"
                  className="mt-2 h-12 w-full rounded-lg border border-stone-300 bg-white px-3 text-base text-stone-900 outline-none placeholder:text-stone-400 focus-visible:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/30"
                />
              </div>

              <dl className="grid grid-cols-[1fr_auto] gap-y-1.5 rounded-xl bg-stone-50 px-4 py-3 text-sm">
                <dt className="text-stone-600">Shelf price</dt>
                <dd className="tabular-nums text-stone-900">{formatUsd(shelfCents)}</dd>
                <dt className="font-medium text-stone-900">Launch Batch 1, 20% off</dt>
                <dd className="font-semibold tabular-nums text-stone-900">{formatUsd(launchCents)}</dd>
                <dt className="text-stone-600">Due today</dt>
                <dd className="tabular-nums text-stone-900">$0.00</dd>
              </dl>

              {errorMessage ? (
                <p role="alert" className="text-sm font-medium text-red-700" data-testid="reserve-error">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                data-testid="reserve-submit"
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-emerald-700 px-4 text-base font-semibold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70"
              >
                {status === "submitting" ? "Saving your price…" : "Lock in 20% off"}
              </button>
              <p className="text-center text-xs leading-relaxed text-stone-500">
                We&apos;ll email you when Launch Batch 1 is ready. You decide then whether to buy at this price. No payment is collected today.
              </p>
            </form>
          )}

          <Dialog.Close
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          >
            <X className="size-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
