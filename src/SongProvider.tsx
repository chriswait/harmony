import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { ChordBeatType } from './types';

const SongContext = createContext<{
  chords: ChordBeatType[], setChords: Dispatch<SetStateAction<ChordBeatType[]>>,
  measures: ChordBeatType[][],
  beatsPerMeasure: number, setBeatsPerMeasure: Dispatch<SetStateAction<number>>,
  setChord: (measure: number, beat: number, chordName: string) => void,
}>({
  chords: [], setChords: () => { },
  measures: [],
  beatsPerMeasure: 0, setBeatsPerMeasure: () => { },
  setChord: () => { }
});

const SongProvider = ({ children }: { children: React.ReactNode }) => {
  const [beatsPerMeasure, setBeatsPerMeasure] = useState<number>(4);
  const [chords, setChords] = useState<ChordBeatType[]>([
    {
      name: 'C',
      timing: {
        measure: 0,
        beat: 0,
      }
    },
    {
      name: 'F',
      timing: {
        measure: 0,
        beat: 2,
      }
    },
    {
      name: 'G',
      timing: {
        measure: 0,
        beat: 3,
      }
    },
    {
      name: 'C',
      timing: {
        measure: 1,
        beat: 0,
      }
    },
  ]);

  const setChord = (measure: number, beat: number, chordName: string) => {
    const matchChord = (chord: ChordBeatType) => !!chord.timing && chord.timing.measure === measure && chord.timing.beat === beat;
    let newChords = [];
    // Check for an actual match
    const match = chords.find(matchChord);
    if (match) {
      if (chordName !== '') {
        newChords = chords.map((chord) => matchChord(chord) ? { ...chord, name: chordName } : chord);
      } else {
        newChords = chords.filter((chord) => !matchChord(chord))
      }
    } else {
      // If there's no match, just add the chord
      newChords = [...chords, { name: chordName, timing: { measure, beat } }];
    }
    newChords.sort((chord1, chord2) => {
      if (chord1.timing!.measure > chord2.timing!.measure) return 1;
      if (chord1.timing!.measure < chord2.timing!.measure) return -1;
      if (chord1.timing!.measure === chord2.timing!.measure) {
        if (chord1.timing!.beat > chord2.timing!.beat) return 1;
        if (chord1.timing!.beat < chord2.timing!.beat) return -1;
      }
      return 0;
    })
    setChords(newChords);
  };

  const measures: ChordBeatType[][] = []
  const maxMeasureIndex = chords[chords.length - 1].timing!.measure + 2;
  let lastChord;
  for (let measureIndex = 0; measureIndex < maxMeasureIndex; measureIndex++) {
    const beats: ChordBeatType[] = [];
    for (let beatIndex = 0; beatIndex < beatsPerMeasure; beatIndex++) {
      const match = chords.find(({ timing }) => timing && timing.measure === measureIndex && timing.beat === beatIndex);
      if (match) {
        beats.push(match);
        lastChord = match
      } else {
        beats.push({ ...lastChord, timing: undefined })
      }
    }
    measures.push(beats);
  }

  return (
    <SongContext.Provider value={{
      chords, setChords,
      measures,
      beatsPerMeasure, setBeatsPerMeasure,
      setChord,
    }}>{children}</SongContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSong = () => useContext(SongContext);

export default SongProvider;