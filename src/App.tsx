import { useEffect, useState } from 'react'

import './App.css'
import { useTheme } from './ThemeProvider';
import { useSong } from './SongProvider';
import { ChordBeatType } from './types';
import SongUploadArea from './SongUploadArea';
import { useDatabase } from './DatabaseProvider';

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
  const { setChord, setLyric, sectionMeasures, sectionNames, setSectionNames, setSectionName, beatsPerMeasure } = useSong();
  const { zoom, setZoom } = useTheme();
  return (
    <>
      <label style={{ display: 'block', marginBottom: '1rem' }}>Zoom
        <input
          value={zoom}
          onChange={(event) => {
            const intVal = parseInt(event.target.value, 10);
            setZoom(Math.max(Math.min(intVal, 4), 0))
          }}
          type='number'
          min={0}
          max={4}
        />
      </label>
      {sectionNames.map((sectionName, sectionIndex) => {
        const measures = sectionMeasures[sectionIndex];
        return (
          <div
            key={`section-${sectionIndex}`}
            style={{ marginBottom: '2rem' }}>
            <input
              value={sectionName}
              onChange={(event) => setSectionName(sectionIndex, event.target.value)}
              style={{ marginBottom: '1rem' }}
            />
            <div
              style={{
                border: '1px solid lightgrey',
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.pow(2, zoom - 1)}, 1fr)`,
                gridTemplateRows: 'auto',
              }}
            >
              {measures.map(({ chordBeats, lyric }, measureIndex) => {
                const isExtra = chordBeats.filter(({ timing }) => !!timing).length === 0
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

const SongList = () => {
  const { songs, selectedSongId, setSelectedSongId } = useDatabase();
  const { importSongFromJson } = useSong();
  return (
    <nav style={{ display: 'flex', gap: '0.5rem' }}>
      {songs.map((song) =>
        <button
          key={`song-${song.id}`}
          onClick={() => {
            setSelectedSongId(song.id);
            importSongFromJson(song.song_data);
          }}
          style={{
            fontWeight: song.id === selectedSongId ? 'bold' : undefined
          }}
        >
          {song.song_data.songName}
        </button>
      )}
    </nav>
  )
};

const App = () => {
  const { selectedSongId, deleteSong } = useDatabase();
  const { songName, setSongName, artist, setArtist, beatsPerMeasure, setBeatsPerMeasure, exportSongAsJson, parseImport, importSongFromJson, saveSongToDatabase } = useSong();
  const [inputBeatsPerMeasure, setInputBeatsPerMeasure] = useState(beatsPerMeasure.toString());
  useEffect(() => {
    setInputBeatsPerMeasure(beatsPerMeasure.toString())
  }, [beatsPerMeasure]);
  return (
    <>
      <header style={{ marginBottom: '1rem', display: 'grid', gap: '1rem' }}>
        <SongList />
        <div style={{ display: 'flex', gap: '1rem', }}>
          <div>
            <label style={{ display: 'block' }}>Song</label>
            <input value={songName} onChange={(event) => setSongName(event.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block' }}>Artist</label>
            <input value={artist} onChange={(event) => setArtist(event.target.value)} />
          </div>
        </div>
        <div>
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
        <div
          style={{
            // display: 'flex',
            gap: '0.5rem', display: 'none'
          }}
        >
          <button onClick={exportSongAsJson}>Export</button>
          <input
            accept="application/json"
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
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', }}>
          <button onClick={saveSongToDatabase}>Save</button>
          <button disabled={!selectedSongId} onClick={() => {
            if (selectedSongId && confirm('Are you sure you want to delete this song?')) {
              deleteSong(selectedSongId)
            }
          }}>Delete</button>
        </div>
      </header>
      <hr />
      <main>
        <SongGrid />
      </main>
      <SongUploadArea />
    </>
  );
}

export default App