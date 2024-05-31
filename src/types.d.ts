export type ChordBeatType = {
  name?: string;
  timing?: {
    section: number;
    measure: number;
    beat: number;
  }
}