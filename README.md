# 💅 Salonų Valdymo Sistema

Tai yra pilna grožio salonų valdymo sistema, sukurta naudojant React.js frontend'ą ir Node.js backend'ą. Sistema leidžia valdyti salonus, vartotojus ir rezervacijas su autentifikacijos funkcijomis.

## 🌟 Funkcijos

### 👤 Vartotojų valdymas
- **Registracija ir prisijungimas** - saugus autentifikavimas su JWT tokenais
- **Administratoriaus teisės** - specialūs administratoriaus veiksmai
- **Vartotojų sąrašas** - administratoriai gali peržiūrėti visus vartotojus

### 🏢 Salonų valdymas (tik administratoriams)
- **CRUD operacijos** - kurti, skaityti, atnaujinti, trinti salonus
- **Kategorijos** - skirtingos salonų kategorijos (Grožio salonas, Kirpykla, SPA, Nagų studija, Masažo studija)
- **Reitingų sistema** - 1-5 balų vertinimo sistema
- **Paieška ir rūšiavimas** - lengvas salonų paieška ir rūšiavimas
- **Puslapių skaidymas** - efektyvus didelių duomenų atvaizdavimas
- **Statistika** - salonų statistikos peržiūra

### 📅 Rezervacijų sistema
- **Laiko intervalų rezervacija** - vartotojai gali rezervuoti laiką salonuose
- **Prisijungimo reikalavimas** - tik prisijungę vartotojai gali daryti rezervacijas
- **Mano rezervacijos** - vartotojai gali peržiūrėti ir atšaukti savo rezervacijas
- **Administratoriaus peržiūra** - administratoriai gali matyti visas rezervacijas

## 🛠️ Technologijos

### Backend
- **Node.js** - serverio aplinka
- **Express.js** - web framework'as
- **MySQL** - duomenų bazė
- **JWT** - autentifikavimas
- **bcrypt** - slaptažodžių šifravimas
- **CORS** - cross-origin užklausų palaikymas

### Frontend
- **React.js** - vartotojo sąsaja
- **Vite** - build įrankis
- **Tailwind CSS** - stilių framework'as
- **Axios** - HTTP užklausų biblioteka
- **React Router** - navigacijos valdymas

## 📋 Reikalavimai

- **Node.js** (v16 arba naujesnė versija)
- **npm** arba **yarn**
- **MySQL** duomenų bazė

## 🚀 Diegimo instrukcijos

### 1. Projekto kloniranje
```bash
git clone <repository-url>
cd Salonai
```

### 2. Backend'o nustatymai

```bash
# Pereiti į Backend katalogą
cd Back

# Įdiegti priklausomybes
npm install

# Sukurti .env failą su šiais nustatymais:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=salonai_db
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### 3. Duomenų bazės nustatymai

1. Sukurkite MySQL duomenų bazę:
```sql
CREATE DATABASE salonai_db;
```

2. Paleiskite serverį - lentelės bus sukurtos automatiškai:
```bash
npm start
```

### 4. Administratoriaus sukūrimas

```bash
# Sukurti administratoriaus paskyrą
node create_admin.mjs
```

### 5. Frontend'o nustatymai

```bash
# Naujame terminale pereiti į Frontend katalogą
cd Front

# Įdiegti priklausomybes
npm install

# Paleisti development serverį
npm run dev
```

## 🎯 Naudojimas

### Prisijungimas prie sistemos

1. **Atidarykite naršyklę** ir eikite į `http://localhost:5173`
2. **Registruokitės** naują paskyrą arba **prisijunkite** su esamomis prisijungimo duomenimis
3. **Administratoriams** bus prieinamos papildomos funkcijos

### Administratoriaus funkcijos

#### Salonų valdymas
- Eikite į **Admin Panel → Salonai**
- **Pridėti saloną**: spauskite "➕ Pridėti saloną"
- **Redaguoti**: spauskite "✏️ Redaguoti" prie salono
- **Ištrinti**: spauskite "🗑️ Ištrinti" prie salono
- **Ieškoti**: naudokite paieškos lauką viršuje
- **Rūšiuoti**: spauskite ant stulpelių antraščių

#### Vartotojų valdymas
- Eikite į **Admin Panel → Vartotojai**
- Peržiūrėkite visų vartotojų sąrašą
- Matysite vartotojų roles ir registracijos datas

### Vartotojų funkcijos

#### Rezervacijų kūrimas
1. **Pagrindiniame puslapyje** pasirinkite saloną
2. **Spauskite "Rezervuoti laiką"**
3. **Pasirinkite datą ir laiką**
4. **Patvirtinkite rezervaciją**

#### Mano rezervacijos
- Eikite į **Mano rezervacijos**
- Peržiūrėkite visas savo rezervacijas
- **Atšaukite** rezervacijas jei reikia

## 📁 Projekto struktūra

