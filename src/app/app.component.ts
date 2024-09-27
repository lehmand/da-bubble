import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  })
export class AppComponent implements OnInit {
  title = 'da-bubble';
  moveLogo: boolean = false;
  moveText: boolean = false;


  ngOnInit(): void {
    setTimeout(() => {
      this.moveLogo = true;
      setTimeout(() => {
        this.moveText = true;
      }, 250);
    }, 500);
  }
}
