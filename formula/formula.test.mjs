// @wavelace/formula: the test the public repo runs before it publishes, against the folder exactly as it
// will be published. The thorough test is in the Wavelace source, where the package is held to the app
// over every preset; this one proves that what arrived here imports and answers.
import {test} from "node:test";
import assert from "node:assert";
import {readFileSync} from "node:fs";
import * as formula from "./index.js";

const here = file => readFileSync(new URL(file, import.meta.url), "utf8");

test("exports every name its declarations promise", () => {
  // apiNames in the Wavelace source's tools/pkg.js, which is not shipped here
  const declared = [...here("index.d.ts").matchAll(/^export (?:declare )?(?:function|const) ([A-Za-z_$][\w$]*)/gm)].map(m => m[1]);
  assert.ok(declared.length >= 10);
  for(const name of declared) assert.notStrictEqual(formula[name], undefined, name);
});

test("compiles a formula as a textbook prints it", () => {
  const f = formula.compile("\\frac{\\sin(kx - \\omega t)}{x}", {k: 2, ω: 3});
  assert.strictEqual(f(0.7, 0, 0, 0, 0, 0, 0, 0.1), Math.sin(1.4 - 0.3) / 0.7);
});

test("names its free letters, and rebinds them without compiling again", () => {
  const wave = formula.bindable("A \\sin(kx - \\omega t)");
  assert.deepStrictEqual(wave.names, ["A", "k", "ω"]);
  assert.strictEqual(wave.bind({A: 2})(Math.PI / 2, 0, 0, 0, 0, 0, 0, 0), 2);
});

test("refuses a typo rather than guess", () => {
  assert.throws(() => formula.compile("sni(x)"), /sni is not a function or a variable here/);
});

test("prints the plate", () => {
  assert.strictEqual(formula.pretty("\\int_0^x \\cos(u^2) du"), "∫₀^x cos(u²) du");
});
