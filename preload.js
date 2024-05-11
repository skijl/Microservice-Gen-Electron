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
const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('electron', {
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron,
    },
    path: path,
    ipcRenderer: {
        ...ipcRenderer,
        on: ipcRenderer.on
    }
});

let indexBridge = {
    executeMicroservice1: async (directory) => {
        await ipcRenderer.invoke("executeMicroservice1", directory);
    },
    executeMicroservice2: async (directory) => {
        await ipcRenderer.invoke("executeMicroservice2", directory);
    },
    executeTests: async (directory) => {
        await ipcRenderer.invoke("executeTests", directory);
    }
};

contextBridge.exposeInMainWorld("indexBridge", indexBridge);

