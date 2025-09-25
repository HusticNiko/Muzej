// server.js (or in Electron main, but this version is plain Node)
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const net = require('net');

// ---- constants ----
const VLC_BIN = '/Applications/VLC.app/Contents/MacOS/VLC';
const RC_HOST = '192.168.4.136';      // VLC RC listens on localhost
const RC_PORT = 3001;             // <-- RC control port (NOT your HTTP port)
const PORT = Number(process.env.CONTROL_PORT || 3001); // HTTP server port

// ---- paths ----
function getVideoAbsPath() {
  return path.join(process.cwd(), 'assets', 'video.mp4');
}
function getVideoAbsPath2() {
  return path.join(process.cwd(), 'assets', 'video2.mp4');
}

// ---- helpers ----
function killVLC() {
  return new Promise((resolve) => {
    exec('pkill -f "VLC.app/Contents/MacOS/VLC"', () => resolve());
  });
}

function vlcRc(cmd) {
  return new Promise((resolve, reject) => {
    const sock = net.createConnection({ host: RC_HOST, port: RC_PORT }, () => {
      sock.write(cmd + '\n');
      setTimeout(() => { sock.end(); resolve(); }, 80);
    });
    sock.on('error', reject);
  });
}

async function playWallWithVLC(videoAbsPath, cols = 3, rows = 1) {
  if (!fs.existsSync(VLC_BIN)) throw new Error(`VLC not found at ${VLC_BIN}`);
  if (!fs.existsSync(videoAbsPath)) throw new Error(`Video not found at ${videoAbsPath}`);

  await killVLC();

  const args = [
    '--video-splitter=wall',
    `--wall-cols=${cols}`,
    `--wall-rows=${rows}`,
    '--no-video-title-show',
    '--fullscreen',
    '--extraintf=rc',
    `--rc-host=${RC_HOST}:${RC_PORT}`, // ✅ RC on 127.0.0.1:5050
    videoAbsPath,
  ];

  console.log('[VLC] launching:', VLC_BIN, args.join(' '));
  const child = spawn(VLC_BIN, ['-vvv', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', d => console.log('[VLC]', d.toString()));
  child.stderr.on('data', d => console.error('[VLC E]', d.toString()));
  child.on('exit', code => console.log('[VLC] exited with code', code));
  child.on('error', (e) => console.error('[VLC] spawn error:', e));
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
    await playWallWithVLC(getVideoAbsPath2(), 3, 1);
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
  try { await killVLC(); res.send('OK'); }
  catch (e) { console.error('[HTTP] /stop', e); res.status(500).send('Failed to kill VLC'); }
});

server.on('error', (err) => {
  console.error('[HTTP] server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`[HTTP] Port ${PORT} in use. Set CONTROL_PORT to a free port.`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[HTTP] Control server listening on http://0.0.0.0:${PORT}`);
  console.log('[HTTP] Use Mac mini IP on tablets, e.g. http://192.168.x.x:' + PORT);
});
