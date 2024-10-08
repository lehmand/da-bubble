import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { StartScreenComponent } from '../start-screen/start-screen.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, WorkspaceComponent, StartScreenComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
