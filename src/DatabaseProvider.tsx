import { createClient } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { SongExport } from './types';
const supabase = createClient(
  import.meta.env.VITE_DATABASE_URL,
  import.meta.env.VITE_DATABASE_API_KEY,
);
const SONG_COLLECTION_NAME = 'songs';

const DatabaseContext = createContext<{
  songs: DatabaseSongType[];
  selectedSongId?: number;
  setSelectedSongId: React.Dispatch<React.SetStateAction<number | undefined>>;
  save: (song_data: SongExport) => Promise<void>;
  deleteSong: (songId: number) => Promise<void>;
}>({
  songs: [],
  selectedSongId: undefined,
  setSelectedSongId: () => {},
  save: async () => {},
  deleteSong: async () => {},
});

type DatabaseSongType = {
  id: number;
  song_data: SongExport;
};

const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [songs, setSongs] = useState<DatabaseSongType[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<number>();

  const fetchSongs = async () => {
    const { data } = await supabase.from(SONG_COLLECTION_NAME).select();
    if (data) {
      setSongs(data);
    } else {
      setSongs([]);
    }
  };

  const save = async (song_data: SongExport) => {
    await supabase
      .from(SONG_COLLECTION_NAME)
      .upsert({ id: selectedSongId, song_data })
      .select();
    await fetchSongs();
  };

  const deleteSong = async (songId: number) => {
    await supabase.from(SONG_COLLECTION_NAME).delete().eq('id', songId);
    await fetchSongs();
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        songs,
        selectedSongId,
        setSelectedSongId,
        save,
        deleteSong,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDatabase = () => useContext(DatabaseContext);

export default DatabaseProvider;
