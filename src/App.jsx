import { useState } from 'react';
import './locked-grid.css';
import GridArea from './GridArea.jsx';
import ControlArea from './ControlArea.jsx'; // Assuming ControlArea is another component

const App = () => {
  const [mode, setMode] = useState('defense'); // 'defense' or 'offense'

  const toggleMode = () => setMode(mode === 'defense' ? 'offense' : 'defense');

  return (
    <div className="main-layout">
      <div className="grid-area">
        <GridArea mode={mode} />
      </div>
      <div className="control-area">
        <ControlArea mode={mode} toggleMode={toggleMode} />
      </div>
    </div>
  );
};

export default App;
