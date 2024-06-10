import { DeleteIcon } from '@chakra-ui/icons';
import { Button, IconButton, List, ListItem } from '@chakra-ui/react';

import { useDatabase } from './DatabaseProvider';
import { useSong } from './SongProvider';

const SongList = () => {
  const { songs, selectedSongId, setSelectedSongId, deleteSong } = useDatabase();
  const { importSongFromJson } = useSong();
  return (
    <List spacing={2}>
      {songs.map((song) => (
        <ListItem key={`song-${song.id}`} display="flex" justifyContent={'space-between'}>
          <Button
            onClick={() => {
              setSelectedSongId(song.id);
              importSongFromJson(song.song_data);
            }}
            style={{ fontWeight: song.id === selectedSongId ? 'bold' : undefined }}
          >
            {song.song_data.songName}
          </Button>
          <IconButton aria-label="Delete" onClick={() => deleteSong(song.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default SongList;
