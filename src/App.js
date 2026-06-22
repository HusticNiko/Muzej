import React, { useState, useEffect, useRef  } from "react";
import wheelImage from './assets/wheel3.png'; // or use public path directly in src
import frameImage from './assets/fortuna.png'; // Adjust path if using public folder
import mitraizem from './assets/Mitraizem.webm'; // Adjust path if using public folder
import rimljani from './assets/Splošno.webm'; // Adjust path if using public folder

import QuizOfMithras from './QuizOfMithras';
import StarrySkyMystery from './StarrySkyMystery';
//import ControllerPage from "../../Muzej/";
import useInactivityTimer from "./useInactivityTimer"; // Adjust path
import "./styles.css";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import AdminMenu from "./components/AdminMenu";
import UserSelection from "./components/UserSelection";
import { UserProvider, useUser  } from './context/UserContext';
import GeneralQuiz from "./GeneralQuiz";
import naslovnica from "./assets/Ostala_naslovnica.png"; // Zamenjaj s pravim imenom in končnico
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

const AppContent = ({ currentGame = null, setCurrentGame, showWarning, setShowWarning }) => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout, login } = useUser();

    const longPressProps = useSilentLongPress(() => {}, 3000);

    // Auto-hide logout button after 5 seconds of inactivity
    useEffect(() => {
      if (longPressProps.showButton) {
        const hideTimer = setTimeout(() => {
          longPressProps.hideButton();
        }, 2000000); // Hide after 5 seconds

        return () => clearTimeout(hideTimer);
      }
    }, [longPressProps.showButton]);

    if (!isAuthenticated) {
      return <UserSelection />;
    }

    // TUKAJ SPREMENI 'customer' v 'kviz_mitraizem'
    if (user === 'kviz_mitraizem') {
      return (
        <div
          className="app"
          {...longPressProps}
          style={{ 
            position: 'relative',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
             onClick={() => {
                longPressProps.hideButton();
              }}
        > 
           <video
          className="bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={mitraizem} type="video/mp4" />
          {/* Optional fallback text */}
          Your browser does not support the video tag.
        </video>
          <div className="content">


          {currentGame === null && (
            <div className="menu">
              <h1>{t('welcome')}</h1>
              {/*<button onClick={() => setCurrentGame("quiz2")} className="home_btn">{t('general_faith')}</button>*/}
              <button onClick={() => setCurrentGame("quiz")} className="home_btn btn_float">{t('trial_of_mithras')}</button>
              {/*<button onClick={() => setCurrentGame("stars")} className="btn">{t('mysteri_of_skyes')}</button> */}
            </div>
          )}
          </div>
 {/* Hidden logout button that appears after 10s hold */}
          {longPressProps.showButton && (
            <button 
              className="logout-btn customer-logout-btn" 
              onClick={() => {
                logout();
                longPressProps.hideButton();
              }}
            >
              {t('logout')}
            </button>
          )}
            {showWarning && (
          <div className="warning-popup" onClick={() => setShowWarning(false)}>              
          {t('warning')}
            </div>
          )}
          {currentGame === "wheel" && <WheelOfFortuna onBack={() => setCurrentGame(null)} />}
          {currentGame === "quiz" && <QuizOfMithras alreadyStarted={showWarning} onBack={() => setCurrentGame(null)} />}
          {currentGame === "quiz2" && <GeneralQuiz onBack={() => setCurrentGame(null)} />}
          {currentGame === "stars" && <StarrySkyMystery onBack={() => setCurrentGame(null)} />}
          
        
          

        </div>
      );
    } else if (user === 'projekcija') {
      
     
            window.location.href = "http://192.168.1.19:8080"; // <-- replace with your actual IP
        
                  
        
    }  else if (user === 'kviz_ostala_bozanstva'){
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
         onClick={() => {
                longPressProps.hideButton();
                
              }}
        >
            <video
          className="bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={rimljani} type="video/mp4" />
          {/* Optional fallback text */}
          Your browser does not support the video tag.
        </video>
          <div className="content"   onClick={() => {
                longPressProps.hideButton();
              }}>
          {currentGame === null && (
            <div className="menu ">
              <img src={naslovnica} alt="Naslovnica" className="intro-title-image" draggable="false" />
              <button onClick={() => setCurrentGame("quiz2")} className="home_btn2 lang-fade" key={i18n.language}>{t('general_faith')}</button>
              {/*<button onClick={() => setCurrentGame("quiz")} className="home_btn">{t('trial_of_mithras')}</button>*/}
              {/*<button onClick={() => setCurrentGame("stars")} className="btn">{t('mysteri_of_skyes')}</button> */}
            </div>
          )}
          </div>
          {showWarning && (
          <div className="warning-popup" onClick={() => setShowWarning(false)}>              
          {t('warning')}
            </div>
          )}
          {currentGame === "wheel" && <WheelOfFortuna onBack={() => setCurrentGame(null)} />}
          {currentGame === "quiz" && <QuizOfMithras onBack={() => setCurrentGame(null)} />}
          {currentGame === "quiz2" && <GeneralQuiz onBack={() => setCurrentGame(null)} />}
          {currentGame === "stars" && <StarrySkyMystery onBack={() => setCurrentGame(null)} />}
          
          {/* Hidden logout button that appears after 10s hold */}
          {longPressProps.showButton && (
            <button 
              className="logout-btn customer-logout-btn" 
              onClick={() => {
                logout();
                setCurrentGame(null); // To popolnoma pobriše spomin na prejšnji kviz!
                longPressProps.hideButton();             
              }}
            >
              {t('logout')}
            </button>
          )}
        </div>

      );
    }


    return <UserSelection />;
  };

const App = () => {
  const { t } = useTranslation();
  const [currentGame, setCurrentGame] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const isGameActive = currentGame !== null;

  useInactivityTimer(
    () => {
      if (isGameActive) setShowWarning(true); // show warning only if inside a game
    },
    () => {
      if (isGameActive) {
        setShowWarning(false);
        setCurrentGame(null); // ✅ go back to main menu
    // hide warning
      }
    },
    100000, // 4 min for warning
    150000  // 5 min for timeout
  );


  return (
    <UserProvider>
      <div className="App">
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
          <LanguageSwitcher />
        </div>
       <AppContent
          currentGame={currentGame}
          setCurrentGame={setCurrentGame}
          showWarning={showWarning}
          setShowWarning={setShowWarning}
        />
      </div>
    </UserProvider>
  );



}

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
