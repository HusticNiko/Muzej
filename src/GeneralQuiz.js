
import React, { useMemo, useState, useEffect } from "react";
import "./styles.css";
import obelisk from "./icons/obelisk.svg";
import emperor from "./icons/emperor.svg";
import columns from "./icons/colums.svg";
import coloseum from "./icons/coloseum.svg";
import ship from "./icons/ship.svg";
import circus from "./icons/circus.svg";
import crown from "./icons/crown.svg";
import sword from "./icons/sword.svg";
import eagle from "./icons/eagle.svg";
import shield from "./icons/shield.svg";
import temple from "./icons/temple.svg";
import legion from "./icons/legion.svg";
import helmet from "./icons/helmet.svg";
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

  // Always pick 6 random unique stages on mount (or remount).
  const stages = useMemo(() => sample(BASE_STAGES, 7), []);

  // If language changes, UI re-renders with updated `t()`. We keep the same 6 stages.
  // Optional: reset progress if you want when language switches:
  // useEffect(() => setStageIndex(0), [i18n.language]);

  const current = stages[stageIndex];

  const handleAnswer = (optionKey) => {
    const correct = optionKey === current.ans; // compare KEYS, not translated strings
    setIsCorrect(correct);
    setShowResult(true);
    setTimeout(() => {
      if (correct) setStageIndex((prev) => prev + 1);
      setShowResult(false);
    }, 800);
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
                  {stage.icon && <img src={stage.icon} alt={stage.name} className="step-icon" />}
                  
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
            <p className="question">{t(current.qKey)}</p>
            <div className="buttons">
            {current.opt.map((optKey) => (
              <button key={optKey} className="question_btn" onClick={() => handleAnswer(optKey)}>
                {t(optKey)}
              </button>
            ))}
          </div>
            {showResult && (
            <div className={`result ${isCorrect ? "correct" : "wrong"}`}>
              {isCorrect ? t("correct") : t("incorrect")}
            </div>
          )}
          </div>
        </>
      ) : (
        <div>
        <div className="final-stage">
          <h2 className="pater-title">{t("completed_text")}</h2>
          <p className="fade-animation">
           {t("completed_subtext")}
          </p>
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
