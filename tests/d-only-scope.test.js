import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const source = (path) => readFileSync(new URL(path, root), "utf8");

test("local template repository exposes only D templates", () => {
  const file = source("src/lib/local-card-templates.js");
  assert.match(file, /template\.type === "D"/);
});

test("D writing suggestions cover the guided fields", () => {
  const file = source("src/lib/d-suggestions.js");
  for (const field of ["situation", "thought", "evidence_for", "evidence_against", "alternative_perspective", "response", "steps", "anchor_phrase"]) {
    assert.match(file, new RegExp(`${field}:`));
  }
});

test("wizard renders optional suggestions without adding an AI dependency", () => {
  const wizard = source("src/components/wizard/EnfrentamentoWizard.jsx");
  assert.match(wizard, /SuggestionChips/);
  assert.match(wizard, /D_SUGGESTIONS/);
  assert.doesNotMatch(wizard, /openai|generate|fetch\(/i);
});

test("active personal-card routes use PDF export instead of sharing", () => {
  const detail = source("src/routes/_authed/meus-cartoes.$cardId.jsx");
  const list = source("src/routes/_authed/meus-cartoes.index.jsx");
  assert.match(detail, /PdfExportButton/);
  assert.match(list, /PdfExportButton/);
  assert.doesNotMatch(detail, /ShareDialog/);
  assert.doesNotMatch(list, /ShareDialog/);
});

test("quick A/B/C creation is not reachable from the active UI", () => {
  const home = source("src/routes/_site/index.jsx");
  const list = source("src/routes/_authed/meus-cartoes.index.jsx");
  const library = source("src/routes/_site/biblioteca.index.jsx");
  for (const file of [home, list, library]) {
    assert.doesNotMatch(file, /criar\/rapido/);
    assert.doesNotMatch(file, /\b[A-C]\b/);
  }
});

test("active card renderer loads only the D renderer", () => {
  const renderer = source("src/components/cards/CardRenderer.jsx");
  assert.match(renderer, /CardD/);
  assert.doesNotMatch(renderer, /CardA|CardB|CardC/);
  assert.match(renderer, /versão anterior/);
});
