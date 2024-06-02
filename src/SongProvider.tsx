import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { ChordBeatType, LyricMeasureType } from './types';

const testChords = [
  {
    name: 'C',
    timing: {
      section: 0,
      measure: 0,
      beat: 0,
    }
  },
  {
    name: 'F',
    timing: {
      section: 0,
      measure: 0,
      beat: 2,
    }
  },
  {
    name: 'G',
    timing: {
      section: 0,
      measure: 0,
      beat: 3,
    }
  },
  {
    name: 'C',
    timing: {
      section: 0,
      measure: 1,
      beat: 0,
    }
  },
];

const testLyrics = [
  {
    content: 'All the leaves are brown',
    timing: {
      section: 0,
      measure: 0,
    }
  },
  {
    content: 'And the sky is grey',
    timing: {
      section: 0,
      measure: 1,
    }
  },
];

const SongContext = createContext<{
  songName: string, setSongName: Dispatch<SetStateAction<string>>,
  artist: string, setArtist: Dispatch<SetStateAction<string>>,
  chords: ChordBeatType[], setChords: Dispatch<SetStateAction<ChordBeatType[]>>,
  lyrics: LyricMeasureType[], setLyrics: Dispatch<SetStateAction<LyricMeasureType[]>>,
  sectionMeasures: ChordBeatType[][][],
  sectionNames: string[], setSectionNames: Dispatch<SetStateAction<string[]>>
  setSectionName: (sectionIndex: number, sectionName: string) => void;
  beatsPerMeasure: number, setBeatsPerMeasure: Dispatch<SetStateAction<number>>,
  setChord: (section: number, measure: number, beat: number, chordName: string) => void,
  setLyric: (section: number, measure: number, content: string) => void;
  exportSongAsJson: () => void;
  importSongFromJson: (jsonData: string) => void;
}>({
  songName: '', setSongName: () => { },
  artist: '', setArtist: () => { },
  chords: [], setChords: () => { },
  lyrics: [], setLyrics: () => { },
  sectionMeasures: [],
  sectionNames: ['Intro'], setSectionNames: () => { },
  setSectionName: () => { },
  beatsPerMeasure: 0, setBeatsPerMeasure: () => { },
  setChord: () => { },
  setLyric: () => { },
  exportSongAsJson: () => { },
  importSongFromJson: () => { },
});

const SongProvider = ({ children }: { children: React.ReactNode }) => {
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [beatsPerMeasure, setBeatsPerMeasure] = useState<number>(4);
  const [sectionNames, setSectionNames] = useState(['Intro']);
  const [chords, setChords] = useState<ChordBeatType[]>(testChords);
  const [lyrics, setLyrics] = useState<LyricMeasureType[]>(testLyrics);

  const setChord = (section: number, measure: number, beat: number, chordName: string) => {
    const matchChord = (chord: ChordBeatType) => !!chord.timing && chord.timing.section === section && chord.timing.measure === measure && chord.timing.beat === beat;
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
      newChords = [...chords, { name: chordName, timing: { section, measure, beat } }];
    }
    newChords.sort((chord1, chord2) => {
      if (chord1.timing!.section > chord2.timing!.section) return 1;
      if (chord1.timing!.section < chord2.timing!.section) return -1;
      if (chord1.timing!.section === chord2.timing!.section) {
        if (chord1.timing!.measure > chord2.timing!.measure) return 1;
        if (chord1.timing!.measure < chord2.timing!.measure) return -1;
        if (chord1.timing!.measure === chord2.timing!.measure) {
          if (chord1.timing!.beat > chord2.timing!.beat) return 1;
          if (chord1.timing!.beat < chord2.timing!.beat) return -1;
        }
      }
      return 0;
    })
    setChords(newChords);
  };

  const setSectionName = (sectionIndex: number, sectionName: string) => {
    setSectionNames(sectionNames.map((name, index) => index === sectionIndex ? sectionName : name));
  }

  const setLyric = (section: number, measure: number, content: string) => {
    const matchLyric = (lyric: LyricMeasureType) => !!lyric.timing && lyric.timing.section === section && lyric.timing.measure === measure;
    let newLyrics = [];
    // Check for an actual match
    const match = lyrics.find(matchLyric);
    if (match) {
      if (content !== '') {
        newLyrics = lyrics.map((lyric) => matchLyric(lyric) ? { ...lyric, content } : lyric);
      } else {
        newLyrics = lyrics.filter((lyric) => !matchLyric(lyric))
      }
    } else {
      // If there's no match, just add the chord
      newLyrics = [...lyrics, { content, timing: { section, measure } }];
    }
    newLyrics.sort((lyric1, lyric2) => {
      if (lyric1.timing!.section > lyric2.timing!.section) return 1;
      if (lyric1.timing!.section < lyric2.timing!.section) return -1;
      if (lyric1.timing!.section === lyric2.timing!.section) {
        if (lyric1.timing!.measure > lyric2.timing!.measure) return 1;
        if (lyric1.timing!.measure < lyric2.timing!.measure) return -1;
      }
      return 0;
    })
    setLyrics(newLyrics);
  };

  const sectionMeasures: ChordBeatType[][][] = [];
  for (let sectionIndex = 0; sectionIndex < sectionNames.length; sectionIndex++) {
    const measures: ChordBeatType[][] = []
    const sectionChords = chords.filter(chord => chord.timing?.section === sectionIndex);
    const lastSectionChord = sectionChords.length === 0 ? undefined : sectionChords[sectionChords.length - 1];
    const maxMeasureIndex = lastSectionChord ? lastSectionChord.timing!.measure + 2 : 1;
    let lastChord;
    for (let measureIndex = 0; measureIndex < maxMeasureIndex; measureIndex++) {
      const beats: ChordBeatType[] = [];
      for (let beatIndex = 0; beatIndex < beatsPerMeasure; beatIndex++) {
        const match = chords.find(({ timing }) => timing && timing.section === sectionIndex && timing.measure === measureIndex && timing.beat === beatIndex);
        if (match) {
          beats.push(match);
          lastChord = match
        } else {
          beats.push({ ...lastChord, timing: undefined })
        }
      }
      measures.push(beats);
    }
    sectionMeasures.push(measures);
  }

  const exportSongAsJson = () => {
    const songExport = JSON.stringify({
      songName,
      beatsPerMeasure,
      chords,
      sectionNames,
    })
    // TODO: write the JSON to a file and download it
    console.log(songExport);
  }

  const importSongFromJson = (jsonData: string) => {
    const songObject = JSON.parse(jsonData);
    if (songObject.songName && songObject.beatsPerMeasure && songObject.chords && songObject.sectionNames) {
      setSongName(songObject.songName);
      setBeatsPerMeasure(songObject.beatsPerMeasure);
      setChords(songObject.chords);
      setSectionNames(songObject.sectionNames);
    } else {
      console.error("Incorrect file format");
    }
  }

  return (
    <SongContext.Provider value={{
      songName, setSongName,
      artist, setArtist,
      chords, setChords,
      lyrics, setLyrics,
      sectionMeasures,
      sectionNames, setSectionNames,
      setSectionName,
      beatsPerMeasure, setBeatsPerMeasure,
      setChord,
      setLyric,
      exportSongAsJson,
      importSongFromJson,
    }}>{children}</SongContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSong = () => useContext(SongContext);

export default SongProvider;