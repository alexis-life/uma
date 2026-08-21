import { useState } from 'react'
import { CARD_TYPES, RARITIES, LIMIT_BREAKS } from '../lib/constants'
import { makeId } from '../lib/storage'
import { SEED_CARDS, buildSeedCards } from '../lib/seedCards'
import { parseGametoraCollection, resolveSupports } from '../lib/gametoraImport'

function typeLabel(type) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

function cardArtUrl(supportId) {
  if (!supportId) return null
  return `https://gametora.com/images/umamusume/supports/support_card_s_${supportId}.png`
}

export default function CardLibraryTab({ cards, setCards, readOnly = false }) {
  const [pasteText, setPasteText] = useState('')
  const [gtText, setGtText] = useState('')
  const [gtResult, setGtResult] = useState(null)

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

      <h3 className="section-heading">All cards ({cards.length})</h3>
      {cards.length === 0 ? (
        <div className="ax-card"><div className="ax-empty">No cards yet.{!readOnly && ' Import my cards or paste a GameTora export to get started.'}</div></div>
      ) : (
        <div className="ax-card card-table-wrap" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Type</th>
                <th>Rarity</th>
                <th>Limit Break</th>
                {!readOnly && <th></th>}
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id}>
                  <td>
                    {cardArtUrl(c.supportId) && (
                      <img
                        src={cardArtUrl(c.supportId)}
                        alt=""
                        className="card-art-thumb"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                  </td>
                  <td>
                    <input
                      className="ax-input"
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCard(c.id, { name: e.target.value })}
                      disabled={readOnly}
                    />
                  </td>
                  <td>
                    <select className="ax-input" value={c.type} onChange={(e) => updateCard(c.id, { type: e.target.value })} disabled={readOnly}>
                      {CARD_TYPES.map((t) => (
                        <option key={t} value={t}>{typeLabel(t)}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select className="ax-input" value={c.rarity} onChange={(e) => updateCard(c.id, { rarity: e.target.value })} disabled={readOnly}>
                      {RARITIES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="ax-input"
                      style={{ width: 76 }}
                      value={c.limitBreak}
                      onChange={(e) => updateCard(c.id, { limitBreak: Number(e.target.value) })}
                      disabled={readOnly}
                    >
                      {LIMIT_BREAKS.map((lb) => (
                        <option key={lb} value={lb}>LB{lb}</option>
                      ))}
                    </select>
                  </td>
                  {!readOnly && (
                    <td>
                      <button className="ax-btn" onClick={() => removeCard(c.id, c.name)}>Remove</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
