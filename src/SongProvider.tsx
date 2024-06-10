import fileDownload from 'js-file-download';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useDatabase } from './DatabaseProvider';
import {
  ChordBeatType,
  LyricMeasureType,
  Measure,
  Section,
  SongExport,
  Timing,
} from './types';

const sortByTiming = (thing1: { timing?: Timing }, thing2: { timing?: Timing }) => {
  if (thing1.timing!.section > thing2.timing!.section) return 1;
  if (thing1.timing!.section < thing2.timing!.section) return -1;
  if (thing1.timing!.section === thing2.timing!.section) {
    if (thing1.timing!.measure > thing2.timing!.measure) return 1;
    if (thing1.timing!.measure < thing2.timing!.measure) return -1;
    if (thing1.timing!.measure === thing2.timing!.measure) {
      if ((thing1.timing?.beat ?? 0) > (thing2.timing?.beat ?? 0)) return 1;
      if ((thing1.timing?.beat ?? 0) < (thing2.timing?.beat ?? 0)) return -1;
      return 0;
    }
  }
  return 0;
};

const SongContext = createContext<{
  songName: string;
  setSongName: Dispatch<SetStateAction<string>>;
  artist: string;
  setArtist: Dispatch<SetStateAction<string>>;
  key: string;
  setKey: Dispatch<SetStateAction<string>>;
  chords: ChordBeatType[];
  setChords: Dispatch<SetStateAction<ChordBeatType[]>>;
  lyrics: LyricMeasureType[];
  setLyrics: Dispatch<SetStateAction<LyricMeasureType[]>>;
  sectionMeasures: Measure[][];
  sections: Section[];
  createSection: (name: string, parentId?: string) => void;
  setSectionName: (sectionId: string, sectionName: string) => void;
  beatsPerMeasure: number;
  setBeatsPerMeasure: Dispatch<SetStateAction<number>>;
  setChord: (section: number, measure: number, beat: number, chordName: string) => void;
  setLyric: (section: number, measure: number, content: string) => void;
  exportSongAsJson: () => void;
  parseImport: (songObjectJson: string) => SongExport | undefined;
  importSongFromJson: (songObject: SongExport) => void;
  saveSongToDatabase: () => Promise<void>;
  initialise: () => void;
}>({
  songName: '',
  setSongName: () => {},
  artist: '',
  setArtist: () => {},
  key: '',
  setKey: () => {},
  chords: [],
  setChords: () => {},
  lyrics: [],
  setLyrics: () => {},
  sectionMeasures: [],
  sections: [],
  createSection: () => {},
  setSectionName: () => {},
  beatsPerMeasure: 0,
  setBeatsPerMeasure: () => {},
  setChord: () => {},
  setLyric: () => {},
  exportSongAsJson: () => {},
  parseImport: () => undefined,
  importSongFromJson: () => {},
  saveSongToDatabase: async () => {},
  initialise: () => {},
});

