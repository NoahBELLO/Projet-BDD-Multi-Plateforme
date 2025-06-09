import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormulaireComponent } from '../../components/formulaire/formulaire.component';
import { NgIf } from '@angular/common';
import { AuthentificationService } from '../../services/authentification.service';

@Component({
  selector: 'app-connexion',
  imports: [NgIf, FormsModule, FormulaireComponent],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent {
  constructor(private authService: AuthentificationService) { }
  typeForm: string = "login";

  formulaireLogin() {
    this.typeForm = "login";
  }

  formulaireRegister() {
    this.typeForm = "register";
  }

  connexionGoogle() {
    console.log("Connexion avec Google");
    window.location.href = "http://localhost:3001/authentification/google";
  }
}
