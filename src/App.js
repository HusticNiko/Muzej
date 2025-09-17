import React, { useState, useEffect, useRef  } from "react";
import wheelImage from './assets/wheel3.png'; // or use public path directly in src
import frameImage from './assets/fortuna.png'; // Adjust path if using public folder
import QuizOfMithras from './QuizOfMithras';
import StarrySkyMystery from './StarrySkyMystery';
import useInactivityTimer from "./useInactivityTimer"; // Adjust path
import "./styles.css";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import AdminMenu from "./components/AdminMenu";
import UserSelection from "./components/UserSelection";
import { UserProvider, useUser } from './context/UserContext';


  // Silent Long Press Hook (no visual feedback)
const useSilentLongPress = (onLongPress, delay = 10000) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const timerRef = useRef(null);

  const start = (event) => {
    // Prevent default touch behaviors
    if (event.type === 'touchstart') {
      event.preventDefault();
    }
    console.log(isPressed);
    setIsPressed(true);
    
    // Long press timer
    timerRef.current = setTimeout(() => {
      setShowButton(true);
      clear();
    }, delay);
  };

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPressed(false);
  };

  const hideButton = () => {
    setShowButton(false);
  };

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: clear,
    showButton,
    hideButton
  };
};

const App = () => {
  const { t } = useTranslation();
  const [currentGame, setCurrentGame] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const isGameActive = currentGame !== null;

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keypress", "touchstart", "scroll"];
  
    const clearWarningOnActivity = () => {
      if (showWarning) {
        setShowWarning(false); // hide warning if player becomes active again
      }
    };
  
    if (currentGame !== null) {
      events.forEach(event => window.addEventListener(event, clearWarningOnActivity));
    }
  
    return () => {
      events.forEach(event => window.removeEventListener(event, clearWarningOnActivity));
    };
  }, [showWarning, currentGame]);
  

  useInactivityTimer(
    () => {
      if (isGameActive) setShowWarning(true); // show warning only if inside a game
    },
    () => {
      if (isGameActive) {
        setCurrentGame(null);     // timeout back to menu
        setShowWarning(false);    // hide warning
      }
    },
    1000, // 4 min for warning
    2000  // 5 min for timeout
  );

  const AppContent = () => {
  const { user, isAuthenticated, logout } = useUser();

    const longPressProps = useSilentLongPress(() => {}, 10000);

    // Auto-hide logout button after 5 seconds of inactivity
    useEffect(() => {
      if (longPressProps.showButton) {
        const hideTimer = setTimeout(() => {
          longPressProps.hideButton();
        }, 5000); // Hide after 5 seconds

        return () => clearTimeout(hideTimer);
      }
    }, [longPressProps.showButton]);

    if (!isAuthenticated) {
      return <UserSelection />;
    }

    if (user === 'customer') {
      return (
        <div
          className="app"
          {...longPressProps}
          style={{ 
            position: 'relative',
            userSelect: 'none', // Prevent text selection during long press
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        >
          {showWarning && (
            <div className="warning-popup">
              <p>⚠️ You will return to the main menu in 1 minute due to inactivity.</p>
            </div>
          )}

          {currentGame === null && (
            <div className="menu">
              <h1>{t('welcome')}</h1>
              <button onClick={() => setCurrentGame("quiz")} className="btn">{t('trial_of_mithras')}</button>
              <button onClick={() => setCurrentGame("stars")} className="btn">{t('mysteri_of_skyes')}</button>
            </div>
          )}

          {currentGame === "wheel" && <WheelOfFortuna onBack={() => setCurrentGame(null)} />}
          {currentGame === "quiz" && <QuizOfMithras onBack={() => setCurrentGame(null)} />}
          {currentGame === "stars" && <StarrySkyMystery onBack={() => setCurrentGame(null)} />}
          
          <LanguageSwitcher variant="" />
          
          {/* Hidden logout button that appears after 10s hold */}
          {longPressProps.showButton && (
            <button 
              className="logout-btn customer-logout-btn" 
              onClick={() => {
                logout();
                longPressProps.hideButton();
              }}
            >
              <span className="logout-icon">🚪</span>
              {t('logout')}
            </button>
          )}
        </div>
      );
    }

    if (user === 'admin') {
      return <AdminMenu />;
    }

    return <UserSelection />;
  };

  return (
    <UserProvider>
      <div className="App">
        <AppContent />
      </div>
    </UserProvider>
  );
};





const WheelOfFortuna = ({ onBack }) => {
  const { t } = useTranslation();
  const fortunes = [
    "Fortuna smiles upon your endeavors.",
    "A twist of fate is near, be ready.",
    "A golden opportunity lies ahead.",
    "Tread carefully, luck is a double-edged sword.",
    "Your path is favored by the gods.",
    "Expect the unexpected. Fortuna sees all.",
    "Now is the time to take a bold leap.",
    "You are guided by unseen forces of prosperity."
  ];

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showFortune, setShowFortune] = useState(false);
  const [selectedFortune, setSelectedFortune] = useState("");

  const spinWheel = () => {
    if (isSpinning) return;

    const index = Math.floor(Math.random() * fortunes.length);
    const anglePerFortune = 360 / fortunes.length;
    const spins = 5; // Always do 5 complete spins
    
    // Calculate additional rotation needed to land on the desired fortune
    // Starting from the current rotation position
    const targetAngle = (360 - index * anglePerFortune - anglePerFortune / 2) % 360;
    const additionalRotation = spins * 360 + targetAngle;
    
    // The new total rotation is current rotation plus the additional rotation
    const newRotation = rotation + additionalRotation;

    setIsSpinning(true);
    setShowFortune(false);
    setRotation(newRotation);

    setTimeout(() => {
      setSelectedFortune(fortunes[index]);
      setShowFortune(true);
      setIsSpinning(false);
    }, 5000);
  };


  return (
    <div className="wheel">
      <div className="wheel-wrapper">
      <img
          src={frameImage}
          alt="Fortuna Frame"
          className={`wheel-frame ${showFortune ? 'faded' : ''}`}
        />
        <img
          src={wheelImage}
          alt="Fortuna's Wheel"
          className="wheel-image"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 5s cubic-bezier(0.1, 0.9, 0.2, 1)"
              : "none"
          }}
        />

        {showFortune && (
          <div className="fortune-overlay" onClick={spinWheel}>
            <div className="fortune-text">
              {selectedFortune}
              <p className="tap-to-spin">(Tap to spin again)</p>
            </div>
          </div>
        )}
      </div>

      {!showFortune && !isSpinning && (
        <button onClick={spinWheel} className="btn spin-btn" disabled={isSpinning}>
          {"Spin the Wheel"}
        </button>
      )}
      {isSpinning && (
        <button onClick={onBack} className="btn back-btn">
        {t("back")}
      </button>
      )
      }
    </div>
  );
};




export default App;
