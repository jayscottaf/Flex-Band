# Flexi-Band™

Landing page for the Flexi-Band™ Launch Batch 1 price test. Visitors pick a pack, see a real shelf price, and reserve **20% off** with an email. No payment is collected.

The product is one nearly clear silicone loop for round and rectangular 13-gallon kitchen cans, with a finger-loop pull tab. Batch 1 is in final silicone molding.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Price test

The single-band shelf price follows `?price=`. Multipacks stay fixed.

| URL | Single band | `priceVariant` |
| --- | --- | --- |
| `/` | $9.99 | `default` |
| `/?price=7` | $7.00 | `7` |
| `/?price=10` | $9.99 | `10` |
| `/?price=12` | $12.99 | `12` |

Any other `price` value stays on the default $9.99 cell.

| Pack | Shelf price |
| --- | --- |
| Single Band | the cell above |
| 2-Pack | $18.99 |
| 4-Pack | $34.99 |

At the $9.99 cell, the 2-pack shows **Save $1** and **Most Popular**. The 4-pack shows **Best Value** when its per-band price is actually lower than the single. Savings copy is hidden when the math would not be a savings (the $7 cell).

Append the usual campaign params. They are stored with the reservation:

`/?price=10&utm_source=meta&utm_medium=paid&utm_campaign=single-10`

## What the buttons do

Shop Now, Get Your Flexi-Band Today, and the pack button (**Reserve the 2-Pack — $18.99**) each:

1. Send a Vercel Analytics event `buy_click` with `{ pack, price, priceVariant }`. `price` is the shelf price of the selected pack, not the 20% launch price.
2. Open the reservation modal.

The modal asks for a can type (Rectangular 13-Gal, Round 13-Gal, or Both / Other) and an email, then `POST`s `/api/waitlist`. On success the browser sends `waitlist_submit` with `{ pack, price, canType }`.

The launch price shown in the modal is 20% off the shelf price. Due today is $0.

## Waitlist log

`POST /api/waitlist` checks the email, pack, can type, and that `price` matches the shelf price for that pack and `priceVariant`. A valid signup writes one JSON line to the server log:

```json
{
  "event": "flexiband_waitlist_reservation",
  "timestamp": "2026-10-23T12:00:00.000Z",
  "email": "person@example.com",
  "pack": "2-pack",
  "quantity": 2,
  "unitPrice": 18.99,
  "singleBandPrice": 9.99,
  "launchPrice": 15.19,
  "priceVariant": "default",
  "canType": "Rectangular 13-Gal",
  "referrer": "https://instagram.com/",
  "utm": { "utm_source": "meta", "utm_campaign": "single-10" }
}
```

There is no database. On Vercel these lines are the record — filter runtime logs for `flexiband_waitlist_reservation`. Log retention depends on the Vercel plan; a log drain is the way to keep them longer.

## Product image

`public/flexi-band-hero.png` is the only product image. The page references it as `/flexi-band-hero.png`, including the thumbnail in the reservation modal.
