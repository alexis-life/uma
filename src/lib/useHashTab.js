import { useEffect, useState } from 'react'

const HASH_TO_TAB = {
  horses: 'Horses',
  cards: 'Card Library',
  'deck-race-plan': 'Deck & Race Plan',
  agenda: 'Agenda',
  'team-trials': 'Team Trials',
}
const TAB_TO_HASH = Object.fromEntries(Object.entries(HASH_TO_TAB).map(([hash, tab]) => [tab, hash]))

function tabFromHash(defaultTab) {
  const hash = window.location.hash.replace('#', '')
  return HASH_TO_TAB[hash] ?? defaultTab
}

// Keeps the active tab in the URL hash (e.g. #team-trials) so refreshing or
// sharing a link lands back on the same tab, and browser back/forward works.
export function useHashTab(defaultTab) {
  const [activeTab, setActiveTabState] = useState(() => tabFromHash(defaultTab))

  useEffect(() => {
    function onHashChange() {
      setActiveTabState(tabFromHash(defaultTab))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [defaultTab])

  function setActiveTab(tab) {
    setActiveTabState(tab)
    const hash = TAB_TO_HASH[tab]
    if (hash && window.location.hash !== `#${hash}`) window.location.hash = hash
  }

  return [activeTab, setActiveTab]
}
