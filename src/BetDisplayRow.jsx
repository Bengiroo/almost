import React from "react";

/**
 * Display-only row for Win Chance and Multiplier.
 * Usage: Place above the tab row in your control panel.
 * Props:
 *   winChance (number|string)
 *   multiplier (number|string)
 */
export default function BetDisplayRow({ winChance, multiplier }) {
  return (
    <div className="bet-display-row">
      <div className="bet-display-col">
        <span className="bet-display-label">Win Chance</span>
        <span className="bet-display-value-box">
          <span className="bet-display-value">
            {Number(winChance).toFixed(2)}
          </span>
          <span className="bet-display-suffix">%</span>
        </span>
      </div>
      <div className="bet-display-col">
        <span className="bet-display-label">Multiplier</span>
        <span className="bet-display-value-box">
          <span className="bet-display-value">
            {Number(multiplier).toFixed(4)}
          </span>
          <span className="bet-display-suffix">x</span>
        </span>
      </div>
    </div>
  );
}