/* @wavelace/embed: the public API. tools/pkg.js reads the exported names off this file, so a name declared
 * here is exported by the package and a name missing here is not. The unions below are held to the app's
 * own tables by the Wavelace source's tests. */

/** Wavelace's renderers: how a formula is drawn. */
export type Renderer = "wave" | "polar" | "surface" | "curve" | "shape" | "complex" | "quantum" | "quantum2d" | "flow" | "swarm" | "bodies" | "bellman";
/** The dials a link may set, as the app's rail names them. */
export type Dial = "span" | "speed" | "amp" | "depth" | "turns" | "vspan" | "x0" | "y0" | "z0" | "seeds" | "sigma" | "k0";
/** A named camera angle; fit frames the whole plot. */
export type View = "iso" | "top" | "front" | "side" | "fit";
/** The iframe's shape: an aspect ratio, or fill, which takes its parent's height. */
export type Size = "4:3" | "16:9" | "1:1" | "fill";

export interface EmbedOptions {
  /** A preset, by its slug ("chirp-wave") or its index in PRESETS. Alone, it is a whole plot. */
  preset?: string | number;
  /** A formula to draw, with its renderer; with a preset too, the preset is where it came from. */
  formula?: string;
  /** The three formulas of the curve and shape renderers. */
  formulas?: {x: string; y: string; z: string};
  /** The renderer that draws formula or formulas. */
  renderer?: Renderer;
  /** The title the plot shows, with a formula of your own. */
  name?: string;
  /** Values for the formula's free letters (a, k, ω…), which are 1 until given. */
  values?: Record<string, number>;
  /** Dial values; the embed keeps each within its range. */
  dials?: Partial<Record<Dial, number>>;
  /** Light or dark; left out, the embed follows the reader's system. */
  theme?: "light" | "dark";
  view?: View;
  /** click (the default): the wheel zooms only after a click; always; or false, never. */
  zoom?: "click" | "always" | false;
  /** Whether time runs (default true). */
  play?: boolean;
  /** Whether the camera turns on its own (default false). */
  spin?: boolean;
  ground?: boolean;
  trace?: boolean;
  particles?: boolean;
  fill?: boolean;
  /** The playback deck (default true). */
  deck?: boolean;
  /** The formula panel (default true). */
  showFormula?: boolean;
  /** The plot's title (default true). */
  title?: boolean;
  /** Dragging turns the camera (default true). */
  orbit?: boolean;
  /** Right-dragging moves it (default true). */
  pan?: boolean;
  /** Where Wavelace is served (default https://www.wavelace.com). */
  site?: string;
}

/** What the frame is made of: its link, its title for assistive technology, lazy loading, and its size. */
export interface FrameAttributes {
  readonly src: string;
  readonly title: string;
  readonly loading: "lazy";
  readonly style: Readonly<Record<string, string>>;
}

/** An embedded plot: its iframe, a new plot, and taking it out. */
export interface Embedded {
  /** The frame on show: update may replace it. */
  readonly iframe: HTMLIFrameElement;
  /** A new plot in the same frame, which the embed reads without reloading: the formula, the theme, the chrome
   *  and the pointer alike. Only another site puts a fresh frame in its place. */
  update(options: EmbedOptions): void;
  remove(): void;
}

/** The link to the embed page for these options. Throws, saying what to change, on an option it does not know. */
export function embedUrl(options: EmbedOptions): string;
/** The <iframe> the Wavelace Embed panel writes, for a server-rendered page. */
export function embedHtml(options: EmbedOptions, size?: Size): string;
/** The iframe's attributes as data, for a framework that makes the element itself: style is an object in the
 *  DOM's camelCase (aspectRatio), as React, Vue and Svelte take it. The same frame embedHtml writes. */
export function embedAttributes(options: EmbedOptions, size?: Size): FrameAttributes;
/** An iframe of the plot, appended to container. */
export function embed(container: Element, options: EmbedOptions, size?: Size): Embedded;

/** Every preset, by index: its slug, its name, and the renderer it opens in. */
export const PRESETS: readonly {readonly slug: string; readonly name: string; readonly renderer: Renderer}[];
/** Every renderer. */
export const RENDERERS: readonly Renderer[];
