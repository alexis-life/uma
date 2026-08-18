import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'

// Behaves like useState's [value, setValue] pair (functional updates included)
// so existing components didn't need to change, but every write is diffed
// against the last-synced snapshot and pushed to Supabase in the background.
export function useSupabaseTable(table, { fromDb, toDb }) {
  const [items, setItemsState] = useState([])
  const [loaded, setLoaded] = useState(false)
  const syncedRef = useRef([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: true })
      if (cancelled) return
      if (error) {
        console.error(`Failed to load ${table}`, error)
        return
      }
      const mapped = data.map(fromDb)
      syncedRef.current = mapped
      setItemsState(mapped)
      setLoaded(true)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [table, fromDb])

  const setItems = useCallback(
    (updater) => {
      setItemsState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        syncToSupabase(table, syncedRef.current, next, toDb)
        syncedRef.current = next
        return next
      })
    },
    [table, toDb],
  )

  return [items, setItems, loaded]
}

async function syncToSupabase(table, prevSynced, next, toDb) {
  const prevById = new Map(prevSynced.map((item) => [item.id, item]))
  const nextById = new Map(next.map((item) => [item.id, item]))

  const toInsert = next.filter((item) => !prevById.has(item.id))
  const toDelete = prevSynced.filter((item) => !nextById.has(item.id))
  const toUpdate = next.filter((item) => {
    const prev = prevById.get(item.id)
    return prev && JSON.stringify(prev) !== JSON.stringify(item)
  })

  if (toInsert.length > 0) {
    const { error } = await supabase.from(table).insert(toInsert.map(toDb))
    if (error) console.error(`Insert failed on ${table}`, error)
  }
  for (const item of toUpdate) {
    const { error } = await supabase.from(table).update(toDb(item)).eq('id', item.id)
    if (error) console.error(`Update failed on ${table}`, error)
  }
  if (toDelete.length > 0) {
    const { error } = await supabase.from(table).delete().in('id', toDelete.map((item) => item.id))
    if (error) console.error(`Delete failed on ${table}`, error)
  }
}
