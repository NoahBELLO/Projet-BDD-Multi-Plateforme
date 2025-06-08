import { Component, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-erreur',
  imports: [CommonModule],
  templateUrl: './popup-erreur.component.html',
  styleUrl: './popup-erreur.component.scss'
})
export class PopupErreurComponent {
  error: string = "";

  constructor(public dialogRef: MatDialogRef<PopupErreurComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.error = data;
  }

  ngAfterViewInit() {
    document.querySelector('app-root')?.setAttribute('aria-hidden', 'false');
  }

  close() {
    document.querySelector('app-root')?.setAttribute('aria-hidden', 'true');
    this.dialogRef.close();
  }
}
