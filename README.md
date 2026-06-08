# Sito personale — Fulvio Raddi

Sito statico (una pagina, più sezioni) per un profilo accademico/di ricerca.
Nessun server o framework: solo HTML, CSS e JavaScript. Si pubblica gratis su
**GitHub Pages**.

## 📂 Struttura

| File / cartella        | A cosa serve                                              |
|------------------------|-----------------------------------------------------------|
| `index.html`           | **I testi del sito.** Qui si modifica quasi tutto.        |
| `assets/css/style.css` | Aspetto grafico (colori, font, spaziature).               |
| `assets/js/site.js`    | Logica (navigazione, schede) e dati numerici dei grafici. |
| `assets/photo.jpg`     | Foto del profilo (da aggiungere).                         |
| `assets/cv.pdf`        | CV in PDF (da aggiungere).                                |
| `GUIDA.md`             | **Guida passo-passo** per modificare e pubblicare.        |

## ✏️ Come si modifica

Apri `index.html` con un editor di testo (consigliato: VS Code) e cambia il testo
tra i tag. Ogni sezione ha un commento in italiano che spiega cosa fare.
Dettagli completi in **[GUIDA.md](GUIDA.md)**.

## 🚀 Come si pubblica

1. Crea un repository GitHub chiamato `tuonome.github.io`.
2. Carica tutto il contenuto di questa cartella (`index.html` nella radice).
3. Settings ▸ Pages ▸ Branch `main` / `(root)` ▸ Save.
4. Il sito sarà su `https://tuonome.github.io/`.

Procedura dettagliata nella **[GUIDA.md](GUIDA.md)**.

## ✨ Funzioni incluse

- Navigazione a sezioni con **link condivisibili** (es. `…/#research`) e
  tasto "indietro" del browser funzionante.
- **Menu mobile** (hamburger) e layout responsive.
- Barra di **avanzamento lettura** e bottone **"torna su"**.
- Grafici **interattivi** (sezioni *Giving Back* e *Italy*) con tooltip ed
  esportazione in **Excel/PNG**.
