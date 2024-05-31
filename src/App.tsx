import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import './App.css'
import { useSong } from './SongProvider';
import { ChordBeatType } from './types';

const Beat = ({ chord, onChange }: {
  chord: ChordBeatType;
  onChange: (chordName: string) => void;
}) => {
  const isReal = !!chord?.timing;
  const isMd = useMediaQuery({ query: '(min-width: 776px)' })
  return (
    <input
      value={chord.name}
      onFocus={(event) => event.target.select()}
      onChange={(event) => onChange(event.target.value)}
      style={{
        color: isReal ? 'black' : 'grey',
        borderRight: '1px solid lightgrey',
        borderLeft: '1px solid lightgrey',
        borderTop: 'none',
        borderBottom: 'none',
        maxWidth: '100%',
        overflow: 'hidden',
        height: 40,
        margin: 0,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 0,
        paddingBottom: 0,
        outline: 'none',
        textAlign: isMd ? 'left' : 'center',
      }}
    />
  )
}

const App = () => {
  const { setChord, sectionMeasures, sectionNames, setSectionNames, setSectionName, beatsPerMeasure, setBeatsPerMeasure } = useSong();
  const [inputBeatsPerMeasure, setInputBeatsPerMeasure] = useState(beatsPerMeasure.toString());
  const isMd = useMediaQuery({ query: '(min-width: 776px)' })

  return (
    <>
      <h1>Harmony Club</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block' }}>Beats Per Measure</label>
        <input
          value={inputBeatsPerMeasure}
          onChange={((event) => setInputBeatsPerMeasure(event.target.value))}
          onBlur={() => Number.isInteger(inputBeatsPerMeasure) ? setBeatsPerMeasure(parseInt(inputBeatsPerMeasure, 10)) : undefined}
        />
      </div>
      {sectionNames.map((sectionName, sectionIndex) => {
        const measures = sectionMeasures[sectionIndex];
        return (
          <div style={{ marginBottom: '1rem' }}>
            <input value={sectionName} onChange={(event) => setSectionName(sectionIndex, event.target.value)} />
            <div style={{
              border: '1px solid lightgrey',
              display: 'grid',
              gridTemplateColumns: `repeat(${isMd ? 4 : 2}, 1fr)`,
              gridTemplateRows: 'auto',
            }}>
              {measures.map((chordBeats, measureIndex) => (
                <div
                  key={`measure-${measureIndex}`}
                  style={{
                    border: '1px solid black',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${beatsPerMeasure}, 1fr)`,
                  }}
                >
                  {chordBeats.map((chord, beatIndex) => (
                    <Beat
                      chord={chord}
                      key={`beat-${beatIndex}`}
                      onChange={(chordName) => {
                        setChord(sectionIndex, measureIndex, beatIndex, chordName);
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )
      })}
      <button onClick={() => setSectionNames([...sectionNames, ''])}>Add Section +</button >
    </>
  );
}

export default App