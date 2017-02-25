const electron = require('electron')

window.clipboard = electron.clipboard
window.nativeImage = electron.nativeImage
window.ipcRenderer = electron.ipcRenderer

if (process.env.NODE_ENV === 'development') {
  const { default: installExtension, VUEJS_DEVTOOLS }
    = require('electron-devtools-installer')
  installExtension(VUEJS_DEVTOOLS)
    .then(() => {
      console.log('devtools installed')
    })
    .catch(err => {
      console.error('failed to install devtools')
    })
}
