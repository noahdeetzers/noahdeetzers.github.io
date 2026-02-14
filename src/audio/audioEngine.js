let ctx = null
let masterGain = null

export function getAudioContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function getMasterBus() {
  if (!masterGain) {
    const c = getAudioContext()
    masterGain = c.createGain()
    masterGain.gain.value = 0.7
    masterGain.connect(c.destination)
  }
  return masterGain
}
