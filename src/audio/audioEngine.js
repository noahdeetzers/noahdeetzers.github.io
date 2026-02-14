let ctx = null
let synthBus = null
let drumBus = null
let synthChannel = null
let drumChannel = null
let masterGain = null
let analyser = null

export function getAudioContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function getSynthBus() {
  if (!synthBus) {
    const c = getAudioContext()
    synthBus = c.createGain()
    synthBus.connect(getSynthChannel())
  }
  return synthBus
}

export function getDrumBus() {
  if (!drumBus) {
    const c = getAudioContext()
    drumBus = c.createGain()
    drumBus.connect(getDrumChannel())
  }
  return drumBus
}

export function getSynthChannel() {
  if (!synthChannel) {
    const c = getAudioContext()
    synthChannel = c.createGain()
    synthChannel.gain.value = 0.7
    synthChannel.connect(getMasterBus())
  }
  return synthChannel
}

export function getDrumChannel() {
  if (!drumChannel) {
    const c = getAudioContext()
    drumChannel = c.createGain()
    drumChannel.gain.value = 0.7
    drumChannel.connect(getMasterBus())
  }
  return drumChannel
}

export function getMasterBus() {
  if (!masterGain) {
    const c = getAudioContext()
    analyser = c.createAnalyser()
    analyser.fftSize = 256
    masterGain = c.createGain()
    masterGain.gain.value = 0.7
    masterGain.connect(analyser)
    analyser.connect(c.destination)
  }
  return masterGain
}

export function getAnalyser() {
  return analyser
}

export function insertFxChain(chain, fxInput, fxOutput) {
  const bus = chain === 'drum' ? getDrumBus() : getSynthBus()
  const channel = chain === 'drum' ? getDrumChannel() : getSynthChannel()
  try { bus.disconnect() } catch (e) { /* may already be disconnected */ }
  bus.connect(fxInput)
  fxOutput.connect(channel)
}

export function removeFxChain(chain) {
  const bus = chain === 'drum' ? drumBus : synthBus
  const channel = chain === 'drum' ? drumChannel : synthChannel
  if (!bus || !channel) return
  try { bus.disconnect() } catch (e) {}
  bus.connect(channel)
}
