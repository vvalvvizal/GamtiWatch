import React, { useState, useEffect, useRef } from "react";
import ProgressCircle from "./progressCircle";
import styles from "../styles/stopwatch.module.css";
import SelectButton from "./SelectButton";
import Notification from "./Notification"; // Notification 컴포넌트 import

interface StopwatchProps {
  image: File | undefined;
}

const FRIES_COUNT = 28;

const Stopwatch = ({ image }: StopwatchProps) => {
  const [mode, setMode] = useState<"timer" | "stopwatch">("timer");
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
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
    if (!isRunning) return;

    const intervalId = window.setInterval(() => {
      const elapsedSinceStart = Math.floor(
        (performance.now() - startedAtRef.current) / 10
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
    }
  }, [isRunning, isStopwatch, maxTime, time]);

  const startAndStop = () => {
    if (isCompleted) {
      elapsedAtStartRef.current = 0;
      startedAtRef.current = performance.now();
      setTime(0);
      setIsCompleted(false);
      setIsRunning(true);
      return;
    }

    if (isRunning) {
      const elapsedSinceStart = Math.floor(
        (performance.now() - startedAtRef.current) / 10
      );
      setTime(elapsedAtStartRef.current + elapsedSinceStart);
      setIsRunning(false);
      return;
    }

    elapsedAtStartRef.current = time;
    startedAtRef.current = performance.now();
    setIsRunning(true);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setIsCompleted(false);
    elapsedAtStartRef.current = 0;
    startedAtRef.current = 0;
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
    elapsedAtStartRef.current = 0;
    startedAtRef.current = 0;
  }, [maxTime, mode]);

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
    ? ((time % 6000) / 6000) * 100
    : Math.min((time / maxTime) * 100, 100);

  return (
    <div className={styles["stopwatch-container"]}>
      <div className={styles.modeTabs} aria-label="시간 측정 모드">
        <button
          className={`${styles.modeTab} ${mode === "timer" ? styles.activeMode : ""}`}
          onClick={() => setMode("timer")}
          aria-pressed={mode === "timer"}
        >
          타이머
        </button>
        <button
          className={`${styles.modeTab} ${mode === "stopwatch" ? styles.activeMode : ""}`}
          onClick={() => setMode("stopwatch")}
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
      />
      {isCompleted && (
        <>
          <div className={styles.friesRain} aria-hidden="true">
            {Array.from({ length: FRIES_COUNT }, (_, index) => (
              <span
                key={index}
                className={styles.fallingFry}
                style={
                  {
                    "--fry-left": `${(index * 37) % 100}%`,
                    "--fry-delay": `${(index % 9) * 0.12}s`,
                    "--fry-duration": `${2.4 + (index % 5) * 0.22}s`,
                    "--fry-rotation": `${(index % 2 ? 1 : -1) * (90 + index * 13)}deg`,
                  } as React.CSSProperties
                }
              >
                🍟
              </span>
            ))}
          </div>
          <div className={styles.completionMessage} role="status">
            <span className={styles.completionIcon}>🍟</span>
            <strong>감튀 완료!</strong>
            <span>오늘의 집중력이 바삭하게 익었어요.</span>
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
      </div>
      <Notification /> {/* Notification 컴포넌트 추가 */}
    </div>
  );
};

export default Stopwatch;
