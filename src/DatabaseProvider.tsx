import { createClient, PostgrestSingleResponse } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

import { SongExport } from './types';
import { Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const supabase = createClient(
  import.meta.env.VITE_DATABASE_URL,
  import.meta.env.VITE_DATABASE_API_KEY,
);
const SONG_COLLECTION_NAME = 'songs';

type DatabaseContextType = {
  songs: DatabaseSongType[];
  save: (song_data: SongExport, id?: number) => Promise<PostgrestSingleResponse<any[]>>;
  deleteSong: (songId: number) => Promise<void>;
};
const DatabaseContext = createContext<DatabaseContextType>({} as DatabaseContextType);

type DatabaseSongType = {
  id: number;
  song_data: SongExport;
};

const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<DatabaseSongType[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchSongs = async () => {
    const { data } = await supabase.from(SONG_COLLECTION_NAME).select();
    setSongs(data ?? []);
  };

  const save = async (
    song_data: SongExport,
    id?: number,
  ): Promise<PostgrestSingleResponse<any[]>> => {
    let result;
    if (id) {
      result = await supabase
        .from(SONG_COLLECTION_NAME)
        .update({ id, song_data })
        .eq('id', id)
        .select();
    } else {
      result = await supabase.from(SONG_COLLECTION_NAME).insert({ song_data }).select();
    }
    await fetchSongs();
    return result;
  };

  const deleteSong = async (songId: number) => {
    if (confirm('Are you sure you want to delete this song?')) {
      await supabase.from(SONG_COLLECTION_NAME).delete().eq('id', songId);
      await fetchSongs();
      navigate('/');
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchSongs();
      setHasLoaded(true);
    };
    init();
  }, []);

  return hasLoaded ? (
    <DatabaseContext.Provider
      value={{
        songs,
        save,
        deleteSong,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  ) : (
    <Spinner />
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDatabase = () => useContext(DatabaseContext);

export default DatabaseProvider;
