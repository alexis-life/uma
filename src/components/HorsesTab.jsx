import { useState, useMemo } from 'react'
import { DISTANCES, STYLES, GRADES, gradeIndex, defaultAptitudes, defaultStyleApt } from '../lib/constants'
import { makeId } from '../lib/storage'
import { buildTraineeRoster, TRAINEE_APTITUDES } from '../lib/seedHorses'

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

export default function HorsesTab({ horses, setHorses }) {
  const [selectedId, setSelectedId] = useState(horses[0]?.id ?? null)
  const selected = useMemo(() => horses.find((h) => h.id === selectedId) ?? null, [horses, selectedId])

  function addHorse() {
    const horse = {
      id: makeId(),
      name: 'New Trainee',
      aptitudes: defaultAptitudes('B'),
      styleApt: defaultStyleApt('B'),
    }
    setHorses((prev) => [...prev, horse])
    setSelectedId(horse.id)
  }

  function importTrainees() {
    const existingNames = new Set(horses.map((h) => h.name))
    const toAdd = buildTraineeRoster().filter((h) => !existingNames.has(h.name))

    // Horses already in the roster with untouched default (all-B) grades get
    // upgraded to real aptitude data too — anything manually edited is left alone.
    setHorses((prev) =>
      prev.map((h) => {
        const real = TRAINEE_APTITUDES[h.name]
        if (!real || !isUntouchedDefault(h)) return h
        return { ...h, aptitudes: real.aptitudes, styleApt: real.styleApt }
      }).concat(toAdd),
    )
    if (toAdd.length > 0) setSelectedId((prev) => prev ?? toAdd[0].id)
  }

  function updateSelected(patch) {
    setHorses((prev) => prev.map((h) => (h.id === selectedId ? { ...h, ...patch } : h)))
  }

  function updateAptitude(distance, grade) {
    updateSelected({ aptitudes: { ...selected.aptitudes, [distance]: grade } })
  }

  function updateStyleApt(style, grade) {
    updateSelected({ styleApt: { ...selected.styleApt, [style]: grade } })
  }

  function removeSelected() {
    setHorses((prev) => prev.filter((h) => h.id !== selectedId))
    setSelectedId(null)
  }

  return (
    <div>
      <div className="ax-header-actions" style={{ padding: 0, marginBottom: 20 }}>
        <button className="ax-btn ax-btn--solid" onClick={addHorse}>+ Add horse</button>
        <button className="ax-btn" onClick={importTrainees}>Import my trainees</button>
        <span className="ax-meta">{horses.length} in roster</span>
      </div>

      <div className="horses-layout">
        <div className="ax-card" style={{ padding: 12 }}>
          {horses.length === 0 ? (
            <div className="ax-empty">No horses yet. Add one or import your trainees.</div>
          ) : (
            <div className="horse-list">
              {horses.map((h) => (
                <button
                  key={h.id}
                  className={`horse-list-item${h.id === selectedId ? ' is-active' : ''}`}
                  onClick={() => setSelectedId(h.id)}
                >
                  <span>{h.name}</span>
                  <span className="ax-badge">{bestStyle(h.styleApt).grade ?? '—'}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ax-card">
          {!selected ? (
            <div className="ax-empty">Select a horse to view or edit its aptitudes.</div>
          ) : (
            <>
              <div className="form-row">
                <label className="label-micro">Name</label>
                <input
                  className="ax-input"
                  type="text"
                  value={selected.name}
                  onChange={(e) => updateSelected({ name: e.target.value })}
                />
              </div>

              <h3 style={{ marginBottom: 10 }}>Distance aptitude</h3>
              <div className="grade-grid" style={{ marginBottom: 20 }}>
                {DISTANCES.map((d) => (
                  <div className="grade-field" key={d}>
                    <label className="label-micro">{d}</label>
                    <select className="ax-input" value={selected.aptitudes[d]} onChange={(e) => updateAptitude(d, e.target.value)}>
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <h3 style={{ marginBottom: 10 }}>Running-style aptitude</h3>
              <div className="grade-grid" style={{ marginBottom: 20 }}>
                {STYLES.map((s) => (
                  <div className="grade-field" key={s}>
                    <label className="label-micro">{s}</label>
                    <select className="ax-input" value={selected.styleApt[s]} onChange={(e) => updateStyleApt(s, e.target.value)}>
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="ax-section-bar--light ax-section-bar" style={{ justifyContent: 'flex-start', marginBottom: 20 }}>
                Best style: {bestStyle(selected.styleApt).styles.join(' / ')} ({bestStyle(selected.styleApt).grade})
              </div>

              <button className="ax-btn" onClick={removeSelected}>Remove horse</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
