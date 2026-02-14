import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FabricWarp from './FabricWarp'
import SynthDevice from './synth/SynthDevice'
import DrumDevice from './drum/DrumDevice'
import SeqDevice from './sequencer/SeqDevice'
import FxDevice from './fx/FxDevice'
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
            {/* Row 1: Synth + Drum side by side */}
            <div className="studio-row studio-row--pair">
              <FabricWarp intensity={0.6}>
                <SynthDevice />
              </FabricWarp>
              <FabricWarp intensity={0.6}>
                <DrumDevice />
              </FabricWarp>
            </div>

            {/* Row 2: Sequencer centered */}
            <div className="studio-row studio-row--center">
              <FabricWarp intensity={0.5}>
                <SeqDevice />
              </FabricWarp>
            </div>

            {/* Row 3: FX pedals centered */}
            <div className="studio-row studio-row--center">
              <FabricWarp intensity={0.5}>
                <FxDevice />
              </FabricWarp>
            </div>

            {/* Row 4: Speakers centered */}
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
