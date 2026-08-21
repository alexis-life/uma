import { useState, useMemo } from 'react'
import { CARD_TYPES, RARITIES, RARITY_ORDER, LIMIT_BREAKS } from '../lib/constants'
import { makeId } from '../lib/storage'
import { SEED_CARDS, buildSeedCards } from '../lib/seedCards'
import { parseGametoraCollection, resolveSupports } from '../lib/gametoraImport'

function typeLabel(type) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const TYPE_ABBR = { speed: 'SPD', stamina: 'STA', power: 'PWR', guts: 'GUT', wisdom: 'WIS', friend: 'FRI' }

function typeAbbr(type) {
  return TYPE_ABBR[type] ?? type.slice(0, 3).toUpperCase()
}

function parseCardName(name) {
  const m = /^(.*?)\s*\[(.+)\]\s*$/.exec(name || '')
  if (!m) return { charName: name, title: null }
  return { charName: m[1], title: m[2] }
}

function limitBreakStars(limitBreak) {
  return '★'.repeat(limitBreak) + '☆'.repeat(4 - limitBreak)
}

function cardArtUrl(supportId) {
  if (!supportId) return null
  return `https://media.gametora.com/umamusume/supports/full/small/${supportId}.png`
}

const SORT_OPTIONS = {
  name: { label: 'Name', compare: (a, b) => a.name.localeCompare(b.name) },
  rarity: { label: 'Rarity (highest first)', compare: (a, b) => RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity] || a.name.localeCompare(b.name) },
  type: { label: 'Type', compare: (a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name) },
  limitBreak: { label: 'Limit break (highest first)', compare: (a, b) => b.limitBreak - a.limitBreak || a.name.localeCompare(b.name) },
}

