// server.js (or in Electron main, but this version is plain Node)
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const net = require('net');
const { execFile } = require('child_process');
const { pathToFileURL } = require('url');

// ---- constants ----
const VLC_BIN = '/Applications/VLC.app/Contents/MacOS/VLC';
const RC_HOST = '127.0.0.1';      // VLC RC listens on localhost
const RC_PORT = 5050;             // <-- RC control port (NOT your HTTP port)
const PORT = Number(process.env.CONTROL_PORT || 3002); // HTTP server port


let vlcChild = null;

function isRcUp() {
  // try connecting to RC; resolves true if socket connects
  return new Promise((resolve) => {
    const sock = net.createConnection({ host: RC_HOST, port: RC_PORT }, () => {
      sock.end(); resolve(true);
    });
    sock.on('error', () => resolve(false));
  });
}

async function startVlcIfNeeded(cols = 3, rows = 1) {
  // If RC is reachable, VLC is already running in RC mode -> reuse it.
  if (await isRcUp()) return;

  if (!fs.existsSync(VLC_BIN)) throw new Error(`VLC not found at ${VLC_BIN}`);

  const args = [
    '--video-splitter=wall',
    `--wall-cols=${cols}`,
    `--wall-rows=${rows}`,
    '--no-video-title-show',
    '--fullscreen',
    '--no-loop',
    '--no-repeat',
    '--extraintf=rc',
    `--rc-host=${RC_HOST}:${RC_PORT}`,
    // NOTE: no initial media here; we add via RC
  ];

  console.log('[VLC] launching persistent instance:', VLC_BIN, args.join(' '));
  vlcChild = spawn(VLC_BIN, ['-vvv', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
  vlcChild.stdout.on('data', d => console.log('[VLC]', d.toString()));
  vlcChild.stderr.on('data', d => console.error('[VLC E]', d.toString()));
  vlcChild.on('exit', code => { console.log('[VLC] exited with code', code); vlcChild = null; });
  vlcChild.on('error', e => console.error('[VLC] spawn error:', e));

  // give VLC a brief moment to bring up the RC
  await new Promise(r => setTimeout(r, 300));
}

async function startVlcIfNeeded2(cols = 3, rows = 1) {
  // If RC is reachable, VLC is already running in RC mode -> reuse it.
  if (await isRcUp()) return;

  if (!fs.existsSync(VLC_BIN)) throw new Error(`VLC not found at ${VLC_BIN}`);

  const args = [
    '--video-splitter=wall',
    `--wall-cols=${cols}`,
    `--wall-rows=${rows}`,
    '--no-video-title-show',
    '--fullscreen',
    '--input-repeat=-1',        // loop each item forever
    '--extraintf=rc',
    `--rc-host=${RC_HOST}:${RC_PORT}`,
    // NOTE: no initial media here; we add via RC
  ];

  console.log('[VLC] launching persistent instance:', VLC_BIN, args.join(' '));
  vlcChild = spawn(VLC_BIN, ['-vvv', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
  vlcChild.stdout.on('data', d => console.log('[VLC]', d.toString()));
  vlcChild.stderr.on('data', d => console.error('[VLC E]', d.toString()));
  vlcChild.on('exit', code => { console.log('[VLC] exited with code', code); vlcChild = null; });
  vlcChild.on('error', e => console.error('[VLC] spawn error:', e));

  // give VLC a brief moment to bring up the RC
  await new Promise(r => setTimeout(r, 300));
}



// ---- paths ----
function getVideoAbsPath() {
  return path.join(process.cwd(), 'assets', 'video.mp4');
}
function getVideoAbsPath2() {
  return path.join(process.cwd(), 'assets', 'video2.mp4');
}

function sendCmdO() {
  return new Promise((resolve, reject) => {
    execFile('osascript', ['-e', 'tell application "System Events" to keystroke "o" using {command down}'], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// ---- helpers ----
function killVLC() {
  return new Promise((resolve) => {
    exec('pkill -f "VLC.app/Contents/MacOS/VLC"', () => resolve());
  });
}

function vlcRc(cmd) {
  return new Promise((resolve, reject) => {
    const sock = net.createConnection({ host: "127.0.0.1", port: 5050 }, () => {
      sock.write(cmd + '\n');
      // give VLC a moment; you can also listen for data if you want responses
      setTimeout(() => { sock.end(); resolve(); }, 80);
    });
    sock.on('error', reject);
  });
}

async function playWallWithVLC(videoAbsPath, cols = 3, rows = 1) {
  if (!fs.existsSync(videoAbsPath)) throw new Error(`Video not found at ${videoAbsPath}`);
  await startVlcIfNeeded(cols, rows);

  const fileUrl = pathToFileURL(videoAbsPath).href; // e.g., file:///Users/you/Videos/My%20Clip.mp4
  console.log(fileUrl);
  setTimeout(() => {
    sendCmdO().catch(err => console.error('Failed to send CMD+O:', err));
  }, 3000 ); // wait a bit so VLC has time to launch
  await vlcRc('stop').catch(() => {});
  await vlcRc('clear').catch(() => {});
  // Use 'add' (plays current item) or 'enqueue' + 'play'
  await vlcRc(`add ${fileUrl}`);   // or: await vlcRc(`enqueue ${fileUrl}`);
  await vlcRc('play');

}

async function playWallWithVLC2(videoAbsPath, cols = 3, rows = 1) {
 if (!fs.existsSync(videoAbsPath)) throw new Error(`Video not found at ${videoAbsPath}`);
  await startVlcIfNeeded2(cols, rows);
  const fileUrl = pathToFileURL(videoAbsPath).href;
 setTimeout(() => {
    sendCmdO().catch(err => console.error('Failed to send CMD+O:', err));
  }, 3000 ); // wait a bit so VLC has time to launch
  await vlcRc('stop').catch(() => {});
  await vlcRc('clear').catch(() => {});
  await vlcRc(`add ${fileUrl}`);
  await vlcRc('repeat on');
  await vlcRc('play');
}

// ---- server ----
const app = express();
const server = http.createServer(app);

// serve remote UI from ./remote-ui (tablets open http://<mac-ip>:3001/)
app.use(express.static(path.join(process.cwd(), 'remote-ui')));


// controls
app.get('/play', async (_req, res) => {
  try {
    await playWallWithVLC(getVideoAbsPath(), 3, 1);
    res.send('OK');
  } catch (err) {
    console.error('[HTTP] /play', err);
    res.status(500).send(String(err?.message || err));
  }
});

app.get('/play2', async (_req, res) => {
  try {
    await playWallWithVLC2(getVideoAbsPath2(), 3, 1);
    res.send('OK');
  } catch (err) {
    console.error('[HTTP] /play2', err);
    res.status(500).send(String(err?.message || err));
  }
});

app.get('/pause', async (_req, res) => {
  try { await vlcRc('pause'); res.send('OK'); }
  catch (e) { console.error('[HTTP] /pause', e); res.status(500).send('VLC RC unreachable'); }
});

app.get('/resume', async (_req, res) => {
  try { await vlcRc('play'); res.send('OK'); }
  catch (e) { console.error('[HTTP] /resume', e); res.status(500).send('VLC RC unreachable'); }
});

app.get('/stop', async (_req, res) => {
  try { await vlcRc('stop'); res.send('OK'); }

  catch (e) { console.error('[HTTP] /stop', e); res.status(500).send('Failed to kill VLC'); }
});

server.on('error', (err) => {
  console.error('[HTTP] server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`[HTTP] Port ${PORT} in use. Set CONTROL_PORT to a free port.`);
  }
});

  const HOST = '0.0.0.0'; // listen on LAN
  server.listen(PORT, HOST, () => {
    console.log(`[HTTP] Control server listening on http://${HOST}:${PORT}`);
    console.log('[HTTP] If accessing from tablet, use Mac mini IP, e.g. http://192.168.x.x:3001');
  });

