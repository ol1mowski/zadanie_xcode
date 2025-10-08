# 💱 Currency Exchange Rate Application

> **Aplikacja do sprawdzania kursów walut z NBP API**  
> Java Spring Boot (Backend) + Angular (Frontend)

---

## 📋 Spis treści

- [Opis projektu](#-opis-projektu)
- [Technologie](#-technologie)
- [Wymagania](#-wymagania)
- [Instalacja i uruchomienie](#-instalacja-i-uruchomienie)
- [Endpointy API](#-endpointy-api)
- [Architektura](#-architektura)
- [Testy](#-testy)
- [Dokumentacja API](#-dokumentacja-api)
- [Screenshoty](#-screenshoty)

---

## 🎯 Opis projektu

Aplikacja umożliwia:
1. **Pobieranie aktualnych kursów walut** z API Narodowego Banku Polskiego (NBP)
2. **Zapisywanie historii zapytań** w bazie danych (kto, kiedy, jaka waluta, jaki wynik)
3. **Przeglądanie historii zapytań** z paginacją
4. **Intuicyjny interfejs webowy** do interakcji z API

### Funkcjonalności:
✅ REST API z walidacją danych wejściowych  
✅ Integracja z zewnętrznym API (NBP)  
✅ Baza danych H2 (in-memory)  
✅ Cachowanie wyników (Caffeine)  
✅ Paginacja i sortowanie  
✅ Globalna obsługa błędów  
✅ Dokumentacja API (Swagger/OpenAPI)  
✅ Testy jednostkowe i integracyjne (40+ testów)  
✅ Nowoczesny frontend (Angular 19, Standalone Components, Signals)  

---

## 🛠 Technologie

### Backend (Java Spring Boot)
- **Java 17**
- **Spring Boot 3.4.0**
- **Spring Web** - REST API
- **Spring Data JPA** - dostęp do bazy danych
- **Spring Security** - bezpieczeństwo aplikacji
- **H2 Database** - baza danych in-memory
- **Spring Cache + Caffeine** - cachowanie
- **Spring Validation** - walidacja danych
- **Springdoc OpenAPI** - dokumentacja API
- **JUnit 5 + Mockito** - testy
- **Maven** - zarządzanie zależnościami

### Frontend (Angular)
- **Angular 19**
- **TypeScript**
- **Standalone Components** - nowoczesna architektura
- **Signals API** - reaktywne zarządzanie stanem
- **RxJS** - programowanie reaktywne
- **Jasmine + Karma** - testy jednostkowe

---

## 📦 Wymagania

### Wymagane:
- **Java 17** lub nowszy - [Pobierz tutaj](https://www.oracle.com/java/technologies/downloads/)
- **Node.js 18+** i **npm** - [Pobierz tutaj](https://nodejs.org/)
- **Maven 3.6+** - [Pobierz tutaj](https://maven.apache.org/download.cgi)

### Opcjonalne (do testów):
- **Google Chrome** - do uruchomienia testów Angular

### Sprawdzenie wersji:
```bash
java -version    # Powinno pokazać Java 17+
node -v          # Powinno pokazać v18+
npm -v           # Powinno pokazać npm 9+
mvn -v           # Powinno pokazać Maven 3.6+
```

---

## 🚀 Instalacja i uruchomienie

### 1️⃣ Sklonuj repozytorium
```bash
git clone https://github.com/ol1mowski/zadanie_xcode.git
cd zadanie_xcode
```

### 2️⃣ Uruchom Backend (Spring Boot)

```bash
# Przejdź do katalogu backendu
cd server

# Zbuduj projekt (pobierze zależności)
./mvnw clean install

# Uruchom aplikację
./mvnw spring-boot:run
```

**Backend będzie dostępny pod adresem:** `http://localhost:8080`

**Konsola H2 Database:** `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:currencydb`
- Username: `sa`
- Password: *(puste)*

### 3️⃣ Uruchom Frontend (Angular)

**W nowym terminalu:**

```bash
# Przejdź do katalogu frontendu
cd client

# Zainstaluj zależności
npm install

# Uruchom aplikację
npm start
```

**Frontend będzie dostępny pod adresem:** `http://localhost:4200`

### 4️⃣ Otwórz aplikację w przeglądarce

Przejdź do: **http://localhost:4200**

---

## 📡 Endpointy API

### **1. Pobierz aktualny kurs waluty**

**POST** `/currencies/get-current-currency-value-command`

**Request Body:**
```json
{
  "currency": "EUR",
  "name": "Jan Nowak"
}
```

**Response (200 OK):**
```json
{
  "value": 4.2954
}
```

**Możliwe błędy:**
- `400 Bad Request` - nieprawidłowe dane (walidacja)
- `404 Not Found` - waluta nie istnieje
- `503 Service Unavailable` - API NBP niedostępne

---

### **2. Pobierz historię zapytań**

**GET** `/currencies/requests?page=0&size=20&sort=createdAt,desc`

**Response (200 OK):**
```json
{
  "content": [
    {
      "currency": "EUR",
      "name": "Jan Nowak",
      "date": "2024-01-01T10:00:00.000Z",
      "value": 4.2954
    }
  ],
  "totalElements": 42,
  "totalPages": 3,
  "size": 20,
  "number": 0,
  "first": true,
  "last": false
}
```

**Parametry zapytania:**
- `page` - numer strony (domyślnie: 0)
- `size` - liczba elementów na stronę (domyślnie: 20)
- `sort` - sortowanie (domyślnie: `createdAt,desc`)

---

## 🏗 Architektura

### Backend (Layered Architecture)

```
server/
├── src/main/java/com/taskxcode/task_xcode/
│   ├── controller/          # REST Controllers
│   │   └── CurrencyController.java
│   ├── service/             # Business Logic
│   │   ├── CurrencyService.java
│   │   └── NbpClient.java
│   ├── repository/          # Data Access
│   │   └── QueryLogRepository.java
│   ├── entity/              # JPA Entities
│   │   └── QueryLog.java
│   ├── dto/                 # Data Transfer Objects
│   │   ├── CurrencyRequest.java
│   │   ├── CurrencyResponse.java
│   │   ├── CurrencyQueryLogResponse.java
│   │   └── ErrorResponse.java
│   ├── mapper/              # DTO-Entity Mappers
│   │   └── CurrencyMapper.java
│   ├── exception/           # Custom Exceptions
│   │   ├── CurrencyNotFoundException.java
│   │   ├── ExternalApiException.java
│   │   └── GlobalExceptionHandler.java
│   └── config/              # Configuration
│       ├── AppConfig.java
│       └── OpenApiConfig.java
└── src/test/java/           # Tests
    └── com/taskxcode/task_xcode/
        ├── CurrencyControllerTest.java
        ├── service/
        │   ├── CurrencyServiceTest.java
        │   └── NbpClientTest.java
```

### Frontend (Component-Based Architecture)

```
client/src/app/
├── components/              # Prezentacyjne komponenty
│   ├── currency-form/       # Formularz wprowadzania danych
│   ├── currency-result/     # Wyświetlanie wyniku
│   ├── error-message/       # Komunikaty błędów
│   └── requests-table/      # Tabela z historią + paginacja
├── models/                  # TypeScript interfaces
│   └── currency.models.ts
├── api.service.ts           # HTTP Client
├── app.component.ts         # Smart/Container component
└── environments/            # Konfiguracja środowisk
    └── environment.ts
```

**Wzorce projektowe:**
- **Smart/Dumb Components** - separacja logiki biznesowej od prezentacji
- **Dependency Injection** - luźne powiązanie komponentów
- **Repository Pattern** - abstrakcja dostępu do danych
- **DTO Pattern** - separacja warstw
- **Global Exception Handler** - centralna obsługa błędów

---

## 🧪 Testy

### Backend - Testy Java

```bash
cd server

# Uruchom wszystkie testy
mvn test

# Uruchom testy z raportem coverage
mvn test jacoco:report
```

**Pokrycie testami:**
- ✅ `CurrencyControllerTest` - testy integracyjne REST API
- ✅ `CurrencyServiceTest` - testy jednostkowe logiki biznesowej
- ✅ `NbpClientTest` - testy klienta API NBP

**Przykładowe testy:**
- Pobieranie kursu waluty (sukces)
- Obsługa nieistniejącej waluty (404)
- Walidacja danych wejściowych (400)
- Paginacja historii zapytań
- Cachowanie wyników
- Obsługa błędów API NBP

---

### Frontend - Testy Angular

```bash
cd client

# Uruchom wszystkie testy
npm test

# Uruchom testy w trybie watch
npm test -- --watch

# Uruchom testy z coverage
npm test -- --code-coverage
```

**Pokrycie testami (40 testów):**
- ✅ `AppComponent` - 8 testów (smart component)
- ✅ `ApiService` - 6 testów (HTTP client)
- ✅ `CurrencyFormComponent` - 6 testów
- ✅ `CurrencyResultComponent` - 4 testy
- ✅ `ErrorMessageComponent` - 5 testów
- ✅ `RequestsTableComponent` - 13 testów

**Przykładowe testy:**
- Submit formularza i pobieranie kursu
- Obsługa błędów walidacji
- Paginacja tabeli
- Warunkowe wyświetlanie komponentów
- Emitowanie eventów
- Integracja z API

---

## 📚 Dokumentacja API

### Swagger UI (interaktywna dokumentacja)

Po uruchomieniu backendu, dokumentacja API jest dostępna pod adresem:

**http://localhost:8080/swagger-ui.html**

![Swagger UI](https://via.placeholder.com/800x400?text=Swagger+UI+Screenshot)

### Funkcje Swagger UI:
- 📖 Pełna dokumentacja wszystkich endpointów
- 🧪 Możliwość testowania API bezpośrednio z przeglądarki
- 📝 Opisy parametrów, request/response body
- ⚠️ Przykłady błędów i kodów HTTP

### OpenAPI JSON:
**http://localhost:8080/api-docs**

---

## 🎨 Screenshoty

### Główny interfejs aplikacji
![Main Interface](https://via.placeholder.com/800x500?text=Currency+Exchange+App+Interface)

**Funkcje:**
- Formularz wprowadzania kodu waluty i nazwy użytkownika
- Wyświetlanie aktualnego kursu
- Komunikaty błędów z walidacją
- Tabela historii zapytań z paginacją

---

## 🔒 Bezpieczeństwo

### Zaimplementowane zabezpieczenia:

✅ **Spring Security**
- Konfiguracja SecurityFilterChain
- Stateless session management (REST API)
- CSRF protection (wyłączone dla REST API)
- CORS policy (globalna konfiguracja)
- Publiczne endpointy bez autentykacji
- Gotowość do dodania JWT/OAuth2

✅ **Walidacja danych wejściowych**
- `@Valid` + Bean Validation (JSR-380)
- Regex dla kodu waluty (3 litery)
- Ograniczenia długości pól

✅ **Obsługa błędów**
- Globalna obsługa wyjątków
- Sanityzacja komunikatów błędów
- Brak wycieku informacji o systemie

✅ **Timeouty HTTP**
- Connection timeout: 5s
- Read timeout: 5s
- Zabezpieczenie przed zawieszeniem

✅ **Cachowanie**
- Ograniczenie liczby zapytań do API NBP
- TTL: 5 minut
- Max size: 100 wpisów

✅ **CORS**
- Skonfigurowane dla `http://localhost:4200`
- Dozwolone metody: GET, POST, PUT, DELETE, OPTIONS
- Credentials support
- Preflight caching (1h)

---

## ⚙️ Konfiguracja

### Backend - `application.properties`

```properties
# Database H2
spring.datasource.url=jdbc:h2:mem:currencydb
spring.h2.console.enabled=true

# NBP API
nbp.api.url=http://api.nbp.pl/api/exchangerates/tables/A?format=json
nbp.api.connect-timeout=5000
nbp.api.read-timeout=5000

# Cache
spring.cache.caffeine.spec=maximumSize=100,expireAfterWrite=5m

# Swagger
springdoc.swagger-ui.path=/swagger-ui.html
```

### Frontend - `environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

---

## 🐛 Rozwiązywanie problemów

### Backend nie startuje

**Problem:** `Port 8080 is already in use`
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

**Problem:** `Java version mismatch`
```bash
# Sprawdź wersję Java
java -version

# Upewnij się, że używasz Java 17+
```

---

### Frontend nie startuje

**Problem:** `Port 4200 is already in use`
```bash
# Zmień port w angular.json lub:
npm start -- --port 4201
```

**Problem:** `npm install fails`
```bash
# Wyczyść cache npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### Testy nie działają

**Problem:** `Cannot find Chrome binary`
```bash
# Zainstaluj Google Chrome lub użyj Firefox:
npm test -- --browsers=Firefox
```

---

## 📊 Najlepsze praktyki

### Backend:
✅ Layered Architecture (Controller → Service → Repository)  
✅ DTO Pattern (separacja warstw)  
✅ Global Exception Handler  
✅ Input Validation (Bean Validation)  
✅ BigDecimal dla wartości monetarnych  
✅ Transakcje (@Transactional)  
✅ Cachowanie (Spring Cache)  
✅ Paginacja (Spring Data)  
✅ Logging (SLF4J)  
✅ Testable Code (Clock injection)  

### Frontend:
✅ Smart/Dumb Components Pattern  
✅ Standalone Components (Angular 19)  
✅ Signals API (reaktywność)  
✅ Type Safety (TypeScript interfaces)  
✅ Environment Variables  
✅ Error Handling  
✅ Form Validation  
✅ Pagination  
✅ Responsive Design  
✅ Component Testing  

---

## 📝 Notatki dla rekrutera

### Dlaczego ten projekt pokazuje dobre praktyki:

1. **Architektura** - Czysta separacja warstw, SOLID principles
2. **Bezpieczeństwo** - Walidacja, obsługa błędów, timeouty
3. **Wydajność** - Cachowanie, paginacja, indeksy DB
4. **Testowalność** - 40+ testów, mocki, izolacja
5. **Dokumentacja** - Swagger, README, komentarze
6. **Nowoczesność** - Angular 19, Spring Boot 3.4, Java 17
7. **Production-ready** - Error handling, logging, configuration

### Możliwe rozszerzenia:

- 🔐 JWT Authentication (Spring Security + JWT tokens)
- 👥 Role-based Access Control (RBAC)
- 💾 Baza danych produkcyjna (PostgreSQL, MySQL)
- 🐳 Dockeryzacja (Docker Compose)
- 🚀 CI/CD (GitHub Actions, Jenkins)
- 📊 Monitoring (Actuator, Prometheus, Grafana)
- 🌍 Internationalization (i18n)
- 📱 Progressive Web App (PWA)
- 🔄 Rate Limiting (Bucket4j)
- 📧 Email notifications

---

## 👨‍💻 Autor

**Projekt wykonany jako zadanie rekrutacyjne**

---

## 📄 Licencja

Ten projekt został stworzony wyłącznie do celów rekrutacyjnych.

---

## 🙏 Podziękowania

- **NBP API** - za udostępnienie danych o kursach walut
- **Spring Boot** - za doskonały framework
- **Angular** - za nowoczesne narzędzia frontendowe

---

**Dziękuję za poświęcony czas na przejrzenie projektu!** 🚀

Jeśli masz pytania lub uwagi, jestem otwarty na kontakt.