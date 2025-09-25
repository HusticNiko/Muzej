const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const { assetPath } = require('./paths');
const { pathToFileURL } = require('url');
const express = require('express');
const http = require('http');
const VLC_BIN = '/Applications/VLC.app/Contents/MacOS/VLC';
const { spawn, exec } = require('child_process');
const fs = require('fs');

function getVideoAbsPath() {
  // if you used the earlier helper, you can replace this with assetPath('video.mp4')
  const base = app.isPackaged ? process.resourcesPath : app.getAppPath();
  return path.join(base, 'assets', 'video.mp4');
}


function getVideoAbsPath2() {
  // if you used the earlier helper, you can replace this with assetPath('video.mp4')
  const base = app.isPackaged ? process.resourcesPath : app.getAppPath();
  return path.join(base, 'assets', 'video2.mp4');
}


// Kill any existing VLC processes (so we don’t stack multiple walls)
function killVLC() {
  return new Promise((resolve) => {
    exec('pkill -f "VLC.app/Contents/MacOS/VLC"', () => resolve());
  });
}

  const net = require('net');

function vlcRc(cmd) {
  return new Promise((resolve, reject) => {
    const sock = net.createConnection({ host: "192.168.4.136", port: 3001 }, () => {
      sock.write(cmd + '\n');
      // give VLC a moment; you can also listen for data if you want responses
      setTimeout(() => { sock.end(); resolve(); }, 80);
    });
    sock.on('error', reject);
  });
}

/**
 * Launch VLC and split 1 video into a 3×1 wall (3 tiles across).
 * Each tile should go fullscreen on a display.
 */
