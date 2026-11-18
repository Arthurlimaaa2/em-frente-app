import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("mobile menu trigger is wired directly to the controlled sheet state", () => {
  const source = readFileSync(new URL("../src/components/Layout.jsx", import.meta.url), "utf8");
  assert.match(source, /<Button[^>]+onClick=\{\(\) => setOpen\(true\)\}/s);
  assert.match(source, /open &&/);
  assert.match(source, /onClick=\{\(\) => setOpen\(false\)\}/);
});

test("mobile header avoids GPU-heavy blur and reserves the system safe area", () => {
  const layout = readFileSync(new URL("../src/components/Layout.jsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8");
  assert.doesNotMatch(layout, /backdrop-blur/);
  assert.match(css, /safe-area-inset-top/);
});

test("official brand is used in the mobile shell and standalone document", () => {
  const layout = readFileSync(new URL("../src/components/Layout.jsx", import.meta.url), "utf8");
  const document = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(layout, /Em Frente/);
  assert.doesNotMatch(layout, /Cartões de\s+Enfrentamento/);
  assert.match(document, /<title>Em Frente<\/title>/);
});

test("standalone router does not mount a nested HTML document", () => {
  const source = readFileSync(new URL("../src/routes/__root.jsx", import.meta.url), "utf8");
  assert.match(source, /typeof document !== "undefined"/);
  assert.match(source, /return children/);
});

test("wizard questions preserve cursor position during Android WebView input", () => {
  const source = readFileSync(new URL("../src/components/wizard/WizardFields.jsx", import.meta.url), "utf8");
  assert.match(source, /<textarea/);
  assert.match(source, /defaultValue=\{value\}/);
  assert.match(source, /ref=\{inputRef\}/);
  assert.match(source, /onInput=\{\(event\) => onChange\(event\.currentTarget\.value\)\}/);
  assert.doesNotMatch(source, /contentEditable/);
});

test("wizard final preview stays lightweight on mobile", () => {
  const source = readFileSync(new URL("../src/components/wizard/EnfrentamentoWizard.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /<CardRenderer/);
  assert.match(source, /Sua resposta alternativa aparecerá aqui/);
});

test("wizard action steps avoid controlled text inputs during slider updates", () => {
  const source = readFileSync(new URL("../src/components/wizard/WizardFields.jsx", import.meta.url), "utf8");
  assert.match(source, /aria-label=\{`Passo \$\{index \+ 1\}`\}/);
  assert.match(source, /defaultValue=\{step\}/);
  assert.match(source, /onInput=\{\(event\) => update\(index, event\.currentTarget\.value\)\}/);
});

test("wizard action slider commits once after dragging", () => {
  const source = readFileSync(new URL("../src/components/wizard/EnfrentamentoWizard.jsx", import.meta.url), "utf8");
  assert.match(source, /defaultValue=\{\[form\.intensity_after \?\? 0\]\}/);
  assert.match(source, /onValueCommit=\{\(\[value\]\) => update\("intensity_after", value\)\}/);
});

test("wizard navigation does not block on draft persistence", () => {
  const source = readFileSync(new URL("../src/components/wizard/EnfrentamentoWizard.jsx", import.meta.url), "utf8");
  assert.match(source, /function goNext\(\) \{/);
  assert.match(source, /setStep\(\(current\) => Math\.min\(current \+ 1, STEPS\.length - 1\)\)/);
  assert.doesNotMatch(source, /await persist\("draft"\);\s*setStep/);
});

test("wizard navigation starts before WebView blur can swallow the tap", () => {
  const source = readFileSync(new URL("../src/components/wizard/EnfrentamentoWizard.jsx", import.meta.url), "utf8");
  assert.match(source, /triggerNavigation\(goNext\)/);
  assert.match(source, /onTouchStart=\{\(\) => triggerNavigation\(goNext\)\}/);
  assert.match(source, /onClick=\{\(\) => triggerNavigation\(goNext\)\}/);
});

test("wizard reports save failures instead of leaving the user without feedback", () => {
  const source = readFileSync(new URL("../src/components/wizard/EnfrentamentoWizard.jsx", import.meta.url), "utf8");
  assert.match(source, /catch \(error\)/);
  assert.match(source, /Não foi possível salvar/);
});

test("wizard page exits loading state when local data loading fails", () => {
  const source = readFileSync(new URL("../src/routes/_authed/criar.enfrentamento.jsx", import.meta.url), "utf8");
  assert.match(source, /catch \(error\)/);
  assert.match(source, /setLoading\(false\)/);
});
