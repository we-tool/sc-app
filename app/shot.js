const { spawn } = require('child_process')
const { dialog, ipcMain, BrowserWindow } = require('electron')

let isShotting = false
exports.shot = shot

function shot () {
  if (isShotting) return
  isShotting = true

  // note: Cannot require `screen` before app is ready
  // todo: multiple screens capture
  let { screen } = require('electron')
  let displays = screen.getAllDisplays()
  let display = displays[0]

  return Promise.all([
    popWin(display),
    screencapture(display)
  ])
  .then(([win]) => {
    win.webContents.send('paste-ready')
    return new Promise(resolve => {
      ipcMain.on('crop-finish', () => {
        resolve()
      })
    })
  })
  .catch(err => {
    dialog.showErrorBox({
      content: `${err}`
    })
  })
  .then(() => {
    isShotting = false
  })
}

function popWin (display) {
  let { x, y, width, height } = display.workArea
  let win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      preload: `${__dirname}/displayPreload.js`
    },
    x, y, width, height,
    resizable: false,
    frame: false,
    // skipTaskbar: true,
    // alwaysOnTop: true,
    transparent: true,
    show: false
  })
  win.loadURL(`file://${__dirname}/display.html`)
  // win.on('close', event => {
  //   event.preventDefault()
  // })
  return new Promise(resolve => {
    win.once('ready-to-show', () => {
      win.show()
      resolve(win)
    })
  })
}

function screencapture (display) {
  let { x, y, width, height } = display.workArea
  let args = ['-x', '-c', '-R' + [x, y, width, height].join(',')]
  let child = spawn('screencapture', args)
  return new Promise((resolve, reject) => {
    child.on('error', err => {
      reject(err)
    })
    child.on('close', code => {
      if (code !== 0) {
        return reject(new Error(`screencapture closed with code ${code}`))
      }
      resolve()
    })
  })
}
