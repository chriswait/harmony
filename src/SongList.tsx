import {
  Button,
  List,
  ListItem
} from '@chakra-ui/react';
import { useSong } from './SongProvider';
import { useDatabase } from './DatabaseProvider';

const SongList = () => {
  const { songs, selectedSongId, setSelectedSongId } = useDatabase();
  const { importSongFromJson } = useSong();
  return (
    <List spacing={2}>
      {songs.map((song) => <ListItem key={`song-${song.id}`}>
        <Button
          onClick={() => {
            setSelectedSongId(song.id);
            importSongFromJson(song.song_data);
          }}
          style={{ fontWeight: song.id === selectedSongId ? 'bold' : undefined }}
        >
          {song.song_data.songName}
        </Button>
      </ListItem>
      )}
    </List>
  );
};

export default SongList;