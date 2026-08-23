// Durable roster-building rules — sourced from uma.guide's Team Trials
// guides and the community Team Trials Guide (Google Doc, shared by the
// user, credited to rat/Pirkui/Derpie/Journey/vinje/Nole/Tsubaki/Zephirine/
// iljaaz/Something/Zazazulu/wunke/Svhiz/Koco/Neb and tsunbakii).
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
  {
    title: 'Skip dedicated Power/Stamina/Guts cards',
    detail: "These stats do virtually nothing for TT scoring directly — cover them with sparks/inheritance instead and spend deck slots on Speed and Wit cards (plus a pal card like Riko Kashimoto), which drive both rating and skill-point income.",
  },
  {
    title: "Don't over-train unused aptitudes",
    detail: "Keep aptitudes you won't race outside of B where possible (e.g. a Medium Uma's Long grade). Career-run Spirit Bursts weight toward your highest grades, so an unnecessary A crowds out hints for the style/distance skills you actually want.",
  },
]

// Current-meta snapshot — this WILL go stale as the game updates. Treat it
// as a dated reference, not a permanent recommendation.
export const CURRENT_META = {
  asOf: 'August 2026',
  notes: [
    'Unity Cup is the strongest scenario for training Team Trials Veterans right now — it provides 2-3 Gold Skill procs and rewards Wit-heavy decks (1600+ Wit), unlike Trackblazer which needs an Uma with diverse distance aptitudes.',
    'Summer Gold Ship is a defining meta pick: her Adventure of 564 activates two Gold Skills in the second half of the race. Teams generally want at least one Veteran carrying an inherited Adventure of 564.',
    "The standard high-investment deck is \"2 Speed 2 Wit\" built around Kitasan Black + Riko Kashimoto + Tazuna Hayakawa (the \"2.5 pal\" core, since Fuku's cost/failure-rate reduction acts like a third pal card without the recreation events) — Tazuna's Concentration alone is worth roughly two gold skills since it also raises Strong Start odds to ~50%.",
    "Common (white) skills are worth 500 base points, rare (gold) skills 1,200 — so 3 cheap whites usually outscore 1 pricier gold. Don't skip debuff skills like Subdued/Flustered/Hesitant just because they're not stat buffs; they still pay out if they trigger consistently.",
  ],
  cards: [
    { name: 'Kitasan Black', note: 'The core Speed staple — +3 hints into a strong skill pool; most decks are built around her.' },
    { name: 'Riko Kashimoto', note: 'Core pal card: Rushing Gale! gold skill, energy/failure-rate reduction, and enough stamina/guts to skip a dedicated Stamina card.' },
    { name: 'Tazuna Hayakawa', note: 'Concentration gold skill pushes Strong Start odds to ~50%, plus the cheap, consistent Tail Held High white skill.' },
    { name: 'Matikanefukukitaru (Speed)', note: 'Huge flat stat gains that open up more races; picking her team name grants Clairvoyance, a cheap gold skill (Medium only).' },
    { name: 'Mihono Bourbon (Wit, SSR Welfare)', note: 'BiS Wit card for Front Runners — Taking the Lead is a cheap gold skill that guarantees an early Good Positioning bonus.' },
    { name: 'Mejiro Dober (Wit, SSR Welfare)', note: 'BiS Wit card for Late Surgers — The Bigger Picture is cheap and consistent, and it\'s a free welfare card.' },
    { name: 'Fine Motion', note: 'One of the best Wit stat-sticks to borrow; strong, broadly relevant hint pool even outside Pace Chaser.' },
    { name: 'Kawakami Princess', note: 'Center Stage is a cheap gold skill with no distance/style requirement — usable on any Uma.' },
    { name: 'Sakura Bakushin O', note: 'Strong Sprint Speed statstick — 10% Race Bonus, 10% Training Effectiveness, and a sprint-relevant hint pool.' },
    { name: 'Marvelous Sunday', note: 'F2P Wit staple — near-universal hint pool despite weak Wit training itself; 10% Race Bonus.' },
    { name: 'Curren Chan', note: 'Sprint Wit specialist — Perfect Prep! is cheap and triggers with no style/position requirement.' },
  ],
}

