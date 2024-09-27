import React, { useState, useEffect } from "react";
import ProgressCircle from "./progressCircle";
import styles from "../styles/stopwatch.module.css";
import SelectButton from "./SelectButton";

interface StopwatchProps {
  image: File | undefined;
}
const Stopwatch = ({ image }: StopwatchProps) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [maxTime, setMaxTime] = useState(6000);

  const items = [
    { name: "3초", value: 300 },
    { name: "1분", value: 6000 },
    { name: "2분", value: 12000 },
    { name: "10분", value: 60000 },
    { name: "30분", value: 180000 },
  ];

  useEffect(() => {
    let intervalId: any;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
      setPercentage(Math.min((time / maxTime) * 100, 100));
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time, maxTime]);

  useEffect(() => {
    console.log(maxTime);
    setIsRunning(false);
    setTime(0);
    setPercentage(0);
  }, [maxTime]);

  const TimeCalc = (time: number) => {
    const hours = Math.floor(time / 360000);
    const minutes = Math.floor((time % 360000) / 6000);

    const seconds = Math.floor((time % 6000) / 100);

    const milliseconds = time % 100;

    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      milliseconds: milliseconds,
    };
  };

  const startAndStop = () => {
    setIsRunning(!isRunning);
  };

  const Nowtime = TimeCalc(time);
  // const Maxtime = TimeCalc(maxTime);

  return (
    <div className={styles["stopwatch-container"]}>
      {/* <p>
        {Maxtime.hours}시간 {Maxtime.minutes}분
      </p> */}

      <SelectButton maxTime={maxTime} setMaxTime={setMaxTime} items={items} />

      <ProgressCircle
        percentage={percentage}
        hours={Nowtime.hours}
        minutes={Nowtime.minutes}
        seconds={Nowtime.seconds}
        milliseconds={Nowtime.milliseconds}
        imageFile={image}
      />

      <button
        onClick={startAndStop}
        className={`${styles.button} ${isRunning ? styles.running : ""}`}
      >
        {isRunning ? "Stop" : "Start"}
      </button>
    </div>
  );
};
export default Stopwatch;
