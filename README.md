# Jednoduchý návod na rýchle spustenie projektu

## Postupnosť príkazov

1. Klonovanie repozitára:
```bash
git clone git@github.com:Goreslav/iprobio2.git
cd iprobio2
```
2. env:
```bash
cp .env.template .env
```

3. Vytvorenie SSL certifikátov:
```bash
chmod +x generate-ssl-certs.sh
./generate-ssl-certs.sh
```

4. Príprava entrypoint skriptu:
```bash
chmod +x docker-entrypoint.sh
```

5. Spustenie Docker kontajnerov:
```bash
docker-compose build --no-cache backend
docker-compose up -d
```

7. Prístup k admin panelu:
   Otvorte http://localhost:9000/app a prihláste sa ako admin@example.com s heslom supersecret

## Riešenie základných problémov

### Chýbajúca databáza:
```bash
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE iprobioDb"
docker-compose restart backend
```

### Problémy s SSL certifikátmi:
```bash
chmod 600 ./ssl/server.key
chmod 644 ./ssl/server.crt
docker-compose restart postgres
```