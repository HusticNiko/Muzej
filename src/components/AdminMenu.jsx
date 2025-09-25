import React , {useState, useEffect, useRef} from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import LanguageSwitcher from './LanguageSwitcher';
import "../styles.css";
import Player from '../projector/player';

const AdminMenu = () => {
  const { t } = useTranslation();
  const { logout } = useUser();
  const [start, setStart] = useState(false);
  const [videoRelPath, setVideoRelPath] = useState('video.mp4');
  const [log, setLog] = useState([]);
  const [events, setEvents] = useState([]);
  const domHandlerRef = useRef(null);

  const playAll = async () => {
  // If you want to choose a different file at runtime, update videoRelPath
  // Passing nothing falls back to assets/video.mp4 via ipcMain
  console.log('[UI] playAll clicked');
  await window.projectors?.playAll();
  };


  useEffect(() => {
    const handler = (e) => {
      const data = e.detail; // e.g., { displayId, type: 'ENDED' }
      console.log('[App] DOM projector-state:', data);
      if(data.type === "ENDED") {
        setStart(false)
      }
       if(data.type === "PLAYING") {
        setStart(true)
      }
    };
    domHandlerRef.current = handler;
    window.addEventListener('projector-state', handler);
    return () => window.removeEventListener('projector-state', handler);
  }, []);


  const pauseAll = async () => {
  await window.projectors?.pauseAll();
  };
  const handleProjectionWithSubtitles = async () => {
      setStart(true);
      await window.projectors?.play1();
  };

  const handleProjectionWithoutSubtitles = async () => {
      setStart(true);
      await window.projectors?.play2();
  };


  return (
    
               start &&     <Player />

   
   
  );
};

export default AdminMenu;