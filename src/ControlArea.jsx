import { useState } from "react";
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

export default function ControlArea({ mode, toggleMode }) {
  const [sliderValue, setSliderValue] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [fireResult, setFireResult] = useState(null);

  // Ship/Missile size label
  const rightLabel =
    mode === "defense"
      ? `Ship: ${shipSizeOptions[sliderValue]?.width}x${shipSizeOptions[sliderValue]?.min}`
      : `Missile: ${missileSizeOptions[sliderValue]?.label}`;

  // For demo: Handle slider input
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

  const btnColor = mode === 'defense' ? '#3d40ff' : '#ff2400';
  const btnText = mode === 'defense' ? 'OFFENSE' : 'DEFENSE';

  return (
    <div className="control-panel-content">
      <button
        className="mode-btn"
        style={{
          background: btnColor,
          color: "#fff"
        }}
        onClick={toggleMode}
      >
        {btnText}
      </button>



      {/* Row 2: API spinner */}
      <ApiSpinnerRow
        isLocked={isLocked}
        fireResult={fireResult}
      />

      {/* Row 1: Balance + Ship/Missile size */}
      <div className="api-meta-row">
        <div className="balance-box">$1250.08</div>
        <div className="size-label-box">{rightLabel}</div>
      </div>

      {/* Controls row */}
      <div className="controls-top" style={{ marginTop: "1.2em", display: "flex", gap: "1em", justifyContent: "center" }}>
        <button className="ui-btn reset" onClick={() => { setIsLocked(false); setFireResult(null); setSliderValue(0); }}>RESET</button>
        <button className="ui-btn rotate">
          <span className="rotate-icon" style={{ fontSize: "1.4em" }}>⟳</span>
        </button>
        <button
          className="ui-btn fire"
          style={{ background: "#ff2400", color: "#fff" }}
          onClick={handleFire}
        >★ FIRE</button>
        <button
          className="ui-btn lock"
          style={{
            background: isLocked ? "#bbb" : "#2ecc40",
            color: "#fff"
          }}
          disabled={isLocked}
          onClick={handleLock}
        >ANCHOR</button>
      </div>

      {/* Slider row */}
      <div className="slider-row" style={{ margin: "1.5em 0 1em 0", display: "flex", justifyContent: "center" }}>
        <input
          type="range"
          min="0"
          max="4"
          step="1"
          className="horizontal-slider"
          style={{ width: "70%" }}
          value={sliderValue}
          onChange={handleSliderChange}
          disabled={isLocked}
        />
      </div>

      {/* Info row */}
      <div className="info-row" style={{ display: "flex", gap: "1em", justifyContent: "center", margin: "1em 0" }}>
        <div className="info-box1">%towi</div>
        <div className="info-box2">multi-x-d</div>
      </div>

      {/* Bet input row */}
      <div className="bet-row" style={{ margin: "1.5em 0" }}>
        <div className="betinput-bar" style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
          <input
            className="betinput-field"
            type="number"
            min="0"
            placeholder="Bet Amount"
            style={{ flex: 1, padding: "0.5em", borderRadius: "6px", border: "1px solid #333" }}
          />
          <div className="betinput-btns" style={{ display: "flex", gap: "0.3em" }}>
            <button className="ui-btn small">2X</button>
            <button className="ui-btn small">1/2</button>
            <button className="ui-btn small">MAX</button>
          </div>
        </div>
      </div>

      {/* Tabs row */}
      <div className="tabs-row" style={{ display: "flex", marginTop: "1em" }}>
        <button className="tab manual selected">MANUAL</button>
        <button className="tab auto">AUTO</button>
      </div>
    </div>
  );
}