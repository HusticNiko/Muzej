const path = require('path');
const { app } = require('electron');


function assetPath(...p) {
// Works in dev and production builds
const base = app.isPackaged ? process.resourcesPath : app.getAppPath();
return path.join(base, 'assets', ...p);
}


module.exports = { assetPath };