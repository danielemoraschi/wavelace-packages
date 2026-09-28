/* @wavelace/formula/react: the public API of the React subpath. tools/pkg.js reads the exported names off
 * this file, so a name declared here is exported by react.js and a name missing here is not. React 18 or
 * later is a peer of the package, needed only by this subpath. */
import type {HTMLAttributes, InputHTMLAttributes, ReactElement, Ref} from "react";
import type {Formula, Values} from "./index.js";

/** A formula as a component shows it: what to draw, how it reads, its sliders, and why the text is refused. */
export interface FormulaState {
  /** The last text that compiled, bound to the values given. Null only until a text has compiled: a refused
   *  text keeps the formula before it, so a plot does not blank out at every half-typed key. */
  readonly fn: Formula | null;
  /** compile's own words for why the text now is refused, or null when it compiles. */
  readonly error: string | null;
  /** How the formula that compiled reads (pretty): Unicode text, "" until one has. */
  readonly plate: string;
  /** Its free names, in order of first appearance: one slider each. */
  readonly freeNames: readonly string[];
}

/** Compiles text once per text and binds it once per change of the values its names read, so a slider drag
 *  never compiles again. A name missing from values is worth FREE_DEFAULT. It never waits: FormulaField does. */
export function useFormula(text: string, values?: Values): FormulaState;

export interface FormulaFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "type"> {
  /** The text, for a controlled field. */
  value?: string;
  /** The text it opens with, for an uncontrolled field. */
  defaultValue?: string;
  /** At every key, with the text. */
  onChange?(text: string): void;
  /** Once per new result: on mount, when typing pauses, and at once when value is set from outside. */
  onFormula?(formula: FormulaState): void;
  /** What the free names are worth. */
  values?: Values;
  /** How long typing must pause, in milliseconds, before the text is compiled (350, as Wavelace's rail). */
  delay?: number;
  /** A class for the refusal, which is shown after the input and described to assistive technology. */
  refusalClassName?: string;
  /** The input itself, for focus. React 19 passes it; React 18 gives a function component no ref. */
  ref?: Ref<HTMLInputElement>;
}
/** A text input for a formula, followed by its refusal in compile's own words. */
export function FormulaField(props: FormulaFieldProps): ReactElement;

export interface PlateProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The formula to show, as it was typed. */
  formula: string;
}
/** A formula as it reads, in a span: the text is pretty's, set upright in Computer Modern when the page has
 *  the face (the computer-modern package's cmu-serif.css) and in a serif when it has not. A text pretty
 *  cannot read is shown as written. */
export function Plate(props: PlateProps): ReactElement;
