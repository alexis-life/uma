export const GRADES = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']

export const DISTANCES = ['Sprint', 'Mile', 'Medium', 'Long', 'Dirt']

export const STYLES = ['Nige', 'Senkou', 'Sashi', 'Oikomi']

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
