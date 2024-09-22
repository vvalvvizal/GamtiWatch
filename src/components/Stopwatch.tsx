import React, { useState, useEffect } from "react";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  useEffect(() => {}, [time]);
  return (
    <div style={{ backgroundColor: "black" }}>
      <p style={{ color: "white" }}> hours minues seconds</p>
    </div>
  );
};
export default Stopwatch;
