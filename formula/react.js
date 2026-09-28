/*! @wavelace/formula/react 0.2.0 | MIT | © 2026 Daniele Moraschi | generated from tools/pkg/formula/react.js */
/* @wavelace/formula/react: a formula in a React app, as Wavelace's own rail has one
 *
 * useFormula compiles, FormulaField is where a reader types, Plate shows a formula as it reads. The file is
 * published as it is written, with no build between, so it is plain calls rather than JSX. React is an
 * optional peer of the package: this subpath is the only module that imports it. Its components hold state,
 * so it is marked for the client, which lets a server component (Next.js's App Router) import it. */
"use client";
import {createElement, Fragment, useEffect, useId, useMemo, useRef, useState} from "react";
import {bindable, pretty, FREE_DEFAULT} from "./index.js";

// Wavelace's rail waits this long after the last key before it lays out a formula's sliders
const TYPING_PAUSE = 350;
// the site's own maths face and its fallbacks, upright, at the one weight Computer Modern is served in
const PLATE_STYLE = {fontFamily: '"CMU Serif", "Latin Modern Roman", "Iowan Old Style", Georgia, "Times New Roman", serif',
                     fontStyle: "normal", fontWeight: 500};
const NO_VALUES = Object.freeze({});
const NO_NAMES = Object.freeze([]);

export function useFormula(text, values = NO_VALUES){
  const attempt = useMemo(() => attemptOf(text), [text]);
  const shown = useLastCompiled(attempt);
  const names = shown?.formula.names ?? NO_NAMES;
  // the values the formula reads, as one key: a new object holding the same values binds nothing again
  const key = names.map(name => values[name] ?? FREE_DEFAULT).join(",");
  const fn = useMemo(() => shown?.formula.bind(valuesOf(names, key)) ?? null, [shown, names, key]);
  const plate = shown?.plate ?? "";
  return useMemo(() => ({fn, error: attempt.error, plate, freeNames: names}), [fn, attempt.error, plate, names]);
}

export function FormulaField({value, defaultValue = "", onChange, onFormula, values, delay = TYPING_PAUSE, refusalClassName, ...inputProps}){
  // the text last typed; uncontrolled, it is also the text on show
  const [typedText, setTypedText] = useState(null);
  const text = value === undefined ? typedText ?? defaultValue : value;
  const formula = useFormula(useTypingPause(text, text === typedText, delay), values);
  useReport(onFormula, formula);
  const refusalId = useId();
  const handleChange = event => {
    setTypedText(event.target.value);
    onChange?.(event.target.value);
  };
  const refused = formula.error !== null;
  return createElement(Fragment, null,
    createElement("input", {...inputProps, type: "text", spellCheck: false, value: text, onChange: handleChange,
                            "aria-invalid": refused, "aria-describedby": describedBy(inputProps["aria-describedby"], refused && refusalId)}),
    createElement("span", {id: refusalId, className: refusalClassName, "aria-live": "polite"}, formula.error ?? ""));
}

export function Plate({formula, style, ...spanProps}){
  const plate = useMemo(() => plateOf(formula), [formula]);
  return createElement("span", {...spanProps, style: {...PLATE_STYLE, ...style}}, plate);
}

// one compile of the text: the formula with its names still open and how it reads, or compile's words for why not
function attemptOf(text){
  try{ return {formula: bindable(text), plate: pretty(text), error: null}; }
  catch(e){ return {formula: null, plate: null, error: e.message}; }
}

// the last attempt that compiled: while the text is refused, the formula before it stays on show, as the
// app's plot does. React's pattern for state kept from an earlier render, set while rendering.
function useLastCompiled(attempt){
  const [lastCompiled, setLastCompiled] = useState(attempt.formula ? attempt : null);
  if(attempt.formula && attempt !== lastCompiled) setLastCompiled(attempt);
  return attempt.formula ? attempt : lastCompiled;
}

// the values back out of their key, in the formula's own order
function valuesOf(names, key){
  const values = key.split(",");
  return Object.fromEntries(names.map((name, i) => [name, Number(values[i])]));
}

// The text to compile. What was typed waits for typing to pause, so a slider laid out from the names does not
// come and go with every key (the s of sin is a name for a moment); a text set from outside, a preset picked,
// is not typing and lands at once, both as the app's rail has it. At once means while rendering, React's way
// for state that follows a prop, so no render shows the old text first. The cleanup restarts the wait at each key.
function useTypingPause(text, typing, delay){
  const [settled, setSettled] = useState(text);
  if(!typing && text !== settled) setSettled(text);
  useEffect(() => {
    if(!typing) return undefined;
    const timer = setTimeout(() => setSettled(text), delay);
    return () => clearTimeout(timer);
  }, [text, typing, delay]);
  return settled;
}

// onFormula once per new result: the latest callback is kept aside, so a parent's inline function, new at
// every render, is not taken for a new result (useEffectEvent does this from React 19.2; the package supports
// React 18). It is called from an effect rather than from the keystroke, as React would otherwise advise,
// because the result is only known once typing has paused, well after the event that caused it.
function useReport(onFormula, formula){
  const latest = useRef(onFormula);
  useEffect(() => { latest.current = onFormula; });
  useEffect(() => { latest.current?.(formula); }, [formula]);
}

// the caller's own description and the refusal, when there is one
const describedBy = (...ids) => ids.filter(Boolean).join(" ") || undefined;

// a plate shows and does not judge: a text pretty cannot read yet, half typed, is shown as it was written
function plateOf(formula){
  try{ return pretty(formula); }
  catch{ return formula; }
}

