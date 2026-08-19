import { useState } from 'react'
import { CARD_TYPES, RARITIES, LIMIT_BREAKS } from '../lib/constants'
import { makeId } from '../lib/storage'
import { SEED_CARDS, buildSeedCards } from '../lib/seedCards'

function typeLabel(type) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export default function CardLibraryTab({ cards, setCards }) {
  const [pasteText, setPasteText] = useState('')

  function quickAdd(type, rarity) {
    setCards((prev) => [
      ...prev,
      { id: makeId(), name: `${typeLabel(type)} ${rarity}`, type, rarity, limitBreak: 0 },
    ])
  }

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
      ...names.map((name) => ({ id: makeId(), name, type: 'speed', rarity: 'R', limitBreak: 0 })),
    ])
    setPasteText('')
  }

  function updateCard(id, patch) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  function removeCard(id) {
    setCards((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div>
      <div className="ax-header-actions" style={{ padding: 0, marginBottom: 20 }}>
        <button className="ax-btn ax-btn--solid" onClick={importSeedCards}>Import my cards</button>
        <span className="ax-meta">Loads your saved support card collection ({SEED_CARDS.length} cards)</span>
      </div>

      <h3 className="section-heading">Quick-add by type &amp; rarity</h3>
      <p className="ax-meta" style={{ marginBottom: 12 }}>
        Card art can't be reliably identified from screenshots, so bulk-adding by type/rarity is the fastest way in — rename and set limit breaks in the table below.
      </p>
      <div className="quick-add-grid" style={{ marginBottom: 28 }}>
        {CARD_TYPES.flatMap((type) =>
          RARITIES.map((rarity) => (
            <button key={`${type}-${rarity}`} className="quick-add-tile" onClick={() => quickAdd(type, rarity)}>
              <span className="ax-badge">{rarity}</span>
              <span className="text-body">{typeLabel(type)}</span>
            </button>
          )),
        )}
      </div>

      <h3 className="section-heading">Paste-import names</h3>
      <div className="ax-card" style={{ marginBottom: 28 }}>
        <p className="ax-meta" style={{ marginBottom: 10 }}>
          One card name per line. Cards are added as Speed / R / LB0 — edit type, rarity, and limit break in the table.
        </p>
        <textarea
          className="ax-input"
          style={{ width: '100%', minHeight: 90, borderRadius: 'var(--radius-md)', resize: 'vertical' }}
          placeholder={'Special Week\nSuper Creek\nGold Ship'}
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
        />
        <div style={{ marginTop: 10 }}>
          <button className="ax-btn ax-btn--solid" onClick={importPasted}>Import names</button>
        </div>
      </div>

      <h3 className="section-heading">All cards ({cards.length})</h3>
      {cards.length === 0 ? (
        <div className="ax-card"><div className="ax-empty">No cards yet. Quick-add or paste-import to get started.</div></div>
      ) : (
        <div className="ax-card card-table-wrap" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Rarity</th>
                <th>Limit Break</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id}>
                  <td>
                    <input
                      className="ax-input"
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCard(c.id, { name: e.target.value })}
                    />
                  </td>
                  <td>
                    <select className="ax-input" value={c.type} onChange={(e) => updateCard(c.id, { type: e.target.value })}>
                      {CARD_TYPES.map((t) => (
                        <option key={t} value={t}>{typeLabel(t)}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select className="ax-input" value={c.rarity} onChange={(e) => updateCard(c.id, { rarity: e.target.value })}>
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
                    >
                      {LIMIT_BREAKS.map((lb) => (
                        <option key={lb} value={lb}>LB{lb}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="ax-btn" onClick={() => removeCard(c.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
