import { generateProverb, validateConfig } from './generator.js';

const spruch = document.querySelector('#spruch');
const quelle = document.querySelector('#quelle');
const status = document.querySelector('#status');
const generate = document.querySelector('#generate');
const copy = document.querySelector('#copy');
let config;
let current = '';

function showNext() {
  try {
    const result = generateProverb(config, current);
    current = result.text;
    spruch.textContent = `„${current}“`;
    quelle.textContent = `Zusammengeschraubt aus: „${result.originals.join('“ + „')}“`;
    status.textContent = '';
  } catch (error) {
    status.textContent = error.message;
  }
}

generate.addEventListener('click', showNext);
copy.addEventListener('click', async () => {
  const text = current;
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = 'Kopiert. Bereit für den Gruppenchat.';
  } catch {
    status.textContent = 'Kopieren nicht verfügbar. Markiere den Spruch und kopiere ihn manuell.';
  }
});

try {
  const response = await fetch(new URL('./data/sprichwoerter.json', import.meta.url));
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  config = validateConfig(await response.json());
  showNext();
  generate.disabled = false;
  copy.disabled = false;
} catch (error) {
  spruch.textContent = 'Die Weisheiten stecken auf der A1 fest.';
  status.textContent = 'Sprüche konnten nicht geladen werden. Bitte lade die Seite neu oder prüfe die JSON-Datei und den Webserver.';
  console.error('Sprichwort-Konfiguration konnte nicht geladen werden:', error);
} finally {
  document.querySelector('#generator').setAttribute('aria-busy', 'false');
}
