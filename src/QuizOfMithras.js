import React, { useState } from "react";
import "./styles.css";

import crow from './icons/crow.png'; // Adjust path if using public folder
import ring from './icons/ring.png'; // Adjust path if using public folder
import cesar from './icons/cesar.png'; // Adjust path if using public folder
import lion from './icons/lion.png'; // Adjust path if using public folder
import stars from './icons/stars.png'; // Adjust path if using public folder
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const QuizOfMithras = ({ onBack }) => {
  const { t } = useTranslation();
  const [stageIndex, setStageIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);


  const stages = [
  { name: "Corax", symbol: "🐦", icon: crow, question: t("stage1"), options: ["Crow", "Bull", "Lion"], answer: "Crow" },
  { name: "Nymphus", symbol: "💍",icon: ring, question: "What does the Nymphus stage represent?", options: ["Sun", "War", "Marriage"], answer: "Marriage" },
  { name: "Miles", symbol: "⚔️", icon: cesar, question: "What is a Miles in Mithraism?", options: ["A farmer", "A priest", "A soldier"], answer: "A soldier" },
  { name: "Leo", symbol: "🦁", icon: lion, question: "Which element is associated with Leo?", options: ["Fire", "Water", "Earth"], answer: "Fire" },
  { name: "Perses", symbol: "🌑",  question: "What does Perses symbolize?", options: ["Moon", "Star Wisdom", "Darkness"], answer: "Star Wisdom" },
  { name: "Heliodromus", symbol: "☀️", icon: stars, question: "What is the role of Heliodromus?", options: ["Bull Slayer", "Moon Watcher", "Sun Runner"], answer: "Sun Runner" },
  { name: "Pater", symbol: "🧙", question: "What happens at the Pater stage?", options: ["War", "Sacrifice", "Enlightenment"], answer: "Enlightenment" }
];

  const current = stages[stageIndex];

  const handleAnswer = (option) => {
    const correct = option === current.answer;
    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(() => {
        if (correct) {
            setStageIndex((prev) => prev + 1);
          }
      setShowResult(false);
    }, 2000);
  };

 
  return (
    <div className="quiz">
     {stageIndex < stages.length ? (
  <>
 <div className="stepper">
  {stages.map((stage, index) => (
    <div key={index} className="step-wrapper">
      <div
        className={`step ${index <= stageIndex ? "active" : "inactive"} ${
          index === stageIndex ? "glow" : ""
        }`}
      >
         <img src={stage.icon} alt={stage.name} className="step-icon" />
         <div className="step-name">{stage.name}</div>
      </div>

      {/* Line Connector */}
      {index !== stages.length - 1 && (
        <div className={`connector ${index < stageIndex ? "active-line" : "inactive-line"}`}></div>
      )}
    </div>
    
  ))}
  {/* Sparkles floating */}
{Array.from({ length: 10 }).map((_, index) => (
  <div
    key={index}
    className="sparkle"
    style={{
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`
    }}
  />
))}

</div>
    <div className="options">
      <p className="question">{current.question}</p>
      {current.options.map((option) => (
        <button key={option} className="btn" onClick={() => handleAnswer(option)}>
          {option}
        </button>
      ))}
    </div>

    {showResult && (
      <div className={`result ${isCorrect ? "correct" : "wrong"}`}>
        {isCorrect ? "Correct! Proceed to the next stage." : "Incorrect... Try again!"}
      </div>
    )}
  </>
) : (
  <div className="final-stage">
    <h2 className="pater-title">🌟 You are now a PATER of the Mysteries 🌟</h2>
    <p className="fade-animation">The torch is passed. The stars align. You wear the golden cloak of wisdom.</p>
    <button onClick={onBack} className="btn back-btn">Back to Menu</button>
  </div>
)}
</div>
  );

};

export default QuizOfMithras;
