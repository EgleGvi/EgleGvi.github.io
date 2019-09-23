# EgleGvi.github.io

## NFQ Akademija, Ruduo 2019 - Stojimo užduotis, Frontend, Eglė Gvildytė

Ligoninėse, bankuose, pašte, pasų išdavimo skyriuose ir pan. galima matyti ekranus su skaičiukais. Ateini, gauni lapuką pas pasirinktą specialistą/darbuotoją/langelį ir lauki savo eilės.

Ar kada pagalvojote, kaip būtų faina, jei žinotumėte kiek maždaug dar reikia laukti eilėje ir atitinkamai susiplanuoti savo darbus.

## Reikalavimai paleidimui

* Web serveris, failams pateikti

## Naudojimasis

### Administravimo skiltis

Čia galima įkelti pradinius duomenis, reikalingus paslaugos veikimui. Pavyzdinis failas `example_data.json`. Iš duomenų failo užkraunami galimi specialistai ir eilės pas juos.

Čia taip pat galima užregistruoti ir naujus įrašus į eiles. Specialistų sąrašą pakeisti įmanoma tik rankomis keičiant duomenų failą.

Joks duomenų keitimas sistemoje niekaip nepakeičia duomenų failo.

### Specialistų skiltis

Pasirinkus specialistą iš sąrašo, atvaizduojama pas jį apsilankyti laukiančiųjų eilė. Pirmasis laukiantysis išskirtas kitokia spalva. Čia taip pat galima pažymėti, kad apsilankymas baigtas. Eilė automatiškai atsinaujina specialisto lange ir švieslentėje.

### Švieslentė

Švieslentėje atvaizduojami visi specialistai, bei pas juos laukiančiųjų eilės. Vaizdas atnaujinamas automatiškai kas 5 sekundes.

### Klientų skiltis

Pasirinkus specialistą bei įvedus savo eilės numerį, pamatomas rezultatas. Galimi 4 variantai:
* Kliento eilė jau praėjo (numeris jau aptarnautas)
* Kliento eilėje nėra (toks numeris pas specialistą neužregistruotas)
* Šiuo metu yra kliento eilė
* Klientas yra X-asis eilėje. Jo laukimo laikas Y. (Jeigu įmanoma suskaičiuoti iš turimų duomenų)


