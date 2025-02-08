<script lang="ts">
  import Cell from "./Cell.svelte";

  // Explicitly type the grid as an array of arrays containing strings or null.
  export let grid: (string | null)[][] = [];

  // Instead of using createEventDispatcher, we use a callback prop.
  // This callback gets the cell's row and column.
  export let cellClick: (row: number, col: number) => void = () => {};
</script>

<div class="grid">
  {#each grid as row, rowIndex}
    <div class="row">
      {#each row as cell, colIndex}
        <Cell
          color={cell}
          bottomRow={rowIndex === grid.length - 1}
          willDisappear={false}
          onclick={() => cellClick(rowIndex, colIndex)}
        />
      {/each}
    </div>
  {/each}
</div>

<style>
  .grid {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
  }
</style>
