import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid.component';

interface GridType extends Array<Array<string | null>> {}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GridComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Define the default grid
  defaultGrid: GridType = [
    ['#01FFDD', 'white', '#FF66FF', '#FF66FF', '#FF66FF'],
    ['#01FFDD', '#FF66FF', 'white', 'white', '#FFEE33'],
    ['#FFEE33', '#01FFDD', 'white', '#FFEE33', '#FF66FF'],
    ['#FFEE33', 'white', '#01FFDD', '#01FFDD', '#FFEE33'],
    ['#FFEE33', '#01FFDD', 'white', '#FFEE33', 'white']
  ];

  grid: GridType = JSON.parse(JSON.stringify(this.defaultGrid));
  movesLeft: number = 8;
  tryCount: number = 1;

  // Getter computed properties
  get gridCompleted(): boolean {
    return this.grid.every(row => row.every(cell => cell === null));
  }

  get showRefresh(): boolean {
    return this.movesLeft === 0 && !this.gridCompleted;
  }

  get canShowTries(): boolean {
    return this.tryCount > 1 && !this.gridCompleted;
  }

  get tryLabel(): string {
    let suffix = 'th';
    if (this.tryCount % 10 === 1 && this.tryCount % 100 !== 11) suffix = 'st';
    else if (this.tryCount % 10 === 2 && this.tryCount % 100 !== 12) suffix = 'nd';
    else if (this.tryCount % 10 === 3 && this.tryCount % 100 !== 13) suffix = 'rd';
    return `${this.tryCount}${suffix} try`;
  }

  // Only allow clicks on cells in the bottom row.
  handleCellClick(row: number, col: number): void {
    if (row !== this.grid.length - 1) return;
    const targetColor = this.grid[row][col];
    if (!targetColor) return;
    if (this.movesLeft === 0) return;

    this.movesLeft--;
    this.floodFill(row, col, targetColor);
    this.applyGravity();
  }

  // Recursively remove connected cells with the same color.
  floodFill(row: number, col: number, targetColor: string): void {
    if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) return;
    if (this.grid[row][col] !== targetColor) return;

    this.grid[row][col] = null;
    this.floodFill(row - 1, col, targetColor);
    this.floodFill(row + 1, col, targetColor);
    this.floodFill(row, col - 1, targetColor);
    this.floodFill(row, col + 1, targetColor);
  }

  // Make cells fall to fill empty spaces.
  applyGravity(): void {
    const numRows = this.grid.length;
    const numCols = this.grid[0].length;
    for (let col = 0; col < numCols; col++) {
      const cellsInColumn: (string | null)[] = [];
      for (let row = 0; row < numRows; row++) {
        if (this.grid[row][col] !== null) {
          cellsInColumn.push(this.grid[row][col]);
        }
      }
      const emptyCount = numRows - cellsInColumn.length;
      for (let row = 0; row < emptyCount; row++) {
        this.grid[row][col] = null;
      }
      for (let row = emptyCount; row < numRows; row++) {
        this.grid[row][col] = cellsInColumn[row - emptyCount];
      }
    }
  }

  // Reset the game.
  resetGame(): void {
    this.tryCount++;
    this.movesLeft = 8;
    this.grid = JSON.parse(JSON.stringify(this.defaultGrid));
  }
}
