// ControllerPage.jsx
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import "../../src/styles.css";


// IMPORTANT: use your Mac's LAN IP, not 127.0.0.1
// e.g. http://192.168.1.23:3002
const PROJECTOR_SERVER = 'http://192.168.1.19:3002';

export default function ControllerPage({ onBack }) {
    const { t } = useTranslation();
  
  const [status, setStatus] = useState('Idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const callApi = async (endpoint, label) => {
    setLoading(true);
    setError('');
    setStatus(`Sending: ${label}...`);

    try {
      const res = await fetch(`${PROJECTOR_SERVER}${endpoint}`, {
        method: 'GET',                 // your server.js uses app.get(...)
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'Request failed');
      }

      setStatus(`OK: ${label}`);
    } catch (e) {
      console.error(e);
      setError('Could not reach projector server.');
      setStatus('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#111',
        color: '#fff',
        fontFamily: 'sans-serif',
        padding: 16,
      }}
    >
      <h1 style={{ marginBottom: 32 }}>Projector Remote</h1>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr' }}>
        <button
          onClick={() => callApi('/play', 'Projekcija')}
          disabled={loading}
          style={btnStyle}
        >
          ▶ Projekcija
        </button>

        <button
          onClick={() => callApi('/play2', 'Ambiental')}
          disabled={loading}
          style={btnStyle}
        >
          ▶ Ambiental
        </button>

        <button
          onClick={() => callApi('/resume', 'Nadaljuj')}
          disabled={loading}
          style={btnStyle}
        >
          ▶ Nadaljuj
        </button>

        <button
          onClick={() => callApi('/pause', 'Pavza')}
          disabled={loading}
          style={btnStyle}
        >
          ⏸ Pavza
        </button>

        <button
          onClick={() => callApi('/stop', 'Prekini')}
          disabled={loading}
          style={btnStyle}
        >
          ✕ Prekini
        </button>
           <button onClick={onBack} className="back_to_menu_btn">
              {t("back_to_menu")}
            </button>
      </div>

      <div style={{ marginTop: 16, fontSize: 14, opacity: 0.85 }}>
        {loading && <span>Sending command…</span>}
        {!loading && <span>Status: {status}</span>}
        {error && (
          <p style={{ color: 'tomato', marginTop: 8 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

const btnStyle = {
  padding: '16px 20px',
  fontSize: 18,
  borderRadius: 12,
  border: 'none',
  background: '#222',
  color: '#fff',
  cursor: 'pointer',
};
