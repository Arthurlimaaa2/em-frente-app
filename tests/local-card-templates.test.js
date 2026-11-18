import test from "node:test";
import assert from "node:assert/strict";

import { getLocalPublishedTemplate, listLocalPublishedTemplates } from "../src/lib/local-card-templates.js";

test("lists only published D card templates", async () => {
  const templates = await listLocalPublishedTemplates();

  assert.ok(templates.every((template) => template.status === "published" && template.type === "D"));
});

test("gets a published D template by id and returns null for unknown ids", async () => {
  const templates = await listLocalPublishedTemplates();

  if (templates[0]) {
    const template = await getLocalPublishedTemplate(templates[0].id);
    assert.equal(template.id, templates[0].id);
  }
  assert.equal(await getLocalPublishedTemplate("missing-template"), null);
});
