import { Box, Container, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import KeyScaleChords from './KeyScaleChords';
import KeySelect from './KeySelect';
import SongGrid from './SongGrid';
import { useSong } from './SongProvider';
import SongUploadArea from './SongUploadArea';
import NavBar from './NavBar.tsx';

const App = () => {
  const {
    songName,
    setSongName,
    artist,
    setArtist,
    beatsPerMeasure,
    setBeatsPerMeasure,
    loadSongWithID,
  } = useSong();
  const [inputBeatsPerMeasure, setInputBeatsPerMeasure] = useState(
    beatsPerMeasure.toString(),
  );
  useEffect(() => {
    setInputBeatsPerMeasure(beatsPerMeasure.toString());
  }, [beatsPerMeasure]);
  const { songId } = useParams();
  useEffect(() => {
    loadSongWithID(songId);
  }, [songId]);
  return (
    <>
      <header>
        <NavBar />
        <Container maxW={'container.lg'} mt={20} mb={[4, 8, 16]}>
          <Flex direction={['column', 'row']} gap={[2, 4, 8]} mb={8}>
            <Box flex={1}>
              <FormControl mb={2}>
                <FormLabel>Title</FormLabel>
                <Input
                  id="song-name"
                  size="lg"
                  value={songName}
                  onChange={(event) => setSongName(event.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Artist</FormLabel>
                <Input
                  id="song-artist"
                  value={artist}
                  onChange={(event) => setArtist(event.target.value)}
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl mb={2}>
                <FormLabel>Key</FormLabel>
                <KeySelect />
              </FormControl>
              <FormControl mb={2}>
                <FormLabel>Beats per Measure</FormLabel>
                <Input
                  id="song-beats-per-measure"
                  value={inputBeatsPerMeasure}
                  onChange={(event) => setInputBeatsPerMeasure(event.target.value)}
                  onBlur={() => {
                    const parsed = parseInt(inputBeatsPerMeasure, 10);
                    if (Number.isInteger(parsed)) {
                      setBeatsPerMeasure(parsed);
                    }
                  }}
                />
              </FormControl>
            </Box>
          </Flex>
          <KeyScaleChords />
        </Container>
      </header>
      <main>
        <Container maxW={'container.lg'} mb={4}>
          <SongGrid />
        </Container>
      </main>
      <SongUploadArea />
    </>
  );
};

export default App;
