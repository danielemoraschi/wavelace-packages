# @wavelace/formula

Paste a formula as a textbook prints it, get a fast JavaScript function back. The formula layer of
[Wavelace](https://www.wavelace.com), the animated maths visualiser, published on its own: LaTeX in,
a compiled function of real numbers out, and a printer for showing the formula back.

```js
import {compile} from "@wavelace/formula";

const f = compile("x^2 e^{-x}");
f(1, 0, 0, 0, 0, 0, 0, 0)   // → 0.3679
```

Every example below runs as written: the package's tests execute this README and check each value
marked `// →`.

## The one signature

Every formula compiles to the same function, whatever it names:

```
(x, y, z, r, th, u, v, t) => number
```

`th` is the polar angle θ, `r` the radius, `u` and `v` two parameters, `t` time. A caller feeds the
variables it has and leaves the rest at 0; `readsVars` says which ones a formula actually reads. The
examples wrap that in a small helper, which is all most programs need.

## Draw a curve

```js
import {compile} from "@wavelace/formula";

const f = compile("x^2 e^{-x}");
const at = x => f(x, 0, 0, 0, 0, 0, 0, 0);

const points = [0, 1, 2, 3].map(x => [x, at(x)]);
points[2][1]   // → 0.5413
```

Sample it as densely as you like: after the one compile, a call costs about twenty nanoseconds.

## Animate it

`t` is time. Ask `readsVars` whether a formula names it, and redraw only the ones that do.

```js
import {compile, readsVars} from "@wavelace/formula";

const src = "\\sin(2\\pi(x - t))";
const wave = compile(src);
wave(0.25, 0, 0, 0, 0, 0, 0, 0)      // → 1
wave(0.25, 0, 0, 0, 0, 0, 0, 0.25)   // → 0

[...readsVars(src)]           // → ["x", "t"]
[...readsVars("x^2 e^{-x}")]  // → ["x"]
```

In a browser, pass `performance.now() / 1000` as `t` from a `requestAnimationFrame` loop.

## Surfaces and polar curves

A height field reads `x` and `y`, or `r`, the distance from the origin; a polar curve reads `θ`.

```js
import {compile} from "@wavelace/formula";

const hill = compile("e^{-(x^2 + y^2)}");
hill(0, 0, 0, 0, 0, 0, 0, 0)   // → 1
hill(1, 1, 0, 0, 0, 0, 0, 0)   // → 0.1353

const ripple = compile("\\frac{\\sin(3r)}{r}");
ripple(0, 0, 0, 1, 0, 0, 0, 0)   // → 0.1411

const rose = compile("\\cos(3\\theta)");
rose(0, 0, 0, 0, Math.PI / 3, 0, 0, 0)   // → -1
```

When you feed `x` and `y`, feed `r = Math.hypot(x, y)` and `th = Math.atan2(y, x)` as well, and a
formula written in either form draws the same.

## Letters become sliders

A single letter the language does not claim is a **free name**: a parameter the caller supplies, like
`a`, `k` and `ω` in `a \sin(kx - \omega t)`. The claimed ones are the eight variables (`x y z r θ u v
t`), `e`, and the names of functions and constants (`sin`, `pi`); a letter with a subscript (`x_0`,
`\omega_0`) is a free name of its own. `bindable` compiles once and lists them in order of first
appearance; `bind` gives them values, and costs one call, never a recompile, so it can run on every
slider movement.

```js
import {bindable, isFreeName} from "@wavelace/formula";

const wave = bindable("a \\sin(kx) + c");
wave.names   // → ["a", "k", "c"]

const f = wave.bind({a: 2, k: 3, c: 0.5});
f(Math.PI / 6, 0, 0, 0, 0, 0, 0, 0)   // → 2.5

isFreeName("k")     // → true
isFreeName("x")     // → false
isFreeName("x_0")   // → true
```

In a page, build one `<input type="range">` per name in `wave.names`, and on each `input` event call
`wave.bind(values)` with the current values.

### A name not given is worth FREE_DEFAULT

A free name left out of the values is worth `FREE_DEFAULT`, which is 1: the value that changes nothing
in a product, so a formula with no values given draws its plain shape, `a \sin(kx)` as `sin(x)`. That
holds everywhere a formula is bound: `bind` with some or none of the values, `compile` with none, and
`useFormula` in React. It is exported so that a slider made for a name can open at the value the
formula is already using, rather than at a 1 written by hand.

```js
import {bindable, compile, FREE_DEFAULT} from "@wavelace/formula";

FREE_DEFAULT   // → 1

const wave = bindable("a \\sin(kx) + c");
wave.bind({a: 2, k: 3})(Math.PI / 6, 0, 0, 0, 0, 0, 0, 0)   // → 3
wave.bind()(Math.PI / 2, 0, 0, 0, 0, 0, 0, 0)               // → 2

compile("a x^2")(3, 0, 0, 0, 0, 0, 0, 0)   // → 9

const slider = name => ({name, value: FREE_DEFAULT});
wave.names.map(slider)   // → [{"name": "a", "value": 1}, {"name": "k", "value": 1}, {"name": "c", "value": 1}]
```

## Calculus, series and cases

Integrals, sums, products and derivatives are written as a textbook writes them, and evaluated
numerically: Simpson's rule for an integral, the terms themselves for a series, a central difference
for a derivative.

```js
import {compile} from "@wavelace/formula";
const at = (src, x) => compile(src)(x, 0, 0, 0, 0, 0, 0, 0);

at("\\int_0^x \\cos(u^2) du", 1)                                 // → 0.9045
at("\\frac{d}{dx} \\sin(x^2)", 1)                                // → 1.0806
at("\\sum_{k=1}^{50} \\frac{\\sin((2k-1)x)}{2k-1}", 1)          // → 0.7803
at("5!", 0)                                                     // → 120
at("\\sin 30^\\circ", 0)                                        // → 0.5

const piecewise = "\\begin{cases} x^2 & x < 0 \\\\ \\sqrt{x} & \\text{otherwise} \\end{cases}";
at(piecewise, -2)   // → 4
at(piecewise, 4)    // → 2
```

The series is the square wave's Fourier series, fifty terms of it, closing on π/4 ≈ 0.7854.

## Errors a reader can act on

Anything `compile` cannot read throws an `Error` whose message is written for the person who typed the
formula, so a form can show it as it is.

```js
import {compile} from "@wavelace/formula";
const why = src => { try { compile(src); return null; } catch (e) { return e.message; } };

why("sni(x)")    // → "sni is not a function or a variable here"
why("\\foo x")   // → "LaTeX command not supported: \\foo"
why("2 +")       // → "this is not a complete formula: something is missing, or in the wrong place"
why("\\sin x")   // → null
```

A longer unknown name is refused rather than guessed at: `sni(x)` says so instead of growing three
free names.

## Show the formula back

`pretty` prints a formula as it should read on screen; `normalize` shows the expression `compile`
actually runs, which helps when a pasted formula does something unexpected.

```js
import {pretty, prettyName, normalize} from "@wavelace/formula";

pretty("\\int_0^x \\cos(u^2) du")   // → "∫₀^x cos(u²) du"
pretty("3x^2 + 2\\theta")           // → "3x² + 2θ"
prettyName("th")                    // → "θ"
prettyName("x_1")                   // → "x₁"

normalize("\\frac{1}{2}\\sin(kx)")   // → "(1/2)*sin(k*x)"
normalize("√(x² + y²) · π")          // → "sqrt(x^(2) + y^(2)) * pi"
```

## In React

`@wavelace/formula/react` has the three pieces a formula needs on a page: `useFormula`, which compiles,
`<FormulaField>`, where a reader types, and `<Plate>`, which shows a formula as it reads. React 18 or
later is an optional peer of the package: only this subpath imports it, so a program without React
never needs it. Types for both paths are included.

Every React example below runs as written too: the tests render it into a page and check each value
marked `// →` once the page has rendered.

### A plot with sliders

`useFormula(text, values)` compiles once per text and binds once per change of the values its letters
read, so dragging a slider never compiles again. It hands back `fn`, `error`, `plate` and
`freeNames`, one slider per name. While the text is refused, `error` says why in `compile`'s words,
and `fn`, `plate` and `freeNames` stay those of the last text that compiled, so a plot does not blank
out at every half-typed key. A LaTeX string in a JSX attribute needs no escaping: `text="a \sin(k x)"`
is the formula as written.

```jsx
import {useState} from "react";
import {createRoot} from "react-dom/client";
import {FREE_DEFAULT} from "@wavelace/formula";
import {useFormula} from "@wavelace/formula/react";

const xs = Array.from({length: 101}, (_, i) => i / 10);

function Curve({text}) {
  const [values, setValues] = useState({});
  const {fn, plate, freeNames, error} = useFormula(text, values);
  const points = fn ? xs.map(x => `${x * 40},${100 - 40 * fn(x, 0, 0, 0, 0, 0, 0, 0)}`).join(" ") : "";
  return (
    <figure>
      <svg viewBox="0 0 400 200"><polyline points={points} fill="none" stroke="currentColor" /></svg>
      <figcaption>{plate}</figcaption>
      {freeNames.map(name => (
        <label key={name}>
          {name}
          <input type="range" min={-10} max={10} step={0.1} value={values[name] ?? FREE_DEFAULT}
                 onChange={e => setValues({...values, [name]: Number(e.target.value)})} />
        </label>
      ))}
      {error && <p role="alert">{error}</p>}
    </figure>
  );
}

createRoot(document.getElementById("root")).render(<Curve text="a \sin(k x)" />);

document.querySelector("figcaption").textContent        // → "a · sin(k · x)"
document.querySelectorAll("input[type=range]").length   // → 2
```

### Animate it

Feed the clock as `t`. React redraws a few hundred points of SVG every frame without trouble; for more,
draw on a canvas in the same effect and keep the frame out of state.

```jsx
import {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import {useFormula} from "@wavelace/formula/react";

const xs = Array.from({length: 201}, (_, i) => i / 200);

function Wave({text}) {
  const {fn} = useFormula(text);
  const [t, setT] = useState(0);
  useEffect(() => {
    let frame = requestAnimationFrame(function tick(now) {
      setT(now / 1000);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const d = fn ? xs.map((x, i) => `${i ? "L" : "M"}${x * 400},${100 - 80 * fn(x, 0, 0, 0, 0, 0, 0, t)}`).join("") : "";
  return <svg viewBox="0 0 400 200"><path d={d} fill="none" stroke="currentColor" /></svg>;
}

createRoot(document.getElementById("root")).render(<Wave text="\sin(2\pi(x - t))" />);

document.querySelector("path").getAttribute("d").startsWith("M0,")   // → true
```

`readsVars(text).has("t")` says whether a formula moves at all, when a still one should not keep a frame
loop running.

### Where a reader types

`<FormulaField>` is a text input with the refusal after it, in `compile`'s words. What is typed is
compiled once typing pauses (350 ms, as on Wavelace's rail, or `delay`), so sliders laid out from the
names do not come and go at every key: the `s` of `sin` is a letter for a moment. `onFormula` hears
what `useFormula` would hand back, once per new result, and `values` is what the letters are worth.

```jsx
import {useState} from "react";
import {createRoot} from "react-dom/client";
import {FormulaField} from "@wavelace/formula/react";

function Editor() {
  const [formula, setFormula] = useState(null);
  return (
    <>
      <label htmlFor="f">f(x) =</label>
      <FormulaField id="f" defaultValue="e^{-a x^2}" values={{a: 2}} onFormula={setFormula} />
      <p>{formula?.plate} at x = 1 is {formula?.fn?.(1, 0, 0, 0, 0, 0, 0, 0).toFixed(4)}</p>
    </>
  );
}

createRoot(document.getElementById("root")).render(<Editor />);

document.querySelector("p").textContent   // → "exp(−a · x²) at x = 1 is 0.1353"
```

It works uncontrolled, as above (`defaultValue`), or controlled (`value` with `onChange`, which is
handed the text rather than the event). A `value` set from outside, a preset picked or a reset, lands at
once, with no pause. The refusal is announced politely to assistive technology and tied to the input by
`aria-describedby`, and the input carries `aria-invalid` while there is one: style either,
`refusalClassName` naming the message.

```jsx
import {useState} from "react";
import {createRoot} from "react-dom/client";
import {FormulaField} from "@wavelace/formula/react";

function Controlled() {
  const [text, setText] = useState("\\frac{1}{");
  return (
    <>
      <FormulaField value={text} onChange={setText} aria-label="Formula" refusalClassName="refusal" />
      <button onClick={() => setText("\\frac{1}{x}")}>Mend it</button>
    </>
  );
}

createRoot(document.getElementById("root")).render(<Controlled />);

document.querySelector(".refusal").textContent                 // → "unbalanced brackets in formula"
document.querySelector("input").getAttribute("aria-invalid")   // → "true"
```

### The plate

`<Plate>` shows a formula as it reads, in a span. The text is `pretty`'s and the styling is yours. It is
set upright in Computer Modern when the page has the face, and in a serif when it has not: the
[computer-modern](https://www.npmjs.com/package/computer-modern) package serves it (`npm install
computer-modern`, then `import "computer-modern/cmu-serif.css"` in a bundled app). A text `pretty`
cannot read yet, half typed, is shown as written, so a plate beside a field never throws.

```jsx
import {createRoot} from "react-dom/client";
import {Plate} from "@wavelace/formula/react";

createRoot(document.getElementById("root")).render(
  <p>The Fresnel integral, <Plate formula="\int_0^x \cos(u^2) du" className="plate" /></p>
);

document.querySelector(".plate").textContent   // → "∫₀^x cos(u²) du"
```

### Next.js and server rendering

The subpath is marked `"use client"`, so a server component, a Next.js App Router page included, may
import it: the components render on the server as client components do, and their state lives in the
browser. Compiling builds a function with `new Function` wherever it runs; see
[One thing to know](#one-thing-to-know) for what that asks of a Content Security Policy.

### The props

`useFormula(text, values?)` hands back:

| Field | What it is |
|---|---|
| `fn` | The last text that compiled, bound to `values`; `null` only until one has. |
| `error` | Why the text now is refused, in `compile`'s words, or `null`. |
| `plate` | How the formula that compiled reads (`pretty`), `""` until one has. |
| `freeNames` | Its free names, in order of first appearance: one slider each. |

`<FormulaField>` takes these, and every other prop of an `<input>` (`id`, `className`, `placeholder`,
`aria-label` and the rest), which go to the input:

| Prop | What it sets |
|---|---|
| `value`, `onChange` | Controlled: the text, and `onChange(text)` at every key. |
| `defaultValue` | Uncontrolled: the text it opens with. |
| `onFormula` | `onFormula(result)`, once per new result: on mount, when typing pauses, and at once for a `value` set from outside. |
| `values` | What the free names are worth; one missing is `FREE_DEFAULT`. |
| `delay` | How long typing must pause, in milliseconds (350). |
| `refusalClassName` | A class for the refusal's element. |
| `ref` | React 19: the input element, for focus. |

`<Plate>` takes `formula`, the text as typed, and every other prop of a `<span>`; a `style` of yours is
laid over the face's.

## What it reads

`\frac`, `\sqrt`, powers in braces, `\sin x` without brackets, `\cos^2 x`, `\sin^{-1}`, the Greek
letters, subscripts (`x_0`, `\omega_0`), `90^\circ`, `\left( … \right)`, `\begin{cases}`,
`\int_a^b … du`, `\sum_{k=1}^{n}`, `\prod`, `\frac{d}{dx}`, `x!`, and the silent products a textbook
writes: `2x`, `2\pi x`, `\sin x \cos y`, `kx`. Pasted symbols work too: `π`, `θ`, `²`, `·`, `−`, `√`.
The whole language is documented at [wavelace.com/documentation](https://www.wavelace.com/documentation).

## Beside the other libraries

Fifteen textbook formulas, each value checked against the arithmetic (27 September 2026):

| | right of 15 | size, minified and gzipped |
|---|---|---|
| @wavelace/formula | 15 | 10 KB |
| Compute Engine 0.138.0 | 15 | 974 KB |
| math-expressions 3.0.0-alpha.1 | 9 | 4 MB unpacked |
| evaluatex 2.2.0 | 5 | 3.6 KB |

Compute Engine does far more (symbolic algebra, simplification, units); this does the real-valued
case, and compiles about twenty times faster.

## One thing to know

`compile` builds its function with `new Function`, which is what makes it fast. A page with a strict
Content Security Policy must allow `'unsafe-eval'` for it to run.

## Licence

MIT. This package is generated from the Wavelace source, the same two files the site runs, byte for
byte; their comments speak of the app (its renderers, its rail, its plate) because that is where they
live. Changes are made there, so issues are welcome here and pull requests are ported upstream by hand.
