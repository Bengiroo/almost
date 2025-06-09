import { useState } from 'react';
import './locked-grid.css';
import GridArea from './GridArea.jsx';
import ControlArea from './ControlArea.jsx';

const App = () => {
  const [mode, setMode] = useState('offense'); // 'offense' or 'defense'
  const [sliderValue, setSliderValue] = useState(0);
  const [rotation, setRotation] = useState('horizontal');
  const [tab, setTab] = useState('manual');

  const toggleMode = () => setMode((m) => (m === 'offense' ? 'defense' : 'offense'));
  const toggleTab = (t) => setTab(t);

  return (
    <div className="main-layout">
      <div className="grid-area">
        <GridArea
          mode={mode}
          sliderValue={sliderValue}
          rotation={rotation}
        />
      </div>
      <div className="control-area">
        <ControlArea
          mode={mode}
          toggleMode={toggleMode}
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          rotation={rotation}
          setRotation={setRotation}
          tab={tab}
          toggleTab={toggleTab}
        />
      </div>
    </div>
  );
};

export default App;