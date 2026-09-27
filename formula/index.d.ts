/* @wavelace/formula: the public API. tools/pkg.js reads the exported names off this file, so a name
 * declared here is exported by the package and a name missing here is not. */

/** A compiled formula: every formula is a function of the same eight variables, and a caller feeds
 *  the ones it has. th is the polar angle θ; the rest are as named. */
export type Formula = (x: number, y: number, z: number, r: number, th: number, u: number, v: number, t: number) => number;

/** What the free names (a single letter the language does not claim, like a or ω) are worth. */
export type Values = Readonly<Record<string, number>>;

/** A formula compiled once with its free names still open. */
export interface Bindable {
  /** The free names, in order of first appearance. */
  readonly names: readonly string[];
  /** The formula with each free name bound to values[name], or FREE_DEFAULT. Cheap: no recompile. */
  bind(values?: Values): Formula;
  /** The normalized source. */
  readonly text: string;
}

/** A LaTeX subset translated into the formula language: \frac, \sqrt, \sin x, \int_a^b … du, \sum,
 *  \frac{d}{dx}, cases, and the silent products (2x, \sin x \cos y). Throws with a readable message. */
export function fromLatex(src: string): string;
/** fromLatex, with pasted symbols (π, θ, ², ·, −) read first and a run of letters like kx read as a
 *  product. What compile reads. Throws with a readable message. */
export function normalize(src: string): string;
/** The formula as it reads on a plate: 3x, θ, π, · for products, superscript powers, ∫ with limits. */
export function pretty(src: string): string;
/** One name as the plate prints it: th as θ, x_1 as x₁. */
export function prettyName(name: string): string;
/** Compile once, bind many times. Throws with a readable message. */
export function bindable(src: string): Bindable;
/** Compile and bind in one call. Throws with a readable message. */
export function compile(src: string, values?: Values): Formula;
/** Which of the eight variables a formula names. Conservative: a bound dummy called v counts as v. */
export function readsVars(src: string): Set<string>;
/** Whether a name would be a free name, and so take a value from Values. */
export function isFreeName(name: string): boolean;

/** The eight variables, in the order a Formula takes them. */
export const VARS: readonly ["x", "y", "z", "r", "th", "u", "v", "t"];
/** The functions and constants a formula may name, by name. */
export const ENV: Readonly<Record<string, unknown>>;
/** The four binders (integral, sum, prod, diff): their parts and the LaTeX that pastes as each. */
export const BINDERS: Readonly<Record<string, {readonly parts: readonly string[]; readonly paste: string}>>;
/** The Greek commands a formula may use as letters, and the glyph each becomes: \omega is ω. */
export const GREEK: Readonly<Record<string, string>>;
/** What a free name is worth until it is given a value. */
export const FREE_DEFAULT: number;
