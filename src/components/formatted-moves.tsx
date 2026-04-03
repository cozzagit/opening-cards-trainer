// Formats SAN moves as numbered pairs on separate lines
// White moves in normal weight, black moves slightly different

interface FormattedMovesProps {
  moves: string[];
  className?: string;
}

interface MovePair {
  number: number;
  white: string;
  black?: string;
}

function parsePairs(moves: string[]): MovePair[] {
  const pairs: MovePair[] = [];
  let moveNum = 1;
  let currentPair: MovePair | null = null;

  for (const token of moves) {
    // Strip move numbers
    const clean = token.replace(/^\d+\.{1,3}/, "");
    if (!clean) continue;

    if (!currentPair) {
      currentPair = { number: moveNum, white: clean };
    } else {
      currentPair.black = clean;
      pairs.push(currentPair);
      moveNum++;
      currentPair = null;
    }
  }

  // Trailing white move without black response
  if (currentPair) pairs.push(currentPair);

  return pairs;
}

export function FormattedMoves({ moves, className = "" }: FormattedMovesProps) {
  const pairs = parsePairs(moves);

  if (pairs.length === 0) return null;

  return (
    <div className={`font-mono text-[13px] leading-relaxed ${className}`}>
      {pairs.map((pair, i) => (
        <div key={i} className="flex items-baseline gap-1">
          <span className="text-tertiary w-5 text-right flex-shrink-0 text-[11px]">
            {pair.number}.
          </span>
          <span className="text-primary font-medium">{pair.white}</span>
          {pair.black && (
            <span className="text-secondary">{pair.black}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// Compact version for small spaces (inline)
export function InlineMoves({ moves }: { moves: string[] }) {
  const pairs = parsePairs(moves);
  return (
    <span className="font-mono text-[12px]">
      {pairs.map((p, i) => (
        <span key={i}>
          {i > 0 && " "}
          <span className="text-tertiary">{p.number}.</span>
          <span className="text-primary">{p.white}</span>
          {p.black && <span className="text-secondary"> {p.black}</span>}
        </span>
      ))}
    </span>
  );
}
