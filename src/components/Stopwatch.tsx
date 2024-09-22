import React, { useState, useEffect } from "react";
import ProgressCircle from "./progressCircle";
import styles from "../styles/stopwatch.module.css";

interface StopwatchProps {
  image: File | undefined;
}
const Stopwatch = ({ image }: StopwatchProps) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    let intervalId: any;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
      setPercentage(Math.min((time / maxTime) * 100, 100));
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const maxTime = 100; //2 hours

  const hours = Math.floor(time / 360000);
  //1ms = 1000s
  //6000s = 1minues
  //360000s = 1hour

  const minutes = Math.floor((time % 360000) / 6000);

  const seconds = Math.floor((time % 6000) / 100);

  const milliseconds = time % 100;

  const startAndStop = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className={styles["stopwatch-container"]}>
      <ProgressCircle
        percentage={percentage}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        milliseconds={milliseconds}
        imageFile={image}
      />
      <button onClick={startAndStop}> {isRunning ? "Stop" : "Start"}</button>
    </div>
  );
};
export default Stopwatch;
