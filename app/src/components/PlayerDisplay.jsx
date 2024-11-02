const SinglePlayerDisplay = ({ name, progress, total }) => {
  return (
    <div>
      <h1>{name}</h1>
      <h2>{progress}/{total}</h2>
    </div>
  );
}

const PlayerDisplay = ({ players, length }) => {
  return (
    <div>
      {Object.entries(players).map(([player, progress]) => (
        <SinglePlayerDisplay name={player} progress={progress} total={length} />
      ))}
    </div>
  );
}

export default PlayerDisplay;