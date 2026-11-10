import test from 'node:test';
import assert from 'node:assert/strict';
import { toDirectImageUrl } from './download-logos.mjs';

test('Wikipedia media-viewer link resolves to the file itself', () => {
  assert.equal(
    toDirectImageUrl('https://fr.wikipedia.org/wiki/Deezer#/media/Fichier:Logo_Deezer_2023.svg'),
    'https://fr.wikipedia.org/wiki/Special:FilePath/Logo_Deezer_2023.svg',
  );
});

test('direct image link is left untouched', () => {
  const url = 'https://upload.wikimedia.org/wikipedia/commons/a/b/Logo.svg';
  assert.equal(toDirectImageUrl(url), url);
});
