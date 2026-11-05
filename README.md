# TH Sprichwort

Eine statische Webseite, die deutsche Sprichworthälften mit stumpfen GTA-5-Punchlines kombiniert. Keine KI, kein Discord-Bot, keine Datenbank und keine API-Schlüssel. Alles läuft im Browser. Es werden keine externen Schriftarten, Tracker oder Bibliotheken geladen.

## Lokal ausprobieren

Im Ordner `privat` ausführen:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Dann `http://localhost:8080` öffnen. Nicht einfach die HTML-Datei doppelklicken: Die JSON-Datei wird per HTTP geladen. Kopieren funktioniert auf localhost und auf HTTPS-Seiten; falls der Browser es blockiert, lässt sich der Text manuell markieren.

## Was du für GitHub Pages brauchst

- Einen GitHub-Account.
- Ein eigenes GitHub-Repository für **den Inhalt dieses Ordners**. Bei GitHub Free ein öffentliches Repository verwenden; private Repositories mit Pages hängen vom Tarif ab. Die Webseite und ihre JSON-Inhalte sind bei öffentlicher Veröffentlichung öffentlich lesbar.
- Keine eigene Domain; GitHub stellt eine Adresse wie `https://DEIN-NAME.github.io/th-sprichwort/` bereit.

Das bestehende Zend-Projekt hat ein internes GitLab-Remote. Lade nur dieses eigenständige Projekt in ein neues GitHub-Repository, nicht das Zend-Backend. Es ist absichtlich noch kein verschachteltes Git-Repository angelegt und nichts veröffentlicht worden.

## Auf GitHub veröffentlichen

1. Auf GitHub ein leeres Repository namens `th-sprichwort` erstellen, zunächst ohne README oder Lizenzdatei.
2. Den Inhalt von `privat`, einschließlich `.github` und `.gitignore`, in einen separaten Ordner **außerhalb des Zend-Repositories** kopieren. Zum Beispiel aus `zend-backend`:

   ```bash
   cp -R privat ../th-sprichwort
   cd ../th-sprichwort
   git init -b main
   git add .
   git commit -m "Add TH Sprichwort website"
   git remote add origin https://github.com/DEIN-NAME/th-sprichwort.git
   git push -u origin main
   ```

3. Im GitHub-Repository unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** wählen.
4. Unter **Actions → Publish GitHub Pages → Run workflow** den Workflow starten. Weitere Pushes auf `main` veröffentlichen automatisch ein Update.
5. Nach erfolgreichem Lauf die unter **Settings → Pages** oder im Deployment angezeigte URL öffnen.

Wichtig: Der Workflow unter `.github/workflows/pages.yml` muss im Wurzelverzeichnis des **neuen** Repositories liegen. Im Zend-Repository liegt er unter `privat/.github` und wird dort nicht ausgeführt. Der Workflow prüft den Generator und veröffentlicht ausschließlich HTML, CSS, JavaScript und `data/`.

## Sprüche anpassen

`data/sprichwoerter.json` enthält:

- `proverbs`: bekannte Sprüche, aufgeteilt in `start` ohne Komma und `end` mit Satzzeichen. Der Generator mischt zwei unterschiedliche Einträge.
- `punchlines`: absurde Nachsätze. Erlaubte Platzhalter sind `{vehicle}`, `{location}` und `{character}`.
- `vehicles`, `locations`, `characters`: GTA-Bezüge für die Platzhalter.

Jede Liste braucht mindestens zwei Einträge. Texte dürfen maximal 250 Zeichen lang sein. JSON erlaubt weder Kommentare noch ein Komma hinter dem letzten Eintrag. Änderungen werden nach dem nächsten Deployment und Neuladen sichtbar. Die Kombinationen sind zufällig und bewusst unsinnig; ein Spruch kann später erneut vorkommen.

## Prüfen

Mit Node.js 22 oder neuer im Projektordner:

```bash
npm test
```

Es müssen keine npm-Pakete installiert werden. Das Fanprojekt verwendet GTA-Namen als Textreferenzen und keine Rockstar-Grafiken.
