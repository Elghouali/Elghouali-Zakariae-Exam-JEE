import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Paiement, Contrat } from '../../../core/models';
import { ContratService } from '../../../core/services/contrat.service';

@Component({
  selector: 'app-paiements-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>💳 Gestion des Paiements</h1>
        <button class="btn-add" (click)="showForm = !showForm">+ Nouveau Paiement</button>
      </div>

      <div class="form-card" *ngIf="showForm">
        <h3>Enregistrer un paiement</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Contrat *</label>
            <select [(ngModel)]="newPaiement.contratId">
              <option [value]="0">-- Choisir un contrat --</option>
              <option *ngFor="let c of contrats" [value]="c.id">
                #{{ c.id }} - {{ c.typeContrat }} - {{ c.clientNom }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Date *</label>
            <input type="date" [(ngModel)]="newPaiement.date" />
          </div>
          <div class="form-group">
            <label>Montant (MAD) *</label>
            <input type="number" [(ngModel)]="newPaiement.montant" placeholder="250.00" />
          </div>
          <div class="form-group">
            <label>Type *</label>
            <select [(ngModel)]="newPaiement.type">
              <option value="MENSUALITE">Mensualité</option>
              <option value="PAIEMENT_ANNUEL">Paiement annuel</option>
              <option value="PAIEMENT_EXCEPTIONNEL">Paiement exceptionnel</option>
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-save" (click)="savePaiement()">💾 Enregistrer</button>
          <button class="btn-cancel" (click)="showForm = false">Annuler</button>
        </div>
      </div>

      <div class="table-card">
        <table>
          <thead>
            <tr><th>ID</th><th>Contrat</th><th>Date</th><th>Montant</th><th>Type</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of paiements">
              <td><span class="id-badge">{{ p.id }}</span></td>
              <td>Contrat #{{ p.contratId }}</td>
              <td>{{ p.date | date:'dd/MM/yyyy' }}</td>
              <td><strong>{{ p.montant | number:'1.2-2' }} MAD</strong></td>
              <td><span class="type-badge" [class]="p.type?.toLowerCase()">{{ typeLabel(p.type!) }}</span></td>
            </tr>
            <tr *ngIf="paiements.length === 0">
              <td colspan="5" class="empty-row">Aucun paiement trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding:24px; max-width:1100px; margin:0 auto; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
    h1 { font-size:24px; font-weight:700; margin:0; }
    .btn-add { background:#0d6efd; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:600; cursor:pointer; }
    .form-card { background:white; border-radius:12px; padding:24px; margin-bottom:24px; box-shadow:0 2px 12px rgba(0,0,0,0.08); border-top:3px solid #198754; }
    .form-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px,1fr)); gap:16px; margin-bottom:20px; }
    .form-group label { display:block; font-size:13px; font-weight:600; margin-bottom:6px; }
    .form-group input, .form-group select { width:100%; padding:10px 12px; border:2px solid #e5e7eb; border-radius:6px; font-size:14px; outline:none; box-sizing:border-box; }
    .form-actions { display:flex; gap:12px; }
    .btn-save { background:#198754; color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; font-weight:600; }
    .btn-cancel { background:#6c757d; color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; }
    .table-card { background:white; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08); }
    table { width:100%; border-collapse:collapse; }
    thead { background:#f8f9fa; }
    th { padding:14px 12px; text-align:left; font-size:12px; font-weight:600; color:#6c757d; text-transform:uppercase; }
    td { padding:14px 12px; border-top:1px solid #f1f3f4; font-size:14px; }
    .id-badge { background:#e9ecef; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:600; }
    .type-badge { padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .type-badge.mensualite { background:#dbeafe; color:#1d4ed8; }
    .type-badge.paiement_annuel { background:#dcfce7; color:#15803d; }
    .type-badge.paiement_exceptionnel { background:#fef3c7; color:#d97706; }
    .empty-row { text-align:center; color:#adb5bd; padding:40px !important; }
  `]
})
export class PaiementsListComponent implements OnInit {
  paiements: Paiement[] = [];
  contrats: Contrat[] = [];
  showForm = false;
  newPaiement: Paiement = { contratId: 0, date: '', montant: 0, type: 'MENSUALITE' };

  constructor(private http: HttpClient, private contratService: ContratService) {}

  ngOnInit(): void {
    this.loadPaiements();
    this.contratService.getAll().subscribe(d => this.contrats = d);
  }

  loadPaiements(): void {
    this.http.get<Paiement[]>(`${environment.apiUrl}/paiements`).subscribe(d => this.paiements = d);
  }

  savePaiement(): void {
    this.http.post<Paiement>(`${environment.apiUrl}/paiements`, this.newPaiement).subscribe(() => {
      this.loadPaiements();
      this.showForm = false;
      this.newPaiement = { contratId: 0, date: '', montant: 0, type: 'MENSUALITE' };
    });
  }

  typeLabel(t: string): string {
    return { MENSUALITE: 'Mensualité', PAIEMENT_ANNUEL: 'Annuel', PAIEMENT_EXCEPTIONNEL: 'Exceptionnel' }[t] || t;
  }
}
