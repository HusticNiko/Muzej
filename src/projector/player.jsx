import { useEffect, useRef, useState } from 'react';

export default function Player() {
  const videoRef = useRef(null);
  const [src, setSrc] = useState(null);

  useEffect(() => {
  const v = videoRef.current;
  const report = (type) => window.projectors?.reportState?.({ type });

  const onEnded = () => report('ENDED');
  const onPause = () => { if (v.currentTime < v.duration) report('PAUSED'); };
  const onPlay  = () => report('PLAYING'); // optional but useful

  v.addEventListener('ended', onEnded);
  v.addEventListener('pause', onPause);
  v.addEventListener('play',  onPlay);

  return () => {
    v.removeEventListener('ended', onEnded);
    v.removeEventListener('pause', onPause);
    v.removeEventListener('play',  onPlay);
  };
}, []);


  useEffect(() => {
    console.log('[Player] mounted');
    const v = videoRef.current;

    // Listen for control messages from main
    window.projectors?.onControl((msg) => {
      const v = videoRef.current;
      if (!v) return;

      if (msg.type === 'PLAY_AT' || msg.type === 'PLAY') {
        if (src !== msg.src) setSrc(msg.src);
        const play = () => v.play();
        if (msg.startAt) {
          const tick = () => (Date.now() >= msg.startAt ? play() : requestAnimationFrame(tick));
          requestAnimationFrame(tick);
        } else {
          play();
        }
      }
      if (msg.type === 'PAUSE') v.pause();
      if (msg.type === 'SEEK') v.currentTime = msg.time || 0;
    });

    // Report stop/end events back to main
    const report = (type) => {
      console.log('[Player] reporting', type);
      window.projectors?.reportState?.({ type });
    };

    v.addEventListener('ended', () => report('ENDED'));
    v.addEventListener('pause', () => {
      if (v.currentTime < v.duration) report('PAUSED'); // user paused before end
    });

    return () => {
      v.removeEventListener('ended', () => report('ENDED'));
      v.removeEventListener('pause', () => report('PAUSED'));
    };
  }, [src]);


  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <video
        ref={videoRef}
        src={src || ''}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        playsInline
        muted
        controls={false}
        preload="auto"
        onPlay={() => console.log('[Player] play')}
        onError={(e) => {
            const v = e.currentTarget;
            const err = v?.error;
            console.error('[Player] video error', {
            code: err?.code,      // 1: aborted, 2: network, 3: decode, 4: src not supported
            message: err?.message
            });
        }}
        onLoadedMetadata={() => console.log("[Video] loadedmetadata", src)}
      />
    </div>
  );
}
