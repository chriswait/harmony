export type Measure = {
  chordBeats: ChordBeatType[],
  lyric?: LyricMeasureType,
}

export type ChordBeatType = {
  name?: string;
  timing?: {
    section: number;
    measure: number;
    beat: number;
  }
}
export type LyricMeasureType = {
  content: string;
  timing?: {
    section: number;
    measure: number;
  }
}

export type SongExport = {
  songName: string;
  artist: string;
  chords: ChordBeatType[];
  lyrics: LyricMeasureType[];
  sectionNames: string[];
  beatsPerMeasure: number;
}