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

A single letter the language does not claim (`a`, `k`, `ω`, `x_0`) is a **free name**: a parameter
the caller supplies, 1 until it is given. `bindable` compiles once and lists them; `bind` gives them
values, and costs one call, never a recompile, so it can run on every slider movement.

```js
import {bindable, isFreeName, FREE_DEFAULT} from "@wavelace/formula";

const wave = bindable("a \\sin(kx) + c");
wave.names   // → ["a", "k", "c"]

const f = wave.bind({a: 2, k: 3});   // c is not given, so it is FREE_DEFAULT
f(Math.PI / 6, 0, 0, 0, 0, 0, 0, 0)   // → 3
FREE_DEFAULT   // → 1

isFreeName("k")   // → true
isFreeName("x")   // → false
```

In a page, build one `<input type="range">` per name in `wave.names`, and on each `input` event call
`wave.bind(values)` with the current values.

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
