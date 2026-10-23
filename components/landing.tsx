import { Check } from "lucide-react"
import { GetFlexiBandButton, PackReserveButton, ShopNowButton } from "@/components/buy-buttons"
import { PackOptions } from "@/components/pack-options"
import { ReserveProvider } from "@/components/reserve-provider"
import { centsToAmount, singleBandCents, type PriceVariant, type UtmParams } from "@/lib/pricing"

const SPECS = [
  { label: "Shape", value: "Circular loop" },
  { label: "Cans", value: "Round & rectangular 13-gal" },
  { label: "Width", value: "~17 mm" },
  { label: "Thickness", value: "1.7 to 1.9 mm" },
  { label: "Hardness", value: "Shore 45–50A" },
  { label: "Finish", value: "Satin, nearly clear" },
] as const

const SILICONE = [
  "One circular loop, so there are no corners to align",
  "Wipe-clean and dishwasher-safe silicone",
  "Satin finish that sits nearly invisible on stainless or matte cans",
  "Finger loop with a reinforced wide base",
] as const

const ELASTIC = [
  "Woven band with a metal clip",
  "Fabric soaks up kitchen liquids",
  "Clips can rust in a wet kitchen",
  "Sits across the rim like a bungee cord",
] as const

const STEPS = [
  {
    title: "Line the can",
    body: "Fold the bag over the rim the way you already do.",
  },
  {
    title: "Stretch the loop",
    body: "Hook a finger in the pull tab and pull the band over the rim. Round or rectangular — nothing has to meet a corner.",
  },
  {
    title: "Let go",
    body: "The liner stays folded over the rim. Lift the tab again when you change the bag.",
  },
] as const

export function Landing({
  priceVariant,
  utm,
}: {
  priceVariant: PriceVariant
  utm: UtmParams
}) {
  const singlePrice = centsToAmount(singleBandCents(priceVariant)).toFixed(2)

  return (
    <ReserveProvider priceVariant={priceVariant} utm={utm}>
      <main className="min-h-screen bg-stone-50 text-stone-900" data-price-variant={priceVariant} data-single-price={singlePrice}>
        <a
          href="#offer"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow"
        >
          Skip to the offer
        </a>

        <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
            <a href="#offer" className="text-xl font-semibold tracking-tight text-stone-900 md:text-2xl">
              Flexi-Band™
            </a>
            <div className="flex items-center gap-3">
              <p className="hidden text-xs text-stone-500 sm:block">No payment today</p>
              <ShopNowButton />
            </div>
          </div>
        </header>

        <section id="offer" className="px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14">
            <div className="order-2 md:order-1">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-800">Launch Batch 1</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance text-stone-950 md:text-5xl md:leading-[1.05]">
                Keep the trash bag over the rim.
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-600">
                Flexi-Band™ is an ultra-thin, nearly transparent silicone loop for round and rectangular 13-gallon kitchen cans. It is one smooth circle, so there are no corners to line up.
              </p>

              <ul className="mt-6 space-y-4">
                <Benefit
                  title="Universal circular loop"
                  body="Conforms smoothly to both round and rectangular 13-gallon cans. No corners to align."
                />
                <Benefit
                  title="Signature pull tab"
                  body="An integrated silicone finger loop with a reinforced wide base, and a subtle molded Flexi-Band™ logo just above the tab."
                />
                <Benefit
                  title="Wipe-clean silicone"
                  body="Dishwasher-safe, with a satin finish. Unlike woven elastic with metal clips, it does not soak up kitchen liquids or rust."
                />
              </ul>

              <div className="mt-8">
                <PackOptions name="pack" layout="cards" />
                <div className="mt-4 flex flex-col gap-3">
                  <PackReserveButton />
                  <GetFlexiBandButton
                    variant="outline"
                    className="h-12 w-full border-stone-300 bg-white px-5 text-base font-semibold text-stone-900 hover:bg-stone-100 hover:text-stone-900"
                  />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  Lock in 20% off Launch Batch 1 when you reserve. Batch 1 is in final silicone molding, and no payment is collected today.{" "}
                  <a href="#compare" className="font-semibold text-emerald-800 underline-offset-4 hover:underline">
                    Learn more
                  </a>
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="overflow-hidden rounded-2xl bg-stone-200 shadow-xl ring-1 ring-stone-900/5">
                <img
                  src="/flexi-band-hero.png"
                  alt="Flexi-Band, a nearly clear silicone band, holding a white trash bag over the rim of a rectangular stainless steel kitchen can"
                  width={1024}
                  height={1024}
                  fetchPriority="high"
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="compare" className="border-t border-stone-200 bg-white px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950 md:text-3xl">
              A thin satin band, not a bungee cord.
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-stone-600">
              Launch Batch 1 is a flat circular strip of clear silicone — about 17 mm wide and 1.7 to 1.9 mm thick, Shore 45–50A — with a subtle satin finish so it blends into stainless steel or a matte can.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-stone-200 py-6 md:grid-cols-3 lg:grid-cols-6">
              {SPECS.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">{spec.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-stone-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-stone-500">
              Width, thickness, and hardness are the Launch Batch 1 molding targets for one universal size.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
                <h3 className="text-lg font-semibold text-stone-950">Flexi-Band™ silicone</h3>
                <ul className="mt-4 space-y-3">
                  {SILICONE.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-stone-700">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
                <h3 className="text-lg font-semibold text-stone-950">Woven elastic straps</h3>
                <ul className="mt-4 space-y-3">
                  {ELASTIC.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-stone-600">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-stone-400" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-stone-600">
              Cheap elastic straps cost less in a multipack. They also hold onto spills, the metal clips can rust, and they look like a cord tied around the can. Flexi-Band is one piece of silicone you can wipe off or run through the dishwasher.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950 md:text-3xl">
                One finger on. One finger off.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-stone-600">
                The pull tab is molded in the same silicone as the band. The hole is a finger loop, the base is wider where the tab joins the strip, and the edges are rounded so the pull does not start a tear. The Flexi-Band™ logo sits just above the tab, debossed into the band.
              </p>
            </div>
            <ol className="space-y-6">
              {STEPS.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-3">
                  <span className="text-2xl font-semibold tabular-nums text-emerald-800">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-semibold text-stone-950">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-stone-950 px-4 py-14 text-white md:px-8 md:py-16">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tight text-balance">Launch Batch 1 is in the mold.</h2>
              <p className="mt-3 text-base leading-relaxed text-stone-300">
                Reserve a pack and lock 20% off the price you just saw. We collect an email today, not a payment, and we&apos;ll write when the bands are ready to order.
              </p>
            </div>
            <GetFlexiBandButton
              testId="get-flexi-band-footer"
              className="h-12 shrink-0 bg-white px-6 text-base font-semibold text-stone-950 shadow-none hover:bg-stone-100"
            />
          </div>
        </section>

        <footer className="border-t border-stone-200 bg-white px-4 py-8 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Flexi-Band™</p>
            <p>Batch 1 is in final silicone molding. Reserving a price does not charge you.</p>
          </div>
        </footer>
      </main>
    </ReserveProvider>
  )
}

function Benefit({ title, body }: { title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <Check className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
      <div>
        <p className="font-semibold text-stone-950">{title}</p>
        <p className="text-sm leading-relaxed text-stone-600">{body}</p>
      </div>
    </li>
  )
}
