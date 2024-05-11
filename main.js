/*
* MIT License
* 
* Copyright (c) 2024 Maksym Makhrevych
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');

const isDev = false;//process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow;
let aboutWindow;

// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1000 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/logo.png`,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Show devtools automatically if in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

   mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// About Window
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    width: 300,
    height: 300,
    title: 'About Microservice Gen',
    icon: `${__dirname}/assets/icons/logo.png`,
  });

   aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}

// When the app is ready, create the window
app.on('ready', () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // Remove variable from memory
  mainWindow.on('closed', () => (mainWindow = null));
});

// Menu template
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: 'fileMenu',
  },
  ...(!isMac
    ? [
        {
          label: 'Help',
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
];

const shellCommand = os.platform() === 'win32' ? `${path.join('C:', 'Program Files', 'Git', 'bin', 'bash.exe')}` : 'bash';

ipcMain.handle('executeMicroservice1', async (event, directory) => {
  const scriptPath = path.join(__dirname, './generator-scripts/microservice-generator1.sh');
  // map path
  const unixStyleDirectory = directory.replace(/\\/g, '/');
  const directoryName = directory.split('\\').pop();
  mainWindow.webContents.send('process-started', 'Generating DTOs for /' + directoryName+' ...');
  exec(`"${shellCommand}" "${scriptPath}" "${unixStyleDirectory}"`, (error, stdout, stderr) => {
    if (error) {
      mainWindow.webContents.send('process-info', 'Error generating DTOs for /' + directoryName+ ": "+error);
      return;
    }
    
    mainWindow.webContents.send('process-info', 'Finished DTOs for /' + directoryName);
  });
});

ipcMain.handle('executeMicroservice2', async (event, directory) => {
  const scriptPath = path.join(__dirname, './generator-scripts/microservice-generator2.sh');
  // map path
  const unixStyleDirectory = directory.replace(/\\/g, '/');
  const directoryName = directory.split('\\').pop();
  mainWindow.webContents.send('process-started', 'Generating Microservice for /' + directoryName+' ...');
  exec(`"${shellCommand}" "${scriptPath}" "${unixStyleDirectory}"`, (error, stdout, stderr) => {
    if (error) {
      mainWindow.webContents.send('process-info', 'Error generating Microservice for /' + directoryName+ ": "+error);
      return;
    }
    
    mainWindow.webContents.send('process-info', 'Finished Microservice for /' + directoryName);
  });
});


ipcMain.handle('executeTests', async (event, directory) => {
  exec('wsl --version', (error) => {
    if (error) {
      // WSL is not available, handle the error
      mainWindow.webContents.send('process-info', 'WSL is not available on this system.');
      return;
    }
  });
  const scriptPath = path.join(__dirname, './generator-scripts/test-generator.sh');
  const unixStyleDirectory = directory.replace(/\\/g, '/');
  const pathName = scriptPath.replace(/\\/g, '/');
  // map path
  const directoryName = directory.split('\\').pop();
  mainWindow.webContents.send('process-started', 'Generating Tests for /' + directoryName+' ...');
  exec(`"${shellCommand}" "${pathName}" "${unixStyleDirectory}"`, (error, stdout, stderr) => {
    if (error) {
      mainWindow.webContents.send('process-info', 'Error generating Tests for /' + directoryName+ ": "+error);
      return;
    }
    
    mainWindow.webContents.send('process-info', 'Finished Tests for /' + directoryName);
  });
});