import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from './cell.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, CellComponent],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  @Input() grid: (string | null)[][] = [];
  @Output() cellClick = new EventEmitter<{ row: number; col: number }>();

  onCellClick(row: number, col: number): void {
    this.cellClick.emit({ row, col });
  }
}
