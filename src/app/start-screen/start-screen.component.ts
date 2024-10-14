import { Component,Input, OnInit  } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent implements OnInit {
  chatMessage: string = '';
  // @Input() user: any;
  @Input() selectedUser: any;
  

  ngOnInit(): void {
   console.log(this.selectedUser)
  }
}
