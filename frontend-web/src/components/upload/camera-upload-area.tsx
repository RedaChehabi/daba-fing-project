"use client"

import { useState, useEffect } from 'react'
// Remove direct import of @electron/remote
// import { remote } from '@electron/remote'

export default function CameraUploadArea() {
  const [hasElectron, setHasElectron] = useState(false)
  
  useEffect(() => {
    // Check if running in Electron environment
    if (typeof window !== 'undefined' && window.process && window.process.type) {
      setHasElectron(true)
      // Dynamically import Electron modules only in Electron environment
      import('@electron/remote').then(remote => {
        // Use remote here
      }).catch(err => {
        console.error('Failed to load Electron modules:', err)
      })
    }
  }, [])

  // Rest of your component
  return (
    <div>
      {hasElectron ? (
        // Electron-specific UI
        <div>Electron camera access available</div>
      ) : (
        // Web browser UI
        <div>
          <h2>Camera Upload</h2>
          {/* Use standard web APIs for camera access */}
          <button>Access Camera</button>
        </div>
      )}
    </div>
  )
}
