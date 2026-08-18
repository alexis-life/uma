import { useState } from 'react'
import { useLocalStorage, makeId } from './lib/storage'
import HorsesTab from './components/HorsesTab'
import CardLibraryTab from './components/CardLibraryTab'
import DeckRacePlanTab from './components/DeckRacePlanTab'
import AgendaTab from './components/AgendaTab'

const TABS = ['Horses', 'Card Library', 'Deck & Race Plan', 'Agenda']

export default function App() {
  const [horses, setHorses] = useLocalStorage('uma.horses', [])
  const [cards, setCards] = useLocalStorage('uma.cards', [])
  const [agenda, setAgenda] = useLocalStorage('uma.agenda', [])
  const [activeTab, setActiveTab] = useState('Horses')

  const pendingCount = agenda.filter((t) => !t.done).length

  function addAgendaTasks(texts, horseId = null) {
    const list = Array.isArray(texts) ? texts : [texts]
    const newTasks = list.map((text) => ({
      id: makeId(),
      text,
      done: false,
      horseId,
      created: new Date().toISOString(),
    }))
    setAgenda((prev) => [...newTasks, ...prev])
  }

  return (
    <>
      <header className="ax-header">
        <div className="ax-header-titles">
          <h1 className="ax-title">uma</h1>
          <p className="ax-subtitle">Trainee roster, support card library, and race planning for Uma Musume: Pretty Derby</p>
        </div>
        <div className="ax-tabs-row">
          <div className="ax-tabs-inner">
            <nav className="ax-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`ax-tab${activeTab === tab ? ' ax-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === 'Agenda' && pendingCount > 0 && (
                    <span className="ax-badge" style={{ marginLeft: 8 }}>{pendingCount}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="page-content">
        {activeTab === 'Horses' && <HorsesTab horses={horses} setHorses={setHorses} />}
        {activeTab === 'Card Library' && <CardLibraryTab cards={cards} setCards={setCards} />}
        {activeTab === 'Deck & Race Plan' && (
          <DeckRacePlanTab horses={horses} cards={cards} onAddAgendaTasks={addAgendaTasks} />
        )}
        {activeTab === 'Agenda' && <AgendaTab agenda={agenda} setAgenda={setAgenda} horses={horses} />}
      </main>
    </>
  )
}
