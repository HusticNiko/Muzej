import React, { useMemo, useState, useEffect, useRef } from "react";
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
import viki from "./assets/Viki_Mitra2.png"
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
import zvokPrvicPrav from "./assets/pravilno_prvic.mp3"; 
import zvokDrugicPrav from "./assets/pravilno_drugic.mp3"; 
import zvokNapacno from "./assets/napacno.mp3";
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
  { id: 1, name: "Corax", symbol: "🐦", icon: obelisk, qKey: "vprasanje_1", opt: ["odgovor_1_1","odgovor_1_2","odgovor_1_3","odgovor_1_4"], ans: "odgovor_1_2" },
  { id: 2, name: "Nymphus", symbol: "💍", icon: emperor, qKey: "vprasanje_2", opt: ["odgovor_2_1","odgovor_2_2","odgovor_2_3","odgovor_2_4"], ans: "odgovor_2_2" },
  { id: 3, name: "Miles", symbol: "⚔️", icon: helmet, qKey: "vprasanje_3", opt: ["odgovor_3_1","odgovor_3_2","odgovor_3_3","odgovor_3_4"], ans: "odgovor_3_3" },
  { id: 4, name: "Leo", symbol: "🦁", icon: columns, qKey: "vprasanje_4", opt: ["odgovor_4_1","odgovor_4_2","odgovor_4_3","odgovor_4_4"], ans: "odgovor_4_4" },
  { id: 5, name: "Perses", symbol: "🌑", qKey: "vprasanje_5", icon: coloseum, opt: ["odgovor_5_1","odgovor_5_2","odgovor_5_3","odgovor_5_4"], ans: "odgovor_5_4" }, 
  { id: 6, name: "Heliodromus", symbol: "☀️", icon: ship, qKey: "vprasanje_6", opt: ["odgovor_6_1","odgovor_6_2","odgovor_6_3","odgovor_6_4"], ans: "odgovor_6_2" },
  { id: 7, name: "Pater", symbol: "🧙", qKey: "vprasanje_7", icon: circus, opt: ["odgovor_7_1","odgovor_7_2","odgovor_7_3","odgovor_7_4"], ans: "odgovor_7_1" },
  { id: 8, name: "Miles", symbol: "⚔️", qKey: "vprasanje_8", icon: crown, opt: ["odgovor_8_1","odgovor_8_2","odgovor_8_3","odgovor_8_4"], ans: "odgovor_8_2" },
  { id: 9, name: "Leo", symbol: "🦁", qKey: "vprasanje_9", icon: legion, opt: ["odgovor_9_1","odgovor_9_2","odgovor_9_3","odgovor_9_4"], ans: "odgovor_9_2" },
  { id: 10, name: "Corax", symbol: "🐦", qKey: "vprasanje_10", icon: sword, opt: ["odgovor_10_1","odgovor_10_2","odgovor_10_3","odgovor_10_4"], ans: "odgovor_10_1" },
  { id: 11, name: "Nymphus", symbol: "💍", qKey: "vprasanje_11", icon: shield, opt: ["odgovor_11_1","odgovor_11_2","odgovor_11_3","odgovor_11_4"], ans: "odgovor_11_2" },
  { id: 12, name: "Heliodromus", symbol: "☀️", qKey: "vprasanje_12", icon: eagle, opt: ["odgovor_12_1","odgovor_12_2","odgovor_12_3","odgovor_12_4"], ans: "odgovor_12_2" },
];

const correctFirstTryById = {
  1: pravilen_Viki_1, 2: pravilen_Viki_2, 3: pravilen_Viki_3, 4: pravilen_Viki_4,
  5: pravilen_Viki_5, 6: pravilen_Viki_6, 7: pravilen_Viki_7, 8: pravilen_Viki_8,
  9: pravilen_Viki_9, 10: pravilen_Viki_10, 11: pravilen_Viki_11, 12: pravilen_Viki_12,
};

const QuizOfMithras = ({ onBack, alreadyStarted }) => {
  const { t } = useTranslation();
  const [stageIndex, setStageIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [attemptCounts, setAttemptCounts] = useState(() => ({})); 
  const [started, setStarted] = useState(alreadyStarted ? alreadyStarted : false);
  const [resultAttemptNumber, setResultAttemptNumber] = useState(1);
  const [generalScore, setGeneralScore] = useState(0);
  const [firstTryScore, setFirstTryScore] = useState(0);
  const [result, setResult] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const K = 7;
  const stages = useMemo(() => sample(BASE_STAGES, Math.min(K, BASE_STAGES.length)), []); 
  const current = stages[stageIndex];
  const videoRef = useRef(null);

  // Audio setup
  // Audio setup
  const audioRefs = useRef({
    bg: new Audio(BgLoop),
    celeb: new Audio('celebration2.mp3'),
    btn: new Audio('button.mp3'),
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

  const handleVideoEnd = () => {
    // Preverimo, če gre za pravilen odgovor v prvem poskusu
    if (result && result.correct && result.attempt === 1) {
      setIsFadingOut(true); // Sproži CSS zatemnitev
      
      // Počakaj 1.2 sekunde (čas fade-outa), preden greš na naslednje vprašanje
      setTimeout(() => {
        setIsFadingOut(false); // Resetiraj za naslednjič
        finishResult();
      }, 1200); 
    } else {
      // Za napačne odgovore ali pravilne v drugo -> pojdi naprej takoj!
      finishResult();
    }
  };

  const handleAnswer = (optionKey) => {
  
    if (showResult) return;

    const correctAnswer = optionKey === current.ans;
    const qid = current.id;
    const prevCount = attemptCounts[qid] || 0;
    const attempt = prevCount + 1;

    // --- PREDVAJAJ SPECIFIČEN ZVOK ---
    const { prvic, drugic, napacno } = audioRefs.current;
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

  const questionId = current?.id;
  const useLaterCorrect = isCorrect && resultAttemptNumber > 1;
  const firstTryVideo = correctFirstTryById[questionId] ?? pravilen_v_drugo;

  const resultVideoSrc = current && isCorrect
    ? (useLaterCorrect ? pravilen_v_drugo : firstTryVideo)
    : napacen;

  useEffect(() => {
    if (!showResult) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [showResult, resultVideoSrc]);

  if (!started) {
    return (
      <div className="quiz intro-page dark-theme">
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
            <img src={viki} alt="" className="intro-character" draggable="false" />
        </div>
      </div>
    );
  }

  return (
    <div className="quiz dark-theme">
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
                className="result-video"
                key={`${questionId}-${resultAttemptNumber}-${isCorrect ? "c" : "w"}`}
               className={`result-video ${isFadingOut ? "video-fade-out" : ""}`}
                src={resultVideoSrc}
                autoPlay
                playsInline
                preload="auto"
                onEnded={handleVideoEnd}
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
          <button onClick={() => { playBtnSound(); onBack(); }} className="back_to_menu_btn">
            {t("back_to_menu")}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizOfMithras;