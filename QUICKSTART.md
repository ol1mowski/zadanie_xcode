# ⚡ Quick Start Guide

## 🚀 Szybkie uruchomienie w 3 krokach

### Krok 1: Backend (Terminal 1)
```bash
cd server
mvn clean install
mvn spring-boot:run
```
✅ Backend działa na: **http://localhost:8080**

---

### Krok 2: Frontend (Terminal 2)
```bash
cd client
npm install
npm start
```
✅ Frontend działa na: **http://localhost:4200**

---

### Krok 3: Otwórz przeglądarkę
Przejdź do: **http://localhost:4200**

---

## 🧪 Uruchomienie testów

### Backend
```bash
cd server
mvn test
```

### Frontend
```bash
cd client
npm test
```

---

## 📚 Dokumentacja API
Po uruchomieniu backendu:
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **H2 Console:** http://localhost:8080/h2-console

---

## ✅ Sprawdzenie wymagań
```bash
java -version    # Java 17+
node -v          # Node 18+
npm -v           # npm 9+
mvn -v           # Maven 3.6+
```

---

## 🎯 Przykładowe użycie

### 1. Pobierz kurs EUR
**POST** `http://localhost:8080/currencies/get-current-currency-value-command`
```json
{
  "currency": "EUR",
  "name": "Jan Nowak"
}
```

### 2. Zobacz historię
**GET** `http://localhost:8080/currencies/requests`

---

## 🐛 Problemy?

### Port zajęty (8080)
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Port zajęty (4200)
```bash
npm start -- --port 4201
```

---

**Gotowe! Aplikacja działa! 🎉**

Pełna dokumentacja: [README.md](README.md)
