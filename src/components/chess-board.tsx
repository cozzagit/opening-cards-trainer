// Mini chess board SVG — renders a position from a FEN-like piece placement
// Uses Unicode chess pieces for simplicity and print-readiness

const PIECE_CHARS: Record<string, string> = {
  K: "\u2654", Q: "\u2655", R: "\u2656", B: "\u2657", N: "\u2658", P: "\u2659",
  k: "\u265A", q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E", p: "\u265F",
};

const LIGHT_SQ = "#E8DFC4";
const DARK_SQ = "#B7A87E";

// Starting position
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

// Apply SAN moves to starting position (simplified — handles common openings)
function parseFenToBoard(fen: string): (string | null)[][] {
  const rows = fen.split("/");
  const board: (string | null)[][] = [];
  for (const row of rows) {
    const boardRow: (string | null)[] = [];
    for (const ch of row) {
      if (ch >= "1" && ch <= "8") {
        for (let i = 0; i < parseInt(ch); i++) boardRow.push(null);
      } else {
        boardRow.push(ch);
      }
    }
    board.push(boardRow);
  }
  return board;
}

// Very basic SAN-to-move converter for common opening moves
function applyMoves(moves: string[]): string {
  const board = parseFenToBoard(START_FEN);
  let whiteToMove = true;

  for (let token of moves) {
    // Strip move numbers: "1.e4" → "e4", "2...Qxd5" → "Qxd5", "12." → skip
    token = token.replace(/^\d+\.{1,3}/, "");
    if (!token) continue;
    const move = token.replace(/[+#!?]/g, "");

    if (move === "O-O" || move === "0-0") {
      const rank = whiteToMove ? 7 : 0;
      board[rank][6] = board[rank][4];
      board[rank][5] = board[rank][7];
      board[rank][4] = null;
      board[rank][7] = null;
      whiteToMove = !whiteToMove;
      continue;
    }
    if (move === "O-O-O" || move === "0-0-0") {
      const rank = whiteToMove ? 7 : 0;
      board[rank][2] = board[rank][4];
      board[rank][3] = board[rank][0];
      board[rank][4] = null;
      board[rank][0] = null;
      whiteToMove = !whiteToMove;
      continue;
    }

    // Parse target square
    const captures = move.includes("x");
    const clean = move.replace("x", "");

    let piece: string;
    let targetFile: number;
    let targetRank: number;
    let sourceHint = "";
    let promotion = "";

    if (clean.includes("=")) {
      const parts = clean.split("=");
      promotion = whiteToMove ? parts[1][0] : parts[1][0].toLowerCase();
      const pawnMove = parts[0];
      piece = whiteToMove ? "P" : "p";
      targetFile = pawnMove.charCodeAt(pawnMove.length - 2) - 97;
      targetRank = 8 - parseInt(pawnMove[pawnMove.length - 1]);
      if (pawnMove.length > 2) sourceHint = pawnMove[0];
    } else if (clean[0] >= "a" && clean[0] <= "h") {
      // Pawn move
      piece = whiteToMove ? "P" : "p";
      if (clean.length === 2) {
        targetFile = clean.charCodeAt(0) - 97;
        targetRank = 8 - parseInt(clean[1]);
      } else {
        sourceHint = clean[0];
        targetFile = clean.charCodeAt(clean.length - 2) - 97;
        targetRank = 8 - parseInt(clean[clean.length - 1]);
      }
    } else {
      // Piece move
      const pieceLetter = clean[0];
      piece = whiteToMove ? pieceLetter : pieceLetter.toLowerCase();
      targetFile = clean.charCodeAt(clean.length - 2) - 97;
      targetRank = 8 - parseInt(clean[clean.length - 1]);
      if (clean.length > 3) {
        sourceHint = clean.substring(1, clean.length - 2);
      }
    }

    if (targetFile < 0 || targetFile > 7 || targetRank < 0 || targetRank > 7) {
      whiteToMove = !whiteToMove;
      continue;
    }

    // Find the source piece
    let found = false;
    for (let r = 0; r < 8 && !found; r++) {
      for (let c = 0; c < 8 && !found; c++) {
        if (board[r][c] !== piece) continue;
        if (sourceHint) {
          if (sourceHint.length === 1 && sourceHint >= "a" && sourceHint <= "h") {
            if (c !== sourceHint.charCodeAt(0) - 97) continue;
          } else if (sourceHint.length === 1 && sourceHint >= "1" && sourceHint <= "8") {
            if (r !== 8 - parseInt(sourceHint)) continue;
          }
        }

        // Check if this piece can reach the target (simplified)
        const dr = targetRank - r;
        const dc = targetFile - c;

        let canReach = false;
        const upperPiece = piece.toUpperCase();

        if (upperPiece === "P") {
          const dir = whiteToMove ? -1 : 1;
          if (dc === 0 && dr === dir && !board[targetRank][targetFile]) canReach = true;
          if (dc === 0 && dr === 2 * dir && r === (whiteToMove ? 6 : 1)) canReach = true;
          if (Math.abs(dc) === 1 && dr === dir) canReach = true; // capture or en passant
        } else if (upperPiece === "N") {
          canReach = (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
        } else if (upperPiece === "B") {
          canReach = Math.abs(dr) === Math.abs(dc) && dr !== 0;
        } else if (upperPiece === "R") {
          canReach = (dr === 0 || dc === 0) && (dr !== 0 || dc !== 0);
        } else if (upperPiece === "Q") {
          canReach = (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) && (dr !== 0 || dc !== 0);
        } else if (upperPiece === "K") {
          canReach = Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
        }

        if (canReach) {
          // En passant capture
          if (upperPiece === "P" && captures && !board[targetRank][targetFile]) {
            board[r][targetFile] = null; // remove captured pawn
          }
          board[r][c] = null;
          board[targetRank][targetFile] = promotion || piece;
          found = true;
        }
      }
    }

    whiteToMove = !whiteToMove;
  }

  // Convert board back to FEN
  let fen = "";
  for (let r = 0; r < 8; r++) {
    let empty = 0;
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === null) {
        empty++;
      } else {
        if (empty > 0) { fen += empty; empty = 0; }
        fen += board[r][c];
      }
    }
    if (empty > 0) fen += empty;
    if (r < 7) fen += "/";
  }
  return fen;
}

interface ChessBoardProps {
  moves: string[];
  size?: number;
}

export function ChessBoard({ moves, size = 160 }: ChessBoardProps) {
  const fen = moves.length > 0 ? applyMoves(moves) : START_FEN;
  const board = parseFenToBoard(fen);
  const sqSize = size / 8;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="rounded shadow-sm border border-border-light"
      style={{ maxWidth: "100%" }}
    >
      {/* Squares */}
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 8 }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * sqSize}
            y={r * sqSize}
            width={sqSize}
            height={sqSize}
            fill={(r + c) % 2 === 0 ? LIGHT_SQ : DARK_SQ}
          />
        ))
      )}
      {/* Pieces */}
      {board.map((row, r) =>
        row.map((piece, c) =>
          piece ? (
            <text
              key={`p-${r}-${c}`}
              x={c * sqSize + sqSize / 2}
              y={r * sqSize + sqSize * 0.82}
              textAnchor="middle"
              fontSize={sqSize * 0.85}
              style={{ userSelect: "none" }}
            >
              {PIECE_CHARS[piece] || ""}
            </text>
          ) : null
        )
      )}
      {/* Coordinate labels */}
      {"abcdefgh".split("").map((l, i) => (
        <text
          key={`fl-${i}`}
          x={i * sqSize + sqSize / 2}
          y={size - 1}
          textAnchor="middle"
          fontSize={sqSize * 0.3}
          fill={(7 + i) % 2 === 0 ? DARK_SQ : LIGHT_SQ}
          style={{ userSelect: "none" }}
        >
          {l}
        </text>
      ))}
      {"87654321".split("").map((n, i) => (
        <text
          key={`rl-${i}`}
          x={2}
          y={i * sqSize + sqSize * 0.35}
          fontSize={sqSize * 0.3}
          fill={(i) % 2 === 0 ? DARK_SQ : LIGHT_SQ}
          style={{ userSelect: "none" }}
        >
          {n}
        </text>
      ))}
    </svg>
  );
}
