import { AddIcon, LinkIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, Input } from '@chakra-ui/react';

import { useEffect, useRef, useState } from 'react';
import Beat from './Beat';
import { useSong } from './SongProvider';
import { useTheme } from './ThemeProvider';

const LyricInput = ({ value, onChange }: React.InputHTMLAttributes<HTMLInputElement>) => {
  const MAX_SIZE = 16;
  const inputRef = useRef<HTMLInputElement>(null);
  const [fontSize, setFontSize] = useState(MAX_SIZE);
  useEffect(() => {
    if (!inputRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0 && value && value.toString().length > 0) {
        const [entry] = entries;
        const { inlineSize: width } = entry.borderBoxSize[0];
        const computedSize = ((width - 8) * 1.65) / value.toString().length;
        setFontSize(Math.min(computedSize, MAX_SIZE));
      } else {
        setFontSize(MAX_SIZE);
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
      border="none"
      fontFamily={'monospace'}
      fontSize={`${fontSize}px`}
      transition={'font-size 0.1s linear'}
    />
  );
};

const SongGrid = () => {
  const { zoom } = useTheme();
  const {
    setChord,
    setLyric,
    sectionMeasures,
    sections,
    createSection,
    setSectionName,
    beatsPerMeasure,
  } = useSong();
  return (
    <>
      {sections.map((section, sectionIndex) => {
        const measures = sectionMeasures[sectionIndex];
        return (
          <Box key={`section-${section.id}`} mb={4}>
            <Flex justifyContent={'space-between'}>
              <Input
                size="lg"
                placeholder="Section name e.g Intro, A, Verse 1"
                value={section.name}
                onChange={(event) => setSectionName(section.id, event.target.value)}
                borderRadius={0}
              />
              <Button
                onClick={() =>
                  createSection(
                    section.name + ' (Copy)',
                    section.parentId ? section.parentId : section.id,
                  )
                }
                rightIcon={<LinkIcon />}
              >
                Clone
              </Button>
            </Flex>
            <Grid
              gridTemplateColumns={[
                `repeat(${Math.pow(2, zoom - 2)}, 1fr)`,
                `repeat(${Math.pow(2, zoom - 1)}, 1fr)`,
                `repeat(${Math.pow(2, zoom)}, 1fr)`,
              ]}
              gridTemplateRows="auto"
              rowGap={2}
              columnGap={1}
            >
              {measures.map(({ chordBeats, lyric }, measureIndex) => {
                const isEmpty =
                  chordBeats.filter(({ timing }) => !!timing).length === 0 && !lyric;
                return (
                  <Box
                    key={`measure-${measureIndex}`}
                    borderWidth={1}
                    borderStyle={isEmpty ? 'dashed' : 'solid'}
                  >
                    <Grid gridTemplateColumns={`repeat(${beatsPerMeasure}, 1fr)`}>
                      {chordBeats.map((chord, beatIndex) => (
                        <Beat
                          key={`beat-${beatIndex}`}
                          chord={chord}
                          onChange={(chordName) =>
                            setChord(sectionIndex, measureIndex, beatIndex, chordName)
                          }
                          last={beatIndex === chordBeats.length - 1}
                        />
                      ))}
                    </Grid>
                    <LyricInput
                      value={lyric?.content ?? ''}
                      onChange={(event) =>
                        setLyric(sectionIndex, measureIndex, event.target.value)
                      }
                    />
                  </Box>
                );
              })}
            </Grid>
          </Box>
        );
      })}
      <Button onClick={() => createSection('New section')} rightIcon={<AddIcon />}>
        Add Section
      </Button>
    </>
  );
};

export default SongGrid;
