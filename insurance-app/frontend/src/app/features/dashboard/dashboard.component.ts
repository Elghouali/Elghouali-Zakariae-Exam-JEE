import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContratService } from '../../core/services/contrat.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="welcome-banner">
        <div class="welcome-content">
          <h1>Tableau de bord</h1>
          <p>
            Bienvenue, <strong>{{ currentUser?.username }}</strong> —
            {{ currentUser?.roles?.[0] | roleLabel }}
          </p>
        </div>
        <div class="welcome-icon">🛡️</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card automobile">
          <div class="stat-icon">🚗</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats['AUTOMOBILE'] || 0 }}</span>
            <span class="stat-label">Contrats Automobile</span>
          </div>
        </div>
        <div class="stat-card habitation">
          <div class="stat-icon">🏠</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats['HABITATION'] || 0 }}</span>
            <span class="stat-label">Contrats Habitation</span>
          </div>
        </div>
        <div class="stat-card sante">
          <div class="stat-icon">💊</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats['SANTE'] || 0 }}</span>
            <span class="stat-label">Contrats Santé</span>
          </div>
        </div>
        <div class="stat-card total">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <span class="stat-value">{{ totalContrats }}</span>
            <span class="stat-label">Total Contrats</span>
          </div>
        </div>
      </div>

      <div class="status-section">
        <h2>Répartition par Statut</h2>
        <div class="status-grid">
          <div class="status-card en-cours">
            <span class="status-dot"></span>
            <div>
              <span class="status-count">{{ statutStats['EN_COURS'] || 0 }}</span>
              <span class="status-label">En Cours</span>
            </div>
          </div>
          <div class="status-card valide">
            <span class="status-dot"></span>
            <div>
              <span class="status-count">{{ statutStats['VALIDE'] || 0 }}</span>
              <span class="status-label">Validés</span>
            </div>
          </div>
          <div class="status-card resilie">
            <span class="status-dot"></span>
            <div>
              <span class="status-count">{{ statutStats['RESILIE'] || 0 }}</span>
              <span class="status-label">Résiliés</span>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Accès Rapide</h2>
        <div class="actions-grid">
          <a routerLink="/clients" class="action-card">
            <span class="action-icon">👥</span>
            <span>Gérer les Clients</span>
          </a>
          <a routerLink="/contrats" class="action-card">
            <span class="action-icon">📄</span>
            <span>Voir les Contrats</span>
          </a>
          <a routerLink="/paiements" class="action-card">
            <span class="action-icon">💳</span>
            <span>Paiements</span>
          </a>
          <a href="http://localhost:8080/swagger-ui.html" target="_blank" class="action-card api">
            <span class="action-icon">🔌</span>
            <span>API Swagger</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .welcome-banner {
        background: linear-gradient(135deg, #1a3a5c, #0d6efd);
        color: white;
        border-radius: 16px;
        padding: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
      }
      .welcome-banner h1 {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 8px;
      }
      .welcome-banner p {
        margin: 0;
        opacity: 0.9;
      }
      .welcome-icon {
        font-size: 64px;
        opacity: 0.8;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
        margin-bottom: 32px;
      }
      .stat-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        border-left: 4px solid;
      }
      .stat-card.automobile {
        border-color: #0d6efd;
      }
      .stat-card.habitation {
        border-color: #198754;
      }
      .stat-card.sante {
        border-color: #dc3545;
      }
      .stat-card.total {
        border-color: #fd7e14;
      }
      .stat-icon {
        font-size: 36px;
      }
      .stat-value {
        font-size: 32px;
        font-weight: 700;
        display: block;
        color: #1a1a1a;
      }
      .stat-label {
        font-size: 13px;
        color: #6c757d;
      }
      .status-section,
      .quick-actions {
        background: white;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      }
      h2 {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0 0 20px;
      }
      .status-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .status-card {
        border-radius: 10px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .status-card.en-cours {
        background: #dbeafe;
      }
      .status-card.valide {
        background: #dcfce7;
      }
      .status-card.resilie {
        background: #fee2e2;
      }
      .status-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .en-cours .status-dot {
        background: #3b82f6;
      }
      .valide .status-dot {
        background: #22c55e;
      }
      .resilie .status-dot {
        background: #ef4444;
      }
      .status-count {
        font-size: 28px;
        font-weight: 700;
        display: block;
      }
      .status-label {
        font-size: 13px;
        color: #6c757d;
      }
      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
      }
      .action-card {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 20px;
        text-decoration: none;
        color: #1a1a1a;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        transition: all 0.2s;
        border: 2px solid transparent;
      }
      .action-card:hover {
        background: #e9ecef;
        border-color: #0d6efd;
        transform: translateY(-2px);
      }
      .action-card.api {
        background: #fff3cd;
      }
      .action-icon {
        font-size: 32px;
      }
      .action-card span:last-child {
        font-size: 14px;
        font-weight: 600;
        text-align: center;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  stats: Record<string, number> = {};
  statutStats: Record<string, number> = {};
  totalContrats = 0;

  currentUser: any;

  constructor(
    private contratService: ContratService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    this.contratService.getStatistiquesParType().subscribe((data: Record<string, number>) => {
      this.stats = data;

      this.totalContrats = Object.values(data).reduce((a, b) => a + b, 0);
    });

    this.contratService.getStatistiquesParStatut().subscribe((data: any) => {
      this.statutStats = data;
    });
  }
}
