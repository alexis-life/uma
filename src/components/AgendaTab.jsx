import { useMemo, useState } from 'react'
import { G1_RACES } from '../lib/races'
import { DISTANCES, GRADES, gradeIndex, isWeakGrade } from '../lib/constants'
import { makeId } from '../lib/storage'

export default function AgendaTab({ agenda, setAgenda, horses, readOnly = false }) {
  const sortedHorses = useMemo(() => [...horses].sort((a, b) => a.name.localeCompare(b.name)), [horses])
  const [selectedHorseId, setSelectedHorseId] = useState(sortedHorses[0]?.id ?? null)
  const selectedHorse = useMemo(() => horses.find((h) => h.id === selectedHorseId) ?? null, [horses, selectedHorseId])
  const [overrides, setOverrides] = useState({})

  function selectHorse(id) {
    setSelectedHorseId(id)
    setOverrides({})
  }

  function effectiveAptitude(category) {
    return overrides[category] ?? selectedHorse?.aptitudes[category]
  }

  function setOverride(category, grade) {
    setOverrides((prev) => ({ ...prev, [category]: grade }))
  }

  const hasOverrides = Object.keys(overrides).length > 0

  const horseAgenda = useMemo(
    () => agenda.filter((a) => a.horseId === selectedHorseId),
    [agenda, selectedHorseId],
  )
  const selectedRaceIds = useMemo(() => new Set(horseAgenda.map((a) => a.raceId)), [horseAgenda])

  const rankedRaces = useMemo(() => {
    if (!selectedHorse) return []
    return [...G1_RACES]
      .map((race) => ({ race, grade: overrides[race.distanceCategory] ?? selectedHorse.aptitudes[race.distanceCategory] }))
      .sort((a, b) => gradeIndex(a.grade) - gradeIndex(b.grade) || a.race.name.localeCompare(b.race.name))
  }, [selectedHorse, overrides])

  const suggested = useMemo(
    () => rankedRaces.filter(({ grade }) => gradeIndex(grade) <= gradeIndex('A')),
    [rankedRaces],
  )

  const categoryCounts = useMemo(() => {
    const counts = {}
    horseAgenda.forEach((a) => {
      const race = G1_RACES.find((r) => r.id === a.raceId)
      if (race) counts[race.distanceCategory] = (counts[race.distanceCategory] ?? 0) + 1
    })
    return counts
  }, [horseAgenda])

  function toggleRace(race) {
    if (!selectedHorseId) return
    setAgenda((prev) => {
      const exists = prev.some((a) => a.horseId === selectedHorseId && a.raceId === race.id)
      if (exists) {
        return prev.filter((a) => !(a.horseId === selectedHorseId && a.raceId === race.id))
      }
      return [
        ...prev,
        { id: makeId(), horseId: selectedHorseId, raceId: race.id, raceName: race.name, created: new Date().toISOString() },
      ]
    })
  }

  function RaceOption({ race, grade }) {
    const weak = isWeakGrade(grade)
    const checked = selectedRaceIds.has(race.id)
    return (
      <label className={`race-option${checked ? ' is-selected' : ''}`}>
        <input type="checkbox" checked={checked} onChange={() => toggleRace(race)} disabled={readOnly} />
        <div className="race-option-info">
          <div className="text-body" style={{ fontWeight: 600 }}>{race.name}</div>
          <div className="ax-meta">{race.terrain === 'dirt' ? 'Dirt' : 'Turf'} · {race.distance}m</div>
        </div>
        <span className={`ax-badge${weak ? ' race-grade-weak' : ''}`}>{grade}</span>
      </label>
    )
  }

  return (
    <div>
      {horses.length === 0 ? (
        <div className="ax-card"><div className="ax-empty">Add horses first to build a race agenda.</div></div>
      ) : (
        <div className="form-row" style={{ maxWidth: 320, marginBottom: 20 }}>
          <label className="label-micro">Horse</label>
          <select className="ax-input" value={selectedHorseId ?? ''} onChange={(e) => selectHorse(e.target.value)}>
            {sortedHorses.map((h) => {
              const count = agenda.filter((a) => a.horseId === h.id).length
              return (
                <option key={h.id} value={h.id}>{h.name}{count > 0 ? ` (${count} planned)` : ''}</option>
              )
            })}
          </select>
        </div>
      )}

      {selectedHorse && (
        <>
          <div className="ax-card" style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 4 }}>{selectedHorse.name}&rsquo;s race agenda</h3>
            <p className="ax-meta">
              {horseAgenda.length} G1{horseAgenda.length === 1 ? '' : 's'} planned
              {Object.keys(categoryCounts).length > 0 && ' — '}
              {Object.entries(categoryCounts).map(([cat, n]) => `${n} ${cat}`).join(' · ')}
            </p>
          </div>

          <div className="ax-card" style={{ marginBottom: 28 }}>
            <h3 style={{ marginBottom: 4 }}>Aptitude for this run</h3>
            <p className="ax-meta" style={{ marginBottom: 14 }}>
              Autofilled from {selectedHorse.name}&rsquo;s trained aptitude — adjust to match sparks or a fresh inheritance before checking suggestions.
            </p>
            <div className="grade-grid">
              {DISTANCES.map((d) => (
                <div className="grade-field" key={d}>
                  <label className="label-micro">{d}</label>
                  <select className="ax-input" value={effectiveAptitude(d)} onChange={(e) => setOverride(d, e.target.value)}>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {hasOverrides && (
              <button className="ax-btn" style={{ marginTop: 14 }} onClick={() => setOverrides({})}>Reset to trained aptitude</button>
            )}
          </div>

          <h3 className="section-heading">Suggested races <span className="ax-meta">(S/A distance aptitude)</span></h3>
          {suggested.length === 0 ? (
            <div className="ax-card"><div className="ax-empty">No G1 fits {selectedHorse.name}&rsquo;s aptitudes yet at S/A — check the full list below, adjust for sparks above, or train up a distance category.</div></div>
          ) : (
            <div className="race-grid" style={{ marginBottom: 28 }}>
              {suggested.map(({ race, grade }) => <RaceOption key={race.id} race={race} grade={grade} />)}
            </div>
          )}

          <h3 className="section-heading">All G1 races</h3>
          <div className="race-grid">
            {rankedRaces.map(({ race, grade }) => <RaceOption key={race.id} race={race} grade={grade} />)}
          </div>
        </>
      )}
    </div>
  )
}
