import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">🛡️</div>
          <h1>AssuranceMS</h1>
          <p>Connectez-vous à votre espace</p>
        </div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nom d'utilisateur</label>
            <input type="text" formControlName="username" placeholder="admin / employe / client1" />
            <span class="error" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
              Champ obligatoire
            </span>
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <input type="password" formControlName="password" placeholder="••••••••" />
          </div>
          <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>
          <button type="submit" [disabled]="loading" class="btn-primary">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
        <div class="demo-hints">
          <p><strong>Comptes de démo :</strong></p>
          <p>admin / Admin123! &nbsp;|&nbsp; employe / Employe123! &nbsp;|&nbsp; client1 / Client123!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display:flex; justify-content:center; align-items:center; min-height:100vh; background: linear-gradient(135deg, #1a3a5c 0%, #0d6efd 100%); }
    .auth-card { background:white; border-radius:16px; padding:40px; width:100%; max-width:420px; box-shadow:0 20px 60px rgba(0,0,0,0.3); }
    .auth-header { text-align:center; margin-bottom:32px; }
    .logo { font-size:48px; margin-bottom:8px; }
    h1 { font-size:24px; font-weight:700; color:#1a3a5c; margin:0; }
    .auth-header p { color:#6c757d; margin-top:4px; }
    .form-group { margin-bottom:20px; }
    label { display:block; font-size:14px; font-weight:600; color:#374151; margin-bottom:6px; }
    input { width:100%; padding:12px 16px; border:2px solid #e5e7eb; border-radius:8px; font-size:15px; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
    input:focus { border-color:#0d6efd; }
    .error { font-size:12px; color:#dc3545; margin-top:4px; display:block; }
    .error-msg { background:#fff5f5; color:#dc3545; padding:10px; border-radius:6px; margin-bottom:16px; font-size:14px; }
    .btn-primary { width:100%; padding:14px; background:#0d6efd; color:white; border:none; border-radius:8px; font-size:16px; font-weight:600; cursor:pointer; transition:background 0.2s; }
    .btn-primary:hover:not(:disabled) { background:#0b5ed7; }
    .btn-primary:disabled { opacity:0.7; cursor:not-allowed; }
    .demo-hints { margin-top:24px; padding:12px; background:#f8f9fa; border-radius:8px; font-size:13px; text-align:center; color:#6c757d; }
    .demo-hints strong { color:#495057; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMsg = 'Identifiants incorrects. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }
}
