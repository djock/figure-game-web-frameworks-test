import React, { useState, useEffect, useCallback } from 'react';
import Grid from './Grid';
import Scoreboard from './Scoreboard';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import styled from 'styled-components';

const AppContainer = styled.div`
  text-align: center;
  font-family: sans-serif;
`;

const NextLevelButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 20px;

  &:hover {
    background-color: #3e8e41;
  }
`;

function App() {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameOver'
  const [rows, setRows] = useState(5); // Fixed grid size based on the image
  const [cols, setCols] = useState(5);
  const [colors, setColors] = useState(['white', 'yellow', 'pink', 'turquoise']); // Simplified color scheme

  // useCallback is used to memoize functions, preventing unnecessary re-renders
  const generateGrid = useCallback(() => {
    const initialGrid = [
      ['turquoise', 'yellow', 'yellow', 'yellow', 'turquoise'],
      ['yellow', 'pink', 'turquoise', 'turquoise', 'pink'],
      ['yellow', 'pink', 'pink', 'yellow', 'pink'],
      ['yellow', 'pink', 'white', 'pink', 'turquoise'],
      ['white', 'white', 'yellow', 'yellow', 'yellow'],
    ];
    setGrid(initialGrid);
  }, []);

  // useCallback is used to memoize functions, preventing unnecessary re-renders
  const findConnectedSquares = useCallback((grid, row, col, color, visited) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const connectedSquares = [];

    function dfs(r, c) {
      if (r < 0 || r >= rows || c < 0 || c >= cols || visited[r][c] || grid[r][c] !== color) {
        return;
      }

      visited[r][c] = true;
      connectedSquares.push({ row: r, col: c });

      // Explore adjacent squares
      dfs(r + 1, c);
      dfs(r - 1, c);
      dfs(r, c + 1);
      dfs(r, c - 1);
    }

    dfs(row, col);
    return connectedSquares;
  }, []);

  // useCallback is used to memoize functions, preventing unnecessary re-renders
  const collapseGrid = useCallback((currentGrid) => {
    const newGrid = currentGrid.map(() => Array(cols).fill(null)); // Initialize an empty grid

    // Iterate through each column
    for (let col = 0; col < cols; col++) {
      const columnValues = [];

      // Collect non-null values from the column
      for (let row = 0; row < rows; row++) {
        if (currentGrid[row][col] !== null) {
          columnValues.push(currentGrid[row][col]);
        }
      }

      // Fill the new grid column from the bottom up
      let newRow = rows - 1;
      for (let i = columnValues.length - 1; i >= 0; i--) {
        newGrid[newRow][col] = columnValues[i];
        newRow--;
      }
    }

    return newGrid;
  }, [cols, rows]);

  // useCallback is used to memoize functions, preventing unnecessary re-renders
  const checkGameOver = useCallback((currentGrid) => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (currentGrid[row][col] !== null) {
          // Check adjacent cells for same color
          if (row > 0 && currentGrid[row][col] === currentGrid[row - 1][col]) return false; // Check top
          if (row < rows - 1 && currentGrid[row][col] === currentGrid[row + 1][col]) return false; // Check bottom
          if (col > 0 && currentGrid[row][col] === currentGrid[row][col - 1]) return false; // Check left
          if (col < cols - 1 && currentGrid[row][col] === currentGrid[row][col + 1]) return false; // Check right
        }
      }
    }
    return true; // No more moves possible
  }, [cols, rows]);

  const handleSquareClick = useCallback((row, col) => {
    // Only allow clicks on the bottom row
    if (row !== rows - 1) {
      return;
    }

    const color = grid[row][col];
    if (!color) return; // If the square is already empty

    const visited = grid.map(() => Array(cols).fill(false));
    const connectedSquares = findConnectedSquares(grid, row, col, color, visited);

    let newGrid;
    let removedCount;

    if (connectedSquares.length > 1) {
      // If there are connected squares, remove all of them
      newGrid = grid.map(gridRow => [...gridRow]); // Create a copy of the grid
      connectedSquares.forEach(({ row, col }) => {
        newGrid[row][col] = null;
      });
      removedCount = connectedSquares.length;
    } else {
      // If it's a single square, remove only that square
      newGrid = grid.map(gridRow => [...gridRow]);
      newGrid[row][col] = null;
      removedCount = 1;
    }

    setGrid(newGrid);

    // Collapse the grid
    const collapsedGrid = collapseGrid(newGrid);
    setGrid(collapsedGrid);

    // Update score
    setScore(score + removedCount * 10);

    // Check for game over
    if (checkGameOver(collapsedGrid)) {
      setGameOver(true);
      setGameState('gameOver');
    }
  }, [checkGameOver, collapseGrid, findConnectedSquares, grid, rows, score]);

  const startNewLevel = () => {
    setLevel(prevLevel => prevLevel + 1);
    setScore(prevScore => prevScore + 500); // Bonus for completing level
    setRows(prevRows => Math.min(15, prevRows + 1)); // Increase grid size (max 15)
    setCols(prevCols => Math.min(15, prevCols + 1));
    if (level % 3 === 0) {
      setColors(prevColors => {
        const newColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        return [...prevColors, newColor]; // Add a new random color every 3 levels
      });
    }
    generateGrid(); // Generate new grid for the level
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setRows(5); // Reset grid size to initial value
    setCols(5);
    setColors(['white', 'yellow', 'pink', 'turquoise']); // Reset colors
    generateGrid();
    setGameState('playing');
  };

  const endGame = () => {
    setGameState('gameOver');
  };

  // Initialize grid when game starts or level changes
  useEffect(() => {
    if (gameState === 'playing') {
      generateGrid();
    }
  }, [gameState, level, generateGrid]);

  return (
    <AppContainer>
      <h1>Color Collapse Game</h1>

      {gameState === 'start' && <StartScreen onStart={startGame} />}

      {gameState === 'playing' && (
        <>
          <Scoreboard score={score} level={level} />
          <Grid grid={grid} onSquareClick={handleSquareClick} />
          {gameOver ? (
            <p>Game Over! No more moves.</p>
          ) : (
            <NextLevelButton onClick={startNewLevel}>Next Level</NextLevelButton>
          )}
          <button onClick={endGame}>End Game</button> {/* Example end game button */}
        </>
      )}

      {gameState === 'gameOver' && (
        <GameOverScreen score={score} onRestart={startGame} />
      )}
    </AppContainer>
  );
}

export default App;