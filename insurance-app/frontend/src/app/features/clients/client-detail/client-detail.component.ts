import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="breadcrumb"><a routerLink="/clients">← Clients</a></div>
      <div *ngIf="client" class="detail-card">
        <div class="client-header">
          <div class="avatar">{{ client.nom[0] }}</div>
          <div>
            <h1>{{ client.nom }}</h1>
            <p>{{ client.email }} &nbsp;|&nbsp; {{ client.telephone || 'Pas de téléphone' }}</p>
          </div>
        </div>
        <h2>Contrats ({{ client.contrats?.length || 0 }})</h2>
        <div class="contrats-grid">
          <div *ngFor="let c of client.contrats" class="contrat-mini" [class]="c.typeContrat?.toLowerCase()">
            <div class="contrat-type">
              {{ typeIcon(c.typeContrat!) }} {{ c.typeContrat }}
            </div>
            <div class="contrat-montant">{{ c.montantCotisation | currency:'MAD ' }}</div>
            <span class="statut-badge" [class]="c.statut?.toLowerCase()">{{ c.statut }}</span>
            <div class="contrat-date">{{ c.dateSouscription | date:'dd/MM/yyyy' }}</div>
          </div>
          <div *ngIf="!client.contrats?.length" class="no-contrats">Aucun contrat</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding:24px; max-width:1000px; margin:0 auto; }
    .breadcrumb a { color:#0d6efd; text-decoration:none; font-weight:500; }
    .detail-card { background:white; border-radius:12px; padding:32px; margin-top:16px; box-shadow:0 2px 12px rgba(0,0,0,0.08); }
    .client-header { display:flex; align-items:center; gap:20px; margin-bottom:32px; }
    .avatar { width:64px; height:64px; border-radius:50%; background:#0d6efd; color:white; font-size:28px; font-weight:700; display:flex; align-items:center; justify-content:center; }
    h1 { margin:0; font-size:24px; } h2 { color:#6c757d; font-size:16px; margin:0 0 4px; }
    .client-header p { margin:0; color:#6c757d; }
    .contrats-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:16px; margin-top:16px; }
    .contrat-mini { border-radius:10px; padding:16px; border-left:4px solid; }
    .contrat-mini.automobile { background:#eff6ff; border-color:#3b82f6; }
    .contrat-mini.habitation { background:#f0fdf4; border-color:#22c55e; }
    .contrat-mini.sante { background:#fff1f2; border-color:#f43f5e; }
    .contrat-type { font-weight:700; font-size:13px; margin-bottom:8px; }
    .contrat-montant { font-size:18px; font-weight:700; color:#1a1a1a; }
    .contrat-date { font-size:12px; color:#6c757d; margin-top:4px; }
    .statut-badge { font-size:11px; padding:2px 8px; border-radius:20px; display:inline-block; margin-top:4px; }
    .statut-badge.en_cours { background:#dbeafe; color:#1d4ed8; }
    .statut-badge.valide { background:#dcfce7; color:#15803d; }
    .statut-badge.resilie { background:#fee2e2; color:#b91c1c; }
    .no-contrats { color:#adb5bd; text-align:center; padding:20px; }
  `]
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  constructor(private route: ActivatedRoute, private clientService: ClientService) {}
  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.clientService.getWithContrats(id).subscribe(data => this.client = data);
  }
  typeIcon(type: string): string {
    return { AUTOMOBILE: '🚗', HABITATION: '🏠', SANTE: '💊' }[type] || '📄';
  }
}
