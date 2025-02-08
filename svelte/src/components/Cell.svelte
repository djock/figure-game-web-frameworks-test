<script lang="ts">
  // Optionally import HTMLButtonAttributes for proper typing of rest props
  import type { HTMLAttributes } from "svelte/elements";

  // Declare your known props with defaults and types
  export let color: string | null = null;
  export let bottomRow: boolean = false;
  export let willDisappear: boolean = false;

  // Derived values used for styling
  $: afterColor = willDisappear ? "#06066A" : color;
  $: colorClass =
    color === "#01FFDD"
      ? "cell--color-turquoise"
      : color === "white"
        ? "cell--color-white"
        : color === "#FF66FF"
          ? "cell--color-magenta"
          : color === "#FFEE33"
            ? "cell--color-yellow"
            : "";

  // Build an object for inline style properties
  $: buttonStyleObj = {
    backgroundColor: willDisappear ? color : "transparent",
    "--after-color": afterColor,
    "--border-color": color || "transparent",
    "--box-shadow": bottomRow ? `0 0 10px ${color}` : "none",
  };

  // Helper function to convert the style object to an inline CSS string
  function styleObjectToString(obj: Record<string, string | null>): string {
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");
  }
</script>

<!--
    Note the use of {...$$restProps} to forward any additional properties
    (such as "onclick") that aren’t explicitly declared.
    An aria-label is included to satisfy accessibility requirements.
  -->
<button
  aria-label="Cell button"
  class="cell-button {colorClass} {bottomRow ? 'bottom-row' : ''}"
  style={styleObjectToString(buttonStyleObj)}
  {...$$restProps}
  disabled={!color}
>
</button>

<style>
  .cell-button {
    width: 68px;
    height: 68px;
    background-color: transparent;
    border: 6px solid var(--border-color);
    border-radius: 25px;
    margin: 6px;
    position: relative;
    cursor: pointer;
    box-shadow: var(--box-shadow);
    padding: 0;
    outline: none;
  }
  .cell-button:hover {
    opacity: 0.8;
  }
  .cell-button:disabled {
    background-color: transparent;
    cursor: not-allowed;
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0);
  }
  /* Pseudo-elements for displaying shapes based on color */
  .cell--color-turquoise::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 15px;
    height: 15px;
    background-color: var(--after-color);
    transform: translate(-50%, -50%) rotate(45deg);
  }
  .cell--color-white::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 15px;
    height: 15px;
    background-color: var(--after-color);
    transform: translate(-50%, -50%);
  }
  .cell--color-magenta::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 15px solid var(--after-color);
    transform: translate(-50%, -50%);
  }
  .cell--color-yellow::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 15px;
    height: 15px;
    background-color: var(--after-color);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
</style>
