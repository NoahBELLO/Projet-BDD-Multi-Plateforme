import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormulaireComponent } from '../../components/formulaire/formulaire.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [NgIf, FormsModule, FormulaireComponent],
  templateUrl: './tableau-de-bord.component.html',
  styleUrl: './tableau-de-bord.component.scss'
})
export class TableauDeBordComponent {
  constructor() { }
  typeForm: string = "";

  formulaireOLTP() {
    this.typeForm = "OLTP";
  }

  formulaireOLAP() {
    this.typeForm = "OLAP";
  }
}