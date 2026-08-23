import { defaultAptitudes, defaultStyleApt, DEFAULT_TALENT_RANK } from './constants'
import { makeId } from './storage'
import { GAMETORA_CHARACTERS } from './gametoraCharacterDb'

// Real talent ranks (1-5★) for the cards we've individually verified so far.
// Anything not listed here (mostly newly-added cards from the wider
// GameTora database) falls back to DEFAULT_TALENT_RANK — edit it in the
// Horses tab once you know the real value.
const TALENT_RANK_BY_CARD_ID = { 103201: 4, 101801: 4, 101802: 3, 102302: 3, 103801: 4, 100901: 4, 103702: 3, 101401: 4, 100501: 3, 100502: 3, 104001: 3, 104002: 3, 100701: 5, 101101: 4, 101102: 3, 105201: 4, 105202: 3, 101201: 3, 106101: 4, 100401: 3, 105601: 4, 105602: 3, 106201: 2, 102401: 4, 102402: 3, 101301: 4, 102701: 4, 102601: 3, 102602: 3, 101601: 4, 106001: 4, 100601: 3, 100602: 4, 103001: 3, 104101: 4, 106901: 3, 106701: 3, 102001: 3, 102002: 4, 100201: 3, 104601: 3, 100101: 3, 104501: 4, 101001: 3, 101502: 3, 100301: 3, 104801: 3, 100801: 4, 103501: 5 }

// A card's display name is just its base character name, unless that
// character has multiple costume cards bundled — then it's suffixed with
// the card's real event/support title so alts stay distinguishable
// (matches the same "Name [Title]" convention Card Library already uses).
const cardCountByName = {}
GAMETORA_CHARACTERS.forEach((c) => { cardCountByName[c.baseName] = (cardCountByName[c.baseName] ?? 0) + 1 })

function displayName(card) {
  return cardCountByName[card.baseName] > 1 ? `${card.baseName} ${card.title}` : card.baseName
}

export const TRAINEE_NAMES = GAMETORA_CHARACTERS.map(displayName).sort((a, b) => a.localeCompare(b))

export const TRAINEE_APTITUDES = Object.fromEntries(
  GAMETORA_CHARACTERS.map((card) => [
    displayName(card),
    {
      talentRank: TALENT_RANK_BY_CARD_ID[card.cardId] ?? DEFAULT_TALENT_RANK,
      cardId: card.cardId,
      aptitudes: card.aptitudes,
      styleApt: card.styleApt,
    },
  ]),
)

export function buildTraineeRoster() {
  return TRAINEE_NAMES.map((name) => {
    const real = TRAINEE_APTITUDES[name]
    return {
      id: makeId(),
      name,
      talentRank: real ? real.talentRank : DEFAULT_TALENT_RANK,
      cardId: real ? real.cardId : null,
      aptitudes: real ? real.aptitudes : defaultAptitudes('B'),
      styleApt: real ? real.styleApt : defaultStyleApt('B'),
    }
  })
}
