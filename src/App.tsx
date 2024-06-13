import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Chord, Scale } from 'tonal';

import NavBar from './NavBar';
import SongGrid from './SongGrid';
import { useSong } from './SongProvider';
import SongUploadArea from './SongUploadArea';
import { Mode } from './types';

const KeySelect = () => {
  const notes = Scale.get('C chromatic').notes;
  const { keyTonic, setKeyTonic, keyMode, setKeyMode } = useSong();
  return (
    <Flex>
      <Select value={keyTonic} onChange={(event) => setKeyTonic(event.target.value)}>
        {notes.map((note) => (
          <option key={note} value={note}>
            {note}
          </option>
        ))}
      </Select>
      <Select
        value={keyMode}
        onChange={(event) => setKeyMode(event.target.value as Mode)}
      >
        {(['major', 'minor'] as Mode[]).map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

const KeyChord = ({ chord }: { chord: string }) => (
  <Button
    onClick={() => {
      console.log(Chord.get(chord));
    }}
  >
    {chord}
  </Button>
);

const KeyScaleChords = () => {
  const { keyScale } = useSong();
  // console.log(keyScale);
  return keyScale ? (
    <>
      <Heading as="h5" size="md" mb={4}>
        Chords
      </Heading>
      <Grid gridTemplateColumns={'repeat(7, 1fr)'} gridTemplateRows={'auto'} gap={2}>
        {keyScale.grades.map((grade) => (
          <Box key={grade} textAlign={'center'}>
            {grade}
          </Box>
        ))}
        {keyScale.triads.map((chord) => (
          <KeyChord key={chord} chord={chord} />
        ))}
        {keyScale.chords.map((chord) => (
          <KeyChord key={chord} chord={chord} />
        ))}
      </Grid>
    </>
  ) : null;
};

const App = () => {
  const {
    songName,
    setSongName,
    artist,
    setArtist,
    beatsPerMeasure,
    setBeatsPerMeasure,
  } = useSong();
  const [inputBeatsPerMeasure, setInputBeatsPerMeasure] = useState(
    beatsPerMeasure.toString(),
  );
  useEffect(() => {
    setInputBeatsPerMeasure(beatsPerMeasure.toString());
  }, [beatsPerMeasure]);
  return (
    <>
      <NavBar />
      <header>
        <Container maxW={'container.lg'} mt={20} mb={[4, 8, 16]}>
          <Flex direction={['column', 'row']} gap={[2, 4, 8]} mb={8}>
            <Box flex={1}>
              <FormControl mb={2}>
                <FormLabel>Title</FormLabel>
                <Input
                  size="lg"
                  value={songName}
                  onChange={(event) => setSongName(event.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Artist</FormLabel>
                <Input
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
