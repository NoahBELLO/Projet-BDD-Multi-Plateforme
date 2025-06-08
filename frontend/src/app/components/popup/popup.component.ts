import { Component, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent implements AfterViewInit {
  parsedArray: any[] = [];
  typeResult: string = "";

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.result && Array.isArray(data.result)) {
      this.parsedArray = data.result;
      this.typeResult = "OLAP";
    } else if (data?.recommendations && Array.isArray(data.recommendations)) {
      this.parsedArray = data.recommendations;
      this.typeResult = "OLTP";
    }
  }

  ngAfterViewInit() {
    document.querySelector('app-root')?.setAttribute('aria-hidden', 'false');
  }

  close() {
    document.querySelector('app-root')?.setAttribute('aria-hidden', 'true');
    this.dialogRef.close();
  }

  isArray(item: any): boolean {
    return Array.isArray(item);
  }
}
