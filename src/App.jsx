import { useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { useSession } from './lib/useSession'
import { useSupabaseTable } from './lib/useSupabaseTable'
import { useHashTab } from './lib/useHashTab'
import LoginScreen from './components/LoginScreen'
import HorsesTab from './components/HorsesTab'
import CardLibraryTab from './components/CardLibraryTab'
import DeckRacePlanTab from './components/DeckRacePlanTab'
import AgendaTab from './components/AgendaTab'
import TeamTrialsTab from './components/TeamTrialsTab'

const TABS = ['Horses', 'Card Library', 'Deck & Race Plan', 'Agenda', 'Team Trials']

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

const veteranMappers = {
  fromDb: (row) => ({
    id: row.id,
    horseId: row.horse_id,
    name: row.name,
    distanceCategory: row.distance_category,
    style: row.style,
    distanceGrade: row.distance_grade,
    styleGrade: row.style_grade,
    isAce: row.is_ace,
    reliableUnique: row.reliable_unique,
    notes: row.notes,
  }),
  toDb: (item) => ({
    id: item.id,
    horse_id: item.horseId || null,
    name: item.name,
    distance_category: item.distanceCategory,
    style: item.style,
    distance_grade: item.distanceGrade,
    style_grade: item.styleGrade,
    is_ace: item.isAce,
    reliable_unique: item.reliableUnique,
    notes: item.notes,
  }),
}

export default function App() {
  const session = useSession()

  if (session === undefined) {
    return <div className="ax-empty">Loading…</div>
  }

  return <AuthenticatedApp session={session} />
}

function AuthenticatedApp({ session }) {
  const isAuthenticated = !!session
  const [horses, setHorses] = useSupabaseTable('uma_horses', horseMappers, isAuthenticated)
  const [cards, setCards] = useSupabaseTable('uma_cards', cardMappers, isAuthenticated)
  const [agenda, setAgenda] = useSupabaseTable('uma_agenda', agendaMappers, isAuthenticated)
  const [veterans, setVeterans] = useSupabaseTable('uma_veterans', veteranMappers, isAuthenticated)
  const [activeTab, setActiveTab] = useHashTab('Horses')
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <header className="ax-header">
        <div className="ax-header-titles">
          <h1 className="ax-title">uma</h1>
          <p className="ax-subtitle">
            Trainee roster, support card library, and race planning for Uma Musume: Pretty Derby
            {!isAuthenticated && ' — viewing read-only'}
          </p>
        </div>
        <div className="ax-header-actions uma-topbar-actions">
          {isAuthenticated ? (
            <button className="ax-btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
          ) : (
            <button className="ax-btn" onClick={() => setShowLogin(true)}>Sign in to edit</button>
          )}
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

      {showLogin && !isAuthenticated && <LoginScreen onClose={() => setShowLogin(false)} />}

      <main className="page-content">
        <div style={{ display: activeTab === 'Horses' ? 'block' : 'none' }}>
          <HorsesTab horses={horses} setHorses={setHorses} readOnly={!isAuthenticated} />
        </div>
        <div style={{ display: activeTab === 'Card Library' ? 'block' : 'none' }}>
          <CardLibraryTab cards={cards} setCards={setCards} readOnly={!isAuthenticated} />
        </div>
        <div style={{ display: activeTab === 'Deck & Race Plan' ? 'block' : 'none' }}>
          <DeckRacePlanTab horses={horses} cards={cards} />
        </div>
        <div style={{ display: activeTab === 'Agenda' ? 'block' : 'none' }}>
          <AgendaTab agenda={agenda} setAgenda={setAgenda} horses={horses} readOnly={!isAuthenticated} />
        </div>
        <div style={{ display: activeTab === 'Team Trials' ? 'block' : 'none' }}>
          <TeamTrialsTab veterans={veterans} setVeterans={setVeterans} horses={horses} cards={cards} readOnly={!isAuthenticated} />
        </div>
      </main>
    </>
  )
}
