const SinglePlayerDisplay = ({ name, progress }) => {
  return (
    <div>
      <h1>{name}</h1>
      <h2>{progress}</h2>
    </div>
  );
}

const PlayerDisplay = ({ players }) => {
  return (
    <div>
      {Object.entries(players).map(([player, progress]) => (
        <SinglePlayerDisplay name={player} progress={progress} />
      ))}
    </div>
  );
}

export default PlayerDisplay;