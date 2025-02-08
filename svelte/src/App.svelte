<script lang="ts">
  import Grid from "./components/Grid.svelte";

  // Define the default grid (deep-cloned upon reset)
  const defaultGrid: (string | null)[][] = [
    ["#01FFDD", "white", "#FF66FF", "#FF66FF", "#FF66FF"],
    ["#01FFDD", "#FF66FF", "white", "white", "#FFEE33"],
    ["#FFEE33", "#01FFDD", "white", "#FFEE33", "#FF66FF"],
    ["#FFEE33", "white", "#01FFDD", "#01FFDD", "#FFEE33"],
    ["#FFEE33", "#01FFDD", "white", "#FFEE33", "white"],
  ];

  // Game state
  let grid: (string | null)[][] = JSON.parse(JSON.stringify(defaultGrid));
  let movesLeft: number = 8;
  let tryCount: number = 1;

  // Reactive computed values
  $: gridCompleted = grid.every((row) => row.every((cell) => cell === null));
  $: showRefresh = movesLeft === 0 && !gridCompleted;
  $: canShowTries = tryCount > 1 && !gridCompleted;
  $: tryLabel = (() => {
    let suffix = "th";
    if (tryCount % 10 === 1 && tryCount % 100 !== 11) suffix = "st";
    else if (tryCount % 10 === 2 && tryCount % 100 !== 12) suffix = "nd";
    else if (tryCount % 10 === 3 && tryCount % 100 !== 13) suffix = "rd";
    return `${tryCount}${suffix} try`;
  })();

  // Allow clicks only on cells in the bottom row.
  function handleCellClick(row: number, col: number): void {
    if (row !== grid.length - 1) return;
    const targetColor = grid[row][col];
    if (!targetColor) return; // Cell already cleared.
    if (movesLeft === 0) return;

    movesLeft -= 1;
    floodFill(row, col, targetColor);
    applyGravity();

    // Reassign to trigger reactivity.
    grid = grid;
  }

  // Recursively remove connected cells that share the same color.
  function floodFill(row: number, col: number, targetColor: string): void {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length)
      return;
    if (grid[row][col] !== targetColor) return;

    grid[row][col] = null;
    floodFill(row - 1, col, targetColor); // up
    floodFill(row + 1, col, targetColor); // down
    floodFill(row, col - 1, targetColor); // left
    floodFill(row, col + 1, targetColor); // right
  }

  // Make cells fall down to fill empty spaces.
  function applyGravity(): void {
    const numRows = grid.length;
    const numCols = grid[0].length;

    for (let col = 0; col < numCols; col++) {
      const cellsInColumn: (string | null)[] = [];
      for (let row = 0; row < numRows; row++) {
        if (grid[row][col] !== null) {
          cellsInColumn.push(grid[row][col]);
        }
      }
      const emptyCount = numRows - cellsInColumn.length;
      // Set top cells to null.
      for (let row = 0; row < emptyCount; row++) {
        grid[row][col] = null;
      }
      // Refill the column with the remaining colors.
      for (let row = emptyCount; row < numRows; row++) {
        grid[row][col] = cellsInColumn[row - emptyCount];
      }
    }
  }

  // Reset the game by restoring moves and the default grid.
  function resetGame(): void {
    tryCount += 1;
    movesLeft = 8;
    grid = JSON.parse(JSON.stringify(defaultGrid));
  }
</script>

<main class="app">
  <div class="info">
    <h2>Moves left: {movesLeft}</h2>
  </div>

  <div class="grid">
    <!-- Pass the grid and event callback to the Grid component -->
    <Grid {grid} cellClick={handleCellClick} />
  </div>

  {#if showRefresh}
    <div class="controls">
      <button on:click={resetGame}>Refresh</button>
    </div>
  {/if}

  {#if canShowTries}
    <div class="controls">
      <h2>{tryLabel}</h2>
    </div>
  {/if}
</main>

<style>
  .app {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 100vh;
  }

  .grid {
    display: flex;
    flex-direction: column;
  }

  h2 {
    color: white;
  }

  .info {
    margin-bottom: 20px;
    color: white;
    font-size: 24px;
  }

  .controls {
    margin-top: 20px;
    text-align: center;
  }
</style>
