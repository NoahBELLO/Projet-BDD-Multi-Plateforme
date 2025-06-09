import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api-gateway.service';
import { AuthentificationService } from '../../services/authentification.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { PopupErreurComponent } from '../popup-erreur/popup-erreur.component';
import { NgIf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, CommonModule],
  templateUrl: './formulaire.component.html',
  styleUrl: './formulaire.component.scss'
})
export class FormulaireComponent implements OnChanges {
  loginForm: FormGroup;
  registerForm: FormGroup;
  formApi: FormGroup;

  constructor(private donneeAPI: ApiService, private dialog: MatDialog, private fb: FormBuilder, private routes: Router, private authService: AuthentificationService) {
    this.loginForm = this.fb.group({
      identifiant: ['', [Validators.required]],
      motDePasse: ['', [Validators.required]],
    });

    this.formApi = this.fb.group({
      item_id: ['', [Validators.required]],
      limit: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      fname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  @Input() data: any;
  baseWidth: number = 300;
  baseHeight: number = 200;
  baseWidthErreur: number = 500;
  baseHeightErreur: number = 182;

  ngOnChanges(changes: SimpleChanges): void { }

  onSubmit() {
    switch (this.data) {
      case 'OLAP':
      case 'OLTP':
        if (!this.formApi.valid) {
          this.dialog.open(PopupErreurComponent, {
            width: `${this.baseWidthErreur}px`,
            height: `${this.baseHeightErreur}px`,
            data: "Requête vers l'API non réussie. Veuillez remplir les champs requis."
          });
          return;
        }
        const { item_id, limit } = this.formApi.value;

        if (limit < 1 || limit > 10) {
          this.dialog.open(PopupErreurComponent, {
            width: `${this.baseWidthErreur}px`,
            height: `${this.baseHeightErreur}px`,
            data: "La limite doit être comprise entre 1 et 10."
          });
          return;
        }

        if (this.data === 'OLAP') {
          this.informationsOLAP(item_id, limit);
        } else {
          this.informationsOLTP(item_id, limit);
        }
        break;

      case 'login':
        if (!this.loginForm.valid) {
          this.dialog.open(PopupErreurComponent, {
            width: `${this.baseWidthErreur}px`,
            height: `${this.baseHeightErreur}px`,
            data: "Connexion non réussie. Veuillez remplir les champs requis."
          });
          return;
        }
        const { identifiant, motDePasse } = this.loginForm.value;
        this.informationsLogin(identifiant, motDePasse);
        break;

      case 'register':
        if (!this.registerForm.valid) {
          this.dialog.open(PopupErreurComponent, {
            width: `${this.baseWidthErreur}px`,
            height: `${this.baseHeightErreur}px`,
            data: "Inscription non réussie. Veuillez remplir les champs requis."
          });
          return;
        }
        const { name, fname, email, login, password, confirmPassword } = this.registerForm.value;
        this.informationsRegister(name, fname, email, login, password, confirmPassword);
        break;

      default:
        console.log("Type de données non valide.");
    }
  }

  informationsOLAP(item_id: number, limit: number): void {
    this.donneeAPI.informationOLAP(item_id, limit).subscribe({
      next: (response) => {
        this.dialog.open(PopupComponent, {
          width: `${this.baseWidth + limit * 10}px`,
          height: `${this.baseHeight + limit * 5}px`,
          data: response
        });
      },
      error: (error) => {
        console.error("Erreur lors de la requête Flag :", error);
      }
    });
  }

  informationsOLTP(item_id: number, limit: number): void {
    this.donneeAPI.informationOLTP(item_id, limit).subscribe({
      next: (response) => {
        this.dialog.open(PopupComponent, {
          width: `${this.baseWidth + limit * 10}px`,
          height: `${this.baseHeight + limit * 5}px`,
          data: response
        });
      },
      error: (error) => {
        console.error("Erreur lors de la requête Flag :", error);
      }
    });
  }

  informationsLogin(email: string, password: string): void {
    console.log("Tentative de connexion avec l'email :", email, "et le mot de passe :", password);
    //   this.donneeAPI.informationOLTP(item_id, limit).subscribe({
    //     next: (response) => {
    //       this.dialog.open(PopupComponent, {
    //         width: `${this.baseWidth + limit * 10}px`,
    //         height: `${this.baseHeight + limit * 5}px`,
    //         data: response
    //       });
    //     },
    //     error: (error) => {
    //       console.error("Erreur lors de la requête Flag :", error);
    //     }
    //   });
    // }
  }

  informationsRegister(name: string, fname: string, email: string, login: string, password: string, confirmPassword: string): void {
    if (password !== confirmPassword) {
      console.error("Les mots de passe ne correspondent pas.");
      return;
    }
    const body = { name, fname, email, login, motDePasse: password };
    this.authService.register(body).subscribe({
      next: (response) => {
        console.log(response);
        // controle de token via une route pour vérifier que les cookies on bien été créer
        this.routes.navigate(['/accueil']);
      },
      error: (error) => {
        console.error("Erreur lors de la requête Flag :", error);
      }
    });
  }
}