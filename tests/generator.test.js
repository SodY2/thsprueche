import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { generateProverb, validateConfig } from '../generator.js';

const config = JSON.parse(await readFile(new URL('../data/sprichwoerter.json', import.meta.url), 'utf8'));

test('Die mitgelieferte JSON-Konfiguration ist gültig', () => {
  assert.equal(validateConfig(config), config);
});

test('Sprüche mischen verschiedene Originale und lösen GTA-Platzhalter auf', () => {
  let previous = '';
  for (let i = 0; i < 500; i++) {
    const result = generateProverb(config, previous);
    assert.notEqual(result.text, previous);
    assert.notEqual(result.originals[0], result.originals[1]);
    assert.equal(result.originals.length, 2);
    assert.doesNotMatch(result.text, /[{}]|undefined/);
    assert.ok([...config.vehicles, ...config.locations, ...config.characters].some(value => result.text.includes(value)));
    previous = result.text;
  }
});

test('Fehlerhafte Konfigurationen werden verständlich abgewiesen', () => {
  assert.throws(() => validateConfig({ ...config, proverbs: [] }), /proverbs/);
  assert.throws(() => validateConfig({ ...config, proverbs: [null, null] }), /proverbs/);
  assert.throws(() => validateConfig({ ...config, punchlines: ['{unknown}', 'Noch ein Spruch'] }), /Unbekannter Platzhalter/);
});

test('Ein wiederholter Spruch führt auch bei gleicher Zufallsfolge nicht zu einer Endlosschleife', () => {
  const first = generateProverb(config, '', () => 0);
  assert.throws(() => generateProverb(config, first.text, () => 0), /keine neue Weisheit/);
});
