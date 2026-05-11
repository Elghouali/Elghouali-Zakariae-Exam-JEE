import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-layout" [class.authenticated]="isAuth">
      <!-- Sidebar -->
      <aside class="sidebar" *ngIf="isAuth">
        <div class="sidebar-header">
          <span class="logo-icon">🛡️</span>
          <span class="logo-text">AssuranceMS</span>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📊</span><span>Tableau de bord</span>
          </a>
          <a routerLink="/clients" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👥</span><span>Clients</span>
          </a>
          <a routerLink="/contrats" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📄</span><span>Contrats</span>
          </a>
          <a routerLink="/paiements" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">💳</span><span>Paiements</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">{{ currentUser?.username?.[0]?.toUpperCase() }}</div>
            <div>
              <div class="user-name">{{ currentUser?.username }}</div>
              <div class="user-role">{{ currentUser?.roles?.[0] }}</div>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()">Déconnexion</button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    * { box-sizing:border-box; margin:0; padding:0; }
    .app-layout { display:flex; min-height:100vh; background:#f4f6f9; font-family:'Segoe UI', sans-serif; }
    .app-layout:not(.authenticated) .main-content { width:100%; }
    .sidebar { width:240px; min-height:100vh; background:#1a3a5c; color:white; display:flex; flex-direction:column; position:fixed; top:0; left:0; z-index:100; }
    .sidebar-header { padding:24px 20px; display:flex; align-items:center; gap:12px; border-bottom:1px solid rgba(255,255,255,0.1); }
    .logo-icon { font-size:28px; }
    .logo-text { font-size:18px; font-weight:700; }
    .sidebar-nav { flex:1; padding:16px 0; }
    .nav-item { display:flex; align-items:center; gap:12px; padding:12px 20px; color:rgba(255,255,255,0.75); text-decoration:none; transition:all 0.2s; }
    .nav-item:hover { background:rgba(255,255,255,0.1); color:white; }
    .nav-item.active { background:rgba(13,110,253,0.6); color:white; border-right:3px solid #66aaff; }
    .nav-icon { font-size:18px; }
    .sidebar-footer { padding:20px; border-top:1px solid rgba(255,255,255,0.1); }
    .user-info { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
    .user-avatar { width:36px; height:36px; border-radius:50%; background:#0d6efd; display:flex; align-items:center; justify-content:center; font-weight:700; }
    .user-name { font-size:14px; font-weight:600; }
    .user-role { font-size:11px; color:rgba(255,255,255,0.6); }
    .logout-btn { width:100%; padding:8px; background:rgba(255,255,255,0.1); color:white; border:none; border-radius:6px; cursor:pointer; font-size:13px; transition:background 0.2s; }
    .logout-btn:hover { background:rgba(220,53,69,0.7); }
    .main-content { flex:1; margin-left:240px; min-height:100vh; }
    .authenticated .main-content { margin-left:240px; }
    :not(.authenticated) .main-content { margin-left:0; }
  `]
})
export class AppComponent implements OnInit {
  isAuth = false;
  currentUser = this.authService.getCurrentUser();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAuth = !!user;
      this.currentUser = user;
    });
  }

  logout(): void { this.authService.logout(); }
}
