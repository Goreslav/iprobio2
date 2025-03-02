# Iprobio2 - Dockerized Medusa.js E-commerce Project

Tento projekt obsahuje dockerizovanú verziu [Medusa.js](https://medusajs.com/) e-commerce platformy, pripravenú na rýchle nasadenie a používanie. Projekt využíva PostgreSQL pre databázu a Redis pre cache a session management.

## Požiadavky

Pre spustenie tohto projektu potrebujete:

- [Docker](https://www.docker.com/products/docker-desktop/) (verzia 20.10.0+)
- [Docker Compose](https://docs.docker.com/compose/install/) (verzia 2.0.0+)
- Git

## Inštalácia a spustenie

### 1. Klonovanie repozitára

```bash
git clone git@github.com:Goreslav/iprobio2.git
cd iprobio2
```

### 2. Generovanie SSL certifikátov

```bash
# Nastavenie práv na spustenie
chmod +x generate-ssl-certs.sh

# Generovanie SSL certifikátov
./generate-ssl-certs.sh
```

### 3. Spustenie aplikácie pomocou Docker Compose

```bash
# Zostavenie a spustenie kontajnerov
docker-compose up -d
```

### 4. Sledovanie logov (voliteľné)

```bash
docker-compose logs -f
```

### 5. Vytvorenie administrátorského účtu

Po úspešnom spustení všetkých kontajnerov vytvorte admin používateľa:

```bash
docker-compose exec backend npx medusa user -e admin@example.com -p supersecret
```

Prihlasovacie údaje (odporúčame zmeniť pri prvom prihlásení):
- Email: admin@example.com
- Heslo: supersecret

## Prístup k aplikácii

- **Medusa Admin Panel**: http://localhost:9000/app
- **Medusa API**: http://localhost:9000

## Štruktúra projektu

```
iprobio2/
├── .dockerignore          # Súbory ignorované pri zostavovaní Docker image
├── .env                   # Konfiguračné premenné prostredia
├── .gitignore             # Súbory ignorované Gitom
├── Dockerfile             # Definícia Docker image pre Medusa
├── docker-compose.yml     # Konfigurácia Docker služieb
├── docker-entrypoint.sh   # Entrypoint skript pre bezpečné spustenie aplikácie
├── generate-ssl-certs.sh  # Skript na generovanie SSL certifikátov
├── src/                   # Zdrojový kód Medusa aplikácie
│   ├── admin/             # Prispôsobenia admin rozhrania
│   ├── api/               # Vlastné API endpointy
│   ├── modules/           # Vlastné moduly
│   └── ...
└── medusa-config.ts       # Hlavný konfiguračný súbor Medusa
```

## Docker kontajnery

Projekt používa nasledujúce Docker kontajnery:

- **backend** (Medusa.js server)
- **postgres** (PostgreSQL databáza)
- **redis** (Redis server)

## Užitočné príkazy

```bash
# Reštartovanie aplikácie
docker-compose restart

# Zastavenie aplikácie
docker-compose down

# Zastavenie aplikácie a odstránenie všetkých dát (POZOR, vymaže databázu)
docker-compose down -v

# Zobrazenie logov konkrétneho kontajnera
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis

# Prístup do shellu kontajnera
docker-compose exec backend sh
docker-compose exec postgres sh
docker-compose exec redis sh
```

## Konfigurácia

Základné nastavenia sú v `.env` súbore. Pre produkčné nasadenie je potrebné zmeniť JWT_SECRET a COOKIE_SECRET na bezpečné hodnoty.

## Aktualizácia

Pre aktualizáciu projektu na najnovšiu verziu Medusa:

```bash
# Zastavenie kontajnerov
docker-compose down

# Aktualizácia repozitára
git pull

# Zostavenie nových kontajnerov
docker-compose build --no-cache

# Spustenie aktualizovaných kontajnerov
docker-compose up -d
```

## Riešenie problémov

### Problém s pripojením k databáze

Ak máte problém s pripojením k databáze:

```bash
# Skontrolujte logy
docker-compose logs -f postgres
docker-compose logs -f backend

# Reštartujte kontajnery
docker-compose restart
```

### Problém s migráciami

```bash
# Spustite migrácie manuálne
docker-compose exec backend npx medusa db:migrate
```

## Licencia

Tento projekt je licencovaný pod [MIT Licenciou](https://opensource.org/licenses/MIT).

## Podpora

Pre ďalšiu pomoc a informácie o Medusa.js navštívte:
- [Oficiálna dokumentácia Medusa](https://docs.medusajs.com/)
- [Medusa GitHub](https://github.com/medusajs/medusa)