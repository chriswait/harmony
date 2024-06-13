export type Mode = 'major' | 'minor';

export type Section = {
  id: string;
  name: string;
  parentId: typeof Section.id;
};

export type Timing = {
  section: number;
  measure: number;
  beat?: number;
};

export type Measure = {
  chordBeats: ChordBeatType[];
  lyric?: LyricMeasureType;
};

export type ChordBeatType = {
  name?: string;
  timing?: Timing;
};
export type LyricMeasureType = {
  content: string;
  timing?: Timing;
};

export type SongExport = {
  songName: string;
  artist: string;
  keyTonic: string;
  keyMode: Mode;
  beatsPerMeasure: number;
  chords: ChordBeatType[];
  lyrics: LyricMeasureType[];
  // sectionNames: string[];
  sections: Section[];
};
