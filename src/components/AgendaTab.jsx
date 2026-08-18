import { useState } from 'react'
import { makeId } from '../lib/storage'

export default function AgendaTab({ agenda, setAgenda, horses }) {
  const [text, setText] = useState('')
  const [horseId, setHorseId] = useState('')

  const pending = agenda.filter((t) => !t.done)
  const done = agenda.filter((t) => t.done)

  function horseName(id) {
    return horses.find((h) => h.id === id)?.name ?? null
  }

  function addTask() {
    const trimmed = text.trim()
    if (!trimmed) return
    setAgenda((prev) => [
      { id: makeId(), text: trimmed, done: false, horseId: horseId || null, created: new Date().toISOString() },
      ...prev,
    ])
    setText('')
  }

  function toggleDone(id) {
    setAgenda((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function removeTask(id) {
    setAgenda((prev) => prev.filter((t) => t.id !== id))
  }

  function renderTask(t) {
    const name = horseName(t.horseId)
    return (
      <div className={`task-row${t.done ? ' is-done' : ''}`} key={t.id}>
        <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id)} />
        <span className="task-text">{t.text}</span>
        {name && <span className="ax-chip">{name}</span>}
        <button className="ax-btn" onClick={() => removeTask(t.id)}>Remove</button>
      </div>
    )
  }

  return (
    <div>
      <div className="agenda-add-row">
        <input
          className="ax-input"
          type="text"
          placeholder="Add a task…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <select className="ax-input" value={horseId} onChange={(e) => setHorseId(e.target.value)}>
          <option value="">No horse</option>
          {horses.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
        <button className="ax-btn ax-btn--solid" onClick={addTask}>+ Add</button>
      </div>

      <h3 className="section-heading">Pending ({pending.length})</h3>
      {pending.length === 0 ? (
        <div className="ax-card"><div className="ax-empty">Nothing pending — nice.</div></div>
      ) : (
        <div className="task-list">{pending.map(renderTask)}</div>
      )}

      <h3 className="section-heading">Done ({done.length})</h3>
      {done.length === 0 ? (
        <div className="ax-card"><div className="ax-empty">No completed tasks yet.</div></div>
      ) : (
        <div className="task-list">{done.map(renderTask)}</div>
      )}
    </div>
  )
}
