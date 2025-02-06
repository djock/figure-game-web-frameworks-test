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
  const [connectedToBottom, setConnectedToBottom] = useState([]);

  const generateGrid = useCallback(() => {
    const initialGrid = [
      ['#01FFDD', '#FFEE33', '#FFEE33', '#FFEE33', '#01FFDD'],
      ['#FFEE33', '#FF66FF', '#01FFDD', '#01FFDD', '#FF66FF'],
      ['#FFEE33', '#FF66FF', '#FF66FF', '#FFEE33', '#FF66FF'],
      ['#FFEE33', '#FF66FF', 'white', '#FF66FF', '#01FFDD'],
      ['white', 'white', '#FFEE33', '#FFEE33', '#FFEE33'],
    ].map(row => row.map(color => ({ color }))); // Store as objects
    setGrid(initialGrid);
  }, []);
  
  

  // Add this utility function in App component
  const findBottomConnected = (grid) => {
    // Add null checks for grid structure
    if (!grid || grid.length === 0 || grid[0].length === 0) return [];
    
    const connectedToBottom = Array(rows).fill().map(() => Array(cols).fill(false));
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
  
    // Verify bottom row exists before accessing
    const bottomRow = rows - 1;
    if (bottomRow >= grid.length) return connectedToBottom;
  
    for (let col = 0; col < cols; col++) {
      // Add nested optional chaining
      const cell = grid[bottomRow]?.[col];
      if (cell) {
        const color = cell.color || cell;
        floodFill(bottomRow, col, color, connectedToBottom, visited, grid);
      }
    }
    return connectedToBottom;
  };
  
// Helper function for flood fill
const floodFill = (row, col, targetColor, connectedToBottom, visited, grid) => {
  // Add boundary checks and grid validation
  if (row < 0 || row >= rows || col < 0 || col >= cols) return;
  if (!grid[row] || visited[row][col]) return;

  // Use optional chaining for color access
  const currentColor = grid[row][col]?.color || grid[row][col];
  if (currentColor !== targetColor) return;

  visited[row][col] = true;
  connectedToBottom[row][col] = true;

  // Recursive calls with boundary checks
  if (row + 1 < rows) floodFill(row + 1, col, targetColor, connectedToBottom, visited, grid);
  if (row - 1 >= 0) floodFill(row - 1, col, targetColor, connectedToBottom, visited, grid);
  if (col + 1 < cols) floodFill(row, col + 1, targetColor, connectedToBottom, visited, grid);
  if (col - 1 >= 0) floodFill(row, col - 1, targetColor, connectedToBottom, visited, grid);
};



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
    const newGrid = Array.from({ length: rows }, () => Array(cols).fill(null));
  
    for (let col = 0; col < cols; col++) {
      const columnValues = [];
      // Collect non-disappearing cells with proper null checks
      for (let row = 0; row < rows; row++) {
        const cell = currentGrid[row]?.[col];
        if (cell && !cell.willDisappear) {
          columnValues.push(cell.color || cell);
        }
      }
  
      // Fill from bottom with valid values
      let newRow = rows - 1;
      for (let i = columnValues.length - 1; i >= 0; i--) {
        if (newGrid[newRow]) {  // Add row existence check
          newGrid[newRow][col] = columnValues[i];
        }
        newRow--;
      }
    }
    return newGrid;
  }, [rows, cols]);
  
  
  

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
    if (tapCount <= 0 || gameState !== 'playing') return;
  
    const cell = grid[row]?.[col];
    if (!cell?.color && !cell) return;
  
    const visited = grid.map(() => Array(cols).fill(false));
    const color = cell.color || cell;
    const connectedSquares = findConnectedSquares(grid, row, col, color, visited);
  
    // Create new grid with disappearance markers
    const markedGrid = grid.map((gridRow, rIdx) => 
      gridRow.map((cell, cIdx) => ({
        ...cell,
        willDisappear: connectedSquares.some(sq => sq.row === rIdx && sq.col === cIdx)
      }))
    );
  
    // Collapse first, then update state
    const collapsedGrid = collapseGrid(markedGrid);
    
    setGrid(collapsedGrid);
    setTapCount(prev => prev - 1);
    
    // Update connection state AFTER grid update
    setConnectedToBottom(findBottomConnected(collapsedGrid));
    
    // Check game state last
    const gameEnded = checkGameOver(collapsedGrid);
    setGameState(gameEnded ? 'gameOver' : tapCount === 1 ? 'retry' : 'playing');
  }, [grid, tapCount, cols, rows, checkGameOver, collapseGrid, findConnectedSquares, gameState]);
  
  

  const startGame = () => {
    setGameOver(false);
    setGameState('playing');
    generateGrid();
    setTapCount(9);
    setConnectedToBottom(findBottomConnected(grid)); // Reset connection state
  };
  
  const retryGame = () => {
    setGameOver(false);
    setGameState('playing');
    generateGrid();
    setTapCount(9);
    setConnectedToBottom(findBottomConnected(grid));
  };
  
  useEffect(() => {
    if (gameState === 'playing') {
      generateGrid();
      setConnectedToBottom(findBottomConnected(grid));
    }
  }, [gameState, generateGrid, grid]);

  return (
      <AppContainer>
        <h1>Figure Game React</h1>
        <h2>{tapCount} moves left</h2>

        {gameState === 'playing' && (
            <>
              <Grid 
                grid={grid} 
                onSquareClick={handleSquareClick} 
                connectedToBottom={connectedToBottom}
              />
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