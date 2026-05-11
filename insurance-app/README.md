#  AssuranceMS — Application de Gestion des Contrats d'Assurance

> **Zakariae** — Projet JEE Spring Boot + Angular

---

##  Architecture Technique

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT ANGULAR 17                    │
│  Login │ Dashboard │ Clients │ Contrats │ Paiements     │
│              HTTP + JWT Bearer Token                    │
└─────────────────────────┬───────────────────────────────┘
                          │ REST API (JSON)
┌─────────────────────────▼───────────────────────────────┐
│               SPRING BOOT 3.2 (Port 8080)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Spring Security + JWT Filter                   │   │
│  └──────────────────────┬───────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │   REST Controllers (AuthController, ClientCtrl,  │   │
│  │    ContratController, PaiementController)        │   │
│  └──────────────────────┬───────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │   Service Layer (IClientService, IContratService,│   │
│  │    IPaiementService + implementations)           │   │
│  └──────────────────────┬───────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │   DAO Layer (Spring Data JPA + Hibernate)        │   │
│  │   Repositories: Client, Contrat, Paiement, User  │   │
│  └──────────────────────┬───────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │   H2 Database (in-memory) / MySQL (optional)     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

##  Lancer l'application

### Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
- API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console

### Frontend (Angular)
```bash
cd frontend
npm install
ng serve
```
- App: http://localhost:4200

---

##  Comptes de démonstration

| Utilisateur | Mot de passe | Rôle |
|---|---|---|
| admin | Admin123! | ROLE_ADMIN |
| employe | Employe123! | ROLE_EMPLOYE |
| client1 | Client123! | ROLE_CLIENT |

---

##  Autorisations par rôle

| Action | ROLE_CLIENT | ROLE_EMPLOYE | ROLE_ADMIN |
|---|---|---|---|
| Voir ses contrats | ✅ | ✅ | ✅ |
| Voir tous les clients | ❌ | ✅ | ✅ |
| Créer un contrat | ❌ | ✅ | ✅ |
| Valider / Résilier | ❌ | ✅ | ✅ |
| Supprimer | ❌ | ❌ | ✅ |

---

##  Structure du projet

```
insurance-app/
├── backend/                     # Spring Boot
│   └── src/main/java/com/zakariae/insurance/
│       ├── entities/            # JPA Entities (Contrat, Client, Paiement, AppUser...)
│       ├── entities/enums/      # StatutContrat, TypeLogement, NiveauCouverture...
│       ├── repositories/        # Spring Data JPA Repositories
│       ├── services/            # Service interfaces + implementations
│       ├── dtos/                # Data Transfer Objects
│       ├── controllers/         # REST Controllers
│       ├── security/jwt/        # JWT (JwtUtils, AuthTokenFilter)
│       └── config/              # SecurityConfig, OpenApiConfig, DataInitializer
└── frontend/                    # Angular 17
    └── src/app/
        ├── core/
        │   ├── models/          # TypeScript interfaces
        │   ├── services/        # AuthService, ClientService, ContratService
        │   ├── interceptors/    # JWT Interceptor
        │   └── guards/          # AuthGuard, AdminGuard
        └── features/
            ├── auth/            # Login, Register
            ├── dashboard/       # Dashboard avec statistiques
            ├── clients/         # CRUD clients
            ├── contrats/        # Gestion contrats (3 types)
            └── paiements/       # Gestion paiements
```

##  Diagramme de classes (entités)

```
Client
  - id: Long
  - nom: String
  - email: String
  - telephone: String
  - contrats: List<Contrat>

Contrat (abstract, SINGLE_TABLE)
  - id: Long
  - dateSouscription: LocalDate
  - statut: StatutContrat [EN_COURS, VALIDE, RESILIE]
  - dateValidation: LocalDate
  - montantCotisation: BigDecimal
  - dureeContrat: Integer
  - tauxCouverture: BigDecimal
  - client: Client
  - paiements: List<Paiement>

ContratAutomobile extends Contrat
  - numeroImmatriculation: String
  - marqueVehicule: String
  - modeleVehicule: String

ContratHabitation extends Contrat
  - typeLogement: TypeLogement [APPARTEMENT, MAISON, LOCAL_COMMERCIAL]
  - adresseLogement: String
  - superficie: BigDecimal

ContratSante extends Contrat
  - niveauCouverture: NiveauCouverture [BASIQUE, INTERMEDIAIRE, PREMIUM]
  - nbPersonnesCouvertes: Integer

Paiement
  - id: Long
  - date: LocalDate
  - montant: BigDecimal
  - type: TypePaiement [MENSUALITE, PAIEMENT_ANNUEL, PAIEMENT_EXCEPTIONNEL]
  - contrat: Contrat

AppUser
  - id: Long
  - username: String
  - password: String (BCrypt)
  - email: String
  - fullName: String
  - roles: List<AppRole>

AppRole
  - id: Long
  - roleName: String
```

##  Technologies utilisées

### Backend
- Java 17 + Spring Boot 3.2
- Spring Security 6 + JWT (jjwt 0.12.3)
- Spring Data JPA + Hibernate
- H2 Database (in-memory)
- SpringDoc OpenAPI 2.3 (Swagger)
- Lombok, Validation

### Frontend
- Angular 17 (Standalone Components)
- RxJS, HttpClient, RouterLink
- JWT Interceptor
- Reactive Forms
