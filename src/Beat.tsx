import { Input } from '@chakra-ui/react';
// import { useTheme } from './ThemeProvider';
import { ChordBeatType } from './types';

const Beat = ({
  chord,
  onChange,
  last = false,
}: {
  chord: ChordBeatType;
  onChange: (chordName: string) => void;
  last?: boolean;
}) => {
  // const isReal = !!chord?.timing;
  // const { isMd, isLg } = useTheme();
  return (
    <Input
      value={chord.timing ? chord.name : ''}
      placeholder={chord.name}
      onChange={(event) => onChange(event.target.value)}
      onFocus={(event) => event.target.select()}
      borderRadius={0}
      borderTop="none"
      // borderBottom='none'
      borderLeft="none"
      borderRight={last ? 'none' : undefined}
      textAlign="center"
      padding={0}
    />
  );
};

export default Beat;
