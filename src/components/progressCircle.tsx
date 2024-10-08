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
}

const ProgressCircle = ({
  percentage,
  hours,
  minutes,
  seconds,
  milliseconds,
  imageFile,
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
    <div style={{ width: 200, height: 200 }}>
      <CircularProgressbarWithChildren
        value={percentage}
        styles={{
          path: { stroke: "#ffe365" },
          trail: {
            stroke: "#d6d6d6",
          },
          background: {
            fill: "#3e98c7",
          },
        }}
      >
        <img src={imageSrc} alt="Icon" style={{ width: 80, marginTop: 0 }} />
        <div>{`${hours}:${minutes.toString().padStart(2, "0")}:
        ${seconds.toString().padStart(2, "0")}:
        ${milliseconds.toString().padStart(2, "0")}`}</div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default ProgressCircle;
