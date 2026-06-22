import React, { useMemo, useState, useEffect, useRef } from "react";
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
import srecka from "./assets/srecka.png"
import napacen from "./assets/pravilen_v_prvo_splosno/napacen.webm";
import pravilen_v_drugo from "./assets/pravilen_v_prvo_splosno/pravilen_v_drugo.webm";
import pravilen_srecka_1 from "./assets/pravilen_v_prvo_splosno/Pravilen_srecka_1.webm";
import pravilen_srecka_2 from "./assets/pravilen_v_prvo_splosno/Pravilen_srecka_2.webm";
import pravilen_srecka_3 from "./assets/pravilen_v_prvo_splosno/Pravilen_srecka_3.webm";
import pravilen_srecka_4 from "./assets/pravilen_v_prvo_splosno/Pravilen_srecka_4.webm";
import pravilen_srecka_5 from "./assets/pravilen_v_prvo_splosno/Pravilen_srecka_5.webm";
import pravilen_srecka_6 from "./assets/pravilen_v_prvo_splosno/Pravilen_srecka_6.webm";
import pravilen_srecka_7 from "./assets/pravilen_v_prvo_splosno/Pravilen_srecka_7.webm";
import pravilen_srecka_8 from "./assets/pravilen_v_prvo_splosno/Pravilen_srecka_8.webm";
import pravilen_srecka_9 from "./assets/pravilen_v_prvo_splosno/Pravilen_srecka_9.webm";
import pravilen_srecka_10 from "./assets/pravilen_v_prvo_splosno/Pravilen_srecka_10.webm";
import pravilen_srecka_11 from "./assets/pravilen_v_prvo_splosno/Pravilen_srecka_11.webm";
import pravilen_srecka_12 from "./assets/pravilen_v_prvo_splosno/Pravilen_srecka_12.webm";
import { useTranslation } from "react-i18next";
import zvokPrvicPrav from "./assets/pravilno_prvic.mp3"; 
import zvokDrugicPrav from "./assets/pravilno_drugic2.mp3"; 
import zvokNapacno from "./assets/napacno2.mp3";
import BgLoop from "./assets/bg_loop.mp3";

function sample(array, k) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, k);
}

const BASE_STAGES = [
  { id: 1, name: "Nymphus", symbol: "💍", icon: emperor, qKey: "vprasanje_14", opt: ["odgovor_14_1","odgovor_14_2","odgovor_14_3","odgovor_14_4"], ans: "odgovor_14_2" },
  { id: 2, name: "Miles", symbol: "⚔️", icon: helmet, qKey: "vprasanje_15", opt: ["odgovor_15_1","odgovor_15_2","odgovor_15_3","odgovor_15_4"], ans: "odgovor_15_3" },
  { id: 3, name: "Leo", symbol: "🦁", icon: columns, qKey: "vprasanje_16", opt: ["odgovor_16_1","odgovor_16_2","odgovor_16_3","odgovor_16_4"], ans: "odgovor_16_1" },
  { id: 4, name: "Perses", symbol: "🌑", qKey: "vprasanje_17", icon: coloseum, opt: ["odgovor_17_1","odgovor_17_2","odgovor_17_3","odgovor_17_4"], ans: "odgovor_17_1" }, 
  { id: 5, name: "Heliodromus", symbol: "☀️", icon: ship, qKey: "vprasanje_18", opt: ["odgovor_18_1","odgovor_18_2","odgovor_18_3","odgovor_18_4"], ans: "odgovor_18_1" },
  { id: 6, name: "Pater", symbol: "🧙", qKey: "vprasanje_19", icon: circus, opt: ["odgovor_19_1","odgovor_19_2","odgovor_19_3","odgovor_19_4"], ans: "odgovor_19_2" },
  { id: 7, name: "Miles", symbol: "⚔️", qKey: "vprasanje_20", icon: crown, opt: ["odgovor_20_1","odgovor_20_2","odgovor_20_3","odgovor_20_4"], ans: "odgovor_20_2" },
  { id: 8, name: "Leo", symbol: "🦁", qKey: "vprasanje_21", icon: legion, opt: ["odgovor_21_1","odgovor_21_2","odgovor_21_3","odgovor_21_4"], ans: "odgovor_21_2" },
  { id: 9, name: "Corax", symbol: "🐦", qKey: "vprasanje_22", icon: sword, opt: ["odgovor_22_1","odgovor_22_2","odgovor_22_3","odgovor_22_4"], ans: "odgovor_22_4" },
  { id: 10, name: "Nymphus", symbol: "💍", qKey: "vprasanje_23", icon: shield, opt: ["odgovor_23_1","odgovor_23_2","odgovor_23_3","odgovor_23_4"], ans: "odgovor_23_3" },
  { id: 11, name: "Heliodromus", symbol: "☀️", qKey: "vprasanje_24", icon: eagle, opt: ["odgovor_24_1","odgovor_24_2","odgovor_24_3","odgovor_24_4"], ans: "odgovor_24_1" },
  { id: 12, name: "Pater", symbol: "🧙", qKey: "vprasanje_25", icon: temple, opt: ["odgovor_25_1","odgovor_25_2","odgovor_25_3","odgovor_25_4"], ans: "odgovor_25_2" },
];

