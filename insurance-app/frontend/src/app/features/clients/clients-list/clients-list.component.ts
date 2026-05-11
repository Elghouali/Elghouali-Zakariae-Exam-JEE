import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>👥 Gestion des Clients</h1>
        <button class="btn-add" (click)="showForm = !showForm">+ Nouveau Client</button>
      </div>

      <div class="search-bar">
        <input [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="🔍 Rechercher par nom..." />
      </div>

      <!-- Add Form -->
      <div class="form-card" *ngIf="showForm">
        <h3>{{ editingClient ? 'Modifier le client' : 'Nouveau client' }}</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Nom complet *</label>
            <input [(ngModel)]="formData.nom" placeholder="Nom du client" />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input [(ngModel)]="formData.email" type="email" placeholder="email@exemple.com" />
          </div>
          <div class="form-group">
            <label>Téléphone</label>
            <input [(ngModel)]="formData.telephone" placeholder="06XXXXXXXX" />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-save" (click)="saveClient()">💾 Enregistrer</button>
          <button class="btn-cancel" (click)="cancelForm()">Annuler</button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of filteredClients">
              <td><span class="id-badge">{{ client.id }}</span></td>
              <td><strong>{{ client.nom }}</strong></td>
              <td>{{ client.email }}</td>
              <td>{{ client.telephone || '—' }}</td>
              <td class="actions">
                <a [routerLink]="['/clients', client.id]" class="btn-view">👁 Voir</a>
                <button class="btn-edit" (click)="editClient(client)">✏️ Modifier</button>
                <button class="btn-delete" (click)="deleteClient(client.id!)">🗑</button>
              </td>
            </tr>
            <tr *ngIf="filteredClients.length === 0">
              <td colspan="5" class="empty-row">Aucun client trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding:24px; max-width:1200px; margin:0 auto; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
    h1 { font-size:24px; font-weight:700; color:#1a1a1a; margin:0; }
    .btn-add { background:#0d6efd; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:600; cursor:pointer; }
    .search-bar { margin-bottom:20px; }
    .search-bar input { width:100%; max-width:400px; padding:10px 16px; border:2px solid #e5e7eb; border-radius:8px; font-size:15px; outline:none; box-sizing:border-box; }
    .search-bar input:focus { border-color:#0d6efd; }
    .form-card { background:white; border-radius:12px; padding:24px; margin-bottom:24px; box-shadow:0 2px 12px rgba(0,0,0,0.08); border-top:3px solid #0d6efd; }
    .form-card h3 { margin:0 0 20px; color:#1a3a5c; }
    .form-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:20px; }
    .form-group label { display:block; font-size:13px; font-weight:600; margin-bottom:6px; color:#374151; }
    .form-group input, .form-group select { width:100%; padding:10px 12px; border:2px solid #e5e7eb; border-radius:6px; font-size:14px; outline:none; box-sizing:border-box; }
    .form-group input:focus, .form-group select:focus { border-color:#0d6efd; }
    .form-actions { display:flex; gap:12px; }
    .btn-save { background:#198754; color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; font-weight:600; }
    .btn-cancel { background:#6c757d; color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; }
    .table-card { background:white; border-radius:12px; padding:0; box-shadow:0 2px 12px rgba(0,0,0,0.08); overflow:hidden; }
    table { width:100%; border-collapse:collapse; }
    thead { background:#f8f9fa; }
    th { padding:14px 16px; text-align:left; font-size:13px; font-weight:600; color:#6c757d; text-transform:uppercase; }
    td { padding:14px 16px; border-top:1px solid #f1f3f4; font-size:14px; }
    .id-badge { background:#e9ecef; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:600; }
    .actions { display:flex; gap:8px; }
    .btn-view { background:#0d6efd; color:white; text-decoration:none; padding:5px 10px; border-radius:5px; font-size:12px; }
    .btn-edit { background:#ffc107; color:#000; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px; }
    .btn-delete { background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px; }
    .empty-row { text-align:center; color:#adb5bd; padding:40px !important; }
    tr:hover td { background:#fafafa; }
  `]
})
export class ClientsListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm = '';
  showForm = false;
  editingClient: Client | null = null;
  formData: Client = { nom: '', email: '', telephone: '' };

  constructor(private clientService: ClientService) {}

  ngOnInit(): void { this.loadClients(); }

  loadClients(): void {
    this.clientService.getAll().subscribe(data => {
      this.clients = data;
      this.filteredClients = data;
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(c =>
      c.nom.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)
    );
  }

  editClient(client: Client): void {
    this.editingClient = client;
    this.formData = { ...client };
    this.showForm = true;
  }

  saveClient(): void {
    if (!this.formData.nom || !this.formData.email) return;
    const op = this.editingClient
      ? this.clientService.update(this.editingClient.id!, this.formData)
      : this.clientService.create(this.formData);
    op.subscribe(() => { this.loadClients(); this.cancelForm(); });
  }

  deleteClient(id: number): void {
    if (confirm('Supprimer ce client ?')) {
      this.clientService.delete(id).subscribe(() => this.loadClients());
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingClient = null;
    this.formData = { nom: '', email: '', telephone: '' };
  }
}
