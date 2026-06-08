# 📖 Guida al sito — come modificarlo e pubblicarlo

Questa guida è pensata per chi **non sa nulla di programmazione**.
Leggila con calma: ogni cosa è spiegata passo per passo.

---

## 1. Come è fatto il sito (in 1 minuto)

Il sito è una cartella con dentro alcuni file. Ognuno ha un compito preciso:

```
Sito Fulvio/
│
├── index.html          ←  ⭐ I TESTI DEL SITO. Qui modifichi quasi tutto.
│
├── assets/             ←  Materiali del sito
│   ├── photo.jpg       ←  La tua foto (mettila tu qui)
│   ├── cv.pdf          ←  Il tuo CV in PDF (mettilo tu qui)
│   ├── css/
│   │   └── style.css   ←  L'aspetto grafico (colori, font). Raramente da toccare.
│   └── js/
│       └── site.js     ←  I meccanismi e i NUMERI dei grafici. Parte avanzata.
│
├── GUIDA.md            ←  Questo file
└── README.md           ←  Riepilogo breve
```

**Regola d'oro:** per cambiare i testi ti basta `index.html`.
Gli altri file servono al "motore" del sito: lasciali stare finché non ti serve davvero.

> 💡 **Sì, GitHub gestisce più file senza problemi.** Anzi, tenere i file separati
> (testi / grafica / logica) è proprio ciò che rende il sito ordinato e facile da
> aggiornare. Caricherai l'intera cartella, non un singolo file.

---

## 2. Con cosa apro e modifico i file?

I file `.html` sono file di **testo**. Per modificarli ti serve un editor di testo.
Consigliato (gratis): **Visual Studio Code** → https://code.visualstudio.com

- Apri VS Code → menu **File ▸ Apri cartella…** → scegli la cartella `Sito Fulvio`.
- A sinistra vedrai tutti i file. Clicca su `index.html` per modificarlo.

> ⚠️ Non usare Word per modificare i file `.html`: rovinerebbe il contenuto.

Per **vedere il risultato** mentre lavori: fai doppio clic su `index.html`
e si aprirà nel browser (Chrome, Edge, Safari…). Dopo ogni modifica salvata,
ricarica la pagina nel browser (tasto F5) per vedere i cambiamenti.

---

## 3. Le regole base per modificare i testi

In `index.html` il testo vero è quello **tra i simboli `>` e `<`**. Esempio:

```html
<p class="project-title">Spatial Heterogeneity in Monetary Policy</p>
```

Qui puoi cambiare solo la parte centrale:

```html
<p class="project-title">Il mio nuovo titolo</p>
```

✅ **Cosa puoi fare:** cambiare il testo tra `>` e `<`.
🚫 **Cosa NON toccare:** le "etichette" tra parentesi angolari, come
`<p class="...">` e `</p>`. Servono al sito per capire come mostrare il testo.

Ogni sezione del file inizia con un **riquadro-commento in italiano** così:

```html
<!-- ════════════════════════════════════
     PAGINA: PROJECTS
     Per aggiungere un progetto, copia ...
     ════════════════════════════════════ -->
```

I commenti (tutto ciò che sta tra `<!--` e `-->`) **non compaiono sul sito**:
sono solo note per te. Leggili: ti dicono cosa fare in ogni sezione.

---

## 4. Esempi pratici (i casi più comuni)

### ✏️ Cambiare la bio in home
Cerca la sezione `PAGINA: HOME` e modifica il testo dentro i `<p>` di `home-bio`.

### ➕ Aggiungere un progetto
1. Vai alla sezione `PAGINA: PROJECTS`.
2. **Copia** un intero blocco da `<div class="project-card">` fino al suo `</div>`.
3. **Incollalo** sotto e cambia titolo e testo.

### ➕ Aggiungere una pubblicazione
Sezione `PAGINA: RESEARCH`, scheda Publications. Copia un blocco
`<div class="pub-item"> ... </div>` e modificalo:
- l'etichetta colorata in alto si sceglie cambiando la classe: `pub-status wp`
  (working paper, grigio), `pub-status rr` (revise & resubmit, arancio) o
  `pub-status published` (pubblicato, blu);
- metti il tuo nome tra `<strong>...</strong>` negli autori;
- nei link (`pub-link`) lascia solo quelli che hai (PDF, DOI, Code, Slides) e
  sostituisci `href="#"` con l'indirizzo vero.

### ➕ Aggiungere una notizia (sezione "Recent" in About)
Sezione `PAGINA: ABOUT`. Copia un blocco `<div class="news-item"> ... </div>`
e mettilo **in cima** (i più recenti vanno per primi). Cambia data e testo.

### 🏷️ Cambiare i campi di ricerca in home
Sezione `PAGINA: HOME`, blocco `home-fields`: copia/togli le targhette
`<span class="home-field">...</span>`.


### ➕ Aggiungere un libro all'archivio "Beyond academia"
Sezione `PAGINA: BOOKS`. Copia un blocco `<div class="gen-item"> ... </div>`.
Il colore dell'etichetta si sceglie con una di queste classi:
`tag-essay`, `tag-novel`, `tag-history`, `tag-science`, `tag-bio`.

