import { RARITY_ORDER } from './constants'

// Per-style weighting of card types. Higher weight = more heavily favored
// when assembling a recommended deck.
export const STYLE_TYPE_WEIGHTS = {
  Nige: { speed: 5, stamina: 2, power: 2, guts: 0, wisdom: 2, friend: 1 },
  Senkou: { speed: 3, stamina: 1, power: 3, guts: 1, wisdom: 2, friend: 1 },
  Sashi: { speed: 3, stamina: 3, power: 1, guts: 1, wisdom: 2, friend: 1 },
  Oikomi: { speed: 1, stamina: 3, power: 1, guts: 3, wisdom: 2, friend: 1 },
}

export function recommendDeck(cards, style, count = 6) {
  const weights = STYLE_TYPE_WEIGHTS[style] ?? {}
  return [...cards]
    .map((card) => ({ card, weight: weights[card.type] ?? 0 }))
    .sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight
      const rarityDiff = (RARITY_ORDER[b.card.rarity] ?? 0) - (RARITY_ORDER[a.card.rarity] ?? 0)
      if (rarityDiff !== 0) return rarityDiff
      return (b.card.level ?? 0) - (a.card.level ?? 0)
    })
    .slice(0, count)
    .map((entry) => entry.card)
}
