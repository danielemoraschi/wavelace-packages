// @wavelace/embed: the test the public repo runs before it publishes, against the folder exactly as it
// will be published. The thorough test is in the Wavelace source, where every link this writes is read
// back by the app itself; this one proves that what arrived here imports and answers.
import {test} from "node:test";
import assert from "node:assert";
import {readFileSync} from "node:fs";
import * as embed from "./index.js";

const here = file => readFileSync(new URL(file, import.meta.url), "utf8");
// the names a declaration file exports: apiNames in the Wavelace source's tools/pkg.js, which is not shipped here
const namesDeclaredIn = file => [...here(file).matchAll(/^export (?:declare )?(?:function|const) ([A-Za-z_$][\w$]*)/gm)].map(m => m[1]);

test("exports every name its declarations promise", () => {
  const declared = namesDeclaredIn("index.d.ts");
  assert.deepStrictEqual(declared.sort(), Object.keys(embed).sort());
});

test("a preset alone is a whole link", () => {
  assert.strictEqual(embed.embedUrl({preset: 0}), "https://www.wavelace.com/embed#p=0");
  assert.ok(embed.PRESETS.length > 100 && embed.RENDERERS.includes("wave"));
});

test("a formula, its letters and how it looks", () => {
  const url = new URL(embed.embedUrl({formula: "a \\sin(kx)", renderer: "wave", values: {a: 2}, theme: "dark", spin: true}));
  const hash = new URLSearchParams(url.hash.slice(1));
  assert.deepStrictEqual([hash.get("m"), hash.get("f"), hash.get("let"), hash.get("theme"), hash.get("spin")],
                         ["wave", "a \\sin(kx)", "a:2", "dark", "1"]);
});

test("refuses what it does not know, saying what to do", () => {
  assert.throws(() => embed.embedUrl({preset: "no-such-preset"}), /PRESETS lists them/);
  assert.throws(() => embed.embedUrl({formula: "x"}), /a formula needs its renderer/);
});

// The React subpath, under the React the publish step installs beside the package, rendered to markup
test("the React subpath exports what it declares, and renders the frame", async () => {
  const [react, {createElement}, {renderToStaticMarkup}] = await Promise.all([import("./react.js"), import("react"), import("react-dom/server")]);
  const declared = namesDeclaredIn("react.d.ts");
  assert.deepStrictEqual(declared.sort(), Object.keys(react).sort());
  assert.strictEqual(renderToStaticMarkup(createElement(react.Embed, {preset: 0})),
    '<iframe src="https://www.wavelace.com/embed#p=0" title="Wavelace" loading="lazy" style="display:block;width:100%;aspect-ratio:4/3;border:0"></iframe>');
});
