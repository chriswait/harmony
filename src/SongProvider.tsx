import type { KeyScale } from '@tonaljs/key';
import fileDownload from 'js-file-download';
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { Key } from 'tonal';

import { useDatabase } from './DatabaseProvider';
import {
  ChordBeatType,
  LyricMeasureType,
  Measure,
  Mode,
  Section,
  SongExport,
} from './types';
import { sortByTiming } from './util';
import { useNavigate } from 'react-router-dom';

const SongContext = createContext<{
  songName: string;
  setSongName: Dispatch<SetStateAction<string>>;
  artist: string;
  setArtist: Dispatch<SetStateAction<string>>;
  keyTonic: string;
  setKeyTonic: Dispatch<SetStateAction<string>>;
  keyMode: Mode;
  setKeyMode: Dispatch<SetStateAction<Mode>>;
  keyScale?: KeyScale;
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
  saveSongToDatabase: (id?: number) => Promise<void>;
  createNewSong: (songName: string) => Promise<void>;
  initialise: () => void;
  loadSongWithID: (id?: string) => void;
}>({
  songName: '',
  setSongName: () => {},
  artist: '',
  setArtist: () => {},
  keyTonic: '',
  setKeyTonic: () => {},
  keyMode: 'major',
  keyScale: undefined,
  setKeyMode: () => {},
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
  createNewSong: async () => {},
  initialise: () => {},
  loadSongWithID: () => {},
});

const SongProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { save, songs } = useDatabase();
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [keyTonic, setKeyTonic] = useState('');
  const [keyMode, setKeyMode] = useState<Mode>('major');
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
    keyTonic,
    keyMode,
    beatsPerMeasure,
    lyrics,
    chords,
    sections,
  };

  const exportSongAsJson = () => {
    fileDownload(JSON.stringify(songExport), `${songName}-${artist}.json`);
  };

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
    setKeyTonic(songObject.keyTonic);
    setKeyMode(songObject.keyMode as Mode);
    setBeatsPerMeasure(songObject.beatsPerMeasure);
    setChords(songObject.chords);
    setSections(songObject.sections);
  };

  const initialise = () => {
    setSongName('');
    setArtist('');
    setKeyTonic('');
    setKeyMode('major');
    setBeatsPerMeasure(4);
    setLyrics([]);
    setChords([]);
    setSections([]);
  };

  const saveSongToDatabase = async (id?: number) => {
    const result = await save(songExport, id);
    if (result.status === 201 && result.data && result.data.length > 0) {
      navigate(`/${result.data[0].id}`);
    }
  };

  const createNewSong = async (songName: string) => {
    const result = await save({
      songName,
      artist: '',
      keyTonic: '',
      keyMode: 'major',
      beatsPerMeasure: 4,
      lyrics: [],
      chords: [],
      sections: [],
    });
    if (result.status === 201 && result.data && result.data.length > 0) {
      navigate(`/${result.data[0].id}`);
    }
  };

  const loadSongWithID = (id?: string) => {
    let matchingSong;
    if (id) {
      matchingSong = songs.find((song) => song.id === parseInt(id, 10));
    }
    if (matchingSong) {
      importSongFromJson(matchingSong.song_data);
    } else {
      initialise();
      navigate('/');
    }
  };

  const keyScale =
    keyMode === 'major'
      ? Key.majorKey(keyTonic)
      : keyMode === 'minor'
        ? Key.minorKey(keyTonic).natural
        : undefined;

  return (
    <SongContext.Provider
      value={{
        songName,
        setSongName,
        artist,
        setArtist,
        keyTonic,
        setKeyTonic,
        keyMode,
        setKeyMode,
        keyScale,
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
        createNewSong,
        initialise,
        loadSongWithID,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSong = () => useContext(SongContext);

export default SongProvider;
