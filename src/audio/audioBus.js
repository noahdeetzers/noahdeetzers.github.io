const listeners = {}

export function on(event, fn) {
  ;(listeners[event] ||= []).push(fn)
  return () => {
    listeners[event] = listeners[event].filter((f) => f !== fn)
  }
}

export function emit(event, data) {
  ;(listeners[event] || []).forEach((fn) => fn(data))
}
