"use client"

import { track } from "@vercel/analytics"

export function trackEvent(
  name: "buy_click" | "waitlist_submit",
  properties: Record<string, string | number>,
) {
  try {
    track(name, properties)
  } catch {
    // Analytics must not block a reservation.
  }
}
