import React, { useEffect, useState } from "react";

export default function ApiSpinnerRow({ isLocked, fireResult }) {
  // Increase these to fill more space with more numbers
  const HISTORY_LENGTH = 8;
  const FROSTED_LENGTH = 8;

  const fakeNumbers = [
    45.90, 80.87, 12.45, 56.45, 33.77, 77.77, 22.22,
    99.99, 68.12, 44.44, 61.23
  ];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [displayValue, setDisplayValue] = useState(fakeNumbers[0]);
  const [history, setHistory] = useState([]);

  // Right side: future (frosted) numbers
  const frostedQueue = Array.from({ length: FROSTED_LENGTH }, (_, i) =>
    fakeNumbers[(currentIdx + i + 1) % fakeNumbers.length]
  );

  useEffect(() => {
    let interval;
    if (isLocked) {
      setHistory((h) => [...h.slice(-HISTORY_LENGTH), "00.00"]);
      setDisplayValue("00.00");
      return;
    }
    if (fireResult && fireResult.spinning === false) {
      let i = 0;
      interval = setInterval(() => {
        if (i < 8) {
          const idx = Math.floor(Math.random() * fakeNumbers.length);
          const newValue = fakeNumbers[idx];
          setHistory((h) => [...h.slice(-HISTORY_LENGTH), newValue]);
          setCurrentIdx(idx);
          setDisplayValue(newValue);
          i++;
        } else {
          setHistory((h) => [
            ...h.slice(-HISTORY_LENGTH),
            fireResult.value.toFixed(2),
          ]);
          setDisplayValue(fireResult.value.toFixed(2));
          clearInterval(interval);
        }
      }, 320); // slower: was 140
      return () => clearInterval(interval);
    }
    interval = setInterval(() => {
      const idx = Math.floor(Math.random() * fakeNumbers.length);
      const newValue = fakeNumbers[idx];
      setHistory((h) => [...h.slice(-HISTORY_LENGTH), newValue]);
      setCurrentIdx(idx);
      setDisplayValue(newValue);
    }, 600); // slower: was 240
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [isLocked, fireResult]);

  function getValueColor(val, fr) {
    if (val === "00.00") return "#fff";
    if (fr && fr.spinning === false && val === fr.value?.toFixed(2)) {
      return fr.won ? "#4cff4c" : "#ff4242";
    }
    return parseFloat(val) >= 50 ? "#4cff4c" : "#ff4242";
  }

  // Neon glow for history
  function getHistoryGlow(val) {
    if (val === "00.00") return "0 0 7px #fff, 0 0 15px #fff";
    const v = parseFloat(val);
    if (isNaN(v)) return "0 0 8px #fff";
    return v >= 50
      ? "0 0 7px #41ff80, 0 0 15px #41ff80, 0 0 22px #fff"
      : "0 0 7px #ff4a4a, 0 0 15px #ff4a4a, 0 0 22px #fff";
  }

  const historyToShow = history.slice(-HISTORY_LENGTH);

  // Frosted opacities/blurs for right side
  const frostedOpacities = [0.66, 0.49, 0.33, 0.19, 0.13, 0.09, 0.06];
  const frostedBlurs = ["4px", "5px", "6px", "7px", "8px", "9px", "10px"];

  return (
    <div className="spinner-row spinner-row-black-bg">
      <div className="spinner-history-box">
        {historyToShow.map((num, idx) => (
          <span
            key={idx}
            className="spinner-history-value"
            style={{
              color: "#fff",
              opacity: 1,
              filter: "none",
              textShadow: getHistoryGlow(num),
            }}
          >
            {num}
          </span>
        ))}
      </div>
      <div className="spinner-current-box spinner-current-box-narrow">
        <span
          className="spinner-value"
          style={{ color: getValueColor(displayValue, fireResult) }}
        >
          {displayValue}
        </span>
      </div>
      <div className="spinner-frosted spinner-frosted-right spinner-frosted-heavy">
        {frostedQueue.map((num, idx) => (
          <span
            key={idx}
            className="spinner-fake-blue spinner-fake-blue-heavy"
            style={{
              opacity: frostedOpacities[idx] || 0.04,
              filter: `blur(${frostedBlurs[idx] || "12px"}) brightness(2.2)`,
              color: "#b9dbff",
              textShadow: "0 0 6px #b9dbff, 0 0 12px #b9dbff",
              fontSize: "0.95rem",
            }}
          >
            {num}
          </span>
        ))}
      </div>
    </div>
  );
}