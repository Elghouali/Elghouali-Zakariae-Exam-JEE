# Elghouali-Zakariae-Exam-JEE

Examen de Rattrapage -- Architecture Distribuee JEE  
**ENSET Mohammedia · Session 2025-2026**  
Etudiant : **EL GHOUALI Zakariae** · `zakariaelgouali@gmail.com`

---

## Présentation

Application backend REST de **gestion de crédits bancaires** développée avec Spring Boot 3.  
Elle couvre la gestion des clients, de trois types de crédits (personnel, immobilier, professionnel) et de leurs remboursements, le tout sécurisé par JWT signé avec une paire de clés RSA.

---

## Stack technique

| Technologie | Rôle |
|---|---|
| Java 21 | Langage principal |
| Spring Boot 3.5.x | Framework applicatif |
| Spring Data JPA | ORM / persistance |
| H2 Database | Base de données en mémoire (dev) |
| Spring Security | Authentification & autorisation |
| OAuth2 Resource Server + Nimbus JOSE | Génération et validation JWT (RSA 2048) |
| Lombok | Réduction du boilerplate |
| SpringDoc OpenAPI 2.5 | Documentation Swagger UI |
| Maven | Build et gestion des dépendances |

---

## Architecture

```
Sécurité (Spring Security + JWT/RSA)
         ↓
Couche Web        — REST Controllers  (/auth, /api)
         ↓
Couche Service    — Logique métier (CreditService)
         ↓
Couche Repository — Spring Data JPA
         ↓
Base de données   — H2 in-memory
```

### Structure des packages

```
ma.enset.elghouali.zakariae.exam_jee/
├── ExamJeeApplication.java          # Point d'entrée + données de test
├── entities/
│   ├── Client.java
│   ├── Credit.java                  # Classe mère (SINGLE_TABLE)
│   ├── CreditPersonnel.java
│   ├── CreditImmobilier.java
│   ├── CreditProfessionnel.java
│   └── Remboursement.java
├── enums/
│   ├── StatutCredit.java            # EN_COURS | ACCEPTE | REJETE
│   ├── TypeBien.java                # APPARTEMENT | MAISON | LOCAL_COMMERCIAL
│   └── TypeRemboursement.java       # MENSUALITE | REMBOURSEMENT_ANTICIPE
├── repositories/
│   ├── ClientRepository.java
│   ├── CreditRepository.java
│   └── RemboursementRepository.java
├── dtos/
│   ├── ClientDTO.java
│   ├── CreditDTO.java
│   └── RemboursementDTO.java
├── mappers/
│   └── ExamMapper.java
├── services/
│   ├── CreditService.java
│   └── CreditServiceImpl.java
├── web/
│   ├── CreditRestController.java
│   └── AuthController.java
└── security/
    ├── SecurityConfig.java
    ├── RsaKeysConfig.java
    └── PasswordEncoderConfig.java
```

---

## Modèle de données

```
Client (1) ──── (*) Credit ──── (*) Remboursement
                    ▲
          ┌─────────┼──────────┐
   CreditPersonnel  CreditImmobilier  CreditProfessionnel
   (motif)          (typeBien)        (motif, raisonSociale)
```

**Stratégie JPA** : `SINGLE_TABLE` — tous les types de crédits partagent une seule table avec la colonne discriminante `TYPE_CREDIT`.

---

## API REST

| Méthode | URL | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Non | Obtenir un JWT (username + password en paramètres) |
| `GET` | `/api/clients` | JWT | Liste de tous les clients |
| `GET` | `/api/clients/{id}/credits` | JWT | Crédits d'un client |
| `GET` | `/api/credits/{id}` | JWT | Détail d'un crédit |
| `POST` | `/api/remboursements` | JWT | Enregistrer un remboursement |

### Exemple — Authentification

```bash
curl -X POST "http://localhost:8080/auth/login?username=admin&password=1234"
```

Réponse :

```json
{ "access-token": "<JWT>" }
```

### Exemple — Appel sécurisé

```bash
curl -H "Authorization: Bearer <JWT>" http://localhost:8080/api/clients
```

---

## Sécurité

- **Authentification** : `POST /auth/login` retourne un JWT signé RSA 2048, valide 30 minutes.
- **Autorisation** : tous les endpoints `/api/**` exigent un Bearer token valide.
- **Session** : stateless (`STATELESS` session policy).
- **Clés RSA** : générées et placées dans `src/main/resources/certs/`.

### Utilisateurs en mémoire

| Utilisateur | Mot de passe | Rôle(s) |
|---|---|---|
| `client1` | `1234` | `ROLE_CLIENT` |
| `employe1` | `1234` | `ROLE_EMPLOYE` |
| `admin` | `1234` | `ROLE_ADMIN`, `ROLE_EMPLOYE` |

---

## Prérequis et lancement

**Prérequis** : Java 21+ · Maven 3.9+

### 1. Générer les clés RSA (une seule fois)

```bash
mkdir -p src/main/resources/certs

openssl genrsa -out src/main/resources/certs/private.pem 2048

openssl rsa -in src/main/resources/certs/private.pem \
            -pubout -out src/main/resources/certs/public.pem
```

### 2. Lancer l'application

```bash
./mvnw spring-boot:run
```

L'application démarre sur `http://localhost:8080`.

---

## Configuration

Fichier : `src/main/resources/application.properties`

```properties
spring.application.name=exam-jee

spring.datasource.url=jdbc:h2:mem:creditdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

rsa.private-key=classpath:certs/private.pem
rsa.public-key=classpath:certs/public.pem
```

---

## Documentation API

Swagger UI disponible après démarrage :

- Interface graphique : `http://localhost:8080/swagger-ui.html`
- Spec OpenAPI JSON : `http://localhost:8080/v3/api-docs`
- Console H2 : `http://localhost:8080/h2-console` (JDBC URL : `jdbc:h2:mem:creditdb`, user : `sa`, password : vide)

---

## Données de test

Au démarrage, l'application insère automatiquement :

| Entité | Données |
|---|---|
| Clients | Hassan (hassan@gmail.com), Amina (amina@gmail.com) |
| CreditPersonnel | Hassan — 50 000 DH · 48 mois · 4.5% · ACCEPTE · motif "Achat Voiture" |
| CreditImmobilier | Amina — 1 200 000 DH · 240 mois · 4.2% · EN_COURS · type APPARTEMENT |
| Remboursements | 2 mensualités de 1 200 DH liées au crédit personnel |

---

## Rapport technique

Un rapport LaTeX complet est disponible à la racine du projet : [`rapport.tex`](rapport.tex)

Il couvre le modèle de données, l'architecture, la sécurité, l'API REST et l'analyse qualité du projet.
