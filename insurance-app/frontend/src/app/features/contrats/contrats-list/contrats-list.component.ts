import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContratService } from '../../../core/services/contrat.service';
import { ClientService } from '../../../core/services/client.service';
import { Contrat, Client, TypeContrat } from '../../../core/models';

@Component({
  selector: 'app-contrats-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>📄 Gestion des Contrats</h1>
        <div class="header-actions">
          <select [(ngModel)]="filterType" (change)="filterContrats()">
            <option value="">Tous les types</option>
            <option value="AUTOMOBILE">🚗 Automobile</option>
            <option value="HABITATION">🏠 Habitation</option>
            <option value="SANTE">💊 Santé</option>
          </select>
          <select [(ngModel)]="filterStatut" (change)="filterContrats()">
            <option value="">Tous les statuts</option>
            <option value="EN_COURS">En Cours</option>
            <option value="VALIDE">Validé</option>
            <option value="RESILIE">Résilié</option>
          </select>
          <button class="btn-add" (click)="showForm = !showForm">+ Nouveau Contrat</button>
        </div>
      </div>

      <!-- Form -->
      <div class="form-card" *ngIf="showForm">
        <h3>Nouveau Contrat</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Type de contrat *</label>
            <select [(ngModel)]="newContrat.typeContrat">
              <option value="">-- Choisir --</option>
              <option value="AUTOMOBILE">Automobile</option>
              <option value="HABITATION">Habitation</option>
              <option value="SANTE">Santé</option>
            </select>
          </div>
          <div class="form-group">
            <label>Client *</label>
            <select [(ngModel)]="newContrat.clientId">
              <option [value]="0">-- Choisir --</option>
              <option *ngFor="let c of clients" [value]="c.id">{{ c.nom }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Date de souscription *</label>
            <input type="date" [(ngModel)]="newContrat.dateSouscription" />
          </div>
          <div class="form-group">
            <label>Montant cotisation (MAD) *</label>
            <input type="number" [(ngModel)]="newContrat.montantCotisation" placeholder="500.00" />
          </div>
          <div class="form-group">
            <label>Durée (mois) *</label>
            <input type="number" [(ngModel)]="newContrat.dureeContrat" placeholder="12" />
          </div>
          <div class="form-group">
            <label>Taux de couverture (%) *</label>
            <input type="number" [(ngModel)]="newContrat.tauxCouverture" placeholder="80" />
          </div>
          <!-- Automobile fields -->
          <ng-container *ngIf="newContrat.typeContrat === 'AUTOMOBILE'">
            <div class="form-group">
              <label>Immatriculation *</label>
              <input [(ngModel)]="newContrat.numeroImmatriculation" placeholder="123456-A-7" />
            </div>
            <div class="form-group">
              <label>Marque *</label>
              <input [(ngModel)]="newContrat.marqueVehicule" placeholder="Toyota" />
            </div>
            <div class="form-group">
              <label>Modèle *</label>
              <input [(ngModel)]="newContrat.modeleVehicule" placeholder="Yaris" />
            </div>
          </ng-container>
          <!-- Habitation fields -->
          <ng-container *ngIf="newContrat.typeContrat === 'HABITATION'">
            <div class="form-group">
              <label>Type logement *</label>
              <select [(ngModel)]="newContrat.typeLogement">
                <option value="APPARTEMENT">Appartement</option>
                <option value="MAISON">Maison</option>
                <option value="LOCAL_COMMERCIAL">Local commercial</option>
              </select>
            </div>
            <div class="form-group">
              <label>Adresse *</label>
              <input [(ngModel)]="newContrat.adresseLogement" placeholder="Adresse du bien" />
            </div>
            <div class="form-group">
              <label>Superficie (m²)</label>
              <input type="number" [(ngModel)]="newContrat.superficie" placeholder="85" />
            </div>
          </ng-container>
          <!-- Sante fields -->
          <ng-container *ngIf="newContrat.typeContrat === 'SANTE'">
            <div class="form-group">
              <label>Niveau de couverture *</label>
              <select [(ngModel)]="newContrat.niveauCouverture">
                <option value="BASIQUE">Basique</option>
                <option value="INTERMEDIAIRE">Intermédiaire</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nb personnes couvertes *</label>
              <input type="number" [(ngModel)]="newContrat.nbPersonnesCouvertes" placeholder="2" />
            </div>
          </ng-container>
        </div>
        <div class="form-actions">
          <button class="btn-save" (click)="saveContrat()">💾 Créer le contrat</button>
          <button class="btn-cancel" (click)="showForm = false">Annuler</button>
        </div>
      </div>

      <!-- Contrats table -->
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Type</th><th>Client</th><th>Souscription</th>
              <th>Cotisation</th><th>Durée</th><th>Statut</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of filteredContrats">
              <td><span class="id-badge">{{ c.id }}</span></td>
              <td><span class="type-badge" [class]="c.typeContrat?.toLowerCase()">{{ typeIcon(c.typeContrat!) }} {{ c.typeContrat }}</span></td>
              <td><strong>{{ c.clientNom }}</strong></td>
              <td>{{ c.dateSouscription | date:'dd/MM/yyyy' }}</td>
              <td><strong>{{ c.montantCotisation | number:'1.2-2' }} MAD</strong></td>
              <td>{{ c.dureeContrat }} mois</td>
              <td><span class="statut-badge" [class]="c.statut?.toLowerCase()">{{ statutLabel(c.statut!) }}</span></td>
              <td class="actions">
                <button *ngIf="c.statut === 'EN_COURS'" class="btn-valider" (click)="valider(c.id!)">✅ Valider</button>
                <button *ngIf="c.statut !== 'RESILIE'" class="btn-resilier" (click)="resilier(c.id!)">❌ Résilier</button>
              </td>
            </tr>
            <tr *ngIf="filteredContrats.length === 0">
              <td colspan="8" class="empty-row">Aucun contrat trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding:24px; max-width:1300px; margin:0 auto; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:16px; }
    h1 { font-size:24px; font-weight:700; margin:0; }
    .header-actions { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
    select { padding:8px 12px; border:2px solid #e5e7eb; border-radius:6px; outline:none; font-size:14px; }
    select:focus { border-color:#0d6efd; }
    .btn-add { background:#0d6efd; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:600; cursor:pointer; white-space:nowrap; }
    .form-card { background:white; border-radius:12px; padding:24px; margin-bottom:24px; box-shadow:0 2px 12px rgba(0,0,0,0.08); border-top:3px solid #0d6efd; }
    .form-card h3 { margin:0 0 20px; }
    .form-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px,1fr)); gap:16px; margin-bottom:20px; }
    .form-group label { display:block; font-size:13px; font-weight:600; margin-bottom:6px; color:#374151; }
    .form-group input, .form-group select { width:100%; padding:10px 12px; border:2px solid #e5e7eb; border-radius:6px; font-size:14px; outline:none; box-sizing:border-box; }
    .form-group input:focus, .form-group select:focus { border-color:#0d6efd; }
    .form-actions { display:flex; gap:12px; }
    .btn-save { background:#198754; color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; font-weight:600; }
    .btn-cancel { background:#6c757d; color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; }
    .table-card { background:white; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08); }
    table { width:100%; border-collapse:collapse; }
    thead { background:#f8f9fa; }
    th { padding:14px 12px; text-align:left; font-size:12px; font-weight:600; color:#6c757d; text-transform:uppercase; }
    td { padding:12px; border-top:1px solid #f1f3f4; font-size:14px; vertical-align:middle; }
    .id-badge { background:#e9ecef; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:600; }
    .type-badge { padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .type-badge.automobile { background:#dbeafe; color:#1d4ed8; }
    .type-badge.habitation { background:#dcfce7; color:#15803d; }
    .type-badge.sante { background:#fff1f2; color:#be185d; }
    .statut-badge { padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .statut-badge.en_cours { background:#fef3c7; color:#d97706; }
    .statut-badge.valide { background:#dcfce7; color:#15803d; }
    .statut-badge.resilie { background:#fee2e2; color:#b91c1c; }
    .actions { display:flex; gap:6px; }
    .btn-valider { background:#198754; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px; }
    .btn-resilier { background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px; }
    .empty-row { text-align:center; color:#adb5bd; padding:40px !important; }
    tr:hover td { background:#fafafa; }
  `]
})
export class ContratsListComponent implements OnInit {
  allContrats: Contrat[] = [];
  filteredContrats: Contrat[] = [];
  clients: Client[] = [];
  filterType = '';
  filterStatut = '';
  showForm = false;
  newContrat: any = { typeContrat: '', clientId: 0, dateSouscription: '', montantCotisation: 0, dureeContrat: 12, tauxCouverture: 80 };

  constructor(private contratService: ContratService, private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadContrats();
    this.clientService.getAll().subscribe(d => this.clients = d);
  }

  loadContrats(): void {
    this.contratService.getAll().subscribe(data => {
      this.allContrats = data;
      this.filterContrats();
    });
  }

  filterContrats(): void {
    this.filteredContrats = this.allContrats.filter(c => {
      const matchType = !this.filterType || c.typeContrat === this.filterType;
      const matchStatut = !this.filterStatut || c.statut === this.filterStatut;
      return matchType && matchStatut;
    });
  }

  saveContrat(): void {
    const type = this.newContrat.typeContrat;
    if (!type) return;
    let obs;
    if (type === 'AUTOMOBILE') obs = this.contratService.createAutomobile(this.newContrat);
    else if (type === 'HABITATION') obs = this.contratService.createHabitation(this.newContrat);
    else obs = this.contratService.createSante(this.newContrat);
    obs.subscribe(() => { this.loadContrats(); this.showForm = false; this.newContrat = { typeContrat: '', clientId: 0, dateSouscription: '', montantCotisation: 0, dureeContrat: 12, tauxCouverture: 80 }; });
  }

  valider(id: number): void {
    this.contratService.valider(id).subscribe(() => this.loadContrats());
  }

  resilier(id: number): void {
    if (confirm('Résilier ce contrat ?')) {
      this.contratService.resilier(id).subscribe(() => this.loadContrats());
    }
  }

  typeIcon(type: string): string {
    return { AUTOMOBILE: '🚗', HABITATION: '🏠', SANTE: '💊' }[type] || '📄';
  }

  statutLabel(s: string): string {
    return { EN_COURS: 'En Cours', VALIDE: 'Validé', RESILIE: 'Résilié' }[s] || s;
  }
}
