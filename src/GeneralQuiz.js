
import React, { useMemo, useState, useEffect } from "react";
import "./styles.css";
import obelisk from "./icons/obelisk.svg";
import emperor from "./icons/emperor1.svg";
import columns from "./icons/columns1.svg";
import coloseum from "./icons/coloseum1.svg";
import ship from "./icons/ship1.svg";
import circus from "./icons/circus1.svg";
import crown from "./icons/crown1.svg";
import sword from "./icons/sword1.svg";
import eagle from "./icons/eagle1.svg";
import shield from "./icons/shield1.svg";
import temple from "./icons/temple1.svg";
import legion from "./icons/legion1.svg";
import helmet from "./icons/helmet1.svg";
import correct from "./icons/correct.svg";
import pravilen from "./assets/pravilen.webm";
import napacen from "./assets/napacen.webm";
import pravilen2 from "./assets/pravilen2.webm";

import wrong from "./icons/wrong.svg";
import { useTranslation } from "react-i18next";

// Helper: sample k unique items without mutating original
function sample(array, k) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, k);
}

// Keep only KEYS here. We'll translate on render with `t`.
const BASE_STAGES = [
  { name: "Nymphus", symbol: "💍", icon: emperor, qKey: "vprasanje_14", opt: ["odgovor_14_1","odgovor_14_2","odgovor_14_3","odgovor_14_4"], ans: "odgovor_14_2" },
  { name: "Miles", symbol: "⚔️", icon: helmet, qKey: "vprasanje_15", opt: ["odgovor_15_1","odgovor_15_2","odgovor_15_3","odgovor_15_4"], ans: "odgovor_15_3" },
  { name: "Leo", symbol: "🦁", icon: columns, qKey: "vprasanje_16", opt: ["odgovor_16_1","odgovor_16_2","odgovor_16_3","odgovor_16_4"], ans: "odgovor_16_1" },
  { name: "Perses", symbol: "🌑", qKey: "vprasanje_17", icon: coloseum, opt: ["odgovor_17_1","odgovor_17_2","odgovor_17_3","odgovor_17_4"], ans: "odgovor_17_1" }, // eagle is NOT part
  { name: "Heliodromus", symbol: "☀️", icon: ship, qKey: "vprasanje_18", opt: ["odgovor_18_1","odgovor_18_2","odgovor_18_3","odgovor_18_4"], ans: "odgovor_18_1" },
  { name: "Pater", symbol: "🧙", qKey: "vprasanje_19", icon: circus, opt: ["odgovor_19_1","odgovor_19_2","odgovor_19_3","odgovor_19_4"], ans: "odgovor_19_2" },
  { name: "Miles", symbol: "⚔️", qKey: "vprasanje_20", icon: crown, opt: ["odgovor_20_1","odgovor_20_2","odgovor_20_3","odgovor_20_4"], ans: "odgovor_20_2" },
  { name: "Leo", symbol: "🦁", qKey: "vprasanje_21", icon: legion, opt: ["odgovor_21_1","odgovor_21_2","odgovor_21_3","odgovor_21_4"], ans: "odgovor_21_2" },
  { name: "Corax", symbol: "🐦", qKey: "vprasanje_22", icon: sword, opt: ["odgovor_22_1","odgovor_22_2","odgovor_22_3","odgovor_22_4"], ans: "odgovor_22_4" },
  { name: "Nymphus", symbol: "💍", qKey: "vprasanje_23", icon: shield, opt: ["odgovor_23_1","odgovor_23_2","odgovor_23_3","odgovor_23_4"], ans: "odgovor_23_3" },
  { name: "Heliodromus", symbol: "☀️", qKey: "vprasanje_24", icon: eagle, opt: ["odgovor_24_1","odgovor_24_2","odgovor_24_3","odgovor_24_4"], ans: "odgovor_24_1" },
  { name: "Pater", symbol: "🧙", qKey: "vprasanje_25", icon: temple, opt: ["odgovor_25_1","odgovor_25_2","odgovor_25_3","odgovor_25_4"], ans: "odgovor_25_2" },
];