const correctFirstTryById = {
  1: pravilen_srecka_1, 2: pravilen_srecka_2, 3: pravilen_srecka_3, 4: pravilen_srecka_4,
  5: pravilen_srecka_5, 6: pravilen_srecka_6, 7: pravilen_srecka_7, 8: pravilen_srecka_8,
  9: pravilen_srecka_9, 10: pravilen_srecka_10, 11: pravilen_srecka_11, 12: pravilen_srecka_12,
};

const GeneralQuiz = ({ onBack }) => {
  const { t, i18n } = useTranslation();
  const [stageIndex, setStageIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [attemptCounts, setAttemptCounts] = useState(() => ({})); 
  const [started, setStarted] = useState(false);
  const [resultAttemptNumber, setResultAttemptNumber] = useState(1);
  const [generalScore, setGeneralScore] = useState(0);
  const [firstTryScore, setFirstTryScore] = useState(0);
  const [result, setResult] = useState(null);

  const K = 7;
  const stages = useMemo(() => sample(BASE_STAGES, Math.min(K, BASE_STAGES.length)), []);
  const current = stages[stageIndex];
  const videoRef = useRef(null);

  // Audio setup
   const audioRefs = useRef({
     bg: new Audio(BgLoop),
     btn: new Audio('button.mp3'),
     celeb: new Audio('celebration2.mp3'),
     // --- NOVI ZVOKI ---
     prvic: new Audio(zvokPrvicPrav),
     drugic: new Audio(zvokDrugicPrav),
     napacno: new Audio(zvokNapacno)
   });

// RESETIRAJ NEAKTIVNOST OB VSTOPU V KVIZ
  useEffect(() => {
    window.dispatchEvent(new Event('mousemove'));
    window.dispatchEvent(new Event('touchstart'));
  }, []);

  const playBtnSound = () => {
    const { btn } = audioRefs.current;
    btn.currentTime = 0;
    btn.play().catch(() => {});
  };

  // Background music lifecycle
  useEffect(() => {
    const { bg } = audioRefs.current;
    bg.loop = true;
    bg.volume = 0.4;
    bg.play().catch(() => {});

    return () => {
      bg.pause();
      bg.currentTime = 0;
    };
  }, []);

  // Celebration sound lifecycle
  useEffect(() => {
    const { bg, celeb } = audioRefs.current;
    if (stageIndex === stages.length && stages.length > 0) {
      bg.pause(); // Pause bg music so celebration stands out
      celeb.currentTime = 0;
      celeb.play().catch(() => {});
    }
  }, [stageIndex, stages.length]);

  // Audio ducking z mehkim prehodom (Fade in / Fade out)
  useEffect(() => {
    const { bg } = audioRefs.current;
    if (!bg) return;

    // Zdaj lahko varno nastaviš tiho glasnost nazaj na 0.1, saj bo prehod mehak!
    const ciljnaGlasnost = showResult ? 0.1 : 0.6; 
    
    // Kako hitro naj se drsnik premika (manjši korak = daljša animacija)
    const korak = showResult ? -0.015 : 0.015; 

    const fadeInterval = setInterval(() => {
      let novaGlasnost = bg.volume + korak;

      // Varnostna blokada, da vrednost ne gre pod 0 ali nad 1 (brskalnik bi vrgel napako)
      novaGlasnost = Math.max(0, Math.min(1, novaGlasnost));

      // Če smo dosegli ali presegli ciljno glasnost, ustavimo animacijo
      if ((korak > 0 && novaGlasnost >= ciljnaGlasnost) || 
          (korak < 0 && novaGlasnost <= ciljnaGlasnost)) {
        bg.volume = ciljnaGlasnost;
        clearInterval(fadeInterval);
      } else {
        bg.volume = novaGlasnost;
      }
    }, 50); // Animacija se osveži vsakih 50 milisekund

    // Počistimo interval, če se komponenta nepričakovano zapre
    return () => clearInterval(fadeInterval);
  }, [showResult]);

  const finishResult = () => {
    setShowResult(false);
    if (!result) return;
    if (result.correct) {
      setStageIndex((prev) => prev + 1);
    } else if (result.attempt >= 2) {
      setStageIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!showResult) return;
    const t = setTimeout(() => { finishResult(); }, 6000); 
    return () => clearTimeout(t);
  }, [showResult, result]); 

  const handleAnswer = (optionKey) => {
    playBtnSound();
    if (showResult) return;

    const correctAnswer = optionKey === current.ans;
    const qid = current.id;
    const prevCount = attemptCounts[qid] || 0;
    const attempt = prevCount + 1;

    // --- PREDVAJAJ SPECIFIČEN ZVOK ---
    const { prvic, drugic, napacno } = audioRefs.current;
    // NASTAVITEV GLASNOSTI (od 0.0 do 1.0)
    prvic.volume = 0.4; 
    drugic.volume = 0.4;
    napacno.volume = 0.4;
    if (correctAnswer) {
      if (attempt === 1) {
        prvic.currentTime = 0;
        prvic.play().catch(() => {});
      } else {
        drugic.currentTime = 0;
        drugic.play().catch(() => {});
      }
    } else {
      napacno.currentTime = 0;
      napacno.play().catch(() => {});
    }
    // ---------------------------------

    setAttemptCounts((prev) => ({ ...prev, [qid]: attempt }));
    setResultAttemptNumber(attempt);

    if (correctAnswer) {
      setGeneralScore((s) => s + 1);
      if (attempt === 1) setFirstTryScore((s) => s + 1);
    }

    const useLaterCorrect = correctAnswer && attempt > 1;
    const firstTryVideo = correctFirstTryById[qid] ?? pravilen_v_drugo;

    const src = correctAnswer ? (useLaterCorrect ? pravilen_v_drugo : firstTryVideo) : napacen;

    setIsCorrect(correctAnswer);
    setShowResult(true);
    setResult({ qid, correct: correctAnswer, attempt, src });
  };

  useEffect(() => {
    if (!showResult) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [showResult, result]);

  if (!started) {
    return (
      <div className="quiz intro-page light-theme lang-fade" key={i18n.language}>
        <div className="intro-card">
          <div className="intro-content">
            <p className="intro-title">{t("intro_title")}</p>
            <p className="intro-line">{t("intro_line_1")}</p>
            <p className="intro-line">{t("intro_line_2")}</p>
            <p className="intro-line intro-spaced">{t("intro_line_3")}</p>
            <button className="intro-btn" onClick={() => { playBtnSound(); setStarted(true); }}>
              {t("start_quiz")}
            </button>
          </div>
          <div className="intro-character-slot" aria-hidden="true" />
          <img src={srecka} alt="" className="intro-character" draggable="false" />
        </div>
      </div>
    );
  }

  return (
    <div className="quiz light-theme lang-fade" key={i18n.language}>
      {stageIndex < stages.length ? (
        <>
          <div className="stepper">
            {stages.map((stage, index) => (
              <div key={index} className="step-wrapper">
                <div className={`step ${index <= stageIndex ? "active" : "inactive"} ${index === stageIndex ? "glow" : ""}`}>
                  {stage.icon && <img src={stage.icon} stroke={"white"} alt={stage.name} className="step-icon" />}
                </div>
                {index !== stages.length - 1 && (
                  <div className={`connector ${index < stageIndex ? "active-line" : "inactive-line"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="options">
            <p className="question title-gold">{t(current.qKey)}</p>
            <div className="buttons">
            {current.opt.map((optKey) => (
              <button key={optKey} className="question_btn tihi-gumb" onClick={() => handleAnswer(optKey)}>
                {t(optKey)}
              </button>
            ))}
          </div>
          {showResult && (
            <div className={`result-overlay ${showResult ? "show" : ""}`}>
              <video
                ref={videoRef}
                key={`${result.qid}-${result.attempt}-${result.correct ? "c" : "w"}`}
                className="result-video"
                src={result.src}
                autoPlay
                playsInline
                preload="auto"
                onEnded={finishResult}
                onError={finishResult}
              />
            </div>
          )}
          </div>
        </>
      ) : (
        <div>
          <div className="final-stage">
            <h2 className="pater-title">
              {firstTryScore === stages.length ? t("completed_text3") : t("completed_text4")}
            </h2>
            <p className="fade-animation">
              {firstTryScore === stages.length ? t("completed_subtext3") : t("completed_subtext2")}
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
          <button onClick={() => { playBtnSound(); onBack(); }} className="back_to_menu_btn">
            {t("back_to_menu")}
          </button>
        </div>
      )}
    </div>
  );
};

export default GeneralQuiz;