import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import fileDownload from 'js-file-download';

import { ChordBeatType, LyricMeasureType, Measure, SongExport } from './types';
import { useDatabase } from './DatabaseProvider';

const SongContext = createContext<{
  songName: string, setSongName: Dispatch<SetStateAction<string>>,
  artist: string, setArtist: Dispatch<SetStateAction<string>>,
  chords: ChordBeatType[], setChords: Dispatch<SetStateAction<ChordBeatType[]>>,
  lyrics: LyricMeasureType[], setLyrics: Dispatch<SetStateAction<LyricMeasureType[]>>,
  sectionMeasures: Measure[][],
  sectionNames: string[], setSectionNames: Dispatch<SetStateAction<string[]>>
  setSectionName: (sectionIndex: number, sectionName: string) => void;
  beatsPerMeasure: number, setBeatsPerMeasure: Dispatch<SetStateAction<number>>,
  setChord: (section: number, measure: number, beat: number, chordName: string) => void,
  setLyric: (section: number, measure: number, content: string) => void;
  exportSongAsJson: () => void;
  parseImport: (songObjectJson: string) => SongExport | undefined;
  importSongFromJson: (songObject: SongExport) => void;
  saveSongToDatabase: () => Promise<void>;
  initialise: () => void;
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
  parseImport: () => undefined,
  importSongFromJson: () => { },
  saveSongToDatabase: async () => { },
  initialise: () => { },
});

const SongProvider = ({ children }: { children: React.ReactNode }) => {
  const { save } = useDatabase();
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [beatsPerMeasure, setBeatsPerMeasure] = useState<number>(4);
  const [sectionNames, setSectionNames] = useState<string[]>([]);
  const [chords, setChords] = useState<ChordBeatType[]>([]);
  const [lyrics, setLyrics] = useState<LyricMeasureType[]>([]);

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

  const sectionMeasures: Measure[][] = [];
  for (let sectionIndex = 0; sectionIndex < sectionNames.length; sectionIndex++) {
    const measures: Measure[] = []
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
      const lyric = lyrics.find(({ timing }) => timing?.section === sectionIndex && timing.measure === measureIndex)
      measures.push({ chordBeats: beats, lyric });
    }
    sectionMeasures.push(measures);
  }

  const songExport: SongExport = {
    songName,
    artist,
    lyrics,
    beatsPerMeasure,
    chords,
    sectionNames,
  };

  const exportSongAsJson = () => {
    fileDownload(JSON.stringify(songExport), `${songName}-${artist}.json`);
  }

  const saveSongToDatabase = async () => save(songExport);

  const parseImport = (songObjectJson: string): SongExport | undefined => {
    const songObject = JSON.parse(songObjectJson);
    if (songObject && songObject.songName) {
      const result: SongExport = songObject;
      return result;
    }
  }

  const importSongFromJson = (songObject: SongExport) => {
    setSongName(songObject.songName);
    setArtist(songObject.artist);
    setLyrics(songObject.lyrics)
    setBeatsPerMeasure(songObject.beatsPerMeasure);
    setChords(songObject.chords);
    setSectionNames(songObject.sectionNames);
  }

  const initialise = () => {
    setSongName('');
    setArtist('');
    setLyrics([]);
    setBeatsPerMeasure(4);
    setChords([]);
    setSectionNames([]);
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
      parseImport,
      importSongFromJson,
      saveSongToDatabase,
      initialise
    }}>{children}</SongContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSong = () => useContext(SongContext);

export default SongProvider;