function pick(items, random) {
  return items[Math.floor(random() * items.length)];
}

export function validateConfig(config) {
  if (!config || typeof config !== 'object') throw new Error('Konfiguration fehlt.');
  for (const key of ['proverbs', 'punchlines', 'vehicles', 'locations', 'characters']) {
    if (!Array.isArray(config[key]) || config[key].length < 2) {
      throw new Error(`${key}: mindestens zwei Einträge erforderlich.`);
    }
    for (const item of config[key]) {
      const values = key === 'proverbs' ? [item?.start, item?.end] : [item];
      if (values.some(value => typeof value !== 'string' || !value.trim() || value.length > 250)) {
        throw new Error(`${key}: ungültiger Eintrag (Text mit maximal 250 Zeichen erwartet).`);
      }
    }
  }
  const placeholders = /\{([^{}]+)\}/g;
  for (const line of config.punchlines) {
    for (const match of line.matchAll(placeholders)) {
      if (!['vehicle', 'location', 'character'].includes(match[1])) {
        throw new Error(`Unbekannter Platzhalter: ${match[1]}`);
      }
    }
  }
  return config;
}

export function generateProverb(config, previous = '', random = Math.random) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const firstIndex = Math.floor(random() * config.proverbs.length);
    // Ein anderer Index verhindert die unveränderte Originalweisheit.
    const offset = 1 + Math.floor(random() * (config.proverbs.length - 1));
    const first = config.proverbs[firstIndex];
    const second = config.proverbs[(firstIndex + offset) % config.proverbs.length];
    const replacements = {
      vehicle: pick(config.vehicles, random),
      location: pick(config.locations, random),
      character: pick(config.characters, random),
    };
    const punchline = pick(config.punchlines, random).replace(/\{([^{}]+)\}/g, (_, key) => replacements[key]);
    const text = `${first.start}, ${second.end}`;
    if (text !== previous) {
      return { text, originals: [`${first.start}, ${first.end}`, `${second.start}, ${second.end}`] };
    }
  }
  throw new Error('Gerade keine neue Weisheit gefunden. Versuch es noch einmal.');
}
