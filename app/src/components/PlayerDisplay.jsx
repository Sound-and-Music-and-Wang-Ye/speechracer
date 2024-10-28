const PlayerDisplay = ({ name, progress }) => {
  return (
    <div>
      <h1>{name}</h1>
      <h2>{progress}</h2>
    </div>
  );
}

export default PlayerDisplay;