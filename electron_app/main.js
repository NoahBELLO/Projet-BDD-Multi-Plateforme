const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__dirname, 'images/LogoProjet.ico'),
    webPreferences: {
      contextIsolation: false,
    }
  });

  win.loadURL('http://localhost:4200');
}

app.whenReady().then(createWindow);