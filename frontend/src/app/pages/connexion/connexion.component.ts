import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormulaireComponent } from '../../components/formulaire/formulaire.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-connexion',
  imports: [NgIf, FormsModule, FormulaireComponent],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent {
  constructor() { }
  typeForm: string = "login";

  formulaireLogin() {
    this.typeForm = "login";
  }

  formulaireRegister() {
    this.typeForm = "register";
  }

  connexionGoogle() {
    console.log("Connexion avec Google");
  }

  connexionFacebook() {
    console.log("Connexion avec Facebook");
  }
}
