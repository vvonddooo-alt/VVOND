const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
function createWindow(){
  const win = new BrowserWindow({width:1440,height:950,minWidth:360,minHeight:650,autoHideMenuBar:true,webPreferences:{contextIsolation:true,nodeIntegration:false}});
  win.loadFile(path.join(__dirname,'index.html'));
  win.webContents.setWindowOpenHandler(({url})=>{shell.openExternal(url);return {action:'deny'};});
}
app.whenReady().then(()=>{createWindow();app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
