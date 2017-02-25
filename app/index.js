const { app, dialog, globalShortcut } = require('electron')
const { shot } = require('./shot')
const { fixMenu } = require('./appMenu')

app.on('window-all-closed', () => {
  // noop
})

app.on('ready', () => {
  fixMenu()
  registerShortcut()
})

function registerShortcut () {
  let shortcutKey = 'Cmd+Shift+C'
  let ret = globalShortcut.register(shortcutKey, () => {
    shot()
  })
  if (!ret) {
    dialog.showErrorBox({
      content: `${shortcutKey} registration failed`
    })
  }
}