export default function CardLibraryTab({ cards, setCards, readOnly = false }) {
  const [pasteText, setPasteText] = useState('')
  const [gtText, setGtText] = useState('')
  const [gtResult, setGtResult] = useState(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [rarityFilter, setRarityFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')

  const visibleCards = useMemo(() => {
    const q = search.trim().toLowerCase()
    return cards
      .filter((c) => (!q || c.name.toLowerCase().includes(q)))
      .filter((c) => (!typeFilter || c.type === typeFilter))
      .filter((c) => (!rarityFilter || c.rarity === rarityFilter))
      .sort(SORT_OPTIONS[sortBy].compare)
  }, [cards, search, typeFilter, rarityFilter, sortBy])

  function importSeedCards() {
    const existingNames = new Set(cards.map((c) => c.name))
    const toAdd = buildSeedCards().filter((c) => !existingNames.has(c.name))
    if (toAdd.length === 0) return
    setCards((prev) => [...prev, ...toAdd])
  }

  function importPasted() {
    const names = pasteText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    if (names.length === 0) return
    setCards((prev) => [
      ...prev,
      ...names.map((name) => ({ id: makeId(), name, type: 'speed', rarity: 'R', limitBreak: 0, supportId: null })),
    ])
    setPasteText('')
  }

  function importGametoraExport() {
    let en
    try {
      en = parseGametoraCollection(gtText)
    } catch (err) {
      setGtResult({ error: err.message })
      return
    }
    const { resolved, unresolved } = resolveSupports(en)
    let added = 0
    let updated = 0
    setCards((prev) => {
      const next = [...prev]
      for (const r of resolved) {
        const idx = next.findIndex((c) => c.supportId === r.supportId || c.name === r.name)
        if (idx === -1) {
          next.push({ id: makeId(), name: r.name, type: r.type, rarity: r.rarity, limitBreak: r.limitBreak, supportId: r.supportId })
          added++
        } else {
          next[idx] = { ...next[idx], supportId: r.supportId, type: r.type, rarity: r.rarity, limitBreak: r.limitBreak }
          updated++
        }
      }
      return next
    })
    setGtResult({ added, updated, unresolved: unresolved.length })
    setGtText('')
  }

  function updateCard(id, patch) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  function removeCard(id, name) {
    if (!window.confirm(`Remove ${name}? This can't be undone.`)) return
    setCards((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div>
      {!readOnly && (
        <div className="ax-header-actions" style={{ padding: 0, marginBottom: 20 }}>
          <button className="ax-btn ax-btn--solid" onClick={importSeedCards}>Import my cards</button>
          <span className="ax-meta">Loads your saved support card collection ({SEED_CARDS.length} cards)</span>
        </div>
      )}

      {!readOnly && (
        <div className="ax-card" style={{ marginBottom: 28 }}>
          <h3 style={{ marginBottom: 6 }}>Update from GameTora export</h3>
          <p className="ax-meta" style={{ marginBottom: 10 }}>
            Paste a fresh GameTora collection export to add new cards and refresh limit break/rarity for existing
            ones by their support card ID — safe to re-run any time you pull.
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

      {!readOnly && (
        <>
          <h3 className="section-heading">Paste-import names</h3>
          <div className="ax-card" style={{ marginBottom: 28 }}>
            <p className="ax-meta" style={{ marginBottom: 10 }}>
              Fallback for a card not in the GameTora importer yet (very new content). One name per line — added as
              Speed / R / LB0, edit type, rarity, and limit break in the table.
            </p>
            <textarea
              className="ax-input"
              style={{ width: '100%', minHeight: 70, borderRadius: 'var(--radius-md)', resize: 'vertical' }}
              placeholder={'Special Week\nSuper Creek\nGold Ship'}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            <div style={{ marginTop: 10 }}>
              <button className="ax-btn ax-btn--solid" onClick={importPasted}>Import names</button>
            </div>
          </div>
        </>
      )}

      <h3 className="section-heading">All cards ({visibleCards.length}{visibleCards.length !== cards.length ? ` of ${cards.length}` : ''})</h3>
      {cards.length === 0 ? (
        <div className="ax-card"><div className="ax-empty">No cards yet.{!readOnly && ' Import my cards or paste a GameTora export to get started.'}</div></div>
      ) : (
        <>
          <div className="filter-bar">
            <input
              className="ax-input"
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: '1 1 200px' }}
            />
            <select className="ax-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All types</option>
              {CARD_TYPES.map((t) => (
                <option key={t} value={t}>{typeLabel(t)}</option>
              ))}
            </select>
            <select className="ax-input" value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value)}>
              <option value="">All rarities</option>
              {RARITIES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select className="ax-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {Object.entries(SORT_OPTIONS).map(([key, { label }]) => (
                <option key={key} value={key}>Sort: {label}</option>
              ))}
            </select>
          </div>
          {visibleCards.length === 0 ? (
            <div className="ax-card"><div className="ax-empty">No cards match this filter.</div></div>
          ) : (
        <div className="card-grid">
          {visibleCards.map((c) => {
            const { charName, title } = parseCardName(c.name)
            return (
              <div className={`card-poster card-poster--${c.rarity}`} key={c.id}>
                <div className="card-poster-art-wrap">
                  {cardArtUrl(c.supportId) ? (
                    <img
                      src={cardArtUrl(c.supportId)}
                      alt=""
                      className="card-poster-art"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <div className="card-poster-art" />
                  )}
                  <span className="card-poster-badge card-poster-badge--rarity">{c.rarity}</span>
                  <span className="card-poster-badge card-poster-badge--type">{typeAbbr(c.type)}</span>
                </div>
                <div className="card-poster-body">
                  {readOnly ? (
                    <>
                      <div className="card-poster-charname">{charName}</div>
                      {title && <div className="card-poster-title">{title}</div>}
                      <div className="card-poster-lb" title={`Limit Break ${c.limitBreak}`}>{limitBreakStars(c.limitBreak)}</div>
                    </>
                  ) : (
                    <>
                      <input
                        className="ax-input"
                        type="text"
                        value={c.name}
                        onChange={(e) => updateCard(c.id, { name: e.target.value })}
                      />
                      <div className="card-poster-controls">
                        <select className="ax-input" value={c.type} onChange={(e) => updateCard(c.id, { type: e.target.value })}>
                          {CARD_TYPES.map((t) => (
                            <option key={t} value={t}>{typeLabel(t)}</option>
                          ))}
                        </select>
                        <select className="ax-input" value={c.rarity} onChange={(e) => updateCard(c.id, { rarity: e.target.value })}>
                          {RARITIES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <select
                          className="ax-input"
                          value={c.limitBreak}
                          onChange={(e) => updateCard(c.id, { limitBreak: Number(e.target.value) })}
                        >
                          {LIMIT_BREAKS.map((lb) => (
                            <option key={lb} value={lb}>LB{lb}</option>
                          ))}
                        </select>
                      </div>
                      <button className="ax-btn" onClick={() => removeCard(c.id, c.name)}>Remove</button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
          )}
        </>
      )}
    </div>
  )
}
