import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthentificationService } from '../../services/authentification.service';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, NgIf, AsyncPipe],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  constructor(public authService: AuthentificationService, private router: Router) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }
}