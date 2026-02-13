import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { myWork, featuredIn } from '../data/music'

function SpotifyEmbed({ trackId, type = 'track' }) {
  return (
    <iframe
      key={trackId}
      src={`https://open.spotify.com/embed/${type}/${trackId}?utm_source=generator&theme=0`}
      width="100%"
      height="152"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify player"
      className="spotify-embed"
    />
  )
}

function Player({ title, subtitle, tracks }) {
  const [index, setIndex] = useState(0)
  const track = tracks[index]
  const hasPrev = index > 0
  const hasNext = index < tracks.length - 1

  return (
    <div className="player">
      <div className="player-header">
        <h3 className="player-title">{title}</h3>
        <p className="player-subtitle">{subtitle}</p>
      </div>

      <div className="player-body">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="player-track"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {track.spotifyId ? (
              <SpotifyEmbed
                trackId={track.spotifyId}
                type={track.embedType || 'track'}
              />
            ) : (
              <div className="player-placeholder">
                <div className="player-placeholder-icon">♫</div>
              </div>
            )}
            <div className="player-track-info">
              <span className="player-track-title">{track.title}</span>
              <span className="player-track-detail">
                {track.artist && track.artist}
                {track.artist && track.role && ' · '}
                {track.role && track.role}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="player-controls">
        <button
          className="player-btn"
          onClick={() => setIndex(i => i - 1)}
          disabled={!hasPrev}
          aria-label="Previous track"
        >
          ←
        </button>
        <span className="player-counter">{index + 1} / {tracks.length}</span>
        <button
          className="player-btn"
          onClick={() => setIndex(i => i + 1)}
          disabled={!hasNext}
          aria-label="Next track"
        >
          →
        </button>
      </div>
    </div>
  )
}

export default function Music() {
  return (
    <section className="music" id="music">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Music
      </motion.h2>

      <motion.div
        className="players-grid"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Player
          title="Songs I've Worked On"
          subtitle="Tracks I've contributed to as a musician or producer"
          tracks={myWork}
        />
        <Player
          title="Powered by My Plugins"
          subtitle="Songs produced using Fine Classics plugins"
          tracks={featuredIn}
        />
      </motion.div>
    </section>
  )
}
