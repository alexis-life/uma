import { defaultAptitudes, defaultStyleApt } from './constants'
import { makeId } from './storage'

export const TRAINEE_NAMES = [
  'Agnes Tachyon', 'Air Groove', 'Air Groove (Wedding)', 'Biwa Hayahide (Christmas)', 'Curren Chan', 'Daiwa Scarlet',
  'Eishin Flash (Valentine)', 'El Condor Pasa', 'Fuji Kiseki', 'Fuji Kiseki (Ballroom)', 'Gold City', 'Gold City (Festival)',
  'Gold Ship', 'Grass Wonder', 'Grass Wonder (Fantasy)', 'Haru Urara', 'Haru Urara (New Year)', 'Hishi Amazon', 'King Halo',
  'Maruzensky', 'Matikanefukukitaru', 'Matikanefukukitaru (Full Armor)', 'Matikanetannhauser', 'Mayano Top Gun',
  'Mayano Top Gun (Wedding)', 'Mejiro McQueen', 'Mejiro Ryan', 'Mihono Bourbon', 'Mihono Bourbon (Valentine)', 'Narita Brian',
  'Nice Nature', 'Oguri Cap', 'Oguri Cap (Christmas)', 'Rice Shower', 'Sakura Bakushin O', 'Sakura Chiyono O', 'Satono Diamond',
  'Seiun Sky', 'Seiun Sky (Ballroom)', 'Smart Falcon', 'Special Week', 'Super Creek', 'Taiki Shuttle', 'TM Opera O (New Year)',
  'Tokai Teio', 'Tosen Jordan', 'Vodka', 'Winning Ticket',
]

export function buildTraineeRoster() {
  return TRAINEE_NAMES.map((name) => ({
    id: makeId(),
    name,
    aptitudes: defaultAptitudes('B'),
    styleApt: defaultStyleApt('B'),
  }))
}
