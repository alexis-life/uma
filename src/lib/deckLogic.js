import { RARITY_ORDER } from './constants'

// Per-style weighting of card types. Higher weight = more slots reserved for
// that type when building a recommended deck (see allocateSlots below) — not
// a hard sort key, so a deck ends up mixed rather than one type maxed out.
export const STYLE_TYPE_WEIGHTS = {
  Nige: { speed: 5, stamina: 2, power: 2, guts: 0, wisdom: 2, friend: 1 },
  Senkou: { speed: 3, stamina: 1, power: 3, guts: 1, wisdom: 2, friend: 1 },
  Sashi: { speed: 3, stamina: 3, power: 1, guts: 1, wisdom: 2, friend: 1 },
  Oikomi: { speed: 1, stamina: 3, power: 1, guts: 3, wisdom: 2, friend: 1 },
}

function compareCards(a, b) {
  const rarityDiff = (RARITY_ORDER[b.rarity] ?? 0) - (RARITY_ORDER[a.rarity] ?? 0)
  if (rarityDiff !== 0) return rarityDiff
  return (b.limitBreak ?? 0) - (a.limitBreak ?? 0)
}

// Turns type weights into whole-number deck slot counts summing to `count`,
// proportional to weight, with leftover slots going to the highest fractional
// remainders (largest-remainder apportionment).
function allocateSlots(weights, count) {
  const types = Object.keys(weights).filter((t) => weights[t] > 0)
  const totalWeight = types.reduce((sum, t) => sum + weights[t], 0)
  if (totalWeight === 0) return {}

  const shares = types.map((type) => {
    const exact = (weights[type] / totalWeight) * count
    return { type, slots: Math.floor(exact), remainder: exact - Math.floor(exact), weight: weights[type] }
  })

  let remaining = count - shares.reduce((sum, s) => sum + s.slots, 0)
  shares.sort((a, b) => b.remainder - a.remainder || b.weight - a.weight)
  for (let i = 0; i < remaining; i++) shares[i % shares.length].slots += 1

  return Object.fromEntries(shares.map((s) => [s.type, s.slots]))
}

export function recommendDeck(cards, style, count = 6) {
  const weights = STYLE_TYPE_WEIGHTS[style] ?? {}
  const slotPlan = allocateSlots(weights, count)

  const deck = []
  const usedIds = new Set()

  for (const [type, slots] of Object.entries(slotPlan)) {
    const picks = cards
      .filter((c) => c.type === type)
      .sort(compareCards)
      .slice(0, slots)
    for (const c of picks) {
      deck.push(c)
      usedIds.add(c.id)
    }
  }

  // Backfill any unfilled slots (sparse library for a planned type) with the
  // next-best remaining cards, still favoring higher-weight types.
  if (deck.length < count) {
    const leftover = cards
      .filter((c) => !usedIds.has(c.id))
      .map((card) => ({ card, weight: weights[card.type] ?? 0 }))
      .sort((a, b) => b.weight - a.weight || compareCards(a.card, b.card))
    for (const entry of leftover) {
      if (deck.length >= count) break
      deck.push(entry.card)
    }
  }

  return deck.slice(0, count)
}
