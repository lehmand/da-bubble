import { Component,inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.scss'
})
 
export class ImpressumComponent {
  router=inject(Router);

  navigateURL(){
    this.router.navigateByUrl('/dashboard');
  }
}
