export const GRADES = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']

export const DISTANCES = ['Sprint', 'Mile', 'Medium', 'Long', 'Dirt']

export const STYLES = ['Nige', 'Senkou', 'Sashi', 'Oikomi']

// Display labels only — the keys above (Nige/Senkou/Sashi/Oikomi) stay as the
// data model everywhere (localStorage, seed data) so existing saved horses
// don't need a migration. Only what's shown on screen changes.
export const STYLE_LABELS = {
  Nige: 'Front Runner',
  Senkou: 'Pace Chaser',
  Sashi: 'Late Surger',
  Oikomi: 'End Closer',
}

export const TALENT_RANKS = [1, 2, 3, 4, 5]
export const DEFAULT_TALENT_RANK = 1

export const CARD_TYPES = ['speed', 'stamina', 'power', 'guts', 'wisdom', 'friend']

export const RARITIES = ['R', 'SR', 'SSR']

export const RARITY_ORDER = { R: 1, SR: 2, SSR: 3 }

export function gradeIndex(grade) {
  const i = GRADES.indexOf(grade)
  return i === -1 ? GRADES.length - 1 : i
}

export function isWeakGrade(grade) {
  return gradeIndex(grade) >= GRADES.indexOf('D')
}

export function defaultAptitudes(grade = 'B') {
  return Object.fromEntries(DISTANCES.map((d) => [d, grade]))
}

export function defaultStyleApt(grade = 'B') {
  return Object.fromEntries(STYLES.map((s) => [s, grade]))
}
