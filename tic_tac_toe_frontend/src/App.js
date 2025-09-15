import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Square component renders one cell of the board.
 * It is a button for accessibility and keyboard support.
 */
function Square({ value, onClick, highlight, index }) {
  return (
    <button
      className={`square ${highlight ? 'highlight' : ''}`}
      onClick={onClick}
      aria-label={`Cell ${index + 1}, ${value ? value : 'empty'}`}
      aria-pressed={!!value}
      data-testid={`square-${index}`}
    >
      {value}
    </button>
  );
}

/**
 * Board component renders a 3x3 grid of Square components.
 */
function Board({ squares, onSquareClick, winningLine }) {
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((val, idx) => {
        const isWinning = winningLine?.includes(idx);
        return (
          <Square
            key={idx}
            value={val}
            onClick={() => onSquareClick(idx)}
            highlight={!!isWinning}
            index={idx}
          />
        );
      })}
    </div>
  );
}

// Utility: all winning line indices for 3x3
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Compute winner and winning line.
 */
function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * Gets next player symbol based on X count vs O count
 */
function nextPlayer(squares) {
  const xCount = squares.filter((s) => s === 'X').length;
  const oCount = squares.filter((s) => s === 'O').length;
  return xCount === oCount ? 'X' : 'O';
}

/**
 * PUBLIC_INTERFACE
 * App is the main entry: renders a full Tic Tac Toe game with:
 * - responsive 3x3 grid
 * - current player indicator
 * - winner/draw announcement with winning-line highlight
 * - restart button
 * - optional light/dark theme toggle persisted in document data-theme
 */
function App() {
  // Theme handling (light by default)
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(
    () => !winner && squares.every((s) => s !== null),
    [winner, squares]
  );
  const player = useMemo(() => (winner ? null : nextPlayer(squares)), [winner, squares]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleSquareClick = (idx) => {
    // ignore if occupied or game finished
    if (squares[idx] || winner) return;
    const next = [...squares];
    next[idx] = nextPlayer(squares);
    setSquares(next);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setSquares(Array(9).fill(null));
  };

  return (
    <div className="App">
      <header className="app-header">
        <nav className="navbar">
          <div className="brand" aria-label="App title">Tic Tac Toe</div>
          <button
            className="btn theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </nav>

        <main className="content">
          <section className="game-card">
            <div className="status" data-testid="status">
              {winner && (
                <span className="status-text winner">
                  Winner: <strong>{winner}</strong>
                </span>
              )}
              {!winner && !isDraw && (
                <span className="status-text turn">
                  Current Turn: <strong>{player}</strong>
                </span>
              )}
              {!winner && isDraw && (
                <span className="status-text draw">
                  It&apos;s a draw!
                </span>
              )}
            </div>

            <Board
              squares={squares}
              onSquareClick={handleSquareClick}
              winningLine={line}
            />

            <div className="controls">
              <button className="btn btn-primary" onClick={resetGame} aria-label="Restart game" data-testid="restart">
                Restart
              </button>
            </div>
          </section>

          <footer className="footer">
            <p className="hint">
              Tip: Use your mouse or keyboard (Tab + Enter/Space) to play.
            </p>
          </footer>
        </main>
      </header>
    </div>
  );
}

export default App;
