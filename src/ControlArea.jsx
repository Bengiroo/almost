import React, { useState } from "react";
import ApiSpinnerRow from "./ApiSpinnerRow";

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

export default function ControlArea({ mode, toggleMode, tab, toggleTab }) {
  const [sliderValue, setSliderValue] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [fireResult, setFireResult] = useState(null);

  // Ship/Missile size label
  const rightLabel =
    mode === "defense"
      ? `Ship: ${shipSizeOptions[sliderValue]?.width}x${shipSizeOptions[sliderValue]?.min}`
      : `Missile: ${missileSizeOptions[sliderValue]?.label}`;

  // Handle slider input
  const handleSliderChange = (e) => {
    setSliderValue(Number(e.target.value));
    setFireResult(null); // Reset result on change
    setIsLocked(false);
  };

  // Simulate "place ship/missile" lock
  const handleLock = () => {
    setIsLocked(true);
    setFireResult(null); // Clear old result
  };

  // Simulate "FIRE" action with fake API response
  const handleFire = () => {
    if (!isLocked) return;
    const randomVal = Math.random() * 100;
    const won = randomVal > 50;
    setFireResult({ spinning: false, value: randomVal, won });
    setIsLocked(false);
  };

  // Correct color and text logic for mode
  const btnColor = mode === "defense" ? "#3d40ff" : "#ff2400"; // Blue for defense, red for offense
  const btnText = mode === "defense" ? "DEFENSE" : "OFFENSE"; // Reflect current mode

  return (
    <div className="control-panel-content">
      {/* Row 1: Mode button and tabs */}
      <div className="mode-tabs-row">

        <button
          className={`tab-btn ${tab === "manual" ? "active" : ""}`}
          onClick={() => toggleTab("manual")}
        >
          Manual
        </button>
        <button
          className={`mode-btn ${mode === "defense" ? "active" : ""}`}
          onClick={toggleMode}
          style={{ background: btnColor }}
        >
          {btnText}
        </button>
        <button
          className={`tab-btn ${tab === "auto" ? "active" : ""}`}
          onClick={() => toggleTab("auto")}
        >
          Auto
        </button>
      </div>

      {/* Row 2: API spinner */}
      <ApiSpinnerRow isLocked={isLocked} fireResult={fireResult} />

      {/* Row 3: Balance + Ship/Missile size */}
      <div className="api-meta-row">
        <div className="balance-box">$1250.08</div>
        <button className="reset-btn" onClick={() => setIsLocked(false)}>
          RESET
        </button>
        <div className="size-label-box">{rightLabel}</div>
      </div>

      {/* Row 4: Buttons and Slider */}
      <div className="action-buttons-row">
        <button className="fire-btn" onClick={handleFire}>
          + FIRE
        </button>
        <div className="slider-row">
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            className="horizontal-slider"
            value={sliderValue}
            onChange={handleSliderChange}
            disabled={isLocked}
          />
        </div>
        <button className="anchor-btn" onClick={handleLock}>
          ANCHOR
        </button>
      </div>

      {/* Fixed Bet Input Bar */}
      <div className="bet-input-container">
        <label className="bet-label">
          Bet Amount <span className="bet-icon">🎮</span>
          <span className="demo-mode-text">
            betting less than .01 enters demo mode
          </span>
        </label>
        <div className="bet-input-box">
          <span className="bet-currency">$</span>
          <input type="number" className="bet-input" placeholder="0" />
          <div className="bet-buttons">
            <button className="bet-btn">1/2</button>
            <button className="bet-btn">2X</button>
            <button className="bet-btn">Max</button>
          </div>
        </div>
      </div>
    </div>
  );
}