### 🖼️ Mettere la tua foto
Salva la foto come `photo.jpg` dentro la cartella `assets`.
(Se non c'è, il sito mostra un riquadro segnaposto: nessun errore.)

### 📄 Mettere il CV
Salva il PDF come `cv.pdf` dentro la cartella `assets`.

### 📧 Cambiare l'email
Cerca `fulvio.raddi@econ.ubbcluj.ro` (compare in più punti: header, contatti,
footer) e sostituiscila ovunque con la nuova.

### 🔗 Aggiornare i link social e il footer
Gli indirizzi di Scholar, GitHub e LinkedIn sono `href="https://..."` sia nella
home sia nel footer (sezione `FOOTER` in fondo a `index.html`). Nel footer puoi
anche aggiornare la riga "Last updated".

### 🔢 Cambiare i numeri delle "schede statistiche" (KPI)
In alcune pagine (es. **Giving Back** e **Italy**) ci sono dei riquadri con un
numero grande in evidenza: sono le **stat card**. Per modificarle cerca
`stat-grid` e cambia il testo dentro:
- `<span class="stat-value">31.6%</span>` → il **numero grande**
  (aggiungi la classe `warm` per colorarlo di arancio: `stat-value warm`);
- `<span class="stat-label">...</span>` → l'**etichetta** sotto il numero;
- `<span class="stat-note">...</span>` → la **nota** descrittiva.
Per aggiungere o togliere una scheda, copia/elimina un blocco
`<div class="stat-card"> ... </div>`.

### ⭐ Cambiare le voci "Selected research" in home
Nella home, sotto i pulsanti, c'è un piccolo elenco `home-selected` con 2 voci
in evidenza che rimandano alla pagina Research. Per modificarle cerca
`home-selected` e cambia i testi dentro `home-sel-title` (titolo) e
`home-sel-meta` (sottotitolo). Copia un blocco `<a class="home-sel-item">...</a>`
per aggiungerne altre.

### 🌗 Il tema chiaro/scuro
In alto, accanto all'email, c'è un pulsante con sole/luna: cambia tra **tema
chiaro e scuro**. La scelta del visitatore viene ricordata dal browser. Non devi
fare nulla: funziona da solo. Se vuoi cambiare i **colori**, sono tutti raccolti
all'inizio di `assets/css/style.css` (blocco `:root` per il chiaro,
`:root[data-theme="dark"]` per lo scuro).

### 🔤 I font del sito
Il sito usa tre caratteri, già impostati: **EB Garamond** (testi e titoli, elegante),
**Inter** (menu, pulsanti, schede — pulito e moderno) e **DM Mono** (numeri e dati).
Non serve modificarli; se proprio vuoi, si cambiano nel blocco `:root` di
`style.css` (righe `--serif`, `--ui`, `--mono`).

> 🛟 **Consiglio anti-disastro:** prima di una modifica importante, fai una **copia
> della cartella** sul computer. Se qualcosa va storto, torni indietro in un attimo.

---

## 5. Pubblicare il sito online con GitHub Pages (GRATIS)

GitHub Pages trasforma la tua cartella in un sito web pubblico, gratuitamente.
L'indirizzo finale sarà del tipo: `https://tuonome.github.io/`

### Passo 1 — Crea un account GitHub
Vai su https://github.com e registrati (gratis).

### Passo 2 — Crea il repository (lo "spazio" del sito)
1. In alto a destra clicca **+ ▸ New repository**.
2. **Repository name:** scrivi esattamente `tuonome.github.io`
   (sostituisci `tuonome` con il tuo nome utente GitHub).
   👉 Questo nome speciale fa sì che il sito sia raggiungibile su `https://tuonome.github.io/`.
3. Imposta su **Public**.
4. Clicca **Create repository**.

### Passo 3 — Carica i file
1. Nella pagina del repository appena creato, clicca
   **Add file ▸ Upload files**.
2. Apri la cartella `Sito Fulvio` sul computer, **seleziona tutto il contenuto**
   (il file `index.html`, la cartella `assets`, ecc.) e **trascinalo** nella pagina.
   ⚠️ Carica il *contenuto* della cartella, non la cartella stessa:
   `index.html` deve trovarsi nella radice del repository.
3. In basso clicca **Commit changes** (è il pulsante che "salva" il caricamento).

### Passo 4 — Attiva GitHub Pages
1. Nel repository vai su **Settings** (in alto) ▸ **Pages** (menu a sinistra).
2. Alla voce **Branch** scegli `main` e cartella `/ (root)`, poi **Save**.
3. Aspetta 1–2 minuti. In cima alla stessa pagina apparirà il link del sito:
   `https://tuonome.github.io/` ✅

Fatto! Il sito è online.

### Aggiornare il sito in futuro
Quando modifichi qualcosa sul computer:
1. Repository ▸ **Add file ▸ Upload files**.
2. Trascina i file modificati (puoi anche ricaricarli tutti: sovrascrive i vecchi).
3. **Commit changes**. Dopo ~1 minuto il sito online si aggiorna da solo.

> Puoi anche modificare un file **direttamente su GitHub**: aprilo nel sito,
> clicca l'icona della **matita** (✏️), cambia il testo e fai **Commit changes**.
> Comodo per piccole correzioni al volo.

---

## 6. Se qualcosa non funziona

- **Pagina bianca o link rotti dopo il caricamento?**
  Assicurati che `index.html` sia nella *radice* del repository (non dentro una
  sottocartella) e che la cartella `assets` sia stata caricata con tutto il contenuto.
- **La foto/il CV non si vedono?**
  I nomi devono essere esattamente `photo.jpg` e `cv.pdf`, dentro `assets`.
- **Il sito online non si aggiorna?**
  Aspetta 1–2 minuti e ricarica con **Ctrl/Cmd + Maiusc + R** (svuota la cache).
- **Ho rotto qualcosa modificando index.html?**
  Ripristina la copia di backup della cartella (vedi consiglio nel §4).

Buon lavoro! ✨
