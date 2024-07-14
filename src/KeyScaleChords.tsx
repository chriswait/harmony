import { Button, Heading, Grid, Box } from '@chakra-ui/react';
import { Chord } from 'tonal';
import { useSong } from './SongProvider';

const KeyChord = ({
  chord,
  onClick,
}: {
  chord: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => <Button onClick={onClick}>{chord}</Button>;

const KeyScaleChords = () => {
  const { keyScale } = useSong();
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
          <KeyChord
            key={chord}
            chord={chord}
            onClick={() => console.log(Chord.get(chord))}
          />
        ))}
        {keyScale.chords.map((chord) => (
          <KeyChord
            key={chord}
            chord={chord}
            onClick={() => console.log(Chord.get(chord))}
          />
        ))}
      </Grid>
    </>
  ) : null;
};

export default KeyScaleChords;
