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
import napacen from "./assets/pravilen_v_prvo_mitraizem/napacen.webm";
import srecka from "./assets/srecka.png"
import pravilen_v_drugo from "./assets/pravilen_v_prvo_mitraizem/pravilen_v_drugo.webm";
import pravilen_Viki_1 from "./assets/pravilen_v_prvo_mitraizem/Pravilen_Viki_1.webm";
import pravilen_Viki_2 from "./assets/pravilen_v_prvo_mitraizem/Pravilen_Viki_2.webm";
import pravilen_Viki_3 from "./assets/pravilen_v_prvo_mitraizem/Pravilen_Viki_3.webm";
import pravilen_Viki_4 from "./assets/pravilen_v_prvo_mitraizem/Pravilen_Viki_4.webm";
import pravilen_Viki_5 from "./assets/pravilen_v_prvo_mitraizem/Pravilen_Viki_5.webm";
import pravilen_Viki_6 from "./assets/pravilen_v_prvo_mitraizem/Pravilen_Viki_6.webm";
import pravilen_Viki_7 from "./assets/pravilen_v_prvo_mitraizem/Pravilen_Viki_7.webm";
import pravilen_Viki_8 from "./assets/pravilen_v_prvo_mitraizem/Pravilen_Viki_8.webm";
import pravilen_Viki_9 from "./assets/pravilen_v_prvo_mitraizem/Pravilen_Viki_9.webm";
import pravilen_Viki_10 from "./assets/pravilen_v_prvo_mitraizem/Pravilen_Viki_10.webm";
import pravilen_Viki_11 from "./assets/pravilen_v_prvo_mitraizem/Pravilen_Viki_11.webm";
import pravilen_Viki_12 from "./assets/pravilen_v_prvo_mitraizem/Pravilen_Viki_12.webm";


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
  { id: 1, name: "Corax", symbol: "🐦", icon: obelisk, qKey: "mitra1", opt: ["odgovor_1_1","odgovor_1_2","odgovor_1_3","odgovor_1_4"], ans: "odgovor_1_2" },
  { id: 2, name: "Nymphus", symbol: "💍", icon: emperor, qKey: "mitra2", opt: ["odgovor_2_1","odgovor_2_2","odgovor_2_3","odgovor_2_4"], ans: "odgovor_2_2" },
  { id: 3, name: "Miles", symbol: "⚔️", icon: helmet, qKey: "mitra3", opt: ["odgovor_3_1","odgovor_3_2","odgovor_3_3","odgovor_3_4"], ans: "odgovor_3_3" },
  { id: 4, name: "Leo", symbol: "🦁", icon: columns, qKey: "mitra4", opt: ["odgovor_4_1","odgovor_4_2","odgovor_4_3","odgovor_4_4"], ans: "odgovor_4_4" },
  { id: 5, name: "Perses", symbol: "🌑", qKey: "mitra5", icon: coloseum, opt: ["odgovor_5_1","odgovor_5_2","odgovor_5_3","odgovor_5_4"], ans: "odgovor_5_4" }, // eagle is NOT part
  { id: 6, name: "Heliodromus", symbol: "☀️", icon: ship, qKey: "mitra6", opt: ["odgovor_6_1","odgovor_6_2","odgovor_6_3","odgovor_6_4"], ans: "odgovor_6_2" },
  { id: 7, name: "Pater", symbol: "🧙", qKey: "mitra7", icon: circus, opt: ["odgovor_7_1","odgovor_7_2","odgovor_7_3","odgovor_7_4"], ans: "odgovor_7_1" },
  { id: 8, name: "Miles", symbol: "⚔️", qKey: "mitra8", icon: crown, opt: ["odgovor_8_1","odgovor_8_2","odgovor_8_3","odgovor_8_4"], ans: "odgovor_8_2" },
  { id: 9, name: "Leo", symbol: "🦁", qKey: "mitra9", icon: legion, opt: ["odgovor_9_1","odgovor_9_2","odgovor_9_3","odgovor_9_4"], ans: "odgovor_9_2" },
  { id: 10, name: "Corax", symbol: "🐦", qKey: "mitra10", icon: sword, opt: ["odgovor_10_1","odgovor_10_2","odgovor_10_3","odgovor_10_4"], ans: "odgovor_10_1" },
  { id: 11, name: "Nymphus", symbol: "💍", qKey: "mitra11", icon: shield, opt: ["odgovor_11_1","odgovor_11_2","odgovor_11_3","odgovor_11_4"], ans: "odgovor_11_2" },
  { id: 12, name: "Heliodromus", symbol: "☀️", qKey: "mitra12", icon: eagle, opt: ["odgovor_12_1","odgovor_12_2","odgovor_12_3","odgovor_12_4"], ans: "odgovor_12_2" },
  { id: 13, name: "Pater", symbol: "🧙", qKey: "mitra13", icon: temple, opt: ["odgovor_13_1","odgovor_13_2","odgovor_13_3","odgovor_13_4"], ans: "odgovor_13_2" },
];

