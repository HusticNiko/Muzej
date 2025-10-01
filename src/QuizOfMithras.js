import React, { useMemo, useState, useEffect } from "react";
import "./styles.css";
import obelisk from "./icons/obelisk1.svg";
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
  { name: "Corax", symbol: "🐦", icon: obelisk, qKey: "mitra1", opt: ["odgovor_1_1","odgovor_1_2","odgovor_1_3","odgovor_1_4"], ans: "odgovor_1_2" },
  { name: "Nymphus", symbol: "💍", icon: emperor, qKey: "mitra2", opt: ["odgovor_2_1","odgovor_2_2","odgovor_2_3","odgovor_2_4"], ans: "odgovor_2_2" },
  { name: "Miles", symbol: "⚔️", icon: helmet, qKey: "mitra3", opt: ["odgovor_3_1","odgovor_3_2","odgovor_3_3","odgovor_3_4"], ans: "odgovor_3_3" },
  { name: "Leo", symbol: "🦁", icon: columns, qKey: "mitra4", opt: ["odgovor_4_1","odgovor_4_2","odgovor_4_3","odgovor_4_4"], ans: "odgovor_4_4" },
  { name: "Perses", symbol: "🌑", qKey: "mitra5", icon: coloseum, opt: ["odgovor_5_1","odgovor_5_2","odgovor_5_3","odgovor_5_4"], ans: "odgovor_5_4" }, // eagle is NOT part
  { name: "Heliodromus", symbol: "☀️", icon: ship, qKey: "mitra6", opt: ["odgovor_6_1","odgovor_6_2","odgovor_6_3","odgovor_6_4"], ans: "odgovor_6_2" },
  { name: "Pater", symbol: "🧙", qKey: "mitra7", icon: circus, opt: ["odgovor_7_1","odgovor_7_2","odgovor_7_3","odgovor_7_4"], ans: "odgovor_7_1" },
  { name: "Miles", symbol: "⚔️", qKey: "mitra8", icon: crown, opt: ["odgovor_8_1","odgovor_8_2","odgovor_8_3","odgovor_8_4"], ans: "odgovor_8_2" },
  { name: "Leo", symbol: "🦁", qKey: "mitra9", icon: legion, opt: ["odgovor_9_1","odgovor_9_2","odgovor_9_3","odgovor_9_4"], ans: "odgovor_9_2" },
  { name: "Corax", symbol: "🐦", qKey: "mitra10", icon: sword, opt: ["odgovor_10_1","odgovor_10_2","odgovor_10_3","odgovor_10_4"], ans: "odgovor_10_1" },
  { name: "Nymphus", symbol: "💍", qKey: "mitra11", icon: shield, opt: ["odgovor_11_1","odgovor_11_2","odgovor_11_3","odgovor_11_4"], ans: "odgovor_11_2" },
  { name: "Heliodromus", symbol: "☀️", qKey: "mitra12", icon: eagle, opt: ["odgovor_12_1","odgovor_12_2","odgovor_12_3","odgovor_12_4"], ans: "odgovor_12_2" },
  { name: "Pater", symbol: "🧙", qKey: "mitra13", icon: temple, opt: ["odgovor_13_1","odgovor_13_2","odgovor_13_3","odgovor_13_4"], ans: "odgovor_13_2" },
];

const QuizOfMithras = ({ onBack }) => {
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
            <div className={`result ${isCorrect ? "correct" : "wrong"}`}>
              {isCorrect ? <img src={correct} className="step-icon" /> : <img src={wrong} className="step-icon" />}
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

export default QuizOfMithras;
