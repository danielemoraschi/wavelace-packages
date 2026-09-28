// @wavelace/formula: the test the public repo runs before it publishes, against the folder exactly as it
// will be published. The thorough test is in the Wavelace source, where the package is held to the app
// over every preset; this one proves that what arrived here imports and answers.
import {test} from "node:test";
import assert from "node:assert";
import {readFileSync} from "node:fs";
import * as formula from "./index.js";

const here = file => readFileSync(new URL(file, import.meta.url), "utf8");
// the names a declaration file exports: apiNames in the Wavelace source's tools/pkg.js, which is not shipped here
const namesDeclaredIn = file => [...here(file).matchAll(/^export (?:declare )?(?:function|const) ([A-Za-z_$][\w$]*)/gm)].map(m => m[1]);

test("exports every name its declarations promise", () => {
  const declared = namesDeclaredIn("index.d.ts");
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

// The React subpath, under the React the publish step installs beside the package. Rendered to markup, which
// needs no page: that it imports, renders and answers is what this proves; how it behaves while a reader
// types is held in the Wavelace source, under a page.
test("the React subpath exports what it declares, and renders", async () => {
  const [react, {createElement}, {renderToStaticMarkup}] = await Promise.all([import("./react.js"), import("react"), import("react-dom/server")]);
  const declared = namesDeclaredIn("react.d.ts");
  assert.deepStrictEqual(declared.sort(), Object.keys(react).sort());
  const Probe = () => createElement("output", null, react.useFormula("k x", {k: 2}).fn(3, 0, 0, 0, 0, 0, 0, 0));
  assert.strictEqual(renderToStaticMarkup(createElement(Probe)), "<output>6</output>");
  assert.match(renderToStaticMarkup(createElement(react.Plate, {formula: "x^2"})), /^<span style="font-family:&quot;CMU Serif&quot;.*">x²<\/span>$/);
  assert.match(renderToStaticMarkup(createElement(react.FormulaField, {defaultValue: "x", "aria-label": "f"})),
    /^<input aria-label="f" type="text" spellCheck="false" aria-invalid="false" value="x"\/><span id="[^"]+" aria-live="polite"><\/span>$/);
});
