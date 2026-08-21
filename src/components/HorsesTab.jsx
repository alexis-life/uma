import { useState, useMemo } from 'react'
import { DISTANCES, STYLES, STYLE_LABELS, GRADES, TALENT_RANKS, DEFAULT_TALENT_RANK, gradeIndex, defaultAptitudes, defaultStyleApt } from '../lib/constants'
import { makeId } from '../lib/storage'
import { buildTraineeRoster, TRAINEE_APTITUDES } from '../lib/seedHorses'
import { parseGametoraCollection, resolveCharCards } from '../lib/gametoraImport'

function isUntouchedDefault(horse) {
  return (
    DISTANCES.every((d) => horse.aptitudes[d] === 'B') &&
    STYLES.every((s) => horse.styleApt[s] === 'B')
  )
}

function bestStyle(styleApt) {
  let best = null
  let bestIdx = Infinity
  for (const style of STYLES) {
    const idx = gradeIndex(styleApt[style])
    if (idx < bestIdx) {
      bestIdx = idx
      best = [style]
    } else if (idx === bestIdx) {
      best.push(style)
    }
  }
  return { styles: best ?? [], grade: GRADES[bestIdx] ?? null }
}

function charArtUrl(cardId) {
  if (!cardId) return null
  const charId = Math.floor(cardId / 100)
  return `https://gametora.com/images/umamusume/characters/thumb/chara_stand_${charId}_${cardId}.png`
}

