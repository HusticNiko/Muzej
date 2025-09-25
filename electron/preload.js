const { contextBridge, ipcRenderer } = require('electron');

try {
  // Identify which display (from URL) purely for logging
  const params = new URLSearchParams((globalThis.location && globalThis.location.search) || '');
  const displayId = params.get('display') || 'unknown';

  console.log('[preload] loaded for display', displayId);
  ipcRenderer.send('renderer:ready', displayId);
  // Forward MAIN → RENDERER as DOM events
  ipcRenderer.on('player:state', (_e, data) => {
    // visible in any window with App.js
    window.dispatchEvent(new CustomEvent('projector-state', { detail: data }));
  });

  ipcRenderer.on('player:control', (_e, msg) => {
    window.dispatchEvent(new CustomEvent('projector-control', { detail: msg }));
  });
  contextBridge.exposeInMainWorld('projectors', {
    playAll: (videoPath) => ipcRenderer.invoke('projectors:playAll', videoPath),
    play1: (videoPath) => ipcRenderer.invoke('projectors:play1', videoPath),
    play2: (videoPath) => ipcRenderer.invoke('projectors:play2', videoPath),
    pauseAll: () => ipcRenderer.invoke('projectors:pauseAll'),
    seekAll: (seconds) => ipcRenderer.invoke('projectors:seekAll', seconds),
    onControl: (cb) => {
      const listener = (_evt, msg) => cb(msg);
      ipcRenderer.on('player:control', listener);
      return () => ipcRenderer.removeListener('player:control', listener);
    },
    // keep your reporting from projector windows
    reportState: (state) => ipcRenderer.send('player:state', { displayId, ...state }),
     onState: (cb) => {
    const listener = (_e, data) => cb(data);
    ipcRenderer.on('player:state', listener);
    return () => ipcRenderer.removeListener('player:state', listener);
  }
  });
   window.__emitTestState = (detail) =>
    window.dispatchEvent(new CustomEvent('projector-state', { detail }));
} catch (e) {
  console.error('[preload] error:', e);
}
