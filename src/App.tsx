import { useEffect, useState } from 'react'

import './App.css'
import { useTheme } from './ThemeProvider';
import { useSong } from './SongProvider';
import { ChordBeatType } from './types';
import SongUploadArea from './SongUploadArea';

const Beat = ({ chord, onChange }: {
  chord: ChordBeatType;
  onChange: (chordName: string) => void;
}) => {
  const isReal = !!chord?.timing;
  const { isMd, isLg } = useTheme();
  return (
    <input
      value={chord.name}
      onFocus={(event) => event.target.select()}
      onChange={(event) => onChange(event.target.value)}
      style={{
        color: isReal ? 'black' : 'lightgrey',
        borderRight: '1px solid lightgrey',
        borderLeft: '1px solid lightgrey',
        borderTop: 'none',
        borderBottom: 'none',
        height: 40,
        paddingLeft: isLg ? 8 : isMd ? 4 : 0,
        paddingRight: isLg ? 8 : isMd ? 4 : 0,
        paddingTop: 0,
        paddingBottom: 0,
        textAlign: isMd ? 'left' : 'center',
        margin: 0,
        outline: 'none',
        overflow: 'hidden',
        maxWidth: '100%',
      }}
    />
  )
}

const SongGrid = () => {
  const { lyrics, setChord, setLyric, sectionMeasures, sectionNames, setSectionNames, setSectionName, beatsPerMeasure } = useSong();
  const { isMd } = useTheme();
  return (
    <>
      {sectionNames.map((sectionName, sectionIndex) => {
        const measures = sectionMeasures[sectionIndex];
        return (
          <div
            key={`section-${sectionIndex}`}
            style={{ marginBottom: '1rem' }}>
            <input
              value={sectionName}
              onChange={(event) => setSectionName(sectionIndex, event.target.value)}
            />
            <div
              style={{
                border: '1px solid lightgrey',
                display: 'grid',
                gridTemplateColumns: `repeat(${isMd ? 4 : 2}, 1fr)`,
                gridTemplateRows: 'auto',
              }}
            >
              {measures.map((chordBeats, measureIndex) => {
                const isExtra = chordBeats.filter(({ timing }) => !!timing).length === 0
                const lyric = lyrics.find(({ timing }) => timing?.section === sectionIndex && timing.measure === measureIndex)
                return (
                  <div
                    key={`measure-${measureIndex}`}
                    style={{
                      border: isExtra ? '1px dashed lightgrey' : '1px solid black',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${beatsPerMeasure}, 1fr)`,
                      }}
                    >
                      {chordBeats.map((chord, beatIndex) => (
                        <Beat
                          key={`beat-${beatIndex}`}
                          chord={chord}
                          onChange={(chordName) => {
                            setChord(sectionIndex, measureIndex, beatIndex, chordName);
                          }}
                        />
                      ))}
                    </div>
                    <input
                      value={lyric?.content ?? ''}
                      onChange={(event) => setLyric(sectionIndex, measureIndex, event.target.value)}
                      style={{
                        borderLeft: 'none',
                        borderRight: 'none',
                        width: '100%',
                        margin: 0,
                        outline: 'none',
                        overflow: 'hidden',
                        maxWidth: '100%',
                        borderRadius: 0,
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      <button onClick={() => setSectionNames([...sectionNames, ''])}>Add Section +</button >
    </>
  )
};

const App = () => {
  const { songName, setSongName, artist, setArtist, beatsPerMeasure, setBeatsPerMeasure, exportSongAsJson, parseImport, importSongFromJson } = useSong();
  const [inputBeatsPerMeasure, setInputBeatsPerMeasure] = useState(beatsPerMeasure.toString());
  useEffect(() => {
    setInputBeatsPerMeasure(beatsPerMeasure.toString())
  }, [beatsPerMeasure]);
  return (
    <>
      <header style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block' }}>Song</label>
            <input value={songName} onChange={(event) => setSongName(event.target.value)} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block' }}>Artist</label>
            <input value={artist} onChange={(event) => setArtist(event.target.value)} />
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block' }}>Beats Per Measure</label>
          <input
            value={inputBeatsPerMeasure}
            onChange={((event) => setInputBeatsPerMeasure(event.target.value))}
            onBlur={() => {
              const parsed = parseInt(inputBeatsPerMeasure, 10);
              if (Number.isInteger(parsed)) {
                setBeatsPerMeasure(parsed)
              }
            }}
          />
        </div>
        <button onClick={exportSongAsJson}>Export</button>
        <input
          // accept="application/json"
          type="file"
          onChange={async (event) => {
            if (event.target.files) {
              const [file] = event.target.files
              const textContent = await file.text();
              const songObject = parseImport(textContent);
              if (songObject) {
                importSongFromJson(songObject);
              }
            }
          }}
        />
      </header>
      <main>
        <SongGrid />
      </main>
      <SongUploadArea />
    </>
  );
}

export default App