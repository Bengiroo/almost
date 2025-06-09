export default function GridArea({ mode }) {
  const N = 10;
  const tileColor =
    mode === 'defense'
      ? 'linear-gradient(145deg, #48e6ff 60%, #95b1ff 100%)'
      : 'linear-gradient(145deg, #ff2400 60%, #ff7e5f 100%)'; // more fire!
  const borderColor = mode === 'defense' ? '#44dbff33' : '#ff240080';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: `repeat(${N}, 1fr)`,
        gridTemplateRows: `repeat(${N}, 1fr)`,
        gap: '4px',
        padding: '12px',
        boxSizing: 'border-box'
      }}
    >
      {Array.from({ length: N * N }).map((_, idx) => (
        <div
          key={idx}
          style={{
            borderRadius: '7px',
            background: tileColor,
            border: `1.5px solid ${borderColor}`,
            boxShadow: '0 1px 2px 0 rgba(32, 34, 65, 0.09)'
          }}
        />
      ))}
    </div>
  );
}