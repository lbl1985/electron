const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindown;
let addWindow;

// Listen for app to be ready 
app.on('ready', function(){
    // create New window
    mainWindown = new BrowserWindow({});
    // Load html into window
    mainWindown.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Quit app when closed
    mainWindown.on('closed', function(){
        app.quit();
    })

    // Build menu from template
    const mainMemu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMemu);
});

// Handle create add window
function createAddWindow(){
    // create New window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Items'
    });
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // gabage collection handle
    addWindow.on('closed', function(){
        addWindow = null;
    });
}

// Create menu template
const mainMenuTemplate = [    
    {
        label:'File', 
        submenu:[
            {
                label: 'Add Item',
                accelerator: process.platform == 'darwin' ? 'Command+B' : "Ctrl+B",
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items'
            },
            {
                label: 'Quit', 
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// If mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({}); // put item into front of the array;
}

// Add developer tools item if not in production
if(process.env.NODE_ENV != 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();

                }
            },
            {
                role: 'reload'
            }
        ]
    })
}