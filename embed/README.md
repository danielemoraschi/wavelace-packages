# @wavelace/embed

[Wavelace](https://www.wavelace.com)'s animated maths plots in your page: any of its presets, or a
formula of your own, as an iframe, from a few options. The package writes the link and the frame; the
plot itself is drawn by Wavelace's embed page, so the package is small and never goes out of date with
the renderers.

```js
import {embedUrl} from "@wavelace/embed";

embedUrl({preset: "chirp-wave"})   // → "https://www.wavelace.com/embed#p=0"
```

Every example below runs as written: the package's tests execute this README and check each value
marked `// →`.

## Embed a preset

A preset alone is a whole plot, named by its slug (the end of its page's address,
`wavelace.com/presets/chirp-wave`) or by its index. `PRESETS` lists them all, for a picker.

```js
import {embedUrl, PRESETS} from "@wavelace/embed";

PRESETS[0]                        // → {"slug": "chirp-wave", "name": "Chirp Wave", "renderer": "wave"}
PRESETS.length > 100              // → true
embedUrl({preset: 0})             // → "https://www.wavelace.com/embed#p=0"

const polar = PRESETS.filter(p => p.renderer === "polar").map(p => p.slug);
polar.includes("polar-mandala")   // → true
```

## Your own formula

A formula goes with the renderer that draws it, and may take a title. The curve and shape renderers
draw three formulas at once, `x`, `y` and `z`.

```js
import {embedUrl, RENDERERS} from "@wavelace/embed";

embedUrl({formula: "\\sin(kx - \\omega t)", renderer: "wave", name: "Travelling wave"})
// → "https://www.wavelace.com/embed#m=wave&n=Travelling+wave&f=%5Csin%28kx+-+%5Comega+t%29"

embedUrl({formulas: {x: "\\cos u", y: "\\sin u", z: "u/5"}, renderer: "curve"})
// → "https://www.wavelace.com/embed#m=curve&fx=%5Ccos+u&fy=%5Csin+u&fz=u%2F5"

RENDERERS.slice(0, 5)   // → ["wave", "polar", "surface", "curve", "shape"]
```

The formula is LaTeX as a textbook prints it; the language is documented at
[wavelace.com/documentation](https://www.wavelace.com/documentation), and
[@wavelace/formula](https://www.npmjs.com/package/@wavelace/formula) reads the same language, if you want
to check a formula before you embed it.

## Letters and dials

A single letter the formula does not otherwise claim (`a`, `k`, `ω`) is a slider in the embed, 1 until
you give it a value. The dials are the ones on Wavelace's rail, speed among them.

```js
import {embedUrl} from "@wavelace/embed";

embedUrl({formula: "a \\sin(kx)", renderer: "wave", values: {a: 2, k: 3}, dials: {speed: 0.5}})
// → "https://www.wavelace.com/embed#m=wave&f=a+%5Csin%28kx%29&let=a%3A2%2Ck%3A3&speed=0.5"
```

## How it looks and moves

Only what differs from the embed's defaults is written into the link. Left out, the theme follows the
reader's system, time runs, the camera turns only when dragged, and the wheel zooms after a click.

```js
import {embedUrl} from "@wavelace/embed";

embedUrl({preset: "chirp-wave", theme: "dark", view: "top", zoom: "always"})
// → "https://www.wavelace.com/embed#p=0&theme=dark&zoom=always&view=top"

// a still, bare picture: no time, no deck, no formula panel, no title
embedUrl({preset: "chirp-wave", play: false, deck: false, showFormula: false, title: false})
// → "https://www.wavelace.com/embed#p=0&play=0&deck=0&formula=0&title=0"

// turning on its own, and not to be moved by the reader
embedUrl({preset: "chirp-wave", spin: true, orbit: false, pan: false, zoom: false})
// → "https://www.wavelace.com/embed#p=0&spin=1&orbit=0&pan=0&zoom=0"
```

## Server-rendered pages

`embedHtml` writes the `<iframe>` that Wavelace's own Embed panel writes, for a static site, a template
or a Markdown page. The sizes are the panel's: `4:3` (the default), `16:9`, `1:1`, and `fill`, which
takes its parent's height.

```js
import {embedHtml} from "@wavelace/embed";

embedHtml({preset: "chirp-wave"}, "16:9")
// → "<iframe src=\"https://www.wavelace.com/embed#p=0\" title=\"Wavelace\" loading=\"lazy\" style=\"display:block;width:100%;aspect-ratio:16/9;border:0\"></iframe>"
```

## In a page

`embed` appends the frame to an element and hands back `update`, which switches the plot in the same frame:
the embed page reads a new link without reloading, the formula, the theme, what it shows around the plot and
what the mouse may do alike. Only a new `site` puts a fresh frame in its place.

```html
<div id="plot"></div>
<select id="pick"></select>
<script type="module">
  import {embed, PRESETS} from "https://cdn.jsdelivr.net/npm/@wavelace/embed/+esm";

  const pick = document.querySelector("#pick");
  for (const p of PRESETS) pick.add(new Option(p.name, p.slug));

  const plot = embed(document.querySelector("#plot"), {preset: "chirp-wave", theme: "dark"}, "16:9");
  pick.addEventListener("change", () => plot.update({preset: pick.value, theme: "dark"}));
</script>
```

## In React

`@wavelace/embed/react` is the frame as a component, `<Embed>`. Its props are the options above, with
`size` and `className` beside them, and, from React 19, a `ref` to the iframe itself. It comes with the package: React 18 or later is an optional peer, and
only this subpath imports it. Types are included. Every React example below runs as written: the tests
render it into a page and check each value marked `// →` once the page has rendered.

### A preset picker

New props change the frame's link, which the embed page reads without reloading: the plot, the theme, what
it shows around the plot and what the mouse may do alike. Only a new `site` puts a fresh frame in its place.

```jsx
import {useState} from "react";
import {createRoot} from "react-dom/client";
import {PRESETS} from "@wavelace/embed";
import {Embed} from "@wavelace/embed/react";

function Gallery() {
  const [preset, setPreset] = useState("chirp-wave");
  return (
    <>
      <select value={preset} onChange={e => setPreset(e.target.value)} aria-label="Preset">
        {PRESETS.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
      </select>
      <Embed preset={preset} theme="dark" size="16:9" />
    </>
  );
}

createRoot(document.getElementById("root")).render(<Gallery />);

document.querySelector("iframe").getAttribute("src")   // → "https://www.wavelace.com/embed#p=0&theme=dark"
```

### A formula of your own, with your own controls

A formula's letters take their values from `values`, so a control on your page can drive the plot, the
slider in the frame hidden with the formula panel if you like. A LaTeX string in a JSX attribute needs no
escaping: `formula="\sin(k x - t)"` is the formula as written.

```jsx
import {useState} from "react";
import {createRoot} from "react-dom/client";
import {Embed} from "@wavelace/embed/react";

function Tunable() {
  const [k, setK] = useState(3);
  return (
    <>
      <input type="range" min={1} max={10} step={1} value={k} onChange={e => setK(Number(e.target.value))} aria-label="k" />
      <Embed formula="\sin(k x - t)" renderer="wave" values={{k}} name="A travelling wave" showFormula={false} />
    </>
  );
}

createRoot(document.getElementById("root")).render(<Tunable />);

document.querySelector("iframe").getAttribute("src")
// → "https://www.wavelace.com/embed#m=wave&n=A+travelling+wave&f=%5Csin%28k+x+-+t%29&let=k%3A3&formula=0"
```

### When an option is wrong

An option `<Embed>` does not know, or a value of the wrong kind, throws while rendering, in the words
[above](#errors-that-say-what-to-change), rather than writing a link that quietly shows something else.
Where the options come from outside your code (a CMS, a query string), put the frame inside an
[error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary),
as for any component that can throw, or ask `embedUrl` first, which throws the same way.

### On the server

`<Embed>` holds no state, so it renders anywhere React does: in a server component (a Next.js App Router
page included) with no `"use client"`, and to markup, the frame the Embed panel writes.

```jsx
import {renderToStaticMarkup} from "react-dom/server";
import {Embed} from "@wavelace/embed/react";

renderToStaticMarkup(<Embed preset="chirp-wave" size="1:1" />)
// → "<iframe src=\"https://www.wavelace.com/embed#p=0\" title=\"Wavelace\" loading=\"lazy\" style=\"display:block;width:100%;aspect-ratio:1/1;border:0\"></iframe>"
```

## Other frameworks

`embedAttributes` is the same frame as data, for a framework that makes the element itself: the style is
an object in the DOM's own spelling, as Vue, Svelte and Solid take it.

```js
import {embedAttributes} from "@wavelace/embed";

embedAttributes({preset: "chirp-wave"}, "16:9")
// → {"src": "https://www.wavelace.com/embed#p=0", "title": "Wavelace", "loading": "lazy", "style": {"display": "block", "width": "100%", "aspectRatio": "16/9", "border": "0"}}
```

## Errors that say what to change

An option the embed would not understand is refused, rather than written into a link that quietly shows
something else.

```js
import {embedUrl} from "@wavelace/embed";
const why = options => { try { embedUrl(options); return null; } catch (e) { return e.message; } };

why({})                                // → "say what to show: a preset, or a formula with its renderer"
why({preset: "chirpwave"})             // → "no preset called chirpwave: PRESETS lists them"
why({preset: "chirp-wave", theme: "blue"})   // → "theme is light or dark, not blue"
why({preset: 0, view: "left"})         // → "no view called left: view is one of iso, top, front, side or fit"
why({preset: 0, spin: "yes"})          // → "spin is true or false, not yes"
why({preset: "chirp-wave"})            // → null
```

## Another address

`site` points the link somewhere else: a preview deployment, or a copy you serve yourself.

```js
import {embedUrl} from "@wavelace/embed";

embedUrl({preset: "chirp-wave", site: "https://preview.example.com"})   // → "https://preview.example.com/embed#p=0"
```

## The options

| Option | What it sets |
|---|---|
| `preset` | A preset, by slug or index. Alone, a whole plot. |
| `formula`, `formulas` | The formula to draw (`formulas: {x, y, z}` for curve and shape), with `renderer`. |
| `renderer` | Which renderer draws the formula: one of `RENDERERS`. |
| `name` | The title shown with a formula of your own. |
| `values` | Values for the formula's free letters. |
| `dials` | Dial values: `span`, `speed`, `amp`, `depth`, `turns`, `vspan`, `x0`, `y0`, `z0`, `seeds`, `sigma`, `k0`. |
| `theme` | `light` or `dark`; left out, the reader's system decides. |
| `view` | `iso`, `top`, `front`, `side` or `fit`. |
| `zoom` | `click` (the default), `always`, or `false`. |
| `play`, `spin`, `ground`, `trace`, `particles`, `fill` | The plot's own switches. |
| `deck`, `showFormula`, `title` | What the frame shows around the plot. |
| `orbit`, `pan` | What the reader's mouse may do. |
| `site` | Where Wavelace is served. |
| `size` | `<Embed>` only (the functions take it as their second argument): `4:3`, `16:9`, `1:1` or `fill`. |
| `className` | `<Embed>` only: a class for the frame. |
| `ref` | `<Embed>` only, React 19: the iframe element, for focus or `postMessage`. |

## Licence

MIT. This package is generated from the Wavelace source, which is private; its tables of presets,
renderers and options are read out of the app each time it is built. Issues are welcome here, and pull
requests are ported upstream by hand.
