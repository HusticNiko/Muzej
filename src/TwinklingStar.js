import React, { useState, useEffect, useRef } from "react";

const TwinklingStar = () => {
  const [position, setPosition] = useState({
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 5
  });

  const starRef = useRef(null);

  useEffect(() => {
    const star = starRef.current;

    const handleAnimationEnd = () => {
      // When animation finishes, reposition the star randomly
      setPosition({
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 5 // New random delay for variation
      });
    };

    if (star) {
      star.addEventListener('animationiteration', handleAnimationEnd);
    }

    return () => {
      if (star) {
        star.removeEventListener('animationiteration', handleAnimationEnd);
      }
    };
  }, []);

  return (
    <div
      ref={starRef}
      className="twinkling-star"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        animationDelay: `${position.delay}s`
      }}
    ></div>
  );
};

export default TwinklingStar;
