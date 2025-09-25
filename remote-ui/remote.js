// Detect Mac mini control server origin (port 3001 by default).
// If you opened http://<mac-ip>:3001 in the tablet, location.origin already matches.
const BASE = location.origin;

// Optional: if you run the UI on a different host, hardcode:
// const BASE = "http://192.168.1.50:3001";

async function cmd(path) {
  try {
    const res = await fetch(BASE + path);
    setStatus(res.ok ? `OK: ${path}` : `Error ${res.status} on ${path}`);
  } catch (e) {
    setStatus(`Network error: ${e.message}`);
  }
}

async function play() {
    await window.projectors?.playAll();
}

function seek() {
  const v = document.getElementById('seekSec').value.trim();
  const s = Number(v);
  if (!Number.isFinite(s) || s < 0) return setStatus('Enter a valid non-negative number');
  cmd(`/seek/${s}`);
}

function setStatus(msg) {
  document.getElementById('status').textContent = `${new Date().toLocaleTimeString()} — ${msg}`;
}

// (Optional) Live status via EventSource or WebSocket could go here later.
