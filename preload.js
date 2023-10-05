const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  notify: (titulo, corpo) => ipcRenderer.send('notify', titulo, corpo)
})
