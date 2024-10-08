import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  chatMessage: string = '';

  ngAfterViewInit() {
    const textarea = document.querySelector('.chat-input') as HTMLTextAreaElement;
    if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(0, 0); 
    }
}

  moveCursorToStart(event: FocusEvent) {
    const target = event.target as HTMLTextAreaElement;
    target.setSelectionRange(0, 0); 
  }
}
