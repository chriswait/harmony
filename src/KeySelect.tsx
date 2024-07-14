import { Flex, Select } from '@chakra-ui/react';
import { Scale } from 'tonal';

import { useSong } from './SongProvider';
import { Mode } from './types';

const KeySelect = () => {
  const notes = Scale.get('C chromatic').notes;
  const { keyTonic, setKeyTonic, keyMode, setKeyMode } = useSong();
  return (
    <Flex>
      <Select
        id="key-tonic"
        value={keyTonic}
        onChange={(event) => setKeyTonic(event.target.value)}
      >
        <option value=""></option>
        {notes.map((note) => (
          <option key={note} value={note}>
            {note}
          </option>
        ))}
      </Select>
      <Select
        id="key-mode"
        value={keyMode}
        onChange={(event) => setKeyMode(event.target.value as Mode)}
      >
        <option value=""></option>
        {(['major', 'minor'] as Mode[]).map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

export default KeySelect;
