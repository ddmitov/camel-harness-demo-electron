"use strict";

const electron = require("electron");

// Module to control application life.
const application = electron.app;

// Module to create native browser window.
const browserWindow = electron.BrowserWindow;

// Module to communicate with the render process:
const ipc = require("electron").ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Set the icon path:
  let iconFullPath = __dirname + "/camel.png";

  // Create the browser window:
  mainWindow = new browserWindow({icon: iconFullPath});

  // Maximize the browser window:
  mainWindow.maximize();

  // Load the index.html of the app:
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools:
  // mainWindow.webContents.openDevTools();

  // Close the window when "close" message arrives:
  let clearToClose = false;
  ipc.on("asynchronous-message", function(event, arg) {
    if (arg == "close") {
      clearToClose = true;
      mainWindow.close();
    }
  });

  // Emitted when window closing is attempted:
  mainWindow.on("close", function(event) {
    if (clearToClose === false) {
      event.preventDefault();
      mainWindow.webContents.send("closeInteractiveScript");
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
application.on("ready", createWindow);

// Quit when all windows are closed.
application.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    application.quit();
  }
});

application.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
