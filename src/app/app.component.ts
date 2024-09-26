import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { style, trigger, state, transition, animate, sequence } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('textAnimation', [
      state('true', style({
        transform: 'translateX(0)',
        display: 'block'
      })),
      state('false', style({
        transform: 'translateX(-100%)',
      })),
      transition('false => true', [
        animate('250ms ease-in-out')
      ])
    ]),
    trigger('logoAnimation', [
      state('false', style({
        transform: 'translateX(33%)',
      })),
      state('true', style({
        transform: 'translateX(0)',
      })),
      transition('false => true', [
        animate('250ms ease-in-out')
      ])
    ]),
    trigger('fadeOut', [
      state('false', style ({
        opacity: '100'

      })),
      state('true', style({
        opacity: '0',
        display: 'none'
      })),
      transition('false => true', [
        animate('1000ms ease-in-out', style({opacity: '0'}))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'da-bubble';
  startTextAnimation: boolean = false;
  startLogoAnimation: boolean = false;
  fadeOut: boolean = false;


  ngOnInit(): void {
    setTimeout(() => {
      this.startTextAnimation = true;
    }, 750);
    
    setTimeout(() => {
      this.startLogoAnimation = true;
    }, 750);

    setTimeout(() => {
      this.fadeOut = true;
    }, 1500);
  }
}