const correctFirstTryById = {
  1: pravilen_Viki_1,
  2: pravilen_Viki_2,
  3: pravilen_Viki_3,
  4: pravilen_Viki_4,
  5: pravilen_Viki_5,
  6: pravilen_Viki_6,
  7: pravilen_Viki_7,
  8: pravilen_Viki_8,
  9: pravilen_Viki_9,
  10: pravilen_Viki_10,
  11: pravilen_Viki_11,
  12: pravilen_Viki_12,
};

const QuizOfMithras = ({ onBack }) => {
  const { t } = useTranslation();
  const [stageIndex, setStageIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [attemptCounts, setAttemptCounts] = useState(() => ({})); // { [stageIndex]: number }
  const [started, setStarted] = useState(false);
  const [resultAttemptNumber, setResultAttemptNumber] = useState(1);
  const [generalScore, setGeneralScore] = useState(0);
  const [firstTryScore, setFirstTryScore] = useState(0);

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
  setShowResult(false);

  // If user has used both attempts (2 tries) and still wrong -> move on
  if (!isCorrect && resultAttemptNumber >= 2) {
    setStageIndex((prev) => prev + 1);
  }
};


 const handleAnswer = (optionKey) => {
  const correctAnswer = optionKey === current.ans;

  setAttemptCounts((prev) => {
    const next = { ...prev };
    const newCount = (next[stageIndex] || 0) + 1; // attempt number for THIS click
    next[stageIndex] = newCount;

    // lock attempt number for deciding which animation to play
    setResultAttemptNumber(newCount);

    // If correct, update scores
    if (correctAnswer) {
      setGeneralScore((s) => s + 1);
      if (newCount === 1) setFirstTryScore((s) => s + 1);
    }

    return next;
  });

  setIsCorrect(correctAnswer);
  setShowResult(true);
};


const attemptsThisQuestion = attemptCounts[stageIndex] || 0;


// If they are correct AND this wasn't the first attempt
const useThirdOnCorrect = isCorrect && resultAttemptNumber > 1;

const questionId = current?.id;

const useLaterCorrect = isCorrect && resultAttemptNumber > 1;

  const resultVideoSrc =
  current && isCorrect
    ? (useLaterCorrect ? pravilen_v_drugo : correctFirstTryById[questionId])
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
          <img
        src={srecka}
        alt=""
        className="intro-character"
        draggable="false"
      />
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
      key={`${questionId}-${isCorrect ? (useLaterCorrect ? "c2" : "c1") : "w"}-${resultAttemptNumber}`}
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
        <div>
  <div className="final-stage">
    <h2 className="pater-title">
      {firstTryScore === stages.length ? t("completed_text") : t("completed_text2")}
    </h2>

    <p className="fade-animation">
      {firstTryScore === stages.length ? t("completed_subtext") : t("completed_subtext2")}
    </p>

    <div className="score-box">
      <p className="score-line">
        {t("score_total")}: <strong>{generalScore} / {stages.length}</strong>
      </p>
      <p className="score-line">
        {t("score_first_try")}: <strong>{firstTryScore} / {stages.length}</strong>
      </p>
    </div>
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
