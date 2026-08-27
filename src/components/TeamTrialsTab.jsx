import { useState } from 'react'
import { DISTANCES, STYLES, STYLE_LABELS, GRADES, isWeakGrade } from '../lib/constants'
import { makeId } from '../lib/storage'
import { GENERAL_PRINCIPLES, CURRENT_META, META_VETERAN_PICKS, PARENTING_PRINCIPLES, RATING_TIERS } from '../lib/teamTrials'

const SLOT_COUNT = 3

function emptyDraft(distanceCategory) {
  return {
    id: null,
    horseId: '',
    name: '',
    distanceCategory,
    style: STYLES[0],
    distanceGrade: 'A',
    styleGrade: 'A',
    turfGrade: 'A',
    dirtGrade: 'G',
    isAce: false,
    reliableUnique: true,
    notes: '',
  }
}

export default function TeamTrialsTab({ veterans, setVeterans, horses, cards, readOnly = false }) {
  const [draft, setDraft] = useState(null)

  const ownedCardNames = cards.map((c) => c.name)
  function ownsMetaCard(metaName) {
    return ownedCardNames.some((n) => n.startsWith(metaName))
  }

  const ownedHorseNames = horses.map((h) => h.name)
  function ownsHorseNamed(metaName) {
    return ownedHorseNames.some((n) => n.startsWith(metaName))
  }

  function veteransFor(distanceCategory) {
    return veterans.filter((v) => v.distanceCategory === distanceCategory)
  }

  function openAdd(distanceCategory) {
    setDraft(emptyDraft(distanceCategory))
  }

  function openEdit(veteran) {
    setDraft({ ...veteran })
  }

  function closeDraft() {
    setDraft(null)
  }

  function saveDraft() {
    if (!draft.name.trim()) return
    if (draft.id) {
      setVeterans((prev) => prev.map((v) => (v.id === draft.id ? { ...draft } : v)))
    } else {
      setVeterans((prev) => [...prev, { ...draft, id: makeId() }])
    }
    setDraft(null)
  }

  function removeDraft() {
    if (!draft.id) return
    if (!window.confirm(`Remove ${draft.name} from your Team Trials roster?`)) return
    setVeterans((prev) => prev.filter((v) => v.id !== draft.id))
    setDraft(null)
  }

  function pickHorse(horseId) {
    const horse = horses.find((h) => h.id === horseId)
    setDraft((d) => ({ ...d, horseId, name: horse ? horse.name : d.name }))
  }

  return (
    <div>
      <h3 className="section-heading">Roster gaps &amp; suggestions</h3>
      <div className="ax-card" style={{ marginBottom: 28 }}>
        <div className="tt-suggestions">
          {DISTANCES.map((distance) => {
            const list = veteransFor(distance)
            const styleCounts = {}
            list.forEach((v) => { styleCounts[v.style] = (styleCounts[v.style] ?? 0) + 1 })
            const overlap = Object.values(styleCounts).some((n) => n > 1)
            const weak = list.filter((v) => isWeakGrade(v.distanceGrade) || isWeakGrade(v.styleGrade))
            const hasAce = list.some((v) => v.isAce)
            const unreliable = list.filter((v) => !v.reliableUnique)

            const notes = []
            if (list.length < SLOT_COUNT) notes.push(`${SLOT_COUNT - list.length} open slot${SLOT_COUNT - list.length > 1 ? 's' : ''}`)
            if (overlap) notes.push('running styles overlap — losing Good Positioning Bonus')
            if (list.length > 0 && !hasAce) notes.push('no Ace set')
            weak.forEach((v) => notes.push(`${v.name} has a weak aptitude grade`))
            unreliable.forEach((v) => notes.push(`${v.name}'s Unique isn't marked reliable`))

            return (
              <div className="tt-suggestion-row" key={distance}>
                <span className="ax-badge">{distance}</span>
                {notes.length === 0 ? (
                  <span className="ax-meta">Looks solid — {list.length}/{SLOT_COUNT} filled.</span>
                ) : (
                  <span className="ax-meta">{notes.join(' · ')}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <h3 className="section-heading">Meta veteran picks <span className="ax-meta">(as of {CURRENT_META.asOf} — community Team Trials Guide)</span></h3>
      <div className="form-grid-2" style={{ marginBottom: 28 }}>
        {META_VETERAN_PICKS.map((entry) => (
          <div className="ax-card" key={entry.distance}>
            <h3 style={{ marginBottom: 10 }}>{entry.distance}</h3>
            {[['core', 'F2P / low investment'], ['whale', 'Whale / 3★']].map(([tier, label]) => (
              <div key={tier} style={{ marginBottom: tier === 'core' ? 14 : 0 }}>
                <div className="label-micro" style={{ marginBottom: 6 }}>{label}</div>
                {entry[tier].map((pick) => (
                  <div key={pick.style} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                      <span className="ax-meta">{pick.style}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="text-body" style={{ fontWeight: 600 }}>{pick.name}</span>
                        {ownsHorseNamed(pick.name) && <span className="ax-badge">Owned</span>}
                      </span>
                    </div>
                    <div className="ax-meta" style={{ fontSize: '0.72rem' }}>{pick.note}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {DISTANCES.map((distance) => {
        const list = veteransFor(distance)
        return (
          <div key={distance} style={{ marginBottom: 28 }}>
            <div className="tt-category-header">
              <h3>{distance}</h3>
              <span className="ax-meta">{list.length}/{SLOT_COUNT} filled</span>
            </div>
            <div className="tt-slot-row">
              {Array.from({ length: SLOT_COUNT }).map((_, i) => {
                const veteran = list[i]
                if (!veteran) {
                  return readOnly ? (
                    <div key={i} className="tt-slot tt-slot--empty">Empty</div>
                  ) : (
                    <button key={i} className="tt-slot tt-slot--empty" onClick={() => openAdd(distance)}>
                      + Add veteran
                    </button>
                  )
                }
                const weakDistance = isWeakGrade(veteran.distanceGrade)
                const weakStyle = isWeakGrade(veteran.styleGrade)
                const weakTurf = isWeakGrade(veteran.turfGrade)
                const weakDirt = isWeakGrade(veteran.dirtGrade)
                return (
                  <button key={veteran.id} className="tt-slot" onClick={() => openEdit(veteran)}>
                    {veteran.isAce && <span className="ax-badge tt-ace-badge">Ace</span>}
                    <div className="text-body" style={{ fontWeight: 600 }}>{veteran.name}</div>
                    <div className="ax-meta">{STYLE_LABELS[veteran.style]}</div>
                    <div className="tt-slot-grades">
                      <span className={`ax-badge${veteran.distanceGrade === 'S' ? ' race-grade-s' : weakDistance ? ' race-grade-weak' : ''}`}>{distance} {veteran.distanceGrade}</span>
                      <span className={`ax-badge${veteran.styleGrade === 'S' ? ' race-grade-s' : weakStyle ? ' race-grade-weak' : ''}`}>{STYLE_LABELS[veteran.style]} {veteran.styleGrade}</span>
                      <span className={`ax-badge${veteran.turfGrade === 'S' ? ' race-grade-s' : weakTurf ? ' race-grade-weak' : ''}`}>Turf {veteran.turfGrade}</span>
                      <span className={`ax-badge${veteran.dirtGrade === 'S' ? ' race-grade-s' : weakDirt ? ' race-grade-weak' : ''}`}>Dirt {veteran.dirtGrade}</span>
                    </div>
                    {!veteran.reliableUnique && <div className="ax-meta" style={{ color: 'var(--error)' }}>⚠ unreliable Unique</div>}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {draft && (
        <div className="ax-card tt-editor">
          <h3 style={{ marginBottom: 16 }}>{draft.id ? 'Edit' : 'Add'} veteran — {draft.distanceCategory}</h3>

          <div className="form-grid-2">
            <div className="form-row">
              <label className="label-micro">Link to a horse (optional)</label>
              <select className="ax-input" value={draft.horseId} onChange={(e) => pickHorse(e.target.value)} disabled={readOnly}>
                <option value="">— none —</option>
                {[...horses].sort((a, b) => a.name.localeCompare(b.name)).map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label className="label-micro">Name</label>
              <input
                className="ax-input"
                type="text"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-row">
              <label className="label-micro">Running style</label>
              <select className="ax-input" value={draft.style} onChange={(e) => setDraft((d) => ({ ...d, style: e.target.value }))} disabled={readOnly}>
                {STYLES.map((s) => (
                  <option key={s} value={s}>{STYLE_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label className="label-micro">Distance category</label>
              <select className="ax-input" value={draft.distanceCategory} onChange={(e) => setDraft((d) => ({ ...d, distanceCategory: e.target.value }))} disabled={readOnly}>
                {DISTANCES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-row">
              <label className="label-micro">Turf aptitude (trained)</label>
              <select className="ax-input" value={draft.turfGrade} onChange={(e) => setDraft((d) => ({ ...d, turfGrade: e.target.value }))} disabled={readOnly}>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label className="label-micro">Dirt aptitude (trained)</label>
              <select className="ax-input" value={draft.dirtGrade} onChange={(e) => setDraft((d) => ({ ...d, dirtGrade: e.target.value }))} disabled={readOnly}>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label className="label-micro">{STYLE_LABELS[draft.style]} aptitude (trained)</label>
              <select className="ax-input" value={draft.styleGrade} onChange={(e) => setDraft((d) => ({ ...d, styleGrade: e.target.value }))} disabled={readOnly}>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label className="label-micro">{draft.distanceCategory} aptitude (trained)</label>
              <select className="ax-input" value={draft.distanceGrade} onChange={(e) => setDraft((d) => ({ ...d, distanceGrade: e.target.value }))} disabled={readOnly}>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
            <label className="ax-chip" style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={draft.isAce} onChange={(e) => setDraft((d) => ({ ...d, isAce: e.target.checked }))} style={{ marginRight: 6 }} disabled={readOnly} />
              Ace (top slot, +10% score)
            </label>
            <label className="ax-chip" style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={draft.reliableUnique} onChange={(e) => setDraft((d) => ({ ...d, reliableUnique: e.target.checked }))} style={{ marginRight: 6 }} disabled={readOnly} />
              Reliable Unique activation
            </label>
          </div>

          <div className="form-row">
            <label className="label-micro">Notes</label>
            <textarea
              className="ax-input"
              style={{ width: '100%', minHeight: 60, borderRadius: 'var(--radius-md)', resize: 'vertical' }}
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              placeholder="Inherited unique, stamina recovery, etc."
              disabled={readOnly}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {!readOnly && <button className="ax-btn ax-btn--solid" onClick={saveDraft}>Save</button>}
            <button className="ax-btn" onClick={closeDraft}>{readOnly ? 'Close' : 'Cancel'}</button>
            {!readOnly && draft.id && <button className="ax-btn" onClick={removeDraft}>Remove</button>}
          </div>
        </div>
      )}

      <h3 className="section-heading">Building good parents <span className="ax-meta">(sparks &amp; inheritance mechanics)</span></h3>
      <div className="form-grid-2" style={{ marginBottom: 16 }}>
        {PARENTING_PRINCIPLES.map((p) => (
          <div className="ax-card" key={p.title}>
            <h3 style={{ marginBottom: 6 }}>{p.title}</h3>
            <p className="ax-meta">{p.detail}</p>
          </div>
        ))}
      </div>
      <div className="ax-card card-table-wrap" style={{ padding: 0, marginBottom: 28 }}>
        <table>
          <thead>
            <tr>
              <th>Rating</th>
              <th>Range</th>
              <th>1★</th>
              <th>2★</th>
              <th>3★</th>
            </tr>
          </thead>
          <tbody>
            {RATING_TIERS.map((t) => (
              <tr key={t.label}>
                <td>{t.label}</td>
                <td className="ax-meta">{t.range}</td>
                <td>{t.odds1}</td>
                <td>{t.odds2}</td>
                <td>{t.odds3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="section-heading">General principles</h3>
      <div className="form-grid-2" style={{ marginBottom: 28 }}>
        {GENERAL_PRINCIPLES.map((p) => (
          <div className="ax-card" key={p.title}>
            <h3 style={{ marginBottom: 6 }}>{p.title}</h3>
            <p className="ax-meta">{p.detail}</p>
          </div>
        ))}
      </div>

      <h3 className="section-heading">Current meta <span className="ax-meta">(as of {CURRENT_META.asOf} — will go stale, double check on uma.guide)</span></h3>
      <div className="ax-card" style={{ marginBottom: 16 }}>
        {CURRENT_META.notes.map((n) => (
          <p key={n} style={{ marginBottom: 10 }}>{n}</p>
        ))}
      </div>
      <div className="ax-card card-table-wrap" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Support card</th>
              <th>Why</th>
              <th>In your library?</th>
            </tr>
          </thead>
          <tbody>
            {CURRENT_META.cards.map((c) => (
              <tr key={c.name}>
                <td>{c.name}</td>
                <td className="ax-meta">{c.note}</td>
                <td>{ownsMetaCard(c.name) ? <span className="ax-badge">Owned</span> : <span className="ax-meta">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
