export default function Scoreboard({ scores }) {
  return (
    <div className="flex gap-6 mb-4 text-lg font-medium">
      <div className="text-blue-600">X: {scores.X}</div>
      <div className="text-red-600">O: {scores.O}</div>
    </div>
  );
}

