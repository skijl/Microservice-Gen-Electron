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
const directory_input = document.getElementById('directoryInput');
const selected_directory_text = document.getElementById('directoryOutput');
const generate_dto_button = document.getElementById('generateDTOButton');
const generate_service_button = document.getElementById('generateServiceButton');
const generate_tests_button = document.getElementById('generateTestsButton');
const process_info = document.getElementById('processInfo');



document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => {
                btn.classList.remove('clicked');
            });
            this.classList.add('clicked');
        });
    });
});

generate_dto_button.addEventListener('click', function() {
    const directory = selected_directory_text.textContent;
    if (directory) {
        window.indexBridge.executeMicroservice1(directory);
    } else {
        process_info.innerText = "No directory selected";
    }
});

generate_service_button.addEventListener('click', function() {
    const directory = selected_directory_text.textContent;
    if (directory) {
        window.indexBridge.executeMicroservice2(directory);
    } else {
        process_info.innerText = "No directory selected";
    }
});

generate_tests_button.addEventListener('click', function() {
    const directory = selected_directory_text.textContent;
    if (directory) {
        window.indexBridge.executeTests(directory);
    } else {
        process_info.innerText = "No directory selected";
    }
});

directory_input.addEventListener('change', function(event) {
    // Get the selected directory
    const selectedDirectory = directory_input.files[0].path;

    // Get the directory path without the file name
    const directoryPath = electron.path.dirname(selectedDirectory);

    // Display the directory path
    selected_directory_text.textContent = directoryPath;
});

electron.ipcRenderer.on('process-info', function (evt, message) {
    generate_dto_button.disabled=false;
    generate_service_button.disabled=false;
    generate_tests_button.disabled=false;
    process_info.innerText = message;
});

electron.ipcRenderer.on('process-started', function (evt, message) {
    generate_dto_button.disabled=true;
    generate_service_button.disabled=true;
    generate_tests_button.disabled=true;
    process_info.innerText = message;
});

