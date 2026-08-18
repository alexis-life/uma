import { defaultAptitudes, defaultStyleApt, DEFAULT_TALENT_RANK } from './constants'
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

// Real distance/style aptitude grades for each trainee's base game data,
// keyed by name so they line up with TRAINEE_NAMES above. Costume variants
// (e.g. "(Wedding)") share their base outfit's grades unless GameTora's data
// distinguishes them.
export const TRAINEE_APTITUDES = {
  'Agnes Tachyon': { aptitudes: { Sprint: 'G', Mile: 'D', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'E', Senkou: 'A', Sashi: 'B', Oikomi: 'F' } },
  'Air Groove': { aptitudes: { Sprint: 'C', Mile: 'B', Medium: 'A', Long: 'E', Dirt: 'G' }, styleApt: { Nige: 'D', Senkou: 'A', Sashi: 'A', Oikomi: 'G' } },
  'Air Groove (Wedding)': { aptitudes: { Sprint: 'C', Mile: 'B', Medium: 'A', Long: 'E', Dirt: 'G' }, styleApt: { Nige: 'D', Senkou: 'A', Sashi: 'A', Oikomi: 'G' } },
  'Biwa Hayahide (Christmas)': { aptitudes: { Sprint: 'F', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'F' }, styleApt: { Nige: 'E', Senkou: 'A', Sashi: 'B', Oikomi: 'E' } },
  'Curren Chan': { aptitudes: { Sprint: 'A', Mile: 'D', Medium: 'G', Long: 'G', Dirt: 'F' }, styleApt: { Nige: 'B', Senkou: 'A', Sashi: 'E', Oikomi: 'G' } },
  'Daiwa Scarlet': { aptitudes: { Sprint: 'F', Mile: 'A', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'A', Sashi: 'E', Oikomi: 'G' } },
  'Eishin Flash (Valentine)': { aptitudes: { Sprint: 'G', Mile: 'F', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'A', Oikomi: 'C' } },
  'El Condor Pasa': { aptitudes: { Sprint: 'F', Mile: 'A', Medium: 'A', Long: 'B', Dirt: 'B' }, styleApt: { Nige: 'E', Senkou: 'A', Sashi: 'A', Oikomi: 'C' } },
  'Fuji Kiseki': { aptitudes: { Sprint: 'B', Mile: 'A', Medium: 'B', Long: 'E', Dirt: 'F' }, styleApt: { Nige: 'C', Senkou: 'A', Sashi: 'C', Oikomi: 'G' } },
  'Fuji Kiseki (Ballroom)': { aptitudes: { Sprint: 'B', Mile: 'A', Medium: 'B', Long: 'E', Dirt: 'F' }, styleApt: { Nige: 'C', Senkou: 'A', Sashi: 'C', Oikomi: 'G' } },
  'Gold City': { aptitudes: { Sprint: 'F', Mile: 'A', Medium: 'B', Long: 'B', Dirt: 'D' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'F' } },
  'Gold City (Festival)': { aptitudes: { Sprint: 'F', Mile: 'A', Medium: 'B', Long: 'B', Dirt: 'D' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'F' } },
  'Gold Ship': { aptitudes: { Sprint: 'G', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'B', Oikomi: 'A' } },
  'Grass Wonder': { aptitudes: { Sprint: 'G', Mile: 'A', Medium: 'B', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'F' } },
  'Grass Wonder (Fantasy)': { aptitudes: { Sprint: 'G', Mile: 'A', Medium: 'B', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'F' } },
  'Haru Urara': { aptitudes: { Sprint: 'A', Mile: 'B', Medium: 'G', Long: 'G', Dirt: 'A' }, styleApt: { Nige: 'G', Senkou: 'G', Sashi: 'A', Oikomi: 'B' } },
  'Haru Urara (New Year)': { aptitudes: { Sprint: 'A', Mile: 'A', Medium: 'G', Long: 'G', Dirt: 'A' }, styleApt: { Nige: 'G', Senkou: 'G', Sashi: 'A', Oikomi: 'B' } },
  'Hishi Amazon': { aptitudes: { Sprint: 'D', Mile: 'A', Medium: 'A', Long: 'B', Dirt: 'E' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'C', Oikomi: 'A' } },
  'King Halo': { aptitudes: { Sprint: 'A', Mile: 'B', Medium: 'B', Long: 'C', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'A', Oikomi: 'D' } },
  'Maruzensky': { aptitudes: { Sprint: 'B', Mile: 'A', Medium: 'B', Long: 'C', Dirt: 'D' }, styleApt: { Nige: 'A', Senkou: 'E', Sashi: 'G', Oikomi: 'G' } },
  'Matikanefukukitaru': { aptitudes: { Sprint: 'F', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'F' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'A', Oikomi: 'F' } },
  'Matikanefukukitaru (Full Armor)': { aptitudes: { Sprint: 'F', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'F' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'A', Oikomi: 'F' } },
  'Matikanetannhauser': { aptitudes: { Sprint: 'G', Mile: 'D', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'E' } },
  'Mayano Top Gun': { aptitudes: { Sprint: 'D', Mile: 'D', Medium: 'A', Long: 'A', Dirt: 'E' }, styleApt: { Nige: 'A', Senkou: 'A', Sashi: 'B', Oikomi: 'B' } },
  'Mayano Top Gun (Wedding)': { aptitudes: { Sprint: 'D', Mile: 'D', Medium: 'A', Long: 'A', Dirt: 'E' }, styleApt: { Nige: 'A', Senkou: 'A', Sashi: 'B', Oikomi: 'B' } },
  'Mejiro McQueen': { aptitudes: { Sprint: 'G', Mile: 'F', Medium: 'A', Long: 'A', Dirt: 'E' }, styleApt: { Nige: 'B', Senkou: 'A', Sashi: 'D', Oikomi: 'F' } },
  'Mejiro Ryan': { aptitudes: { Sprint: 'E', Mile: 'C', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'F' } },
  'Mihono Bourbon': { aptitudes: { Sprint: 'C', Mile: 'B', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'E', Sashi: 'G', Oikomi: 'G' } },
  'Mihono Bourbon (Valentine)': { aptitudes: { Sprint: 'C', Mile: 'B', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'E', Sashi: 'G', Oikomi: 'G' } },
  'Narita Brian': { aptitudes: { Sprint: 'F', Mile: 'B', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'A', Sashi: 'A', Oikomi: 'D' } },
  'Nice Nature': { aptitudes: { Sprint: 'G', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'F', Senkou: 'B', Sashi: 'A', Oikomi: 'D' } },
  'Oguri Cap': { aptitudes: { Sprint: 'E', Mile: 'A', Medium: 'A', Long: 'B', Dirt: 'B' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'D' } },
  'Oguri Cap (Christmas)': { aptitudes: { Sprint: 'E', Mile: 'A', Medium: 'A', Long: 'B', Dirt: 'B' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'D' } },
  'Rice Shower': { aptitudes: { Sprint: 'E', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'B', Senkou: 'A', Sashi: 'C', Oikomi: 'G' } },
  'Sakura Bakushin O': { aptitudes: { Sprint: 'A', Mile: 'B', Medium: 'G', Long: 'G', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'A', Sashi: 'F', Oikomi: 'G' } },
  'Sakura Chiyono O': { aptitudes: { Sprint: 'E', Mile: 'A', Medium: 'A', Long: 'E', Dirt: 'G' }, styleApt: { Nige: 'B', Senkou: 'A', Sashi: 'F', Oikomi: 'G' } },
  'Satono Diamond': { aptitudes: { Sprint: 'G', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'A', Oikomi: 'D' } },
  'Seiun Sky': { aptitudes: { Sprint: 'G', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'B', Sashi: 'D', Oikomi: 'E' } },
  'Seiun Sky (Ballroom)': { aptitudes: { Sprint: 'G', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'B', Sashi: 'D', Oikomi: 'E' } },
  'Smart Falcon': { aptitudes: { Sprint: 'B', Mile: 'A', Medium: 'A', Long: 'E', Dirt: 'A' }, styleApt: { Nige: 'A', Senkou: 'D', Sashi: 'G', Oikomi: 'G' } },
  'Special Week': { aptitudes: { Sprint: 'F', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'A', Sashi: 'A', Oikomi: 'C' } },
  'Super Creek': { aptitudes: { Sprint: 'G', Mile: 'G', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'D', Senkou: 'A', Sashi: 'B', Oikomi: 'G' } },
  'Taiki Shuttle': { aptitudes: { Sprint: 'A', Mile: 'A', Medium: 'E', Long: 'G', Dirt: 'B' }, styleApt: { Nige: 'C', Senkou: 'A', Sashi: 'E', Oikomi: 'G' } },
  'TM Opera O (New Year)': { aptitudes: { Sprint: 'G', Mile: 'E', Medium: 'A', Long: 'A', Dirt: 'E' }, styleApt: { Nige: 'C', Senkou: 'A', Sashi: 'A', Oikomi: 'G' } },
  'Tokai Teio': { aptitudes: { Sprint: 'F', Mile: 'E', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'D', Senkou: 'A', Sashi: 'C', Oikomi: 'E' } },
  'Tosen Jordan': { aptitudes: { Sprint: 'G', Mile: 'F', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'C', Senkou: 'A', Sashi: 'B', Oikomi: 'G' } },
  'Vodka': { aptitudes: { Sprint: 'F', Mile: 'A', Medium: 'A', Long: 'F', Dirt: 'G' }, styleApt: { Nige: 'C', Senkou: 'B', Sashi: 'A', Oikomi: 'F' } },
  'Winning Ticket': { aptitudes: { Sprint: 'G', Mile: 'F', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'A', Oikomi: 'G' } },
}

export function buildTraineeRoster() {
  return TRAINEE_NAMES.map((name) => {
    const real = TRAINEE_APTITUDES[name]
    return {
      id: makeId(),
      name,
      talentRank: DEFAULT_TALENT_RANK,
      aptitudes: real ? real.aptitudes : defaultAptitudes('B'),
      styleApt: real ? real.styleApt : defaultStyleApt('B'),
    }
  })
}