async function playWallWithVLC(videoAbsPath, cols = 3, rows = 1) {
  if (!fs.existsSync(VLC_BIN)) {
    console.error('[VLC] VLC not found at', VLC_BIN);
    throw new Error('VLC not installed at default path.');
  }
  if (!fs.existsSync(videoAbsPath)) {
    console.error('[VLC] Video not found at', videoAbsPath);
    throw new Error('Video file missing.');
  }

  // Ensure we start clean
  await killVLC();

  const args = [
    '--video-splitter=wall',
    `--wall-cols=${cols}`,
    `--wall-rows=${rows}`,
    '--no-video-title-show',
    '--fullscreen',
    '--extraintf=rc',
    `--rc-host=192.168.4.136:3001`,
    videoAbsPath,
  ];
  console.log('[VLC] launching:', VLC_BIN, args.join(' '));
  const child = spawn(VLC_BIN, ['-vvv', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', d => console.log('[VLC]', d.toString()));
  child.stderr.on('data', d => console.error('[VLC E]', d.toString()));
  child.on('exit', code => console.log('[VLC] exited with code', code));
  child.on('error', (e) => console.error('[VLC] spawn error:', e));
}

function broadcast(msg) {
  windows.forEach(w => w.webContents.send('player:control', msg));
}

function createWindows() {
  const { screen } = require('electron');
  const displays = screen.getAllDisplays();
  windows = displays.map((d, idx) => {
    const win = new BrowserWindow({
      x: d.bounds.x, y: d.bounds.y, width: d.size.width, height: d.size.height,
      fullscreen: true, frame: false, backgroundColor: '#000',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true, nodeIntegration: false,
      },
    });
    const isDev = !app.isPackaged;
    const url = isDev
      ? `http://localhost:3000/?display=${idx}`
      : `file://${path.join(app.getAppPath(), 'build', 'index.html')}?display=${idx}`;
    console.log('[main] loading', url);
    win.loadURL(url);
    win.webContents.on('did-finish-load', () => console.log(`[main] d${idx} ready`));
    win.webContents.on('did-fail-load', (_e, c, d, u) => console.error('[main] fail', c, d, u));
    return win;
  });
}

function startControlServer() {
  const controlApp = express();
  const server = http.createServer(controlApp);

  // (optional) serve your remote UI
  controlApp.use(express.static(path.join(app.getAppPath(), 'remote-ui')));

  controlApp.get('/play', async (_req, res) => {
    try {
      const vid = getVideoAbsPath();        // e.g., .../assets/video.mp4
      await playWallWithVLC(vid, 3, 1);     // 3 columns × 1 row
      res.send('OK');
    } catch (err) {
      console.error('[HTTP] /play error:', err);
      res.status(500).send(String(err?.message || err));
    }
  });

  controlApp.get('/play2', async (_req, res) => {
    try {
      const vid = getVideoAbsPath2();        // e.g., .../assets/video.mp4
      await playWallWithVLC(vid, 3, 1);     // 3 columns × 1 row
      res.send('OK');
    } catch (err) {
      console.error('[HTTP] /play error:', err);
      res.status(500).send(String(err?.message || err));
    }
  });

  // optional: /stop to quit VLC
  controlApp.get('/stop', async (_req, res) => {
    await killVLC();
    res.send('OK');
  });

   // optional: /stop to quit VLC
controlApp.get('/pause', async (_req, res) => {
  try {
    await vlcRc('pause'); // toggles play/pause
    res.send('OK');
  } catch (e) {
    console.error('[HTTP] /pause', e);
    res.status(500).send('VLC not running or RC unreachable');
  }
});

controlApp.get('/resume', async (_req, res) => {
  try {
    await vlcRc('play'); // explicitly play (resumes if paused)
    res.send('OK');
  } catch (e) {
    console.error('[HTTP] /resume', e);
    res.status(500).send('VLC not running or RC unreachable');
  }
});


  const PORT = Number(process.env.CONTROL_PORT || 3001);
  server.listen(PORT, '0.0.0.0', () =>
    console.log(`[HTTP] Control server listening on http://<mac-ip>:${PORT}`)
  );
  const HOST = '0.0.0.0'; // listen on LAN
  server.listen(PORT, HOST, () => {
    console.log(`[HTTP] Control server listening on http://${HOST}:${PORT}`);
    console.log('[HTTP] If accessing from tablet, use Mac mini IP, e.g. http://192.168.x.x:3001');
  });

  server.on('error', (err) => {
    console.error('[HTTP] server error:', err);
    if (err.code === 'EADDRINUSE') {
      console.error(`[HTTP] Port ${PORT} in use. Set CONTROL_PORT env var to another port.`);
    }
  });
}

app.whenReady().then(() => {
  console.log('[main] app ready');
  createWindows();
  startControlServer(); // ✅ start here
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


let windows = [];

function createWindows() {
  const displays = screen.getAllDisplays();

  windows = displays.map((d, idx) => {
    const win = new BrowserWindow({
      x: d.bounds.x,
      y: d.bounds.y,
      width: d.size.width,
      height: d.size.height,
      fullscreen: true,
      frame: false,
      backgroundColor: '#000000',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        // sandbox: false, // ensure this is NOT true unless you know you need it
      },
    });

    const isDev = !app.isPackaged;
    const url = isDev
      ? `http://localhost:3000/?display=${idx}`
      : `file://${path.join(app.getAppPath(), 'build', 'index.html')}?display=${idx}`;

    console.log(`[main] loading URL for display ${idx}:`, url);
    win.loadURL(url);

    // Pipe renderer console to terminal
    win.webContents.on('console-message', (_e, level, message, line, sourceId) => {
      console.log(`[renderer d${idx}] (${level}) ${message} @${sourceId}:${line}`);
    });

    // Lifecycle logs
    win.webContents.on('did-start-loading', () => console.log(`[main] d${idx} did-start-loading`));
    win.webContents.on('did-finish-load',   () => console.log(`[main] d${idx} did-finish-load`));
    win.webContents.on('did-fail-load', (_e, code, desc, url2) =>
      console.error(`[main] d${idx} did-fail-load ${code} ${desc} ${url2}`)
    );

    // Open devtools so you can see renderer logs
    win.webContents.openDevTools({ mode: 'detach' });

    return win;
  });
}

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

app.whenReady().then(() => {
  createWindows();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindows();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Broadcast helper
function broadcast(msg) {
  console.log('[main] broadcast', msg);
  windows.forEach(w => w.webContents.send('player:control', msg));
}

function broadcastAll(msg) {
  BrowserWindow.getAllWindows().forEach(w => w.webContents.send('player:control', msg));
}


// IPC handlers + readiness pi
ipcMain.on('player:state', (_evt, data) => {
  console.log('[main] projector state', data);
  BrowserWindow.getAllWindows().forEach(w =>
    w.webContents.send('player:state', data)
  );
});

ipcMain.handle('projectors:play1', (_evt, maybePath) => {
    const isDev = !app.isPackaged;
  let src;
  if (maybePath) {
    // If caller passed an absolute path, convert it to file:// safely
    src = pathToFileURL(maybePath).toString();
  } else {
    // DEV: use HTTP to avoid file:// in http:// pages
    // PRODUCTION: send a relative URL that resolves against the loaded index.html
    src = isDev ? 'http://localhost:3000/video.mp4' : 'video.mp4';
  }
  console.log('[main] PLAY requested:', src);
  const msg = { type: 'PLAY_AT', src, startAt: Date.now() + 600 };
  broadcastAll(msg);
  setTimeout(() => broadcastAll(msg), 300); // resend once in case listeners were late
});

ipcMain.handle('projectors:play2', (_evt, maybePath) => {
  console.log(maybePath)
    const isDev = !app.isPackaged;
  let src;
  if (maybePath) {
    // If caller passed an absolute path, convert it to file:// safely
    src = pathToFileURL(maybePath).toString();
  } else {
    // DEV: use HTTP to avoid file:// in http:// pages
    // PRODUCTION: send a relative URL that resolves against the loaded index.html
    src = isDev ? 'http://localhost:3000/video2.mp4' : 'video2.mp4';
  }
  console.log('[main] PLAY requested:', src);
  const msg = { type: 'PLAY_AT', src, startAt: Date.now() + 600 };
  broadcastAll(msg);
  setTimeout(() => broadcastAll(msg), 300); // resend once in case listeners were late
});

ipcMain.handle('projectors:pauseAll', () => broadcast({ type: 'PAUSE' }));
ipcMain.handle('projectors:seekAll', (_e, seconds) => broadcast({ type: 'SEEK', time: Number(seconds) || 0 }));
