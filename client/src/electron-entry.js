const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let win;

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600});

    win.loadURL('http://localhost:3000');

    // win.webContents.openDevTools();

    win.on('close', function() {
        win = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
    app.quit();
});

app.on('activate', function() {
    if(win == null) {
        createWindow();
    }
})