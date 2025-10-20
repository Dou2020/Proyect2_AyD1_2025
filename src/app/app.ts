import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModal } from './features/utils/alert-modal/alert-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, AlertModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Proyect2');
}
