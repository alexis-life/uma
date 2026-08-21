import { defaultAptitudes, defaultStyleApt, DEFAULT_TALENT_RANK } from './constants'
import { makeId } from './storage'

export const TRAINEE_NAMES = [
  'Agnes Tachyon', 'Air Groove', 'Air Groove (Wedding)', 'Biwa Hayahide (Christmas)', 'Curren Chan', 'Daiwa Scarlet',
  'Eishin Flash (Valentine)', 'El Condor Pasa', 'Fuji Kiseki', 'Fuji Kiseki (Ballroom)', 'Gold City', 'Gold City (Festival)',
  'Gold Ship', 'Grass Wonder', 'Grass Wonder (Fantasy)', 'Haru Urara', 'Haru Urara (New Year)', 'Hishi Amazon', 'King Halo',
  'Maruzensky', 'Matikanefukukitaru', 'Matikanefukukitaru (Full Armor)', 'Matikanetannhauser', 'Mayano Top Gun',
  'Mayano Top Gun (Wedding)', 'Mejiro McQueen', 'Mejiro Ryan', 'Mihono Bourbon', 'Mihono Bourbon (Valentine)', 'Narita Brian',
  'Nice Nature', 'Oguri Cap', 'Oguri Cap (Christmas)', 'Rice Shower', 'Sakura Bakushin O', 'Sakura Chiyono O', 'Satono Diamond',
  'Seiun Sky', 'Seiun Sky (Ballroom)', 'Silence Suzuka', 'Smart Falcon', 'Special Week', 'Super Creek', 'Taiki Shuttle',
  'TM Opera O (New Year)', 'Tokai Teio', 'Tosen Jordan', 'Vodka', 'Winning Ticket',
]

