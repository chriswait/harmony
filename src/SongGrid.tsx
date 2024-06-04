import {
  Box,
  Button,
  Grid,
  Input
} from '@chakra-ui/react';

import Beat from './Beat';
import { useTheme } from './ThemeProvider';
import { useSong } from './SongProvider';
import { useEffect, useRef, useState } from 'react';

const LyricInput = ({ value, onChange }: React.InputHTMLAttributes<HTMLInputElement>) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fontSize, setFontSize] = useState(16);
  useEffect(() => {
    if (!inputRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0 && value && value.toString().length > 0) {
        const [entry] = entries;
        const { inlineSize: width } = entry.borderBoxSize[0];
        const computedSize = width * 1.5 / value.toString().length;
        setFontSize(Math.min(computedSize, 16));
      } else {
        setFontSize(16);
      }
    });
    resizeObserver.observe(inputRef.current);
    return () => resizeObserver.disconnect(); // clean up 
  }, [value]);
  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={onChange}
      borderRadius={0}
      padding={1}
      border='none'
      fontFamily={'monospace'}
      fontSize={`${fontSize}px`}
    />
  );
}

const SongGrid = () => {
  const { zoom } = useTheme();
  const { setChord, setLyric, sectionMeasures, sectionNames, setSectionNames, setSectionName, beatsPerMeasure } = useSong();
  return (
    <>
      {sectionNames.map((sectionName, sectionIndex) => {
        const measures = sectionMeasures[sectionIndex];
        return (
          <Box key={`section-${sectionIndex}`} mb={4}>
            <Input
              size='lg'
              placeholder='Section name e.g Intro, A, Verse 1'
              value={sectionName}
              onChange={(event) => setSectionName(sectionIndex, event.target.value)}
              borderRadius={0}
            />
            <Grid
              gridTemplateColumns={`repeat(${Math.pow(2, zoom)}, 1fr)`}
              gridTemplateRows='auto'
              rowGap={2}
              columnGap={1}
            >
              {measures.map(({ chordBeats, lyric }, measureIndex) => {
                const isEmpty = chordBeats.filter(({ timing }) => !!timing).length === 0 && !lyric;
                return (
                  <Box
                    key={`measure-${measureIndex}`}
                    borderWidth={1}
                    borderStyle={isEmpty ? 'dashed' : 'solid'}
                  >
                    <Grid gridTemplateColumns={`repeat(${beatsPerMeasure}, 1fr)`} >
                      {chordBeats.map((chord, beatIndex) => (
                        <Beat
                          key={`beat-${beatIndex}`}
                          chord={chord}
                          onChange={(chordName) => setChord(sectionIndex, measureIndex, beatIndex, chordName)}
                          last={beatIndex === chordBeats.length - 1}
                        />
                      ))}
                    </Grid>
                    <LyricInput
                      value={lyric?.content ?? ''}
                      onChange={(event) => setLyric(sectionIndex, measureIndex, event.target.value)}
                    />
                  </Box>
                );
              })}
            </Grid>
          </Box>
        );
      })}
      <Button onClick={() => setSectionNames([...sectionNames, ''])}>Add Section +</Button>
    </>
  );
};

export default SongGrid;