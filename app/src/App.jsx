import { useState } from 'react';
import InstanceView from './views/InstanceView';
import StartPage from './views/StartPage';

function App() {
  const [difficulty, setDifficulty] = useState(null);

  const handleSelectDifficulty = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
  };

  if (!difficulty) {
    return <StartPage onSelectDifficulty={handleSelectDifficulty} />;
  }

  return (
    <InstanceView 
      difficulty={difficulty} 
      changeDifficulty={() => setDifficulty(null)}
    />
  );
}

export default App;
