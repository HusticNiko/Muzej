import { useEffect, useRef } from "react";

const useInactivityTimer = (onWarning, onTimeout, warningTime = 240000, timeoutTime = 300000) => {
  const warningTimerRef = useRef();
  const timeoutTimerRef = useRef();

  const clearTimers = () => {
    clearTimeout(warningTimerRef.current);
    clearTimeout(timeoutTimerRef.current);
  };

  const resetTimers = () => {
    clearTimers();
    warningTimerRef.current = setTimeout(onWarning, warningTime);
    timeoutTimerRef.current = setTimeout(onTimeout, timeoutTime);
  };

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keypress", "touchstart", "scroll"];

    const handleActivity = () => {
      resetTimers();
    };

    events.forEach(event => window.addEventListener(event, handleActivity));

    resetTimers(); // Start timers when mounted

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearTimers();
    };
  }, [onWarning, onTimeout, warningTime, timeoutTime]);
};

export default useInactivityTimer;
