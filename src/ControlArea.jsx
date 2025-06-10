import React, { useState } from "react";
import ApiSpinnerRow from "./ApiSpinnerRow";
import BetDisplayRow from "./BetDisplayRow";
import "./ControlArea.css"; // Assuming you have a CSS file for styles
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

export default function ControlArea({
  mode,
  toggleMode,
  sliderValue,
  setSliderValue,
  rotation,
  setRotation,
  tab,
  toggleTab,
}) {
  const [isLocked, setIsLocked] = useState(false);
  const [fireResult, setFireResult] = useState(null);

  // SAFELY get ship/missile for label
  const ship = shipSizeOptions[sliderValue] || shipSizeOptions[0];
  const missile = missileSizeOptions[sliderValue] || missileSizeOptions[0];
  const rightLabel =
    mode === "defense"
      ? `Ship: ${ship.name} (${ship.width}x${ship.min || ship.height})`
      : `Missile: ${missile.label}`;

  const handleSliderChange = (e) => {
    setSliderValue(Number(e.target.value));
    setFireResult(null);
    setIsLocked(false);
  };

  const handleLock = () => {
    setIsLocked(true);
    setFireResult(null);
  };

  const handleFire = () => {
    if (!isLocked) return;
    const randomVal = Math.random() * 100;
    const won = randomVal > 50;
    setFireResult({ spinning: false, value: randomVal, won });
    setIsLocked(false);
  };

  const handleRotate = () =>
    setRotation(rotation === "horizontal" ? "vertical" : "horizontal");

  const btnColor = mode === "defense" ? "#3d40ff" : "#ff2400";
  const btnText = mode === "defense" ? "DEFENSE" : "OFFENSE";

  // Example values for display row; replace with your logic as needed
  const winChance = 56.0;
  const multiplier = 1.7679;

  return (
    <div className="control-panel-content">
      {/* Display-only Win Chance / Multiplier row */}
      <BetDisplayRow winChance={winChance} multiplier={multiplier} />

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

      <ApiSpinnerRow isLocked={isLocked} fireResult={fireResult} />

      <div className="api-meta-row">
        <div className="balance-box">$1250.08</div>
        <button className="reset-btn" onClick={() => setIsLocked(false)}>
          RESET
        </button>
        <div className="size-label-box">{rightLabel}</div>
      </div>
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

      {/* New row for Rotate, Anchor, and Fire buttons */}
      <div className="action-buttons-row">
        <button className="rotate-btn" onClick={handleRotate}></button>
        <button className="anchor-btn" onClick={handleLock}></button>
        <button className="fire-btn" onClick={handleFire}></button>
      </div>

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