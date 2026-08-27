import React, { useState, useEffect } from "react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import defaultIcon from "../../public/favicon.ico"; // 아이콘 파일 경로

interface ProgressCircleProps {
  percentage: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  imageFile: File | undefined;
  isStopwatch: boolean;
}

const ProgressCircle = ({
  percentage,
  hours,
  minutes,
  seconds,
  milliseconds,
  imageFile,
  isStopwatch,
}: ProgressCircleProps) => {
  const [imageSrc, setImagesrc] = useState<string>(defaultIcon);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagesrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  return (
    <div style={{ width: "min(260px, 78vw)", aspectRatio: "1" }}>
      <CircularProgressbarWithChildren
        value={isStopwatch ? 18 : percentage}
        styles={{
          path: {
            stroke: "var(--brand-yellow)",
            transition: "none",
            transform: isStopwatch
              ? `rotate(${((seconds + milliseconds / 100) / 60) * 360}deg)`
              : "none",
            transformOrigin: "center",
            strokeLinecap: "round",
          },
          trail: {
            stroke: "#d6d6d6",
          },
          background: {
            fill: "var(--brand-blue)",
          },
        }}
      >
        <img src={imageSrc} alt="Icon" style={{ width: 96, marginTop: 0 }} />
        <div>{`${hours}:${minutes.toString().padStart(2, "0")}:
        ${seconds.toString().padStart(2, "0")}:
        ${milliseconds.toString().padStart(2, "0")}`}</div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default ProgressCircle;
