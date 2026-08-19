import { join } from "node:path"
import { app, BrowserWindow, ipcMain, shell } from "electron"

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(import.meta.dirname, "../preload/index.mjs"),
      sandbox: false,
    },
  })

  mainWindow.on("ready-to-show", () => {
    mainWindow.show()
  })

  // Open external links in the system browser, not in a new window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: "deny" }
  })

  // HMR: electron-vite sets ELECTRON_RENDERER_URL in development
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(import.meta.dirname, "../renderer/index.html"))
  }
}

app.whenReady().then(() => {
  ipcMain.handle("ping", () => "pong")

  createWindow()

  app.on("activate", () => {
    // On macOS, re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})
