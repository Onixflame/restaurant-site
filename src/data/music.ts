import type { MusicEntry } from '../types/domain';

export const MUSIC_DEFAULTS: MusicEntry[] = [
  {
    "day": "Monday",
    "title": "Candlelight Piano",
    "artist": "Klára Novák",
    "time": "19:30–22:30",
    "note": "Solo piano: Satie, Janáček and modern minimalism."
  },
  {
    "day": "Tuesday",
    "title": "Strings at the Hearth",
    "artist": "Vltava Duo",
    "time": "19:30–22:30",
    "note": "Cello and violin in the Stone Room."
  },
  {
    "day": "Wednesday",
    "title": "After Dark Trio",
    "artist": "Marek Kral Trio",
    "time": "20:00–23:00",
    "note": "Contemporary jazz, brushed drums and upright bass."
  },
  {
    "day": "Thursday",
    "title": "Modern Chamber",
    "artist": "Aster Quartet",
    "time": "19:30–22:30",
    "note": "New arrangements, Czech modernism and quiet classics."
  },
  {
    "day": "Friday",
    "title": "Late Jazz",
    "artist": "Eva Kline & Friends",
    "time": "20:30–00:00",
    "note": "Vocals, piano and a later bar set after dinner service."
  },
  {
    "day": "Saturday",
    "title": "Night Salon",
    "artist": "Rotating guest artists",
    "time": "20:30–00:00",
    "note": "Piano, voice, strings or small acoustic ensembles."
  },
  {
    "day": "Sunday",
    "title": "Sunday Nocturne",
    "artist": "Tomáš Valeš",
    "time": "19:00–22:00",
    "note": "Solo piano and a quieter close to the week."
  }
] as MusicEntry[];
