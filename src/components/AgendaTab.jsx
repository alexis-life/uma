import { useMemo, useState } from 'react'
import { G1_RACES } from '../lib/races'
import { isWeakGrade } from '../lib/constants'
import { makeId } from '../lib/storage'

export default function AgendaTab({ agenda, setAgenda, horses, readOnly = false }) {
  const [selectedHorseId, setSelectedHorseId] = useState(horses[0]?.id ?? null)
  const selectedHorse = useMemo(() => horses.find((h) => h.id === selectedHorseId) ?? null, [horses, selectedHorseId])

  const horseAgenda = useMemo(
    () => agenda.filter((a) => a.horseId === selectedHorseId),
    [agenda, selectedHorseId],
  )
  const selectedRaceIds = useMemo(() => new Set(horseAgenda.map((a) => a.raceId)), [horseAgenda])

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

  return (
    <div>
      <div className="horses-layout">
        <div className="ax-card" style={{ padding: 12 }}>
          {horses.length === 0 ? (
            <div className="ax-empty">Add horses first to build a race agenda.</div>
          ) : (
            <div className="horse-list">
              {horses.map((h) => {
                const count = agenda.filter((a) => a.horseId === h.id).length
                return (
                  <button
                    key={h.id}
                    className={`horse-list-item${h.id === selectedHorseId ? ' is-active' : ''}`}
                    onClick={() => setSelectedHorseId(h.id)}
                  >
                    <span>{h.name}</span>
                    {count > 0 && <span className="ax-badge">{count}</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="ax-card">
          {!selectedHorse ? (
            <div className="ax-empty">Select a horse to build their G1 race agenda.</div>
          ) : (
            <>
              <h3 style={{ marginBottom: 4 }}>{selectedHorse.name}&rsquo;s race agenda</h3>
              <p className="ax-meta" style={{ marginBottom: 16 }}>
                G1 races to prioritize for this horse&rsquo;s next Independent Training run — {horseAgenda.length} selected.
              </p>
              <div className="race-grid">
                {G1_RACES.map((race) => {
                  const grade = selectedHorse.aptitudes[race.distanceCategory]
                  const weak = isWeakGrade(grade)
                  const checked = selectedRaceIds.has(race.id)
                  return (
                    <label key={race.id} className={`race-option${checked ? ' is-selected' : ''}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleRace(race)} disabled={readOnly} />
                      <div className="race-option-info">
                        <div className="text-body" style={{ fontWeight: 600 }}>{race.name}</div>
                        <div className="ax-meta">{race.terrain === 'dirt' ? 'Dirt' : 'Turf'} · {race.distance}m</div>
                      </div>
                      <span className={`ax-badge${weak ? ' race-grade-weak' : ''}`}>{grade}</span>
                    </label>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
