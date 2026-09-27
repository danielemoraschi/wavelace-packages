# @wavelace/formula

Paste a formula as a textbook prints it, get a fast JavaScript function back. The formula layer of
[Wavelace](https://www.wavelace.com), the animated maths visualiser, published on its own: LaTeX in,
a plain expression out, a compiled function of real numbers, and a printer for showing it back.

```js
import {compile, bindable, pretty} from "@wavelace/formula";

const f = compile("\\frac{\\sin(kx - \\omega t)}{x}", {k: 2, ω: 3});
f(0.7, 0, 0, 0, 0, 0, 0, 0.1);                 // a number

const wave = bindable("A \\sin(kx - \\omega t)");
wave.names;                                    // ["A", "k", "ω"]: one slider each
const g = wave.bind({A: 2});                   // rebinding is one call, never a recompile

pretty("\\int_0^x \\cos(u^2) du");             // "∫₀^x cos(u²) du"
```

## What it reads

`\frac`, `\sqrt`, powers in braces, `\sin x` without brackets, `\cos^2 x`, `\sin^{-1}`, the Greek
letters, subscripts (`x_0`, `\omega_0`), `90^\circ`, `\left( … \right)`, `\begin{cases}`,
`\int_a^b … du`, `\sum_{k=1}^{n}`, `\prod`, `\frac{d}{dx}`, `x!`, and the silent products a textbook
writes: `2x`, `2\pi x`, `\sin x \cos y`, `kx`. Pasted symbols work too: `π`, `θ`, `²`, `·`, `−`, `√`.
The whole language is documented at [wavelace.com/documentation](https://www.wavelace.com/documentation).

A single letter the language does not claim (`a`, `k`, `ω`, `x_0`) is a **free name**: it takes its
value from the values you pass, and is 1 until you do. A longer unknown name is refused rather than
guessed at, so a mistyped `sni(x)` says so instead of growing three free names.

## The one signature

Every formula compiles to the same function, `(x, y, z, r, th, u, v, t) => number`, whatever it names:
`th` is the polar angle θ, and a caller feeds the variables it has. That is Wavelace's own choice, kept
as it is; `readsVars` says which of the eight a formula actually reads.

## Beside the other libraries

Fifteen textbook formulas, each value checked against the arithmetic (27 September 2026; the script
that produced this is in this repository, so the numbers can be rerun rather than trusted):

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
