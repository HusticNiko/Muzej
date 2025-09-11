import React, { useState, useEffect } from "react";
import "./styles.css";
import star_sparkle from './icons/star-sparkle.png'; // Adjust path if using public folder
import TwinklingStar from "./TwinklingStar";

const constellations = [
  {
    name: "Taurus",
    question: "What does Taurus represent in Mithraism?",
    options: ["The Bull of Heaven", "Messenger of the Moon", "God of War"],
    answer: "The Bull of Heaven",
    x: 30, y: 40 // Example coordinates
  },
  {
    name: "Canis Major",
    question: "What is Canis Major associated with?",
    options: ["Guardian of the Bull", "Star of the King", "Solar Chariot"],
    answer: "Guardian of the Bull",
    x: 70, y: 60
  },
  // Add more constellations...
];

const StarrySkyMystery = ({ onBack }) => {
  const [found, setFound] = useState([]);
  const [activeConstellation, setActiveConstellation] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selection, setSelection] = useState(false);
  const [completed, setCompleted] = useState(false);


  const handleSkyClick = (e) => {
    if (showQuiz) return; // Don't click while answering
    const { clientX, clientY } = e;
  
    const starArea = e.target.getBoundingClientRect();
    const clickedX = ((clientX - starArea.left) / starArea.width) * 100;
    const clickedY = ((clientY - starArea.top) / starArea.height) * 100;
  
    const foundConstellation = constellations.find(
      (c) => Math.abs(c.x - clickedX) < 10 && Math.abs(c.y - clickedY) < 10 && !found.some(f => f.name === c.name)
    );
  
    if (foundConstellation) {
      setActiveConstellation({ ...foundConstellation, clickX: clickedX, clickY: clickedY });
      setShowQuiz(true);
    } else {
      const starrySky = document.querySelector(".starry-sky");
      starrySky.classList.add("wrong-click");
      setTimeout(() => {
        starrySky.classList.remove("wrong-click");
      }, 600);
    }
  };
  

  const handleAnswer = (option) => {
    if (option === activeConstellation.answer) {
      setFound([...found, { name: activeConstellation.name, x: activeConstellation.clickX, y: activeConstellation.clickY }]);
      setShowQuiz(false);
      setActiveConstellation(null);
      setSelection(false)
  
      if (found.length + 1 === constellations.length) {
        setTimeout(() => {
          setCompleted(true);
        }, 1000);
      }
    } else {
      setSelection(true);
    }
  };
  
  return (
    <div className="starry-sky-wrapper">
    {Array.from({ length: 80 }).map((_, index) => (
      <TwinklingStar key={index} />
    ))}
  
    <div className="starry-sky" onClick={handleSkyClick}>
    {!completed ? (
        <>
          <div className="starry-sky" onClick={handleSkyClick}>
            <p className="instruction">Najdi zvezde ki so povezane z Mitraizmom</p>
            {found.map(({ name, x, y }) => (
              <div key={name}>
                <img
                  src={star_sparkle}
                  alt="Constellation Star"
                  className="constellation-star"
                  style={{ left: `${x}%`, top: `${y}%` }}
                />
                {/* Sparkle burst */}
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="star-particle"
                    style={{
                      left: `${x + (Math.random() - 0.5) * 5}%`,
                      top: `${y + (Math.random() - 0.5) * 5}%`,
                      animationDelay: `${Math.random()}s`
                    }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
          {showQuiz && (
            <div className="quiz-overlay">
              <h2>{activeConstellation.name}</h2>
              <p>{activeConstellation.question}</p>
              {activeConstellation.options.map((option) => (
                <button key={option} className="question-btn" onClick={() => handleAnswer(option)}>
                  {option}
                </button>
              ))}
               {selection && (
                <div className="wrong-answer-overlay">
                  <a>Napačen odgovor !</a>
                </div>
               )}
            </div>
          )}
        </>
      ) : (
        <div className="final-reveal">
          <h2>Welcome to the Mysteries of the Sky</h2>
          <p>As Mithras mastered the bull, so the stars shape our destiny.</p>
          <div className="relief-image"></div>
        </div>
      )}
       <button onClick={onBack} className="btn back-btn-stars">Nazaj na meni</button>
    </div>
    </div>     
  );
};

export default StarrySkyMystery;