// Real distance/style aptitude grades and talent rank (1-5★) for each
// trainee's base game data, keyed by name so they line up with TRAINEE_NAMES
// above. Costume variants (e.g. "(Wedding)") share their base outfit's
// aptitude grades unless GameTora's data distinguishes them, but each
// variant keeps its own real talent rank.
export const TRAINEE_APTITUDES = {
  'Agnes Tachyon': { talentRank: 4, aptitudes: { Sprint: 'G', Mile: 'D', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'E', Senkou: 'A', Sashi: 'B', Oikomi: 'F' } },
  'Air Groove': { talentRank: 4, aptitudes: { Sprint: 'C', Mile: 'B', Medium: 'A', Long: 'E', Dirt: 'G' }, styleApt: { Nige: 'D', Senkou: 'A', Sashi: 'A', Oikomi: 'G' } },
  'Air Groove (Wedding)': { talentRank: 3, aptitudes: { Sprint: 'C', Mile: 'B', Medium: 'A', Long: 'E', Dirt: 'G' }, styleApt: { Nige: 'D', Senkou: 'A', Sashi: 'A', Oikomi: 'G' } },
  'Biwa Hayahide (Christmas)': { talentRank: 3, aptitudes: { Sprint: 'F', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'F' }, styleApt: { Nige: 'E', Senkou: 'A', Sashi: 'B', Oikomi: 'E' } },
  'Curren Chan': { talentRank: 4, aptitudes: { Sprint: 'A', Mile: 'D', Medium: 'G', Long: 'G', Dirt: 'F' }, styleApt: { Nige: 'B', Senkou: 'A', Sashi: 'E', Oikomi: 'G' } },
  'Daiwa Scarlet': { talentRank: 4, aptitudes: { Sprint: 'F', Mile: 'A', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'A', Sashi: 'E', Oikomi: 'G' } },
  'Eishin Flash (Valentine)': { talentRank: 3, aptitudes: { Sprint: 'G', Mile: 'F', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'A', Oikomi: 'C' } },
  'El Condor Pasa': { talentRank: 4, aptitudes: { Sprint: 'F', Mile: 'A', Medium: 'A', Long: 'B', Dirt: 'B' }, styleApt: { Nige: 'E', Senkou: 'A', Sashi: 'A', Oikomi: 'C' } },
  'Fuji Kiseki': { talentRank: 3, aptitudes: { Sprint: 'B', Mile: 'A', Medium: 'B', Long: 'E', Dirt: 'F' }, styleApt: { Nige: 'C', Senkou: 'A', Sashi: 'C', Oikomi: 'G' } },
  'Fuji Kiseki (Ballroom)': { talentRank: 3, aptitudes: { Sprint: 'B', Mile: 'A', Medium: 'B', Long: 'E', Dirt: 'F' }, styleApt: { Nige: 'C', Senkou: 'A', Sashi: 'C', Oikomi: 'G' } },
  'Gold City': { talentRank: 3, aptitudes: { Sprint: 'F', Mile: 'A', Medium: 'B', Long: 'B', Dirt: 'D' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'F' } },
  'Gold City (Festival)': { talentRank: 3, aptitudes: { Sprint: 'F', Mile: 'A', Medium: 'B', Long: 'B', Dirt: 'D' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'F' } },
  'Gold Ship': { talentRank: 5, aptitudes: { Sprint: 'G', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'B', Oikomi: 'A' } },
  'Grass Wonder': { talentRank: 4, aptitudes: { Sprint: 'G', Mile: 'A', Medium: 'B', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'F' } },
  'Grass Wonder (Fantasy)': { talentRank: 3, aptitudes: { Sprint: 'G', Mile: 'A', Medium: 'B', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'F' } },
  'Haru Urara': { talentRank: 4, aptitudes: { Sprint: 'A', Mile: 'B', Medium: 'G', Long: 'G', Dirt: 'A' }, styleApt: { Nige: 'G', Senkou: 'G', Sashi: 'A', Oikomi: 'B' } },
  'Haru Urara (New Year)': { talentRank: 3, aptitudes: { Sprint: 'A', Mile: 'A', Medium: 'G', Long: 'G', Dirt: 'A' }, styleApt: { Nige: 'G', Senkou: 'G', Sashi: 'A', Oikomi: 'B' } },
  'Hishi Amazon': { talentRank: 3, aptitudes: { Sprint: 'D', Mile: 'A', Medium: 'A', Long: 'B', Dirt: 'E' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'C', Oikomi: 'A' } },
  'King Halo': { talentRank: 4, aptitudes: { Sprint: 'A', Mile: 'B', Medium: 'B', Long: 'C', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'A', Oikomi: 'D' } },
  'Maruzensky': { talentRank: 3, aptitudes: { Sprint: 'B', Mile: 'A', Medium: 'B', Long: 'C', Dirt: 'D' }, styleApt: { Nige: 'A', Senkou: 'E', Sashi: 'G', Oikomi: 'G' } },
  'Matikanefukukitaru': { talentRank: 4, aptitudes: { Sprint: 'F', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'F' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'A', Oikomi: 'F' } },
  'Matikanefukukitaru (Full Armor)': { talentRank: 3, aptitudes: { Sprint: 'F', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'F' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'A', Oikomi: 'F' } },
  'Matikanetannhauser': { talentRank: 2, aptitudes: { Sprint: 'G', Mile: 'D', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'E' } },
  'Mayano Top Gun': { talentRank: 4, aptitudes: { Sprint: 'D', Mile: 'D', Medium: 'A', Long: 'A', Dirt: 'E' }, styleApt: { Nige: 'A', Senkou: 'A', Sashi: 'B', Oikomi: 'B' } },
  'Mayano Top Gun (Wedding)': { talentRank: 3, aptitudes: { Sprint: 'D', Mile: 'D', Medium: 'A', Long: 'A', Dirt: 'E' }, styleApt: { Nige: 'A', Senkou: 'A', Sashi: 'B', Oikomi: 'B' } },
  'Mejiro McQueen': { talentRank: 4, aptitudes: { Sprint: 'G', Mile: 'F', Medium: 'A', Long: 'A', Dirt: 'E' }, styleApt: { Nige: 'B', Senkou: 'A', Sashi: 'D', Oikomi: 'F' } },
  'Mejiro Ryan': { talentRank: 4, aptitudes: { Sprint: 'E', Mile: 'C', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'F' } },
  'Mihono Bourbon': { talentRank: 3, aptitudes: { Sprint: 'C', Mile: 'B', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'E', Sashi: 'G', Oikomi: 'G' } },
  'Mihono Bourbon (Valentine)': { talentRank: 3, aptitudes: { Sprint: 'C', Mile: 'B', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'E', Sashi: 'G', Oikomi: 'G' } },
  'Narita Brian': { talentRank: 4, aptitudes: { Sprint: 'F', Mile: 'B', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'A', Sashi: 'A', Oikomi: 'D' } },
  'Nice Nature': { talentRank: 4, aptitudes: { Sprint: 'G', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'F', Senkou: 'B', Sashi: 'A', Oikomi: 'D' } },
  'Oguri Cap': { talentRank: 3, aptitudes: { Sprint: 'E', Mile: 'A', Medium: 'A', Long: 'B', Dirt: 'B' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'D' } },
  'Oguri Cap (Christmas)': { talentRank: 4, aptitudes: { Sprint: 'E', Mile: 'A', Medium: 'A', Long: 'B', Dirt: 'B' }, styleApt: { Nige: 'F', Senkou: 'A', Sashi: 'A', Oikomi: 'D' } },
  'Rice Shower': { talentRank: 3, aptitudes: { Sprint: 'E', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'B', Senkou: 'A', Sashi: 'C', Oikomi: 'G' } },
  'Sakura Bakushin O': { talentRank: 4, aptitudes: { Sprint: 'A', Mile: 'B', Medium: 'G', Long: 'G', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'A', Sashi: 'F', Oikomi: 'G' } },
  'Sakura Chiyono O': { talentRank: 3, aptitudes: { Sprint: 'E', Mile: 'A', Medium: 'A', Long: 'E', Dirt: 'G' }, styleApt: { Nige: 'B', Senkou: 'A', Sashi: 'F', Oikomi: 'G' } },
  'Satono Diamond': { talentRank: 3, aptitudes: { Sprint: 'G', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'A', Oikomi: 'D' } },
  'Seiun Sky': { talentRank: 3, aptitudes: { Sprint: 'G', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'B', Sashi: 'D', Oikomi: 'E' } },
  'Seiun Sky (Ballroom)': { talentRank: 4, aptitudes: { Sprint: 'G', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'B', Sashi: 'D', Oikomi: 'E' } },
  'Silence Suzuka': { talentRank: 3, aptitudes: { Sprint: 'D', Mile: 'A', Medium: 'A', Long: 'E', Dirt: 'G' }, styleApt: { Nige: 'A', Senkou: 'C', Sashi: 'E', Oikomi: 'G' } },
  'Smart Falcon': { talentRank: 3, aptitudes: { Sprint: 'B', Mile: 'A', Medium: 'A', Long: 'E', Dirt: 'A' }, styleApt: { Nige: 'A', Senkou: 'D', Sashi: 'G', Oikomi: 'G' } },
  'Special Week': { talentRank: 3, aptitudes: { Sprint: 'F', Mile: 'C', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'A', Sashi: 'A', Oikomi: 'C' } },
  'Super Creek': { talentRank: 4, aptitudes: { Sprint: 'G', Mile: 'G', Medium: 'A', Long: 'A', Dirt: 'G' }, styleApt: { Nige: 'D', Senkou: 'A', Sashi: 'B', Oikomi: 'G' } },
  'Taiki Shuttle': { talentRank: 3, aptitudes: { Sprint: 'A', Mile: 'A', Medium: 'E', Long: 'G', Dirt: 'B' }, styleApt: { Nige: 'C', Senkou: 'A', Sashi: 'E', Oikomi: 'G' } },
  'TM Opera O (New Year)': { talentRank: 3, aptitudes: { Sprint: 'G', Mile: 'E', Medium: 'A', Long: 'A', Dirt: 'E' }, styleApt: { Nige: 'C', Senkou: 'A', Sashi: 'A', Oikomi: 'G' } },
  'Tokai Teio': { talentRank: 3, aptitudes: { Sprint: 'F', Mile: 'E', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'D', Senkou: 'A', Sashi: 'C', Oikomi: 'E' } },
  'Tosen Jordan': { talentRank: 3, aptitudes: { Sprint: 'G', Mile: 'F', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'C', Senkou: 'A', Sashi: 'B', Oikomi: 'G' } },
  'Vodka': { talentRank: 4, aptitudes: { Sprint: 'F', Mile: 'A', Medium: 'A', Long: 'F', Dirt: 'G' }, styleApt: { Nige: 'C', Senkou: 'B', Sashi: 'A', Oikomi: 'F' } },
  'Winning Ticket': { talentRank: 5, aptitudes: { Sprint: 'G', Mile: 'F', Medium: 'A', Long: 'B', Dirt: 'G' }, styleApt: { Nige: 'G', Senkou: 'B', Sashi: 'A', Oikomi: 'G' } },
}

export function buildTraineeRoster() {
  return TRAINEE_NAMES.map((name) => {
    const real = TRAINEE_APTITUDES[name]
    return {
      id: makeId(),
      name,
      talentRank: real ? real.talentRank : DEFAULT_TALENT_RANK,
      aptitudes: real ? real.aptitudes : defaultAptitudes('B'),
      styleApt: real ? real.styleApt : defaultStyleApt('B'),
    }
  })
}
