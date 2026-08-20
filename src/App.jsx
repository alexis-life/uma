import { useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { useSession } from './lib/useSession'
import { useSupabaseTable } from './lib/useSupabaseTable'
import LoginScreen from './components/LoginScreen'
import HorsesTab from './components/HorsesTab'
import CardLibraryTab from './components/CardLibraryTab'
import DeckRacePlanTab from './components/DeckRacePlanTab'
import AgendaTab from './components/AgendaTab'

const TABS = ['Horses', 'Card Library', 'Deck & Race Plan', 'Agenda']

const horseMappers = {
  fromDb: (row) => ({ id: row.id, name: row.name, talentRank: row.talent_rank, aptitudes: row.aptitudes, styleApt: row.style_apt }),
  toDb: (item) => ({ id: item.id, name: item.name, talent_rank: item.talentRank, aptitudes: item.aptitudes, style_apt: item.styleApt }),
}

const cardMappers = {
  fromDb: (row) => ({ id: row.id, name: row.name, type: row.type, rarity: row.rarity, limitBreak: row.limit_break }),
  toDb: (item) => ({ id: item.id, name: item.name, type: item.type, rarity: item.rarity, limit_break: item.limitBreak }),
}

const agendaMappers = {
  fromDb: (row) => ({ id: row.id, horseId: row.horse_id, raceId: row.race_id, raceName: row.race_name, created: row.created_at }),
  toDb: (item) => ({ id: item.id, horse_id: item.horseId, race_id: item.raceId, race_name: item.raceName, created_at: item.created }),
}

export default function App() {
  const session = useSession()

  if (session === undefined) {
    return <div className="ax-empty">Loading…</div>
  }

  if (session === null) {
    return <LoginScreen />
  }

  return <AuthenticatedApp />
}

function AuthenticatedApp() {
  const [horses, setHorses] = useSupabaseTable('uma_horses', horseMappers)
  const [cards, setCards] = useSupabaseTable('uma_cards', cardMappers)
  const [agenda, setAgenda] = useSupabaseTable('uma_agenda', agendaMappers)
  const [activeTab, setActiveTab] = useState('Horses')

  return (
    <>
      <header className="ax-header">
        <div className="ax-header-titles">
          <h1 className="ax-title">uma</h1>
          <p className="ax-subtitle">Trainee roster, support card library, and race planning for Uma Musume: Pretty Derby</p>
        </div>
        <div className="ax-header-actions">
          <button className="ax-btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
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
                  {tab === 'Agenda' && agenda.length > 0 && (
                    <span className="ax-badge" style={{ marginLeft: 8 }}>{agenda.length}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="page-content">
        <div style={{ display: activeTab === 'Horses' ? 'block' : 'none' }}>
          <HorsesTab horses={horses} setHorses={setHorses} />
        </div>
        <div style={{ display: activeTab === 'Card Library' ? 'block' : 'none' }}>
          <CardLibraryTab cards={cards} setCards={setCards} />
        </div>
        <div style={{ display: activeTab === 'Deck & Race Plan' ? 'block' : 'none' }}>
          <DeckRacePlanTab horses={horses} cards={cards} />
        </div>
        <div style={{ display: activeTab === 'Agenda' ? 'block' : 'none' }}>
          <AgendaTab agenda={agenda} setAgenda={setAgenda} horses={horses} />
        </div>
      </main>
    </>
  )
}
