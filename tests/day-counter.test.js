import test from "node:test";
import assert from "node:assert/strict";
import { elapsedDays, todayISO } from "../src/lib/day-counter.js";

test("counter starts at zero and ignores the time of day", () => {
  assert.equal(elapsedDays("2026-11-18", new Date(2026,10,18,23,59)),0);
  assert.equal(elapsedDays("2026-11-18", new Date(2026,10,19,0,1)),1);
});
test("counter includes leap days and never counts backwards", () => {
  assert.equal(elapsedDays("2024-02-28", new Date(2024,2,1)),2);
  assert.equal(elapsedDays("2026-12-01", new Date(2026,10,18)),0);
  assert.equal(todayISO(new Date(2026,0,2)),"2026-01-02");
});