```
Salonai/
├── Back/                          # Backend serveris
│   ├── controllers/              # Kontroleriai
│   │   ├── authController.mjs    # Autentifikavimo logika
│   │   ├── salonController.mjs   # Salonų CRUD operacijos
│   │   ├── userController.mjs    # Vartotojų valdymas
│   │   └── reservationController.mjs # Rezervacijų valdymas
│   ├── DB_config/                # Duomenų bazės konfigūracija
│   │   ├── db.mjs               # DB prisijungimas
│   │   ├── user_table.mjs       # Vartotojų lentelė
│   │   ├── salonai.mjs          # Salonų lentelė
│   │   └── reservations.mjs     # Rezervacijų lentelė
│   ├── middleware/               # Middleware funkcijos
│   │   └── authMiddleware.mjs   # Autentifikavimo middleware
│   ├── models/                   # Duomenų modeliai
│   ├── routers/                  # Maršrutų apibrėžimai
│   │   ├── authRoutes.mjs       # Auth maršrutai
│   │   ├── userRoutes.mjs       # Vartotojų maršrutai
│   │   └── salonRoutes.mjs      # Salonų maršrutai
│   ├── validators/               # Duomenų validatoriai
│   ├── server.mjs               # Pagrindinis serverio failas
│   ├── create_admin.mjs         # Admin kūrimo skriptas
│   └── package.json             # Backend priklausomybės
├── Front/                        # Frontend aplikacija
│   ├── src/
│   │   ├── components/          # React komponentai
│   │   │   └── ReservationModal.jsx # Rezervacijos modalas
│   │   ├── context/             # React Context
│   │   │   └── AuthContext.jsx  # Autentifikavimo kontekstas
│   │   ├── pages/               # Puslapiai
│   │   │   ├── Home.jsx         # Pagrindinis puslapis
│   │   │   ├── LoginPage.jsx    # Prisijungimo puslapis
│   │   │   ├── RegisterPage.jsx # Registracijos puslapis
│   │   │   ├── AdminPanel.jsx   # Admin skydelis
│   │   │   ├── MyReservationsPage.jsx # Vartotojo rezervacijos
│   │   │   └── admin/
│   │   │       ├── SalonPage.jsx     # Salonų valdymas
│   │   │       └── UsersPage.jsx     # Vartotojų valdymas
│   │   ├── services/            # API paslaugos
│   │   ├── App.jsx              # Pagrindinis App komponentas
│   │   └── main.jsx             # React aplikacijos entry point
│   ├── index.html               # HTML šablonas
│   ├── vite.config.js           # Vite konfigūracija
│   ├── tailwind.config.js       # Tailwind CSS konfigūracija
│   └── package.json             # Frontend priklausomybės
└── README.md                     # Šis failas
```

## 🔐 Saugumas

- **JWT tokenai** - saugus autentifikavimas
- **Slaptažodžių šifravimas** - bcrypt biblioteka
- **Middleware autorizacija** - prieigos kontrolė
- **CORS konfigūracija** - saugūs cross-origin užklausos

## 🗄️ Duomenų bazės schema

### users lentelė
- `id` - unikalus identifikatorius
- `username` - vartotojo vardas
- `email` - elektroninio pašto adresas
- `password` - šifruotas slaptažodis
- `role` - vartotojo rolė (user/admin)
- `created_at` - sukūrimo data

### salonai lentelė
- `id` - unikalus identifikatorius
- `salon` - salono pavadinimas
- `category` - salono kategorija
- `inversion` - salono reitingas (1-5)
- `created_at` - sukūrimo data

### reservations lentelė
- `id` - unikalus identifikatorius
- `user_id` - vartotojo ID
- `salon_id` - salono ID
- `reservation_date` - rezervacijos data
- `reservation_time` - rezervacijos laikas
- `status` - rezervacijos būsena
- `created_at` - sukūrimo data

## 🚨 Dažnos problemos ir sprendimai

### Backend negali prisijungti prie duomenų bazės
- Patikrinkite `.env` failo nustatymus
- Įsitikinkite kad MySQL serveris paleistas
- Patikrinkite duomenų bazės pavadinimą ir kredencialus

### Frontend negali pasiekti backend'o
- Patikrinkite ar backend serveris veikia ant port 3000
- Patikrinkite CORS nustatymus `server.mjs` faile

### JWT token klaidos
- Patikrinkite ar `JWT_SECRET` nustatytas `.env` faile
- Pabandykite atsijungti ir vėl prisijungti

## 🤝 Indėlis į projektą

1. **Fork'inti** projektą
2. **Sukurti** naują feature branch'ą
3. **Commit'inti** pakeitimus
4. **Push'inti** į branch'ą
5. **Sukurti** Pull Request

## 📄 Licencija

Šis projektas yra skirtas edukaciniams tikslams.

---

**Sėkmingos salonų valdymo!** 💅✨
