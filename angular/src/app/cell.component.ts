import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent {
  @Input() color: string | null = null;
  @Input() bottomRow: boolean = false;
  @Input() willDisappear: boolean = false;
  @Output() cellClick = new EventEmitter<{ row: number, col: number }>();

  @Input() row: number = 0;
  @Input() col: number = 0;

  // Derived property for the pseudo-element color.
  get afterColor(): string {
    return this.willDisappear ? "#06066A" : (this.color || "");
  }

  // Compute a CSS class based on the cell's color.
  get colorClass(): string {
    if (this.color === "#01FFDD") return "cell--color-turquoise";
    if (this.color === "white") return "cell--color-white";
    if (this.color === "#FF66FF") return "cell--color-magenta";
    if (this.color === "#FFEE33") return "cell--color-yellow";
    return "";
  }

  // Create an inline style object.
  get buttonStyleObj(): { [key: string]: string } {
    return {
      "background-color": this.willDisappear ? (this.color || "transparent") : "transparent",
      "--after-color": this.afterColor,
      "--border-color": this.color || "transparent",
      "--box-shadow": (this.bottomRow && this.color) ? `0 0 10px ${this.color}` : "none"
    };
  }

  onClick(): void {
    this.cellClick.emit({ row: this.row, col: this.col });
  }
}
