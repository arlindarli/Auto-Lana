# Auto Lana — Frontend për Qera Makinash

Frontend React + Vite + Tailwind, ndërtuar për t'u lidhur me backend-in Spring Boot
që punon në `http://localhost:8080`.

## Si të nisësh

```bash
npm install
npm run dev
```

Aplikacioni hapet te `http://localhost:5173`.

## Konfigurimi i API-t

Baza e API-t është e centralizuar në një vend të vetëm:

```
src/api/api.js
```

```js
export const API_BASE_URL = "http://localhost:8080";
```

Kur backend-i të shkojë online (p.sh. në një domain tjetër), ndrysho vetëm këtë
vlerë — s'ka nevojë të prekësh asnjë komponent tjetër.

## Backend — CORS

Që browser-i të mos bllokojë kërkesat React → Spring Boot, në `SecurityConfig` të
backend-it duhet të lejohet origjina:

```
http://localhost:5173
```

## Struktura

```
src
├── api
│   └── api.js          → API_BASE_URL + të gjitha thirrjet fetch
├── components
│   ├── Navbar.jsx
│   ├── CarCard.jsx
│   └── BookingForm.jsx
├── pages
│   ├── HomePage.jsx
│   ├── CarsPage.jsx
│   ├── CarDetailPage.jsx
│   └── AdminPage.jsx    → CRUD makinash + pamje rezervimesh
├── App.jsx
└── main.jsx
```

## Endpoint-et e përdorura

```
GET    /api/cars
GET    /api/cars/{id}
POST   /api/cars
PUT    /api/cars/{id}
DELETE /api/cars/{id}

GET    /api/bookings
POST   /api/bookings/car/{carId}
GET    /api/bookings/car/{carId}
GET    /api/bookings/car/{carId}/availability?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

Fushat e `Booking` (POST):

```json
{
  "customerName": "Arlind",
  "customerPhone": "+355...",
  "customerEmail": "test@example.com",
  "startDate": "2026-08-25",
  "endDate": "2026-08-28"
}
```

Fushat e `Car`:

```json
{
  "brand": "Audi",
  "model": "A8",
  "year": 2018,
  "category": "Luxury",
  "dailyPrice": 2000,
  "description": "Audi A8 2018",
  "imageUrl": "/images/audi-a8.jpg",
  "active": true
}
```

Datat gjithmonë në formatin `YYYY-MM-DD` (backend-i përdor `LocalDate`).

## Shënim mbi AdminPage

Momentalisht `/admin` është i hapur pa autentikim — vetëm për zhvillim. Para se ta
vësh online, shto login/role-check (p.sh. me JWT nga backend-i), përndryshe kushdo
mund të fshijë/shtojë makina.

## Përgjigja e /availability

`BookingForm.jsx` përballon disa forma të mundshme përgjigjeje nga backend-i
(boolean true/false, objekt { available: boolean }, ose listë datash të zëna).
Nëse forma reale e përgjigjes suaj është ndryshe, rregullo funksionin
`isAvailableResponse` te `src/components/BookingForm.jsx`.