export default function HorsesTab({ horses, setHorses, readOnly = false }) {
  const [selectedId, setSelectedId] = useState(horses[0]?.id ?? null)
  const selected = useMemo(() => horses.find((h) => h.id === selectedId) ?? null, [horses, selectedId])
  const [gtText, setGtText] = useState('')
  const [gtResult, setGtResult] = useState(null)

  function addHorse() {
    const horse = {
      id: makeId(),
      name: 'New Trainee',
      talentRank: DEFAULT_TALENT_RANK,
      cardId: null,
      aptitudes: defaultAptitudes('B'),
      styleApt: defaultStyleApt('B'),
    }
    setHorses((prev) => [...prev, horse])
    setSelectedId(horse.id)
  }

  function importTrainees() {
    const existingNames = new Set(horses.map((h) => h.name))
    const toAdd = buildTraineeRoster().filter((h) => !existingNames.has(h.name))

    // Horses already in the roster with untouched default (all-B) grades, an
    // unset talent rank, or a missing cardId get upgraded/backfilled too —
    // anything manually edited away from the default is left alone.
    setHorses((prev) =>
      prev.map((h) => {
        const real = TRAINEE_APTITUDES[h.name]
        if (!real) return h
        const patch = {}
        if (isUntouchedDefault(h)) {
          patch.aptitudes = real.aptitudes
          patch.styleApt = real.styleApt
        }
        if ((h.talentRank ?? DEFAULT_TALENT_RANK) === DEFAULT_TALENT_RANK) {
          patch.talentRank = real.talentRank
        }
        if (!h.cardId && real.cardId) {
          patch.cardId = real.cardId
        }
        return Object.keys(patch).length > 0 ? { ...h, ...patch } : h
      }).concat(toAdd),
    )
    if (toAdd.length > 0) setSelectedId((prev) => prev ?? toAdd[0].id)
  }

  function importGametoraExport() {
    let en
    try {
      en = parseGametoraCollection(gtText)
    } catch (err) {
      setGtResult({ error: err.message })
      return
    }
    const { resolved, unresolved } = resolveCharCards(en)
    let added = 0
    let updated = 0
    setHorses((prev) => {
      const next = [...prev]
      for (const r of resolved) {
        const idx = next.findIndex((h) => h.cardId === r.cardId || h.name === r.name)
        if (idx === -1) {
          next.push({ id: makeId(), name: r.name, talentRank: r.talentRank, cardId: r.cardId, aptitudes: r.aptitudes, styleApt: r.styleApt })
          added++
        } else {
          next[idx] = { ...next[idx], cardId: r.cardId, talentRank: r.talentRank, aptitudes: r.aptitudes, styleApt: r.styleApt }
          updated++
        }
      }
      return next
    })
    setGtResult({ added, updated, unresolved: unresolved.length })
    setGtText('')
  }

  function updateSelected(patch) {
    setHorses((prev) => prev.map((h) => (h.id === selectedId ? { ...h, ...patch } : h)))
  }

  function updateTalentRank(rank) {
    updateSelected({ talentRank: Number(rank) })
  }

  function removeSelected() {
    if (!window.confirm(`Remove ${selected.name}? This can't be undone.`)) return
    setHorses((prev) => prev.filter((h) => h.id !== selectedId))
    setSelectedId(null)
  }

  return (
    <div>
      <div className="ax-header-actions" style={{ padding: 0, marginBottom: 20 }}>
        {!readOnly && (
          <>
            <button className="ax-btn ax-btn--solid" onClick={addHorse}>+ Add horse</button>
            <button className="ax-btn" onClick={importTrainees}>Import my trainees</button>
          </>
        )}
        <span className="ax-meta">{horses.length} in roster</span>
      </div>

      {!readOnly && (
        <div className="ax-card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 6 }}>Update from GameTora export</h3>
          <p className="ax-meta" style={{ marginBottom: 10 }}>
            Paste a fresh GameTora collection export to add new trainees and refresh trained aptitude/talent rank for
            existing ones by their card ID — safe to re-run any time you pull.
          </p>
          <textarea
            className="ax-input"
            style={{ width: '100%', minHeight: 70, borderRadius: 'var(--radius-md)', resize: 'vertical' }}
            placeholder='{"app":"gametora","game":"umamusume","type":"collection",...}'
            value={gtText}
            onChange={(e) => setGtText(e.target.value)}
          />
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button className="ax-btn ax-btn--solid" onClick={importGametoraExport} disabled={!gtText.trim()}>Import export</button>
            {gtResult && (
              <span className="ax-meta">
                {gtResult.error
                  ? gtResult.error
                  : `Added ${gtResult.added}, updated ${gtResult.updated}${gtResult.unresolved ? `, ${gtResult.unresolved} not recognized yet` : ''}.`}
              </span>
            )}
          </div>
        </div>
      )}

      {horses.length === 0 ? (
        <div className="ax-card"><div className="ax-empty">No horses yet. Add one or import your trainees.</div></div>
      ) : (
        <div className="horse-gallery" style={{ marginBottom: 20 }}>
          {[...horses].sort((a, b) => a.name.localeCompare(b.name)).map((h) => (
            <button
              key={h.id}
              className={`horse-tile${h.id === selectedId ? ' is-active' : ''}`}
              onClick={() => setSelectedId(h.id)}
            >
              {charArtUrl(h.cardId) ? (
                <img
                  src={charArtUrl(h.cardId)}
                  alt=""
                  className="horse-tile-art"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <div className="horse-tile-art" />
              )}
              <span className="horse-tile-name">{h.name}</span>
              <span className="ax-badge">★{h.talentRank ?? DEFAULT_TALENT_RANK}</span>
            </button>
          ))}
        </div>
      )}

      <div className="horses-layout">
        <div className="ax-card">
          {!selected ? (
            <div className="ax-empty">Select a horse to view or edit its aptitudes.</div>
          ) : (
            <>
              <div className="form-grid-2" style={{ marginBottom: 0 }}>
                <div className="form-row">
                  <label className="label-micro">Name</label>
                  <input
                    className="ax-input"
                    type="text"
                    value={selected.name}
                    onChange={(e) => updateSelected({ name: e.target.value })}
                    disabled={readOnly}
                  />
                </div>
                <div className="form-row">
                  <label className="label-micro">Talent rank</label>
                  <select className="ax-input" value={selected.talentRank ?? DEFAULT_TALENT_RANK} onChange={(e) => updateTalentRank(e.target.value)} disabled={readOnly}>
                    {TALENT_RANKS.map((r) => (
                      <option key={r} value={r}>{'★'.repeat(r)} ({r})</option>
                    ))}
                  </select>
                </div>
              </div>

              {charArtUrl(selected.cardId) && (
                <img
                  src={charArtUrl(selected.cardId)}
                  alt={selected.name}
                  className="horse-art"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              )}

              <h3 style={{ marginBottom: 10 }}>Distance aptitude</h3>
              <div className="grade-grid" style={{ marginBottom: 20 }}>
                {DISTANCES.map((d) => (
                  <div className="grade-field" key={d}>
                    <label className="label-micro">{d}</label>
                    <div className="ax-input grade-display">{selected.aptitudes[d]}</div>
                  </div>
                ))}
              </div>

              <h3 style={{ marginBottom: 10 }}>Running-style aptitude</h3>
              <div className="grade-grid" style={{ marginBottom: 20 }}>
                {STYLES.map((s) => (
                  <div className="grade-field" key={s}>
                    <label className="label-micro">{STYLE_LABELS[s]}</label>
                    <div className="ax-input grade-display">{selected.styleApt[s]}</div>
                  </div>
                ))}
              </div>

              <div className="ax-section-bar--light ax-section-bar" style={{ justifyContent: 'flex-start', marginBottom: 20 }}>
                Best style: {bestStyle(selected.styleApt).styles.map((s) => STYLE_LABELS[s]).join(' / ')} ({bestStyle(selected.styleApt).grade})
              </div>

              {!readOnly && <button className="ax-btn" onClick={removeSelected}>Remove horse</button>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