// Meta veteran picks per distance category, from the Team Trials Guide's
// Team Building section. "core" picks are meta at essentially any
// investment level; "whale" swaps require 3-star/whale-tier trainees.
export const META_VETERAN_PICKS = [
  {
    distance: 'Sprint',
    core: [
      { style: 'Front Runner', name: 'Sakura Bakushin O', note: 'Natural Sprint A; strong growths make her an easy rating pad.' },
      { style: 'Pace Chaser', name: 'Air Groove', note: 'Needs a Sprint parent (Sprint C native) but very consistent once built.' },
      { style: 'Late Surger', name: 'King Halo', note: 'Natural Sprint A; unique gets more consistent against strong opponents.' },
    ],
    whale: [
      { style: 'Front Runner', name: 'Silence Suzuka', note: 'Needs ~7 Sprint sparks from D, but her unique + Concentration make her a top Ace pick.' },
      { style: 'Pace Chaser', name: 'Curren Chan', note: 'Or Sakura Bakushin O — both viable; Curren Chan needs a Mile-aptitude boost.' },
      { style: 'Late Surger', name: 'Air Groove', note: 'Unique triggers more consistently as Late Surger than Pace Chaser.' },
    ],
  },
  {
    distance: 'Mile',
    core: [
      { style: 'Front Runner', name: 'Daiwa Scarlet', note: 'Natural Mile A; lacks relevant skills in her own kit so lean on Daiwa Scarlet the support card for hints.' },
      { style: 'Pace Chaser', name: 'Vodka', note: 'Natural Mile A; needs one Pace spark to bring Pace B up to A.' },
      { style: 'Late Surger', name: 'Grass Wonder', note: 'Natural Mile A; consistent unique, good low-investment pick.' },
    ],
    whale: [
      { style: 'Front Runner', name: 'Maruzensky [Hot☆Summer Night]', note: 'Consistent unique with a reliable recovery skill.' },
      { style: 'Pace Chaser', name: 'Fuji Kiseki', note: 'Or Taiki Shuttle — Taiki leans more Dirt-relevant overall.' },
      { style: 'Late Surger', name: 'Vodka', note: 'Same as core pick — she holds her spot even at whale investment.' },
    ],
  },
  {
    distance: 'Medium',
    core: [
      { style: 'Front Runner', name: 'Mayano Top Gun', note: 'No real competition for the slot; flexible enough to fit any style if needed.' },
      { style: 'Pace Chaser', name: 'Agnes Tachyon', note: 'BiS at any investment level — built-in recovery + Speed growth make stamina a non-issue.' },
      { style: 'Late Surger', name: 'Winning Ticket', note: 'Beats out Nice Nature/Mejiro Ryan on kit despite an inconsistent unique; bring a stamina source since she has no recovery.' },
    ],
    whale: [
      { style: 'Front Runner', name: 'Mihono Bourbon', note: 'Innate skills + unique carry her once built, but career difficulty is high.' },
      { style: 'Pace Chaser', name: 'Agnes Tachyon', note: 'Still BiS — no whale-tier swap needed.' },
      { style: 'Late Surger', name: 'Mayano Top Gun [Sunlight Bouquet]', note: 'Contender for best TT Uma overall; semi-consistent Fast Learner access.' },
    ],
  },
  {
    distance: 'Long',
    core: [
      { style: 'Pace Chaser', name: 'Super Creek', note: 'BiS — huge recovery unique lets her ignore stamina almost entirely.' },
      { style: 'Late Surger', name: 'Matikanefukukitaru', note: 'Weakest of the trio (no innate recovery) but the best F2P Late option available.' },
      { style: 'End Closer', name: 'Gold Ship', note: 'BiS — very consistent unique and a kit built around catching up from behind.' },
    ],
    whale: [
      { style: 'Pace Chaser', name: 'Super Creek', note: 'Stays — no better alternative even at whale investment.' },
      { style: 'Front Runner or Late Surger', name: 'TM Opera O [New Year, Same Radiance!]', note: 'Very consistent unique; more optimal as Front Runner despite a native C aptitude there.' },
      { style: 'End Closer', name: 'Gold Ship', note: 'Stays — remains BiS.' },
    ],
  },
  {
    distance: 'Dirt',
    core: [
      { style: 'Pace Chaser', name: 'El Condor Pasa', note: 'Needs a Dirt spark (B→A); consistent unique once built.' },
      { style: 'Late Surger', name: 'Haru Urara', note: 'Needs a Mile spark; thin F2P options overall on Dirt.' },
    ],
    whale: [
      { style: 'Front Runner', name: 'Smart Falcon', note: 'BiS Front Runner/Dirt — raise Turf aptitude to at least C for easier career fan/SP gain.' },
      { style: 'Late Surger', name: 'Haru Urara [New Year ♪ New Urara!]', note: 'Comes with native Mile A, no longer needs the Mile spark her original outfit does.' },
      { style: 'End Closer', name: 'Agnes Digital', note: 'Needs one End spark (B→A); very consistent kit.' },
    ],
  },
]
