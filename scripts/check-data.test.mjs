import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectLanguage, findPairs } from './check-data.mjs';

test('detectLanguage', () => {
  assert.equal(detectLanguage('Vous pouvez demander la suppression de vos données par email'), 'fr');
  assert.equal(detectLanguage('You can request the deletion of your data by email'), 'en');
  assert.equal(detectLanguage('Google LLC'), null);
  assert.equal(detectLanguage('https://example.com/privacy'), null);
});

test('findPairs flags wrong language, untranslated text and key drift', () => {
  const findings = [];
  findPairs(
    {
      comments: 'Les données sont stockées aux États-Unis par le groupe',
      comments_en: 'Les données sont stockées aux États-Unis par le groupe',
      response_delay: 'Un mois pour les demandes',
      response_delay_en: 'Un mois pour les demandes de la plupart des clients',
      i18n: { fr: { a: 'x', b: 'y' }, en: { a: 'x', c: 'z' } },
    },
    'fiche',
    (rule, where) => findings.push(`${rule} @ ${where}`)
  );
  assert.deepEqual(findings.sort(), [
    'EN text looks French @ fiche.response_delay',
    'FR and EN text identical (untranslated) @ fiche.comments',
    'key missing in EN @ fiche.i18n.b',
    'key missing in FR @ fiche.i18n.c',
  ]);
});
