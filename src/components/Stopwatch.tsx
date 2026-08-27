import React, { useState, useEffect, useRef } from "react";
import defaultIcon from "../../public/favicon.ico";
import ProgressCircle from "./progressCircle";
import styles from "../styles/stopwatch.module.css";
import SelectButton from "./SelectButton";

interface StopwatchProps {
  image: File | undefined;
}

const FRIES_COUNT = 28;

const Stopwatch = ({ image }: StopwatchProps) => {
  const [mode, setMode] = useState<"timer" | "stopwatch">("timer");
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCompletionVisible, setIsCompletionVisible] = useState(false);
  const [iconSrc, setIconSrc] = useState<string>(defaultIcon);
  const [maxTime, setMaxTime] = useState(6000);
  const startedAtRef = useRef(0);
  const elapsedAtStartRef = useRef(0);

  const items = [
    { name: "3초", value: 300 },
    { name: "1분", value: 6000 },
    { name: "2분", value: 12000 },
    { name: "10분", value: 60000 },
    { name: "30분", value: 180000 },
  ];
  const isStopwatch = mode === "stopwatch";

  useEffect(() => {
    if (!image) {
      setIconSrc(defaultIcon);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setIconSrc(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = window.setInterval(() => {
      const elapsedSinceStart = Math.floor(
        (Date.now() - startedAtRef.current) / 10
      );
      setTime(elapsedAtStartRef.current + elapsedSinceStart);
    }, 10);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && !isStopwatch && time >= maxTime) {
      setTime(maxTime);
      handleTimerComplete();
      setIsRunning(false);
      setIsCompleted(true);
      setIsCompletionVisible(true);
    }
  }, [isRunning, isStopwatch, maxTime, time]);

  const startAndStop = () => {
    if (isCompleted) {
      elapsedAtStartRef.current = 0;
      startedAtRef.current = Date.now();
      setTime(0);
      setIsCompleted(false);
      setIsCompletionVisible(false);
      setIsRunning(true);
      return;
    }

    if (isRunning) {
      const elapsedSinceStart = Math.floor(
        (Date.now() - startedAtRef.current) / 10
      );
      setTime(elapsedAtStartRef.current + elapsedSinceStart);
      setIsRunning(false);
      return;
    }

    elapsedAtStartRef.current = time;
    startedAtRef.current = Date.now();
    setIsRunning(true);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setIsCompleted(false);
    setIsCompletionVisible(false);
    elapsedAtStartRef.current = 0;
    startedAtRef.current = 0;
  };

  const changeMode = (nextMode: "timer" | "stopwatch") => {
    if (nextMode === mode) return;

    setIsRunning(false);
    setTime(0);
    setIsCompleted(false);
    setIsCompletionVisible(false);
    elapsedAtStartRef.current = 0;
    startedAtRef.current = 0;
    setMode(nextMode);
  };

  const finishStopwatch = () => {
    if (time === 0 || isCompleted) return;

    if (isRunning) {
      const elapsedSinceStart = Math.floor(
        (Date.now() - startedAtRef.current) / 10
      );
      setTime(elapsedAtStartRef.current + elapsedSinceStart);
    }
    setIsRunning(false);
    setIsCompleted(true);
    setIsCompletionVisible(true);
    handleTimerComplete();
  };

  const handleTimerComplete = () => {
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.5
      );
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // 브라우저가 오디오 재생을 막더라도 화면 알림은 계속 표시합니다.
    }
  };

  useEffect(() => {
    setIsRunning(false);
    setTime(0);
    setIsCompleted(false);
    setIsCompletionVisible(false);
    elapsedAtStartRef.current = 0;
    startedAtRef.current = 0;
  }, [maxTime]);

  useEffect(() => {
    if (!isCompletionVisible) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsCompletionVisible(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isCompletionVisible]);

  const TimeCalc = (time: number) => {
    const hours = Math.floor(time / 360000);
    const minutes = Math.floor((time % 360000) / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const milliseconds = time % 100;

    return {
      hours,
      minutes,
      seconds,
      milliseconds,
    };
  };

  const Nowtime = TimeCalc(time);
  const percentage = isStopwatch
    ? 0
    : Math.min((time / maxTime) * 100, 100);

  return (
    <div className={styles["stopwatch-container"]}>
      <div className={styles.modeTabs} aria-label="시간 측정 모드">
        <button
          className={`${styles.modeTab} ${mode === "timer" ? styles.activeMode : ""}`}
          onClick={() => changeMode("timer")}
          aria-pressed={mode === "timer"}
        >
          타이머
        </button>
        <button
          className={`${styles.modeTab} ${mode === "stopwatch" ? styles.activeMode : ""}`}
          onClick={() => changeMode("stopwatch")}
          aria-pressed={mode === "stopwatch"}
        >
          스톱워치
        </button>
      </div>
      {!isStopwatch && (
        <SelectButton maxTime={maxTime} setMaxTime={setMaxTime} items={items} />
      )}
      <p className={styles.modeDescription}>
        {isStopwatch ? "집중한 시간을 제한 없이 기록합니다." : "선택한 시간만큼 집중합니다."}
      </p>
      <ProgressCircle
        percentage={percentage}
        hours={Nowtime.hours}
        minutes={Nowtime.minutes}
        seconds={Nowtime.seconds}
        milliseconds={Nowtime.milliseconds}
        imageFile={image}
        isStopwatch={isStopwatch}
      />
      {isCompletionVisible && (
        <>
          <button
            className={styles.completionBackdrop}
            onClick={() => setIsCompletionVisible(false)}
            aria-label="완료 알림 닫기"
          />
          <div className={styles.friesRain} aria-hidden="true">
            {Array.from({ length: FRIES_COUNT }, (_, index) => (
              <span
                key={index}
                className={styles.fallingFry}
                style={
                  {
                    "--fry-left": `${(index * 37) % 100}%`,
                    "--fry-delay": `${(index % 9) * 0.08}s`,
                    "--fry-duration": `${2.6 + (index % 5) * 0.2}s`,
                    "--fry-apex": `${10 + ((index * 23) % 32)}vh`,
                    "--fry-rotation": `${(index % 2 ? 1 : -1) * (90 + index * 13)}deg`,
                  } as React.CSSProperties
                }
              >
                <span className={styles.fryFace} aria-hidden="true">
                  <i />
                  <i />
                  <b />
                </span>
              </span>
            ))}
          </div>
          <div
            className={styles.completionMessage}
            role="alertdialog"
            aria-modal="true"
            aria-label="집중 시간 완료"
          >
            <button
              className={styles.closeCompletion}
              onClick={() => setIsCompletionVisible(false)}
              aria-label="닫기"
            >
              ×
            </button>
            <img className={styles.completionIcon} src={iconSrc} alt="집중 아이콘" />
            <span className={styles.completionText}>오늘의 감튀가 바삭하게 익었어요.</span>
            {isStopwatch && (
              <div className={styles.finalTime} aria-label="최종 집중 시간">
                {Nowtime.hours.toString().padStart(2, "0")}:
                {Nowtime.minutes.toString().padStart(2, "0")}:
                {Nowtime.seconds.toString().padStart(2, "0")}.
                {Nowtime.milliseconds.toString().padStart(2, "0")}
              </div>
            )}
            <button
              className={styles.confirmCompletion}
              onClick={() => setIsCompletionVisible(false)}
            >
              ESC
            </button>
          </div>
        </>
      )}
      <div className={styles.controls}>
        <button
          onClick={startAndStop}
          className={`${styles.button} ${isRunning ? styles.running : ""}`}
        >
          {isRunning
            ? "일시정지"
            : isCompleted
              ? "다시 시작"
              : time > 0
                ? "계속"
                : "시작"}
        </button>
        <button
          onClick={reset}
          className={`${styles.button} ${styles.resetButton}`}
          disabled={time === 0}
        >
          초기화
        </button>
        {isStopwatch && (
          <button
            onClick={finishStopwatch}
            className={`${styles.button} ${styles.finishButton}`}
            disabled={time === 0 || isCompleted}
          >
            종료
          </button>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;