const SongProvider = ({ children }: { children: React.ReactNode }) => {
  const { save, selectedSong } = useDatabase();
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [key, setKey] = useState('');
  const [beatsPerMeasure, setBeatsPerMeasure] = useState<number>(4);
  const [sections, setSections] = useState<Section[]>([]);
  const [chords, setChords] = useState<ChordBeatType[]>([]);
  const [lyrics, setLyrics] = useState<LyricMeasureType[]>([]);

  const setChord = (
    section: number,
    measure: number,
    beat: number,
    chordName: string,
  ) => {
    const matchChord = (chord: ChordBeatType) =>
      !!chord.timing &&
      chord.timing.section === section &&
      chord.timing.measure === measure &&
      chord.timing.beat === beat;
    let newChords = [];
    // Check for an actual match
    const match = chords.find(matchChord);
    if (match) {
      if (chordName !== '') {
        newChords = chords.map((chord) =>
          matchChord(chord) ? { ...chord, name: chordName } : chord,
        );
      } else {
        newChords = chords.filter((chord) => !matchChord(chord));
      }
    } else {
      // If there's no match, just add the chord
      newChords = [...chords, { name: chordName, timing: { section, measure, beat } }];
    }
    newChords.sort(sortByTiming);
    setChords(newChords);
  };

  const setSectionName = (sectionId: string, sectionName: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, name: sectionName } : section,
      ),
    );
  };

  const createSection = (name: string, parentId?: string) => {
    setSections([
      ...sections,
      {
        id: crypto.randomUUID(),
        name,
        parentId,
      },
    ]);
  };

  const setLyric = (section: number, measure: number, content: string) => {
    const matchLyric = (lyric: LyricMeasureType) =>
      !!lyric.timing &&
      lyric.timing.section === section &&
      lyric.timing.measure === measure;
    let newLyrics = [];
    // Check for an actual match
    const match = lyrics.find(matchLyric);
    if (match) {
      if (content !== '') {
        newLyrics = lyrics.map((lyric) =>
          matchLyric(lyric) ? { ...lyric, content } : lyric,
        );
      } else {
        newLyrics = lyrics.filter((lyric) => !matchLyric(lyric));
      }
    } else {
      // If there's no match, just add the chord
      newLyrics = [...lyrics, { content, timing: { section, measure } }];
    }
    newLyrics.sort(sortByTiming);
    setLyrics(newLyrics);
  };

  const sectionMeasures: Measure[][] = sections.map((section, sectionIndex) => {
    const measures: Measure[] = [];
    const parentSectionIndex = section.parentId
      ? sections.findIndex((parentSection) => parentSection.id === section.parentId)
      : sectionIndex;
    const sectionChords = chords.filter(
      (chord) => chord.timing?.section === parentSectionIndex,
    );
    const lastSectionChord =
      sectionChords.length === 0 ? undefined : sectionChords[sectionChords.length - 1];
    const maxMeasureIndex = lastSectionChord ? lastSectionChord.timing!.measure + 2 : 1;
    let lastChord;
    for (let measureIndex = 0; measureIndex < maxMeasureIndex; measureIndex++) {
      const beats: ChordBeatType[] = [];
      for (let beatIndex = 0; beatIndex < beatsPerMeasure; beatIndex++) {
        const match = chords.find(
          ({ timing }) =>
            timing &&
            timing.section === parentSectionIndex && // grab chords from parent section
            timing.measure === measureIndex &&
            timing.beat === beatIndex,
        );
        if (match) {
          beats.push(match);
          lastChord = match;
        } else {
          beats.push({ ...lastChord, timing: undefined });
        }
      }
      const lyric = lyrics.find(
        ({ timing }) =>
          timing?.section === sectionIndex && timing.measure === measureIndex, // grab lyrics from current section
      );
      measures.push({ chordBeats: beats, lyric });
    }
    return measures;
  });

  const songExport: SongExport = {
    songName,
    artist,
    key,
    beatsPerMeasure,
    lyrics,
    chords,
    sections,
  };

  const exportSongAsJson = () => {
    fileDownload(JSON.stringify(songExport), `${songName}-${artist}.json`);
  };

  const saveSongToDatabase = async () => save(songExport);

  const parseImport = (songObjectJson: string): SongExport | undefined => {
    const songObject = JSON.parse(songObjectJson);
    if (songObject && songObject.songName) {
      const result: SongExport = songObject;
      return result;
    }
  };

  const importSongFromJson = (songObject: SongExport) => {
    setSongName(songObject.songName);
    setArtist(songObject.artist);
    setLyrics(songObject.lyrics);
    setKey(songObject.key);
    setBeatsPerMeasure(songObject.beatsPerMeasure);
    setChords(songObject.chords);
    setSections(songObject.sections);
  };

  const initialise = () => {
    setSongName('');
    setArtist('');
    setKey('');
    setBeatsPerMeasure(4);
    setLyrics([]);
    setChords([]);
    setSections([]);
  };

  useEffect(() => {
    if (selectedSong) {
      importSongFromJson(selectedSong.song_data);
    }
  }, [selectedSong]);

  return (
    <SongContext.Provider
      value={{
        songName,
        setSongName,
        artist,
        setArtist,
        key,
        setKey,
        beatsPerMeasure,
        setBeatsPerMeasure,
        chords,
        setChords,
        lyrics,
        setLyrics,
        sectionMeasures,
        sections,
        createSection,
        setSectionName,
        setChord,
        setLyric,
        exportSongAsJson,
        parseImport,
        importSongFromJson,
        saveSongToDatabase,
        initialise,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSong = () => useContext(SongContext);

export default SongProvider;
