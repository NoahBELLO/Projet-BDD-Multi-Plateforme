const { app, BrowserWindow } = require("electron");
const path = require("path");
const axios = require("axios");

function createWindow() {
  const win = new BrowserWindow({
    // width: 1000,
    // height: 800,
    // fullscreen: true,
    show: false,
    icon: path.join(__dirname, "images/LogoProjet.ico"),
    webPreferences: {
      contextIsolation: false,
    },
  });

  win.maximize();
  win.show();
  win.loadURL("http://localhost:4200");
}

async function isServerAvailable(url) {
  try {
    const res = await axios.get(url);
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

app.whenReady().then(async () => {
  const available = await isServerAvailable("http://localhost:4200");

  if (!available) {
    console.error("Le serveur Angular est inaccessible.");
    app.quit();
  }

  createWindow();
});
