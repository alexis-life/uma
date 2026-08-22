import { useMemo, useState } from 'react'
import { G1_RACES } from '../lib/races'
import { gradeIndex, isWeakGrade } from '../lib/constants'
import { makeId } from '../lib/storage'

function charArtUrl(cardId) {
  if (!cardId) return null
  const charId = Math.floor(cardId / 100)
  return `https://gametora.com/images/umamusume/characters/chara_stand_${charId}_${cardId}.png`
}

export default function AgendaTab({ agenda, setAgenda, horses, readOnly = false }) {
  const [selectedHorseId, setSelectedHorseId] = useState(horses[0]?.id ?? null)
  const selectedHorse = useMemo(() => horses.find((h) => h.id === selectedHorseId) ?? null, [horses, selectedHorseId])

  const horseAgenda = useMemo(
    () => agenda.filter((a) => a.horseId === selectedHorseId),
    [agenda, selectedHorseId],
  )
  const selectedRaceIds = useMemo(() => new Set(horseAgenda.map((a) => a.raceId)), [horseAgenda])

  const rankedRaces = useMemo(() => {
    if (!selectedHorse) return []
    return [...G1_RACES]
      .map((race) => ({ race, grade: selectedHorse.aptitudes[race.distanceCategory] }))
      .sort((a, b) => gradeIndex(a.grade) - gradeIndex(b.grade) || a.race.name.localeCompare(b.race.name))
  }, [selectedHorse])

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
        <div className="horse-gallery" style={{ marginBottom: 20 }}>
          {[...horses].sort((a, b) => a.name.localeCompare(b.name)).map((h) => {
            const count = agenda.filter((a) => a.horseId === h.id).length
            return (
              <button
                key={h.id}
                className={`horse-tile${h.id === selectedHorseId ? ' is-active' : ''}`}
                onClick={() => setSelectedHorseId(h.id)}
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
                {count > 0 && <span className="ax-badge">{count} planned</span>}
              </button>
            )
          })}
        </div>
      )}

      {selectedHorse && (
        <>
          <div className="ax-card" style={{ marginBottom: 28 }}>
            <h3 style={{ marginBottom: 4 }}>{selectedHorse.name}&rsquo;s race agenda</h3>
            <p className="ax-meta">
              {horseAgenda.length} G1{horseAgenda.length === 1 ? '' : 's'} planned
              {Object.keys(categoryCounts).length > 0 && ' — '}
              {Object.entries(categoryCounts).map(([cat, n]) => `${n} ${cat}`).join(' · ')}
            </p>
          </div>

          <h3 className="section-heading">Suggested races <span className="ax-meta">(S/A distance aptitude)</span></h3>
          {suggested.length === 0 ? (
            <div className="ax-card"><div className="ax-empty">No G1 fits {selectedHorse.name}&rsquo;s trained aptitudes yet at S/A — check the full list below or train up a distance category.</div></div>
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