const GeneralQuiz = ({ onBack }) => {
  const { t } = useTranslation();
  const [stageIndex, setStageIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [attemptCounts, setAttemptCounts] = useState(() => ({})); // { [stageIndex]: number }
  const [resultAttemptNumber, setResultAttemptNumber] = useState(1);
  const [started, setStarted] = useState(false);



  // Always pick 6 random unique stages on mount (or remount).
  const stages = useMemo(() => sample(BASE_STAGES, 7), []);

  // If language changes, UI re-renders with updated `t()`. We keep the same 6 stages.
  // Optional: reset progress if you want when language switches:
  // useEffect(() => setStageIndex(0), [i18n.language]);

  const current = stages[stageIndex];

useEffect(() => {
  if (showResult && isCorrect) {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }
}, [showResult, isCorrect]);

  const handleCorrectAnimationEnd = () => {
  setShowResult(false);
  setStageIndex((prev) => prev + 1);
};

const handleWrongAnimationEnd = () => {
  setShowResult(false); // do NOT advance
};


 const handleAnswer = (optionKey) => {
  const correctAnswer = optionKey === current.ans;

  // increment attempts for THIS question
  setAttemptCounts((prev) => {
     const next = { ...prev };
  const newCount = (next[stageIndex] || 0) + 1;
  next[stageIndex] = newCount;
  setResultAttemptNumber(newCount); // <-- lock attempt number for this result
  return next;
  });

  setIsCorrect(correctAnswer);
  setShowResult(true);
};

const attemptsThisQuestion = attemptCounts[stageIndex] || 0;


// If they are correct AND this wasn't the first attempt
const useThirdOnCorrect = isCorrect && resultAttemptNumber > 1;

const resultVideoSrc = isCorrect
  ? (useThirdOnCorrect ? pravilen2 : pravilen)
  : napacen;

if (!started) {
  return (
    <div className="quiz intro-page">
      <div className="intro-card">
        <div className="intro-content">
          <p className="intro-title">{t("intro_title")}</p>

          <p className="intro-line">{t("intro_line_1")}</p>
          <p className="intro-line">{t("intro_line_2")}</p>
          <p className="intro-line intro-spaced">{t("intro_line_3")}</p>

          <button className="intro-btn" onClick={() => setStarted(true)}>
            {t("start_quiz")}
          </button>
        </div>

        {/* Character placeholder (you'll add later) */}
        <div className="intro-character-slot" aria-hidden="true" />
      </div>
    </div>
  );
}


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
                    {stage.icon && <img src={stage.icon} stroke={"white"} alt={stage.name} className="step-icon" />}
                    
                  </div>
                  {index !== stages.length - 1 && (
                    <div className={`connector ${index < stageIndex ? "active-line" : "inactive-line"}`} />
                  )}
                </div>
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="sparkle"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
  
            <div className="options">
              <p className="question title-gold">{t(current.qKey)}</p>
              <div className="buttons">
              {current.opt.map((optKey) => (
                <button key={optKey} className="question_btn" onClick={() => handleAnswer(optKey)}>
                  {t(optKey)}
                </button>
              ))}
            </div>
            {showResult && (
  <div className="result-overlay">
    <video
      className="result-video"
      src={resultVideoSrc}
      key={`${stageIndex}-${isCorrect ? (useThirdOnCorrect ? "c2" : "c1") : "w"}`}
      autoPlay
      muted
      playsInline
      onEnded={isCorrect ? handleCorrectAnimationEnd : handleWrongAnimationEnd}
    />
  </div>
)
}
            </div>
          </>
        ) : (
          <div className="final-stage-stage">
          <div className="final-stage">
            <h2 className="pater-title">{t("completed_text2")}</h2>
          </div>
           <button onClick={onBack} className="back_to_menu_btn">
              {t("back_to_menu")}
            </button>
            </div>
        )}
      </div>
    );
  };

export default GeneralQuiz;
