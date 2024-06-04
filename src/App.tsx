import {
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import NavBar from './NavBar';
import SongGrid from './SongGrid';
import { useSong } from './SongProvider';
import SongUploadArea from './SongUploadArea';

const App = () => {
  const { songName, setSongName, artist, setArtist, key, setKey, beatsPerMeasure, setBeatsPerMeasure, } = useSong();
  const [inputBeatsPerMeasure, setInputBeatsPerMeasure] = useState(beatsPerMeasure.toString());
  useEffect(() => {
    setInputBeatsPerMeasure(beatsPerMeasure.toString())
  }, [beatsPerMeasure]);
  return (
    <>
      <NavBar />
      <header>
        <Container maxW={'container.lg'} mb={4}>
          <Flex direction={['column', 'row']} gap={[2, 4, 8]}>
            <Box flex={1}>
              <FormControl mb={2}>
                <FormLabel>Title</FormLabel>
                <Input size='lg' value={songName} onChange={(event) => setSongName(event.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Artist</FormLabel>
                <Input value={artist} onChange={(event) => setArtist(event.target.value)} />
              </FormControl>
            </Box>
            <Box>
              <FormControl mb={2}>
                <FormLabel>Key</FormLabel>
                <Input
                  value={key}
                  onChange={(event) => setKey(event.target.value)}
                />
              </FormControl>
              <FormControl mb={2}>
                <FormLabel>Beats per Measure</FormLabel>
                <Input
                  value={inputBeatsPerMeasure}
                  onChange={(event) => setInputBeatsPerMeasure(event.target.value)}
                  onBlur={() => {
                    const parsed = parseInt(inputBeatsPerMeasure, 10);
                    if (Number.isInteger(parsed)) {
                      setBeatsPerMeasure(parsed)
                    }
                  }}
                />
              </FormControl>
            </Box>
          </Flex>
        </Container>
      </header>
      <main>
        <Container maxW={'container.lg'} mb={4}>
          <SongGrid />
        </Container >
      </main>
      <SongUploadArea />
    </>
  );
}

export default App