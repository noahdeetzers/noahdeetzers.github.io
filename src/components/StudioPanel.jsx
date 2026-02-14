import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FabricWarp from './FabricWarp'
import SynthDevice from './synth/SynthDevice'
import DrumDevice from './drum/DrumDevice'
import SynthSeqDevice from './sequencer/SynthSeqDevice'
import DrumSeqDevice from './sequencer/DrumSeqDevice'
import FxDevice from './fx/FxDevice'
import TransportBar from './TransportBar'
import Mixer from './mixer/Mixer'
import Speakers from './Speakers'
import CableOverlay from './CableOverlay'

const panelVariants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    x: '-100%',
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
}

export default function StudioPanel({ open }) {
  const [devicesLanded, setDevicesLanded] = useState(false)
  const panelRef = useRef(null)

  return (
    <AnimatePresence
      onExitComplete={() => setDevicesLanded(false)}
    >
      {open && (
        <motion.div
          ref={panelRef}
          className="studio-panel"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onAnimationComplete={(def) => {
            if (def === 'visible') setDevicesLanded(true)
          }}
        >
          <div className="studio-devices">
            {/* Shared transport */}
            <div className="studio-row studio-row--center">
              <TransportBar />
            </div>

            {/* Two-column layout: Synth chain | Drum chain */}
            <div className="studio-columns">
              <div className="studio-column">
                <FabricWarp intensity={0.6}>
                  <SynthDevice />
                </FabricWarp>
                <FabricWarp intensity={0.5}>
                  <SynthSeqDevice />
                </FabricWarp>
                <FabricWarp intensity={0.5}>
                  <FxDevice chain="synth" portPrefix="synth" />
                </FabricWarp>
              </div>
              <div className="studio-column">
                <FabricWarp intensity={0.6}>
                  <DrumDevice />
                </FabricWarp>
                <FabricWarp intensity={0.5}>
                  <DrumSeqDevice />
                </FabricWarp>
                <FabricWarp intensity={0.5}>
                  <FxDevice chain="drum" portPrefix="drum" />
                </FabricWarp>
              </div>
            </div>

            {/* Full-width: Mixer */}
            <div className="studio-row studio-row--center">
              <FabricWarp intensity={0.4}>
                <Mixer />
              </FabricWarp>
            </div>

            {/* Full-width: Speakers */}
            <div className="studio-row studio-row--center">
              <FabricWarp intensity={0.4}>
                <Speakers />
              </FabricWarp>
            </div>
          </div>

          <CableOverlay panelRef={panelRef} visible={devicesLanded} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
