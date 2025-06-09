import React, { useState, useEffect, useCallback } from "react";

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
  let rotation = 0;
  if (orientation === "horizontal") {
    [width, height] = [height, width];
    rotation = 0;
  } else {
    rotation = 90;
  }

  if (startCol + width > GRID_SIZE) startCol = GRID_SIZE - width;
  if (startRow + height > GRID_SIZE) startRow = GRID_SIZE - height;

  const positions = [];
  for (let dr = 0; dr < height; dr++) {
    for (let dc = 0; dc < width; dc++) {
      positions.push([startRow + dr, startCol + dc]);
    }
  }
  return { positions, startRow, startCol, width, height, rotation };
}

export default function GridArea({
  mode,
  sliderValue = 0,
  rotation = "horizontal",
}) {
  // Persisted selection for each mode
  const [placed, setPlaced] = useState({ defense: null, offense: null });
  // Hover area (desktop only)
  const [hover, setHover] = useState(null);

  // Current placed for this mode
  const currentPlaced = placed[mode === "defense" ? "defense" : "offense"];

  // Clear hover on control changes
  useEffect(() => {
    setHover(null);
  }, [mode, sliderValue, rotation]);

  // Helper: Is [row,col] in current placed selection?
  const isPlaced = useCallback(
    (row, col) =>
      currentPlaced &&
      currentPlaced.positions.some(([r, c]) => r === row && c === col),
    [currentPlaced]
  );
  // Helper: Is [row,col] in current hover area?
  const isHover = useCallback(
    (row, col) =>
      hover && hover.positions.some(([r, c]) => r === row && c === col),
    [hover]
  );

  // Hover logic
  const handleCellHover = (row, col) => {
    if ("ontouchstart" in window) return;
    const option = getOption(mode, sliderValue);
    setHover(getPlacement(row, col, option, rotation));
  };
  const handleCellLeave = () => setHover(null);

  // Click logic: toggles persistent placement, resets on selecting any selected cell
  const handleCellClick = (row, col) => {
    if (isPlaced(row, col)) {
      setPlaced((old) => ({ ...old, [mode]: null }));
      setHover(null);
      return;
    }
    const option = getOption(mode, sliderValue);
    const newPlacement = getPlacement(row, col, option, rotation);
    setPlaced((old) => ({
      ...old,
      [mode]: newPlacement,
    }));
    setHover(null);
  };

  const handleCellTouch = (row, col) => handleCellClick(row, col);

  // For rotation: if orientation is vertical, rotate the image 90deg
  const getImgStyle = (isVert) => ({
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
    filter: "drop-shadow(0 0 6px #48e6ff)",
    transform: isVert ? "rotate(90deg)" : "none",
    transition: "transform 0.2s"
  });

  const getHoverImgStyle = (isVert) => ({
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
    filter: "drop-shadow(0 0 9px #48e6ff)",
    transform: isVert ? "rotate(90deg)" : "none",
    transition: "transform 0.2s"
  });

  // Determine if current orientation is vertical
  const isVertical = rotation === "vertical";

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
        const hov = isHover(row, col) && !lit;

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
              cursor: "pointer",
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
                style={getImgStyle(isVertical)}
              />
            )}
            {/* Hover image */}
            {hov && (
              <img
                src={getOverlay(mode)}
                alt="Preview"
                style={getHoverImgStyle(isVertical)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}