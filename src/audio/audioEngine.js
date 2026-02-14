let ctx = null
let deviceBus = null
let masterGain = null
let analyser = null

export function getAudioContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function getDeviceBus() {
  if (!deviceBus) {
    const c = getAudioContext()
    deviceBus = c.createGain()
    deviceBus.connect(getMasterBus())
  }
  return deviceBus
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

export function insertFxChain(fxInput, fxOutput) {
  const bus = getDeviceBus()
  const master = getMasterBus()
  try { bus.disconnect() } catch (e) { /* may already be disconnected */ }
  bus.connect(fxInput)
  fxOutput.connect(master)
}

export function removeFxChain() {
  if (!deviceBus || !masterGain) return
  try { deviceBus.disconnect() } catch (e) {}
  deviceBus.connect(masterGain)
}
