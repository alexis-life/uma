import { GAMETORA_SUPPORTS } from './gametoraSupportDb'
import { GAMETORA_CHARACTERS } from './gametoraCharacterDb'

const supportByTid = Object.fromEntries(GAMETORA_SUPPORTS.map((c) => [c.tid, c]))
const charByTid = Object.fromEntries(GAMETORA_CHARACTERS.map((c) => [c.tid, c]))

export function parseGametoraCollection(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('That’s not valid JSON.')
  }
  if (data?.app !== 'gametora' || data?.type !== 'collection') {
    throw new Error('This doesn’t look like a GameTora collection export.')
  }
  const en = data.servers?.en
  if (!en) throw new Error('No "en" server data found in this export.')
  return en
}

// Returns { resolved, unresolved } for support cards (uma_cards).
// unresolved tids are ones our bundled database doesn't recognize yet
// (brand-new content, or a card type we don't track like "group").
export function resolveSupports(en) {
  const resolved = []
  const unresolved = []
  for (const [tid, value] of Object.entries(en.supports || {})) {
    const card = supportByTid[tid]
    if (!card) {
      unresolved.push(tid)
      continue
    }
    const limitBreak = Array.isArray(value) ? value[0] : value
    resolved.push({
      supportId: card.supportId,
      name: card.name,
      type: card.type,
      rarity: card.rarity,
      limitBreak,
    })
  }
  return { resolved, unresolved }
}

// Returns { resolved, unresolved } for character/trainee cards (uma_horses).
export function resolveCharCards(en) {
  const resolved = []
  const unresolved = []
  for (const [tid, value] of Object.entries(en.charCards || {})) {
    const card = charByTid[tid]
    if (!card) {
      unresolved.push(tid)
      continue
    }
    const talentRank = Array.isArray(value) ? value[0] : value
    resolved.push({
      cardId: card.cardId,
      charId: card.charId,
      name: `${card.baseName} ${card.title}`,
      aptitudes: card.aptitudes,
      styleApt: card.styleApt,
      talentRank,
    })
  }
  return { resolved, unresolved }
}
