import React, { useEffect, useRef, useState } from "react";

// Props: mode, sliderValue, isLocked, fireResult
export default function ApiCallBox({
  mode,
  sliderValue,
  isLocked,
  fireResult, // { spinning: true/false, value: number, won: true/false }
}) {
  // Balance logic (left)
  const [balance] = useState("$1250.08"); // static for now

  // Spinning number logic (middle)
  const numbers = [45.90, 80.87, 12.45, 56.45, 33.77, 77.77, 22.22, 99.99];
  const [displayValue, setDisplayValue] = useState(numbers[0]);
  const [isSpinning, setIsSpinning] = useState(true);

  // Animate spin
  const spinInterval = useRef(null);

  useEffect(() => {
    if (isLocked) {
      // Stop on 00.00
      setIsSpinning(false);
      setDisplayValue("00.00");
      clearInterval(spinInterval.current);
      return;
    }
    if (fireResult && fireResult.spinning === false) {
      // After fire, spin in the result (simulate quick animation)
      setIsSpinning(true);
      let i = 0;
      spinInterval.current = setInterval(() => {
        if (i < 8) {
          setDisplayValue(numbers[Math.floor(Math.random() * numbers.length)]);
          i++;
        } else {
          setDisplayValue(fireResult.value.toFixed(2));
          setIsSpinning(false);
          clearInterval(spinInterval.current);
        }
      }, 60);
      return;
    }

    setIsSpinning(true);
    spinInterval.current = setInterval(() => {
      setDisplayValue(numbers[Math.floor(Math.random() * numbers.length)]);
    }, 80);

    return () => clearInterval(spinInterval.current);
    // eslint-disable-next-line
  }, [isLocked, fireResult]);

  // Animation class for spin
  const spinClass =
    isSpinning || (fireResult && fireResult.spinning === true)
      ? "spin-in"
      : "";

  // Color
  let valueColor = "#4cff4c";
  if (parseFloat(displayValue) < 50) valueColor = "#ff4242";
  if (displayValue === "00.00") valueColor = "#fff";
  if (fireResult && fireResult.spinning === false) {
    valueColor = fireResult.won ? "#4cff4c" : "#ff4242";
  }

  // Ship/missile labels (right)
  const shipSizeOptions = [
    { name: "Patrol Boat", min: 3, max: 3, width: 1 },
    { name: "Destroyer", min: 3, max: 3, width: 2 },
    { name: "Submarine", min: 5, max: 5, width: 2 },
    { name: "Battleship", min: 8, max: 8, width: 2 },
    { name: "Aircraft Carrier", min: 10, max: 10, width: 2 },
  ];
  const missileSizeOptions = [
    { label: "2x1", width: 2, height: 1 },
    { label: "4x1", width: 4, height: 1 },
    { label: "4x2", width: 4, height: 2 },
    { label: "7x2", width: 7, height: 2 },
    { label: "8x3", width: 8, height: 3 },
  ];
  const rightLabel =
    mode === "defense"
      ? `Ship: ${shipSizeOptions[sliderValue]?.width}x${shipSizeOptions[sliderValue]?.min}`
      : `Missile: ${missileSizeOptions[sliderValue]?.label}`;

  return (
    <div className="api-call-box-outer">
      <div className="api-col left">
        <div className="api-value balance">{balance}</div>
      </div>
      <div className="api-col middle">
        <div
          className={`api-value spin-value ${spinClass}`}
          style={{
            background: "#151c19",
            color: valueColor,
          }}
        >
          {displayValue}
        </div>
      </div>
      <div className="api-col right">
        <div className="api-value size-label">{rightLabel}</div>
      </div>
    </div>
  );
}