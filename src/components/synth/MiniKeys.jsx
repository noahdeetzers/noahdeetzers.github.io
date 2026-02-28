import { useState, useCallback, useRef } from 'react'

const NOTES = [
  { note: 'C4', freq: 261.63, black: false },
  { note: 'C#4', freq: 277.18, black: true },
  { note: 'D4', freq: 293.66, black: false },
  { note: 'D#4', freq: 311.13, black: true },
  { note: 'E4', freq: 329.63, black: false },
  { note: 'F4', freq: 349.23, black: false },
  { note: 'F#4', freq: 369.99, black: true },
  { note: 'G4', freq: 392.0, black: false },
  { note: 'G#4', freq: 415.3, black: true },
  { note: 'A4', freq: 440.0, black: false },
  { note: 'A#4', freq: 466.16, black: true },
  { note: 'B4', freq: 493.88, black: false },
  { note: 'C5', freq: 523.25, black: false },
]

const WHITE_NOTES = NOTES.filter((n) => !n.black)
const BLACK_NOTES = NOTES.filter((n) => n.black)

// Map black key index to its position between white keys
const BLACK_POSITIONS = [0, 1, 3, 4, 5] // after which white key index (0-based)

export default function MiniKeys({ onNoteOn, onNoteOff }) {
  const [activeNote, setActiveNote] = useState(null)
  const activeRef = useRef(null)

  const handleDown = useCallback(
    (freq) => {
      setActiveNote(freq)
      activeRef.current = freq
      onNoteOn(freq)
    },
    [onNoteOn],
  )

  const handleUp = useCallback(() => {
    if (activeRef.current != null) {
      onNoteOff()
      activeRef.current = null
      setActiveNote(null)
    }
  }, [onNoteOff])

  const whiteW = 24
  const whiteH = 64
  const blackW = 16
  const blackH = 38
  const totalW = WHITE_NOTES.length * whiteW

  return (
    <div
      className="mini-keys"
      style={{ position: 'relative', width: totalW, height: whiteH, userSelect: 'none' }}
      onPointerLeave={handleUp}
    >
      {/* White keys */}
      {WHITE_NOTES.map((n, i) => (
        <div
          key={n.note}
          className={`mini-key mini-key--white ${activeNote === n.freq ? 'mini-key--active' : ''}`}
          style={{
            position: 'absolute',
            left: i * whiteW,
            top: 0,
            width: whiteW - 1,
            height: whiteH,
          }}
          onPointerDown={(e) => {
            e.preventDefault()
            handleDown(n.freq)
          }}
          onPointerUp={handleUp}
          onPointerEnter={(e) => {
            if (e.buttons > 0) handleDown(n.freq)
          }}
        />
      ))}
      {/* Black keys */}
      {BLACK_NOTES.map((n, i) => {
        const pos = BLACK_POSITIONS[i]
        return (
          <div
            key={n.note}
            className={`mini-key mini-key--black ${activeNote === n.freq ? 'mini-key--active-black' : ''}`}
            style={{
              position: 'absolute',
              left: pos * whiteW + whiteW - blackW / 2,
              top: 0,
              width: blackW,
              height: blackH,
              zIndex: 2,
            }}
            onPointerDown={(e) => {
              e.preventDefault()
              handleDown(n.freq)
            }}
            onPointerUp={handleUp}
            onPointerEnter={(e) => {
              if (e.buttons > 0) handleDown(n.freq)
            }}
          />
        )
      })}
    </div>
  )
}
