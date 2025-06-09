import React, { useState, useEffect } from "react";

const GRID_SIZE = 10;

const SHIP_OPTIONS = [
  { name: "Patrol Boat", min: 3, max: 3, width: 1, height: 3 },
  { name: "Destroyer", min: 3, max: 3, width: 2, height: 3 },
  { name: "Submarine", min: 5, max: 5, width: 2, height: 5 },
  { name: "Battleship", min: 8, max: 8, width: 2, height: 8 },
  { name: "Aircraft Carrier", min: 10, max: 10, width: 2, height: 10 },
];

const MISSILE_OPTIONS = [
  { label: "2x1", width: 2, height: 1 },
  { label: "4x1", width: 4, height: 1 },
  { label: "4x2", width: 4, height: 2 },
  { label: "7x2", width: 7, height: 2 },
  { label: "8x3", width: 8, height: 3 },
];

function getOption(mode, sliderValue) {
  return mode === "defense"
    ? SHIP_OPTIONS[sliderValue] || SHIP_OPTIONS[0]
    : MISSILE_OPTIONS[sliderValue] || MISSILE_OPTIONS[0];
}

function getOverlay(mode) {
  return mode === "defense"
    ? "/assets/ship.png"
    : "/assets/missile.png";
}

function getPlacement(startRow, startCol, option, orientation) {
  let width = option.width;
  let height = option.height || option.min;

  // For horizontal, swap width and height
  if (orientation === "horizontal") {
    [width, height] = [height, width];
  }

  // Snap inside grid
  if (startCol + width > GRID_SIZE) startCol = GRID_SIZE - width;
  if (startRow + height > GRID_SIZE) startRow = GRID_SIZE - height;

  const positions = [];
  for (let dr = 0; dr < height; dr++) {
    for (let dc = 0; dc < width; dc++) {
      positions.push([startRow + dr, startCol + dc]);
    }
  }
  return { positions, startRow, startCol, width, height };
}

export default function GridArea({
  mode,
  sliderValue = 0,
  rotation = "horizontal",
}) {
  // All placed items (ships or missiles), each is {positions, ...}
  const [placed, setPlaced] = useState([]);

  // Hover preview (for current selection)
  const [hover, setHover] = useState(null);

  // Clear hover preview on control changes
  useEffect(() => setHover(null), [mode, sliderValue, rotation]);

  // Helper: is cell in any placed object?
  function isPlaced(row, col) {
    return placed.some(item =>
      item.positions.some(([r, c]) => r === row && c === col)
    );
  }

  // Helper: is cell in current hover preview?
  function isHover(row, col) {
    return hover && hover.positions.some(([r, c]) => r === row && c === col) && !isPlaced(row, col);
  }

  // Helper: does a new placement overlap any placed?
  function overlapsAny(positions) {
    return placed.some(item =>
      item.positions.some(
        ([r, c]) => positions.some(([r2, c2]) => r === r2 && c === c2)
      )
    );
  }

  // Hover logic
  const handleCellHover = (row, col) => {
    if ("ontouchstart" in window) return;
    const option = getOption(mode, sliderValue);
    setHover(getPlacement(row, col, option, rotation));
  };
  const handleCellLeave = () => setHover(null);

  // Click logic: place if no overlap
  const handleCellClick = (row, col) => {
    const option = getOption(mode, sliderValue);
    const newPlacement = getPlacement(row, col, option, rotation);

    // Don't allow overlapping placements
    if (overlapsAny(newPlacement.positions)) {
      setHover(null);
      return;
    }

    setPlaced(prev => [...prev, { ...newPlacement, mode }]);
    setHover(null);
  };

  // Touch logic for mobile
  const handleCellTouch = (row, col) => handleCellClick(row, col);

  // Reset all placements (add a button if you wish)
  // For example, call setPlaced([]) in a parent or from a button

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        gap: "4px",
        padding: "12px",
        boxSizing: "border-box",
        position: "relative",
        background: "#223",
      }}
    >
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
        const row = Math.floor(idx / GRID_SIZE);
        const col = idx % GRID_SIZE;
        const lit = isPlaced(row, col);
        const hov = isHover(row, col);

        return (
          <div
            key={idx}
            style={{
              borderRadius: "7px",
              background:
                lit
                  ? "rgba(72,230,255,0.25)"
                  : hov
                    ? "rgba(72,230,255,0.15)"
                    : mode === "defense"
                      ? "linear-gradient(145deg, #48e6ff 60%, #95b1ff 100%)"
                      : "linear-gradient(145deg, #ff2400 60%, #ff7e5f 100%)",
              border: `1.5px solid ${lit
                ? "#48e6ff"
                : hov
                  ? "#48e6ff99"
                  : mode === "defense"
                    ? "#44dbff33"
                    : "#ff240080"
                }`,
              boxShadow: lit
                ? "0 0 12px 2px #48e6ff, 0 0 18px 4px #fff2"
                : hov
                  ? "0 0 6px 2px #48e6ff88"
                  : "0 1px 2px 0 rgba(32, 34, 65, 0.09)",
              position: "relative",
              cursor: overlapsAny([[row, col]]) ? "not-allowed" : "pointer",
              overflow: "hidden",
              zIndex: lit ? 10 : hov ? 5 : 1,
              transition: "box-shadow 0.16s, border 0.15s, background 0.15s",
              minHeight: 0,
              aspectRatio: "1 / 1"
            }}
            onMouseEnter={() => handleCellHover(row, col)}
            onMouseLeave={handleCellLeave}
            onClick={() => handleCellClick(row, col)}
            onTouchStart={() => handleCellTouch(row, col)}
          >
            {/* Placed image */}
            {lit && (
              <img
                src={getOverlay(mode)}
                alt={mode === "defense" ? "Ship" : "Missile"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  opacity: 0.85,
                  position: "absolute",
                  left: 0,
                  top: 0,
                  pointerEvents: "none",
                  borderRadius: "7px",
                  zIndex: 2,
                  filter: "drop-shadow(0 0 6px #48e6ff)"
                }}
              />
            )}
            {/* Hover image */}
            {hov && (
              <img
                src={getOverlay(mode)}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  opacity: 0.5,
                  position: "absolute",
                  left: 0,
                  top: 0,
                  pointerEvents: "none",
                  borderRadius: "7px",
                  zIndex: 1,
                  filter: "drop-shadow(0 0 9px #48e6ff)"
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}