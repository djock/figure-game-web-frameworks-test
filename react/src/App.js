
import React, { useState, useEffect, useCallback } from 'react';
import Grid from './Grid';
import GameOverScreen from './GameOverScreen';
import styled from 'styled-components';
import './App.css'; // Import the CSS file

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  font-family: sans-serif;
  background-color: #06066A;
`;

const RetryButton = styled.button`
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 20px;

  &:hover {
    background-color: #d32f2f;
  }
`;

function App() {
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'gameOver'
  const [rows, setRows] = useState(5); // Fixed grid size based on the image
  const [cols, setCols] = useState(5);
  const [tapCount, setTapCount] = useState(9); // Set number of taps

  const generateGrid = useCallback(() => {
    const initialGrid = [
      ['#01FFDD', '#FFEE33', '#FFEE33', '#FFEE33', '#01FFDD'],
      ['#FFEE33', '#FF66FF', '#01FFDD', '#01FFDD', '#FF66FF'],
      ['#FFEE33', '#FF66FF', '#FF66FF', '#FFEE33', '#FF66FF'],
      ['#FFEE33', '#FF66FF', 'white', '#FF66FF', '#01FFDD'],
      ['white', 'white', '#FFEE33', '#FFEE33', '#FFEE33'],
    ];
    setGrid(initialGrid);
  }, []);

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
    if (tapCount <= 0) return; // No more taps allowed

    const color = grid[row][col];
    if (!color) return; // If the square is already empty

    const visited = grid.map(() => Array(cols).fill(false));
    const connectedSquares = findConnectedSquares(grid, row, col, color, visited);

    let newGrid = grid.map(gridRow => gridRow.map(cell => ({ color: cell, willDisappear: false }))); // Create a copy of the grid

    connectedSquares.forEach(({ row, col }) => {
      newGrid[row][col].willDisappear = true;
    });

    setGrid(newGrid);

    // Collapse the grid
    const collapsedGrid = collapseGrid(newGrid.map(row => row.map(cell => (cell && cell.willDisappear) ? null : cell.color)));
    setGrid(collapsedGrid);

    // Decrement tap count
    setTapCount(tapCount - 1);

    // Check for game over
    if (checkGameOver(collapsedGrid)) {
      setGameOver(true);
      setGameState('gameOver');
    } else if (tapCount - 1 <= 0) {
      setGameState('retry');
    }
  }, [checkGameOver, collapseGrid, findConnectedSquares, grid, cols, tapCount, rows]);

  const startGame = () => {
    setGameOver(false);
    generateGrid();
    setGameState('playing');
    setTapCount(9); // Reset tap count
  };

  const retryGame = () => {
    setGameOver(false);
    generateGrid();
    setGameState('playing');
    setTapCount(9); // Reset tap count
  };

  useEffect(() => {
    if (gameState === 'playing') {
      generateGrid();
    }
  }, [gameState, generateGrid]);

  return (
      <AppContainer>
        <h1>Figure Game React</h1>
        <h2>{tapCount} moves left</h2>

        {gameState === 'playing' && (
            <>
              <Grid grid={grid} onSquareClick={handleSquareClick} />
              {gameOver && <p>Game Over! No more moves.</p>}
            </>
        )}

        {gameState === 'retry' && (
            <>
              <p>Out of taps! Try again.</p>
              <RetryButton onClick={retryGame}>Retry</RetryButton>
            </>
        )}

        {gameState === 'gameOver' && (
            <GameOverScreen onRestart={startGame} />
        )}
      </AppContainer>
  );
}

export default App;