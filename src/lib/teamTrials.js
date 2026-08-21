// Durable roster-building rules — not tied to any particular scenario or
// support card lineup, sourced from uma.guide's Team Trials guides.
export const GENERAL_PRINCIPLES = [
  {
    title: 'Diversify running styles per category',
    detail: "Each of the 3 slots in a distance category should run a different style. Overlapping styles forfeit the Good Positioning Bonus — worth up to 3000 points per Uma.",
  },
  {
    title: 'Prioritize reliable Unique Skill activation',
    detail: 'Veterans with strict placement-condition Uniques (e.g. must finish 1st) are unreliable scorers. Consistent or unconditional Uniques matter more than raw stats.',
  },
  {
    title: 'Raise aptitude grades',
    detail: "Higher aptitude directly raises your Team Rating, which raises the Opponent Rating Bonus — the single biggest score multiplier in Team Trials.",
  },
  {
    title: 'Set your best scorer as Ace',
    detail: 'The top slot in each category is the Ace and gets a flat +10% score bonus. Check Race History → Score Info to see which Veteran actually scores highest.',
  },
  {
    title: 'Cover stamina on Medium/Long',
    detail: 'Longer distances need reliable stamina recovery. Veterans with stamina-recovery Uniques can skip a dedicated Stamina card slot entirely.',
  },
  {
    title: 'Fill single-aptitude Umas first',
    detail: 'Early on, slot in Umas who are only good at one distance first, then use flexible multi-aptitude Umas to patch remaining gaps.',
  },
]

// Current-meta snapshot — this WILL go stale as the game updates. Treat it
// as a dated reference, not a permanent recommendation.
export const CURRENT_META = {
  asOf: 'August 2026',
  notes: [
    'Unity Cup is the strongest scenario for training Team Trials Veterans right now — it provides 2-3 Gold Skill procs and rewards Wit-heavy decks (1600+ Wit), unlike Trackblazer which needs an Uma with diverse distance aptitudes.',
    'Summer Gold Ship is a defining meta pick: her Adventure of 564 activates two Gold Skills in the second half of the race. Teams generally want at least one Veteran carrying an inherited Adventure of 564.',
  ],
  cards: [
    { name: 'Riko Kashimoto', note: 'Support chain grants Rushing Gale! and helps meet stamina requirements.' },
    { name: 'Kawakami Princess', note: 'Usable on anyone even at no uncaps; chain rewards Center Stage, a cheap no-requirement Gold Skill.' },
    { name: 'Narita Top Road', note: 'Reliably activates Firm Course Menace — most TT tracks run Firm conditions.' },
    { name: 'Marvelous Sunday', note: '15% Race Bonus plus Fast & Furious.' },
    { name: 'Yaeno Muteki', note: "Provides a strong skill kit including It's On!." },
    { name: 'Sakura Chiyono O', note: 'Consistently activating Speed Star plus 15% Race Bonus.' },
    { name: 'Silence Suzuka', note: 'Concentration helps early positioning consistently.' },
    { name: 'Ikuno Dictus', note: '15% Race Bonus plus Studious, which activates with no positional requirement.' },
    { name: 'Curren Chan', note: 'SSR usable on any Sprint Uma; Perfect Prep! procs consistently with no style/position requirement.' },
    { name: 'Mejiro Dober', note: 'SSR usable on any Late Surger; chain rewards The Bigger Picture, a cheap consistent Gold Skill.' },
    { name: 'Heirs to the Throne', note: 'Recreation events grant stats and Skill Points; provides Refraction Arc, usable anywhere via 564.' },
  ],
}
