// This file will only be imported in Electron environment
let electronRemote: any = null

export function initElectron() {
  try {
    if (typeof window !== 'undefined' && window.process && window.process.type) {
      // We're in Electron
      electronRemote = require('@electron/remote')
      return true
    }
  } catch (error) {
    console.error('Not in Electron environment:', error)
  }
  return false
}

export function getElectronRemote() {
  return electronRemote
}