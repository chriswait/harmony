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