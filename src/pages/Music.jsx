import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from '../components/FadeIn'
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

function Player({ tracks, title, showDetails = false }) {
  const [index, setIndex] = useState(0)
  const track = tracks[index]

  return (
    <FadeIn>
      <h2 className="section-heading">{title}</h2>
      <div className="player">
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
              <SpotifyEmbed
                trackId={track.spotifyId}
                type={track.embedType || 'track'}
              />
              <div className="player-track-info">
                <span className="player-track-title">{track.title}</span>
                {showDetails && (
                  <span className="player-track-detail">
                    {track.artist}{track.role && ` · ${track.role}`}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="player-controls">
          <button
            className="player-btn"
            onClick={() => setIndex(i => i - 1)}
            disabled={index === 0}
            aria-label="Previous track"
          >
            &larr;
          </button>
          <span className="player-counter">{index + 1} / {tracks.length}</span>
          <button
            className="player-btn"
            onClick={() => setIndex(i => i + 1)}
            disabled={index === tracks.length - 1}
            aria-label="Next track"
          >
            &rarr;
          </button>
        </div>
      </div>
    </FadeIn>
  )
}

export default function MusicPage() {
  return (
    <section className="page-section">
      <FadeIn>
        <h1 className="page-title">Music</h1>
        <p className="page-subtitle">Songs I've worked on and tracks powered by my plugins.</p>
      </FadeIn>

      <div className="music-players">
        <Player tracks={myWork} title="Songs I've Worked On" showDetails />
        <Player tracks={featuredIn} title="Powered by My Plugins" />
      </div>
    </section>
  )
}
