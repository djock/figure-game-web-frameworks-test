<template>
  <div class="app">
    <div class="info">
      <h2>Moves left: {{ movesLeft }}</h2>
    </div>

    <div class="grid">
      <GridComponent :grid="grid" @cell-click="handleCellClick" />
    </div>

    <div class="controls" v-if="showRefresh">
      <button @click="resetGame">Refresh</button>
    </div>

    <div class="controls" v-if="canShowTries">
      <h2>{{ tryLabel }}</h2>
    </div>


  </div>
</template>

<script>
import GridComponent from './components/Grid.vue';

// Define the default grid as a constant so we can deep clone it when resetting.
const defaultGrid = [
  ['#01FFDD', 'white', '#FF66FF', '#FF66FF', '#FF66FF'],
  ['#01FFDD', '#FF66FF', 'white', 'white', '#FFEE33'],
  ['#FFEE33', '#01FFDD', 'white', '#FFEE33', '#FF66FF'],
  ['#FFEE33', 'white', '#01FFDD', '#01FFDD', '#FFEE33'],
  ['#FFEE33', '#01FFDD', 'white', '#FFEE33', 'white']
];

export default {
  name: "App",
  components: {
    GridComponent
  },
  data() {
    return {
      grid: JSON.parse(JSON.stringify(defaultGrid)),
      movesLeft: 8,
      tryCount: 1
    }
  },
  computed: {
    // Return true if every cell in the grid is null (i.e. cleared).
    gridCompleted() {
      return this.grid.every(row => row.every(cell => cell === null));
    },
    // Show the refresh button if no moves are left and the grid isn't completely cleared.
    showRefresh() {
      return this.movesLeft === 0 && !this.gridCompleted;
    },
    canShowTries() {
      return this.tryCount > 1 && !this.gridCompleted;
    },
    // Compute an ordinal label for the try counter.
    tryLabel() {
      let suffix = "th";
      if (this.tryCount % 10 === 1 && this.tryCount % 100 !== 11) suffix = "st";
      else if (this.tryCount % 10 === 2 && this.tryCount % 100 !== 12) suffix = "nd";
      else if (this.tryCount % 10 === 3 && this.tryCount % 100 !== 13) suffix = "rd";
      return `${this.tryCount}${suffix} try`;
    }
  },
  methods: {
    // Only allow clicks on cells in the bottom row.
    handleCellClick(row, col) {
      if (row !== this.grid.length - 1) return;
      const targetColor = this.grid[row][col];
      if (!targetColor) return; // Already empty.

      if (this.movesLeft == 0) return;

      this.movesLeft -= 1;

      // Remove connected cells having the same color.
      this.floodFill(row, col, targetColor);

      // After removal, apply gravity to drop cells down.
      this.applyGravity();
    },
    // Recursively remove cells that are connected (up, down, left, right) and share the same color.
    floodFill(row, col, targetColor) {
      // Out-of-bound check.
      if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) return;

      // Only remove matching cells.
      if (this.grid[row][col] !== targetColor) return;

      // "Remove" the cell by setting its value to null.
      this.grid[row].splice(col, 1, null);

      // Recursively check neighbors.
      this.floodFill(row - 1, col, targetColor); // up
      this.floodFill(row + 1, col, targetColor); // down
      this.floodFill(row, col - 1, targetColor); // left
      this.floodFill(row, col + 1, targetColor); // right
    },
    // Make cells fall to fill empty spaces.
    applyGravity() {
      const numRows = this.grid.length;
      const numCols = this.grid[0].length;

      for (let col = 0; col < numCols; col++) {
        // Collect all non-null cells in the current column.
        let cellsInColumn = [];
        for (let row = 0; row < numRows; row++) {
          if (this.grid[row][col] !== null) {
            cellsInColumn.push(this.grid[row][col]);
          }
        }
        // Count how many empty cells are needed at the top.
        const emptyCount = numRows - cellsInColumn.length;
        // Fill the top of the column with null.
        for (let row = 0; row < emptyCount; row++) {
          this.grid[row][col] = null;
        }
        // Place the remaining cells at the bottom in their original order.
        for (let row = emptyCount; row < numRows; row++) {
          this.grid[row][col] = cellsInColumn[row - emptyCount];
        }
      }
    },
    resetGame() {
      // Increment the try counter on refresh.
      this.tryCount += 1;
      // Reset moves to 8 and restore the grid from the default.
      this.movesLeft = 8;
      this.grid = JSON.parse(JSON.stringify(defaultGrid));
    }
  }
};
</script>

<style>
body {
  background-color: #06066A;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

.app {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  min-height: 100vh;
}

.game {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.grid {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
}

.cell {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  cursor: pointer;
}

h1,
h2 {
  color: white;
}

.info {
  margin-bottom: 20px;
  color: white;
  font-size: 24px;
}

/* Controls under the grid styling */
.controls {
  margin-top: 20px;
  text-align: center;
}
</style>
