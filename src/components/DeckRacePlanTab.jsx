import { useMemo, useState } from 'react'
import { DISTANCES, STYLES, STYLE_LABELS, isWeakGrade } from '../lib/constants'
import { recommendDeck } from '../lib/deckLogic'
import { RACE_PLANS, SKILL_PRIORITIES } from '../lib/racePlans'

export default function DeckRacePlanTab({ horses, cards, onAddAgendaTasks }) {
  const [horseId, setHorseId] = useState(horses[0]?.id ?? '')
  const [style, setStyle] = useState('Nige')
  const [distance, setDistance] = useState('Mile')

  const horse = useMemo(() => horses.find((h) => h.id === horseId) ?? null, [horses, horseId])
  const deck = useMemo(() => recommendDeck(cards, style, 6), [cards, style])
  const styleGrade = horse?.styleApt?.[style] ?? null
  const distanceGrade = horse?.aptitudes?.[distance] ?? null
  const weakStyle = styleGrade ? isWeakGrade(styleGrade) : false
  const weakDistance = distanceGrade ? isWeakGrade(distanceGrade) : false

  function addAllSkills() {
    const texts = SKILL_PRIORITIES[style].map((s) => `[${STYLE_LABELS[style]}] ${s.category} — ${s.rationale}`)
    onAddAgendaTasks(texts, horseId || null)
  }

  return (
    <div>
      <div className="selector-row">
        <div className="grade-field">
          <label className="label-micro">Horse</label>
          <select className="ax-input" value={horseId} onChange={(e) => setHorseId(e.target.value)}>
            <option value="">— none —</option>
            {horses.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
        <div className="grade-field">
          <label className="label-micro">Running style</label>
          <select className="ax-input" value={style} onChange={(e) => setStyle(e.target.value)}>
            {STYLES.map((s) => (
              <option key={s} value={s}>{STYLE_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div className="grade-field">
          <label className="label-micro">Distance</label>
          <select className="ax-input" value={distance} onChange={(e) => setDistance(e.target.value)}>
            {DISTANCES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {horse && (
        <div className="ax-card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 12 }}>Aptitude summary for {horse.name}</h3>
          <div className="ks-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: (weakStyle || weakDistance) ? 12 : 0 }}>
            <div className="ax-stat ax-stat--bordered" style={{ minWidth: 120 }}>
              <div className="ax-stat-value">{styleGrade}</div>
              <div className="ax-stat-label">{STYLE_LABELS[style]} aptitude</div>
            </div>
            <div className="ax-stat ax-stat--bordered ax-stat--sp2" style={{ minWidth: 120 }}>
              <div className="ax-stat-value">{distanceGrade}</div>
              <div className="ax-stat-label">{distance} aptitude</div>
            </div>
          </div>
          {(weakStyle || weakDistance) && (
            <p className="ax-meta" style={{ color: 'var(--error)' }}>
              ⚠ {horse.name} has weak {weakStyle ? `${STYLE_LABELS[style]} style` : ''}{weakStyle && weakDistance ? ' and ' : ''}{weakDistance ? `${distance} distance` : ''} aptitude ({weakStyle ? styleGrade : distanceGrade} grade) — expect a harder race in this matchup.
            </p>
          )}
        </div>
      )}

      <div className="form-grid-2">
        <div className="ax-card">
          <h3 style={{ marginBottom: 10 }}>Race plan — {STYLE_LABELS[style]}</h3>
          <p>{RACE_PLANS[style]}</p>
        </div>

        <div className="ax-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3>Skills to prioritize</h3>
            <button className="ax-btn" onClick={addAllSkills}>+ Add to agenda</button>
          </div>
          <div className="skill-list">
            {SKILL_PRIORITIES[style].map((s) => (
              <div className="skill-item" key={s.category}>
                <div>
                  <div className="text-body" style={{ fontWeight: 600 }}>{s.category}</div>
                  <div className="ax-meta">{s.rationale}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className="section-heading">Recommended support deck</h3>
      {deck.length === 0 ? (
        <div className="ax-card"><div className="ax-empty">No cards in your library yet — add some in Card Library.</div></div>
      ) : (
        <div className="deck-grid">
          {deck.map((c) => (
            <div className="deck-slot" key={c.id}>
              <div className="ax-badge" style={{ marginBottom: 6 }}>{c.rarity}</div>
              <div className="text-body" style={{ fontWeight: 600 }}>{c.name}</div>
              <div className="ax-meta">{c.type} · Lv.{c.level}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
