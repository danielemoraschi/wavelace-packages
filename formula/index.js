/*! @wavelace/formula 0.1.1 | MIT | © 2026 Daniele Moraschi | generated from js/latex.js and js/formula.js */
const window = {};
/* Wavelace · latex — a LaTeX subset translated into the formula language
 * reads:   nothing
 * exports: fromLatex, eachBinder, dummiesOf, NAME, LETTER, WORD, NOT_IN_NAME, NAME_END, LETTER_OR_TH, SUBSCRIPTED_LETTER, NOT_AFTER_LETTER,
 *          GREEK, GREEK_SYMBOLS, GREEK_VARIANTS, foldVariant, COMMANDS, FUNCTIONS, BINDERS, INVERSE, CALLABLE, callShape
 *
 * So that textbook notation pastes straight in: \frac, \sqrt, powers in braces, \sin and
 * friends, \pi and \theta, the other Greek letters as names of the formula's own (each becomes its
 * glyph, so \omega is ω from here on, a letter to every scanner below and a free name to formula.js;
 * LETTER is the one class that says what a letter is), a subscripted letter as a name of its own
 * (x_1, \omega_0, x_{max}: the identifier x_1, and free too), 90^\circ and a pasted 90° as deg(90),
 * \cdot, \left( … \right), e^{…}, and
 * \int_a^b … du, which becomes the formula language's integral(…, u, a, b). LaTeX's silent products (2x, 2\pi x,
 * \sin x \cos y) become explicit, and that rule runs for every formula, so cos(3x − t) works
 * whether or not a backslash is in sight. Anything left over that starts with a backslash is
 * reported by name rather than failing as an illegal character. The scanner of the binder calls —
 * integral, sum, prod and diff, which each bind an expression to a dummy, the first three over a
 * range and diff at the point the outer variable holds — and the names they bind are exported for
 * formula.js, which reads this file. */
(() => {
"use strict";
const WL = window.Wavelace = window.Wavelace || {};

// The Greek letters that are names here, each as its glyph. Not the ones that already stand for
// something: \pi, \theta, \vartheta and \tau are quantities, \Gamma the gamma function, and \Sigma and
// Pi the operators, since the pasted Σ already means \sum and a plate printing Σ would paste back as
// a sum (GREEK_SYMBOLS below is that list as glyphs). Not the ones a reader cannot tell from Latin:
// omicron reads as o and Upsilon as Y, and a dial that reads as Y and is not Y is the silent kind of
// wrong. \varpi is π in another hand. The \var… forms are their plain letter, one dial each. Since
// the glyph is the name, \gamma and gamma never meet.
const GREEK = {alpha:"α", beta:"β", gamma:"γ", delta:"δ", epsilon:"ε", varepsilon:"ε", zeta:"ζ", eta:"η",
               iota:"ι", kappa:"κ", varkappa:"κ", lambda:"λ", mu:"μ", nu:"ν", xi:"ξ", rho:"ρ", varrho:"ρ",
               sigma:"σ", varsigma:"σ", upsilon:"υ", phi:"φ", varphi:"φ", chi:"χ", psi:"ψ", omega:"ω",
               Delta:"Δ", Theta:"Θ", Lambda:"Λ", Xi:"Ξ", Phi:"Φ", Psi:"Ψ", Omega:"Ω"};
const GREEK_LETTERS = [...new Set(Object.values(GREEK))].join("");
// the pasted Greek that stands for a command: normalize (formula.js) turns each into that command,
// so one reader owns them and \int_0^\pi takes π as one limit, and what the plate prints pastes back
const GREEK_SYMBOLS = {"θ": "theta", "ϑ": "theta", "π": "pi", "τ": "tau", "Γ": "Gamma", "Σ": "sum", "Π": "prod"};
// and the pasted glyphs that are one of the letters above in another hand, folded by normalize
// before any scanner reads them, so one letter is one dial however it was typed: the variant forms,
// and what a keyboard types for Δ, Ω and μ (the increment sign, the ohm sign and the micro sign)
const GREEK_VARIANTS = {"ϵ": "ε", "ϕ": "φ", "ϱ": "ρ", "ς": "σ", "ϰ": "κ", "ϐ": "β", "ϴ": "Θ",
                        "∆": "Δ", "Ω": "Ω", "µ": "μ"};
const foldVariant = glyph => Object.hasOwn(GREEK_VARIANTS, glyph) ? GREEK_VARIANTS[glyph] : glyph;   // the letter a glyph is
// what a letter is, to every scanner in this file and in formula.js: the table's own glyphs and
// no range, so that a Greek capital that looks Latin (Ε, Α, Κ) names no command and stays an
// illegal character rather than a dial that reads as E. WORD is what may continue a name;
// NOT_IN_NAME and NAME_END are the edges of one, the lookarounds that \b, ASCII in JS, is not,
// and every scanner that matches a name by spelling is built from them.
const LETTER = `A-Za-z${GREEK_LETTERS}`;
const WORD = `${LETTER}0-9_`;
const NOT_IN_NAME = `(?<![${WORD}])`, NAME_END = `(?![${WORD}])`;
const TOKEN_CHARS = `${WORD}.`;                   // what a run of letters, digits and dots is made of: 2x, x_1, 2.5
// a name of the formula's own: a letter, or th (the two letters θ is spelled with), with or without a
// subscript of letters and digits; what a free name (formula.js) and an atom of the silent product are.
// Its edge on the left is a letter or an underscore and not a digit, since 2x_1 is one glued run until
// implicitProducts puts the * in, and the passes that read the shape run before that one.
const LETTER_OR_TH = `(?:th|[${LETTER}])`;
const SUBSCRIPTED_LETTER = `${LETTER_OR_TH}(?:_[${LETTER}0-9]+)?`;
const NOT_AFTER_LETTER = `(?<![${LETTER}_])`;
const COMMANDS = {...GREEK,
                  sin:"sin", cos:"cos", tan:"tan", arcsin:"asin", arccos:"acos", arctan:"atan", sinh:"sinh", cosh:"cosh",
                  tanh:"tanh", exp:"exp", ln:"log", log:"log", min:"min", max:"max", sqrt:"sqrt",
                  cdot:"*", times:"*", div:"/", pi:"pi", theta:"th", vartheta:"th", tau:"tau", infty:"inf",
                  sec:"sec", csc:"csc", cot:"cot", sum:"sum", prod:"prod",
                  Gamma:"gamma",                 // the gamma function; lowercase \gamma is the letter γ, in GREEK above
                  arcsinh:"asinh", arccosh:"acosh", arctanh:"atanh",
                  arsinh:"asinh", arcosh:"acosh", artanh:"atanh",
                  // the fences are named commands standing for a call, like cdot stands for *; by
                  // the time this table is read the \left or \right before one has been stripped
                  lfloor:"floor(", rfloor:")", lceil:"ceil(", rceil:")",
                  // the relations, which are only meaningful inside a ternary: x \le 1 ? x : 1
                  le:"<=", leq:"<=", ge:">=", geq:">=", ne:"!=", neq:"!="};
const FUNCTIONS = ["sin","cos","tan","asin","acos","atan","atan2","sinh","cosh","tanh","exp","log","log2","log10",
                   "sqrt","cbrt","abs","sign","floor","ceil","round","min","max","pow","hypot",
                   "gamma","factorial","combinations","erf","besselJ","superformula","sinc","deg","sec","csc","cot",
                   "asinh","acosh","atanh"];
// the ones whose first argument is an expression bound to a dummy: their parts, and what to paste
// instead of writing the call. They are not in FUNCTIONS — applyFunctions would take that
// expression for an atom — but they are callable. Three bind their dummy over a range and are
// given it; diff differentiates at the point the outer variable already holds, so it needs nothing
// after the name. One entry per head, the way every other table in this file is keyed: the part
// names give the arity by their count and the signature by their spelling, so a binder is added
// here and nowhere else.
const OVER_RANGE = ["expression", "variable", "from", "to"];
const BINDERS = {
  integral: {parts: OVER_RANGE, paste: String.raw`\int_a^b … du`},
  sum:      {parts: OVER_RANGE, paste: String.raw`\sum_{k=1}^{n}`},
  prod:     {parts: OVER_RANGE, paste: String.raw`\prod_{k=1}^{n}`},
  diff:     {parts: ["expression", "variable"], paste: String.raw`\frac{d}{dx}`},
};
const BINDER_NAMES = Object.keys(BINDERS);
const IN_WORDS = ["", "one", "two", "three", "four"];
const callShape = head => `${head}(${BINDERS[head].parts.join(", ")})`;
// every name that may head a call, which operandEnd needs to know so that e^sin(x) is exp(sin(x))
// and \sum of a \sum takes the inner call whole. Not FUNCTIONS ∪ BINDERS: FUNCTIONS is the set
// that may be applied to a bare atom, and mod is deliberately absent from it (mod x means
// nothing) while mod(x, 2) is a call like any other. The invariant: every function-valued key of
// ENV in formula.js belongs here.
const CALLABLE = new Set([...FUNCTIONS, ...BINDER_NAMES, "mod"]);
// sin^{-1} is asin, not 1/sin — only the names INVERSE lists; anything else carrying a ^{-1} is
// refused by name (applyFunctions), since reading it as a reciprocal would be a guess.
const INVERSE = {sin:"asin", cos:"acos", tan:"atan", sinh:"asinh", cosh:"acosh", tanh:"atanh"};
const INVERSES_OFFERED = Object.keys(INVERSE).map(f => `${f}^{-1}`).join(", ");
const MINUS_ONE = /^\^(?:\(\s*-\s*1\s*\)|-1)$/;  // ^{-1}, the pasted ⁻¹, and the unbraced ^-1
// The separator translateCommands leaves where the author wrote none. A command and a pasted symbol
// both expand to a padded name — \theta to " th " — so that x\theta cannot become the single name
// xth; but padding is a space the author did not type, and atomEnd reads a contiguous run, so
// \sin 2\theta ended its atom at the 2 and drew sin(2)·th. LaTeX settles which spaces are real: one
// space after a control word terminates the name and means nothing, so 2\theta and 2\theta{} are the
// same atom while the typed space of \sin 2 \theta separates, as sin 2 x does. This character carries
// that distinction from translateCommands to atomEnd, which is the only scanner that reads it
// differently; skipSpaces takes it for a space, and fromLatex turns every one back into a space
// before implicitProducts, so nothing downstream of the atom scanners can tell it was ever here.
const GLUE = "\u0001";
const TOKEN = new RegExp(`^[${TOKEN_CHARS}]+`), NAME = new RegExp(`^[${LETTER}][${LETTER}0-9]*$`);   // a run of letters, digits and dots (2x, x_1, 2.5); a name
// names that multiply whatever follows them: the constants spelled with more than one letter (th,
// pi, tau, inf, read off COMMANDS so one added there multiplies without a second edit) and any
// SUBSCRIPTED_LETTER, a plot variable, a constant or a free name (formula.js), an atom as a
// binder's dummy already was
const NAMED_ATOMS = [...new Set(Object.values(COMMANDS))].filter(n => n.length > 1 && NAME.test(n) && !CALLABLE.has(n));
const ATOMS = [...NAMED_ATOMS, SUBSCRIPTED_LETTER].join("|");
const EXPONENT = new RegExp(`^-?[${TOKEN_CHARS}]+`);                // a token, and an exponent may be negative
// the end-anchored forms of the two above, for the one pass that scans backwards: what may sit
// before the ( of a call (a subscripted name too, so x_1(y)! is what x(y)! is), and the run that is
// an operand on its own. BANG skips the ! of !=.
// the operand run reads over GLUE as atomEnd does, so 2\theta° is (2θ)° as 2x° is (2x)°
const BANG = /!(?!=)/, DEGREE = /°/, NAME_BEFORE = new RegExp(`[${LETTER}][${WORD}]*$`);
const OPERAND_BEFORE = new RegExp(`[${TOKEN_CHARS}]+(?:${GLUE}+[${TOKEN_CHARS}]+)*$`);
const LIMIT = new RegExp(String.raw`^(?:\\[A-Za-z]+|\d+(?:\.\d+)?|[${LETTER}])`);   // a bare limit, as LaTeX reads it: \infty, a number, one letter

/* ---------- scanning ---------- */
// the index just past the bracket group opening at text[i] ("(" or "{")
function groupEnd(text, i){
  const open = text[i], close = open === "(" ? ")" : "}";
  let depth = 0;
  for(let k = i; k < text.length; k++){
    if(text[k] === open) depth++;
    else if(text[k] === close && --depth === 0) return k + 1;
  }
  throw new Error("unbalanced brackets in formula");
}
// the index of the "(" matching the ")" at text[k]: groupEnd read backwards, for the one pass that
// scans that way (a postfix operator has to find where the thing before it began)
function groupStart(text, k){
  let depth = 0;
  for(let i = k; i >= 0; i--){
    if(text[i] === ")") depth++;
    else if(text[i] === "(" && --depth === 0) return i;
  }
  throw new Error("unbalanced brackets in formula");
}
// where the operand ending at text[k] begins: a bracket group, carrying the name of the call in
// front of it when there is one, or the run of letters, digits and dots that stands on its own.
// sign is the postfix asking, ! or °, so the refusal names it
function operandStart(text, k, sign){
  if(text[k] === ")"){
    const open = groupStart(text, k);
    const j = skipSpacesBack(text, open - 1);               // \sin(x)° arrives as " sin (x)°", the name padded
    const name = NAME_BEFORE.exec(text.slice(0, j + 1));    // sin(x)! is the factorial of sin(x)
    if(!name) return open;
    const adjacent = j === open - 1, known = CALLABLE.has(name[0]);   // across padding, only a name the language knows
    return adjacent || known ? j + 1 - name[0].length : open;
  }
  const operand = OPERAND_BEFORE.exec(text.slice(0, k + 1));
  if(!operand) throw new Error(`${sign} needs a number, a name or a bracket before it: 5${sign}, x${sign}, (x + 1)${sign}`);
  return k + 1 - operand[0].length;
}
// where the operand starting at text[i] ends: the mirror of operandStart. A bracket group, or a
// known function with its own bracket taken whole, or else an atom. Only a name the language knows
// absorbs what follows it, which is what keeps e^t(x) meaning exp(t)·x while e^sin(x) is exp(sin(x)).
function operandEnd(text, i){
  const m = TOKEN.exec(text.slice(i));
  if(m && CALLABLE.has(m[0])){
    const call = skipSpaces(text, i + m[0].length);
    if(text[call] === "(") return groupEnd(text, call);
  }
  return atomEnd(text, i);
}
// a power written ^(…) or ^token at text[i]; returns its end, or i when there is none. The exponent
// may lead with a minus, which TOKEN does not: x^-2 is the spelling half of LaTeX writes, and
// without it ^{-1} would be read as an inverse while ^-1 quietly became a product.
function powerEnd(text, i){
  if(text[i] !== "^") return i;
  if(text[i + 1] === "(") return groupEnd(text, i + 1);
  const m = EXPONENT.exec(text.slice(i + 1));
  return m ? i + 1 + m[0].length : i;
}
// an atom, what a bare function or e^ applies to: a bracket group, or a run of letters and digits
// carrying its own powers (2x, x^2, th), continued over every GLUE, which stands where the author
// wrote nothing: 2\theta is the one atom 2θ. Returns its end, or i when there is none.
function atomEnd(text, i){
  if(text[i] === "(") return groupEnd(text, i);
  let k = i;
  for(;;){
    const m = TOKEN.exec(text.slice(k));
    if(!m) break;                                    // nothing here, and on the first pass k is still i
    k += m[0].length;
    // A power binds to the token before it over GLUE as well, so \tan\theta^2 is tan(θ²), which is
    // what \tan x^2 already was. powerEnd returns its own index when what follows ^ is not an
    // exponent it can read (x^+, x^ ); stopping on that rather than asking again is what keeps this
    // loop finite whatever it is fed.
    let p = skipGlue(text, k);
    while(text[p] === "^"){
      const end = powerEnd(text, p);
      if(end === p) break;
      k = p = end;
    }
    // only GLUE continues the run, and only into another token: 2\pi x is one atom, 2 \pi is not,
    // and 2\theta( stops at the bracket exactly as 2th( would
    const glued = skipGlue(text, k);
    if(glued === k || !TOKEN.test(text.slice(glued))) break;
    k = glued;
  }
  return k;
}
// GLUE is a space to every scanner but atomEnd: it separates two names, so a function still finds
// its argument over one (\sin\theta) and a postfix ! still finds the operand before it
const skipSpaces = (text, i) => { while(text[i] === " " || text[i] === GLUE) i++; return i; };
const skipSpacesBack = (text, k) => { while(text[k] === " " || text[k] === GLUE) k--; return k; };   // its mirror, for the backward scan
const skipGlue = (text, i) => { while(text[i] === GLUE) i++; return i; };
const skipGroup = (text, k) => text[k] === "(" || text[k] === "{" ? groupEnd(text, k) - 1 : k;   // a scan's last index inside a bracket group opening at k
// the arguments of the call whose "(" is at text[open], split at the commas of its own level, and the index past ")"
function argsOf(text, open){
  const end = groupEnd(text, open), args = [];
  let start = open + 1;
  for(let k = start; k < end - 1; k++){
    k = skipGroup(text, k);
    if(text[k] === ","){ args.push(text.slice(start, k)); start = k + 1; }
  }
  args.push(text.slice(start, end - 1));
  return {args, end};
}
// every binder call — head(expr, var, …) — replaced by print(head, expr, var, …), the parts done
// first so that one inside another, or in a limit, is handled too. They share the first two: an
// expression, and the dummy it is bound over. What follows differs by head, so BINDERS says how
// many to expect and a short print takes only the parts it needs.
const BINDER_CALL = String.raw`${NOT_IN_NAME}(${BINDER_NAMES.join("|")})\s*\(`;
function eachBinder(text, print){
  const call = new RegExp(BINDER_CALL, "g");            // its own lastIndex, since this recurses
  let out = "", last = 0;
  for(let m = call.exec(text); m; m = call.exec(text)){
    const head = m[1];
    const {args, end} = argsOf(text, m.index + m[0].length - 1);
    const {parts} = BINDERS[head];
    if(args.length !== parts.length)
      throw new Error(`${head} takes ${IN_WORDS[parts.length]} parts: ${callShape(head)}`);
    out += text.slice(last, m.index) + print(head, ...args.map(a => eachBinder(a, print).trim()));
    last = end; call.lastIndex = end;
  }
  return out + text.slice(last);
}
// the names the binders bind, whichever spelling wrote them. A head is never one: as an atom it
// would turn every integral( into a product before compile could refuse it
function dummiesOf(text){
  const names = [];
  eachBinder(text, (head, expr, name) => {
    if(NAME.test(name) && !Object.hasOwn(BINDERS, name)) names.push(name);
    return "";
  });
  return names;
}
// a number or one name needs no brackets round it, anything else does: a glued run like 2x or kx is a
// product by the time the formula is read (implicitProducts, and formula.js for a run of letters), so
// \frac{1}{2x} left bare would be (1/2)*x
const LONE_VALUE = new RegExp(`^(?:\\d*\\.?\\d+|${SUBSCRIPTED_LETTER})$`);
const wrap = a => LONE_VALUE.test(a.trim()) ? a.trim() : `(${a})`;

/* ---------- the passes, in order ---------- */
// \begin{cases} x^2 & x>0 \\ -x & \text{otherwise} \end{cases} → a chain of ternaries, which the
// language already has. It runs before everything else because stripWrappers reads a \\ followed by
// a space as a thin space; the cells then flow through the rest of the pipeline as ordinary
// expressions, so \le in a condition is translated where every other \le is.
// A row is <value> & <condition>. One with no condition, or whose condition is prose, is the last
// resort; if no row matches and there is no last resort the point is a hole, as 0/0.
const CASES = /\\begin\s*\{\s*cases\s*\}([\s\S]*?)\\end\s*\{\s*cases\s*\}/g;
const OPENS_CASES = /\\begin\s*\{\s*cases\s*\}/;
// what separates a row's cells: a lone &, not the && a condition may be built from, so that
// x>0 && y>0 stays one cell rather than becoming three
const CELL_SEP = /(?<!&)&(?!&)/;
const TEXT_CMD = String.raw`text(?:rm|it|bf)?`;      // the prose commands, spelled once
const OTHERWISE = new RegExp(String.raw`^\\${TEXT_CMD}\s*\{`);
// one block's rows as a chain of ternaries, built last row first so that each becomes the else of
// the one above it. A row with no condition, or a prose one, ends the chain; if none does, nothing
// matching leaves a hole rather than a guess.
function chainOf(rowText){
  const rows = rowText.split(/\\\\/).map(r => r.trim()).filter(Boolean);
  if(!rows.length) throw new Error("\\begin{cases} needs a row: <value> & <condition>");
  let chain = "(0/0)";
  for(let i = rows.length - 1; i >= 0; i--){
    const cells = rows[i].split(CELL_SEP).map(c => c.trim());
    if(cells.length > 2)
      throw new Error("a row of \\begin{cases} is one value and one condition: x^2 & x > 0");
    const [value, when] = cells;
    chain = !when || OTHERWISE.test(when) ? `(${value})` : `((${when}) ? (${value}) : ${chain})`;
  }
  return chain;
}
function translateCases(text){
  const out = text.replace(CASES, (_, rowText) => ` ${chainOf(rowText)} `);
  // anything left open would otherwise reach stripWrappers, whose \\ guard would report the rows
  // as a stray line break — advice to use the construct the reader is already using
  if(OPENS_CASES.test(out)) throw new Error("\\begin{cases} has no matching \\end{cases}");
  return out;
}
function stripWrappers(text){
  // \\ before the control symbols below: those consume a backslash and one character, so a row
  // break left to them is read as \<space> and the first backslash escapes into the output as an
  // illegal character — where this file promises to report anything unknown by name. Refused
  // rather than turned into a space, since x^2 \\ y^2 becoming a product would be a silent
  // misreading; translateCases has taken the row breaks it owns before this runs.
  if(/\\\\/.test(text))
    throw new Error("\\\\ is a line break: this field takes one expression, or \\begin{cases}");
  return text
    // a "z =" or "\theta =" head: the field already says it. Only the left-hand sides a renderer
    // writes — y, r, z and w, the four in MODES' own groups, which test/latex.js checks against the
    // table — and any single pasted name. Anything wider swallowed what it did not understand:
    // sin(x) = 0 came out as the constant 0 and x = 1 as the constant 1, with no left side left
    // anywhere to say so. What survives this is an equation, and js/formula.js refuses it by name;
    // a Greek letter is a name and not a head, so \omega = x survives to that refusal as ω = x does.
    .replace(/^\s*(?:\\([A-Za-z]+)|[yrzw])\s*=(?!=)\s*/, (head, cmd) => cmd && Object.hasOwn(GREEK, cmd) ? head : "")
    .replace(/\$|\\\(|\\\)|\\\[|\\\]|\\displaystyle/g, " ")
    .replace(/\\[,;!:]|\\quad|\\qquad|\\ /g, " ")
    .replace(/\\left\s*\||\\lvert/g, " abs(").replace(/\\right\s*\||\\rvert/g, ") ")
    .replace(/\\left\s*\.|\\right\s*\./g, " ").replace(/\\left|\\right/g, "")
    .replace(/\\\{/g, "(").replace(/\\\}/g, ")")
    .replace(/\\(?:mathrm|text|operatorname)\s*\{d\}\s*/g, "d");        // the differential's upright d
}
// \int_a^b <integrand> d<var> → integral(<integrand>, <var>, a, b): the limits go before the subscript check sees
// them, and the differential is the first d<letter> at the integrand's own bracket level
function limitAt(text, i, needs){                         // the limit after the _ or ^ at text[i]: a bracket group (the plate prints round ones) or one token
  i = skipSpaces(text, i + 1);
  if(text[i] === "{" || text[i] === "("){ const end = groupEnd(text, i); return {value: text.slice(i + 1, end - 1), end}; }
  const m = LIMIT.exec(text.slice(i));
  if(!m) throw new Error(needs);
  return {value: m[0], end: i + m[0].length};
}
// both limits after the \int at text[i], _ and ^ in either order: {from, to, end}
function limitsAt(text, i, needs){
  const limits = {};
  for(let k = 0; k < 2; k++){
    i = skipSpaces(text, i);
    if(text[i] !== "_" && text[i] !== "^") break;
    const {value, end} = limitAt(text, i, needs);
    limits[text[i]] = value; i = end;
  }
  if(!("_" in limits && "^" in limits)) throw new Error(needs);
  return {from: limits._, to: limits["^"], end: i};
}
// \frac{du}{…}, the textbook spelling, is \frac{1}{…} du: the differential comes out where differentialAt sees it
function liftDifferentials(text){
  const re = new RegExp(String.raw`\\[dt]?frac\s*\{\s*d\s*${BOUND_VAR}\s*\}\s*(?=\{)`);
  for(let m = re.exec(text); m; m = re.exec(text)){
    const open = m.index + m[0].length, end = groupEnd(text, open);
    text = `${text.slice(0, m.index)}\\frac{1}${text.slice(open, end)} d${m[1]} ${text.slice(end)}`;
  }
  return text;
}
// a bound variable as LaTeX writes it: a command like \theta, a pasted Greek glyph, or a plain name. One spelling, shared
// by the integral's differential, the \frac{du}{…} lift and the derivative's head, because the three
// have to agree on what counts as a name — and a test pins that the derivative reads \theta the way
// the differential does. nameOf resolves it: a command through variableOf, a plain name as itself.
const BOUND_VAR = String.raw`(\\?[A-Za-z]+|[${GREEK_LETTERS}])`;
const DIFFERENTIAL = new RegExp(String.raw`d\s*${BOUND_VAR}(?![${WORD}])`, "y");   // sticky: read where the scan stands; dx_1 is no differential
const nameOf = (v, construct) => v[0] === "\\" ? variableOf(v.slice(1), construct) : v;
// the differential: d and a name (du, d u, d\theta), the d standing on its own (after a space, a bracket, a digit
// or the * the plate's · becomes), at the integrand's bracket level
function differentialAt(text, i){
  for(let k = i; k < text.length; k++){
    k = skipGroup(text, k);
    if(text[k] === "d" && (k === i || /[\s)}0-9*]/.test(text[k - 1]))){
      DIFFERENTIAL.lastIndex = k;
      const m = DIFFERENTIAL.exec(text);
      if(m) return {at: k, name: nameOf(m[1], "an integral"), end: DIFFERENTIAL.lastIndex};
    }
  }
  throw new Error("an integral needs its d<variable> after the integrand");
}
function commandOf(cmd){                           // what a LaTeX command stands for, by name
  // hasOwn, not `in`: the name is text the user pasted, and toString is on every plain object
  if(Object.hasOwn(COMMANDS, cmd)) return COMMANDS[cmd];
  throw new Error(`LaTeX command not supported: \\${cmd}`);
}
function variableOf(cmd, construct){               // the variable a LaTeX command stands for: \theta is th, \cdot is none
  const name = commandOf(cmd);
  if(NAME.test(name)) return name;
  throw new Error(`\\${cmd} cannot be ${construct}'s variable`);
}
// The derivative's head, in every spelling it is written, reduced to one marker. It has to happen
// before translateCommands turns \frac into a division — \frac{d}{dx} would become ((d)/(dx)) and
// then a silent product of two unknown names — but the term it applies to cannot be found until
// applyFunctions has made the calls, so the marker waits and translateDerivatives finishes the job.
// d and \partial mean one thing here, so one alternation reads both: a formula is already a
// function of all eight variables, and there is no total-versus-partial distinction to make. The
// plate's own d/dx is read too, which is what lets a printed derivative paste back; the pasted ∂
// arrives here as \partial, since normalize owns every symbol that stands for a command.
const D_OR_PARTIAL = String.raw`(?:d|\\partial)`;
const DERIV_HEADS = [
  new RegExp(String.raw`\\[dt]?frac\s*\{\s*${D_OR_PARTIAL}\s*\}\s*\{\s*${D_OR_PARTIAL}\s*${BOUND_VAR}\s*\}`, "g"),
  new RegExp(String.raw`(?<![${LETTER}0-9])${D_OR_PARTIAL}\s*/\s*${D_OR_PARTIAL}\s*${BOUND_VAR}`, "g"),
];
const markDerivatives = text =>
  DERIV_HEADS.reduce((marked, re) => marked.replace(re, (_, v) => ` diff_(${nameOf(v, "a derivative")}) `), text);

// the head of every integral, last first, so that an integral inside another (or in a limit) is bound before the one
// holding it; a rewrite touches nothing before its own \int, so the earlier positions hold
const NEEDS_INT = "an integral needs its limits: \\int_a^b";
const INTEGRAL = /\\int(?![A-Za-z])/g;
// every head, last first: a rewrite that begins at its own match moves only what follows it, so
// the earlier positions stay good and one scan does for all of them. translateFactorials cannot
// use this — its rewrite begins before the ! it matched, so every earlier position shifts too.
const headsIn = (re, text) => [...text.matchAll(re)].reverse();
const integralsIn = text => headsIn(INTEGRAL, text).map(m => m.index);
function translateIntegrals(text){
  if(text.search(INTEGRAL) < 0) return text;
  text = liftDifferentials(text);
  for(const at of integralsIn(text)){
    const head = at + 4 + (text.startsWith("\\limits", at + 4) ? 7 : 0);
    const {from, to, end} = limitsAt(text, head, NEEDS_INT), start = skipSpaces(text, end);
    const d = differentialAt(text, start);
    const integrand = text.slice(start, d.at).replace(/(?:\\cdot|\\times|\*)\s*$/, "").trim() || "1";   // u \cdot du, u * du: u du
    text = `${text.slice(0, at)} integral(${integrand}, ${d.name}, ${from}, ${to}) ${text.slice(d.end)}`;
  }
  return text;
}
// rewrite every \cmd{a}{b}… (argc brace arguments) as fn(args), searching again after each
function rewrite(text, cmd, argc, fn){
  const re = new RegExp("\\\\" + cmd + "(?![A-Za-z])");
  for(let m = re.exec(text); m; m = re.exec(text)){
    let i = m.index + m[0].length;
    const args = [];
    for(let a = 0; a < argc; a++){
      i = skipSpaces(text, i);
      // m[0] is the command as it was actually written, backslash and all; naming `cmd` here would
      // print the pattern that matched it (\(?:hat|bar|vec|…)) at the reader
      if(text[i] !== "{") throw new Error(`${m[0]} needs its argument in braces`);
      const end = groupEnd(text, i);
      args.push(text.slice(i + 1, end - 1)); i = end;
    }
    text = `${text.slice(0, m.index)} ${fn(args)} ${text.slice(i)}`;
  }
  return text;
}
function translateCommands(text){
  text = rewrite(text, "[dt]?frac", 2, ([a, b]) => `(${wrap(a)}/${wrap(b)})`);
  text = rewrite(text, "[dt]?binom", 2, ([n, k]) => `combinations(${n}, ${k})`);
  text = text.replace(/\\sqrt\s*\[([^\]]*)\]\s*(?=\{)/g, "\\root{$1}");
  text = rewrite(text, "root", 2, ([n, a]) => `((${a})^(1/(${n})))`);
  text = rewrite(text, "sqrt(?=\\s*\\{)", 1, ([a]) => `sqrt(${a})`);
  // \operatorname{arcsinh} is the same name \arcsinh is, so it goes through the same table; a name
  // the table does not know is passed through to be refused later as an unknown function
  text = rewrite(text, "operatorname", 1, ([name]) => {
    const trimmed = name.trim();
    return Object.hasOwn(COMMANDS, trimmed) ? COMMANDS[trimmed] : name;
  });
  // an accent decorates a name without changing what it stands for: \hat{x} is still x. This runs
  // after stripWrappers, which has already turned the differential's upright \text{d} into d —
  // dropping \text any earlier would eat it and break every \int … d\theta.
  text = rewrite(text, "(?:hat|bar|vec|tilde|overline|overrightarrow)", 1, ([a]) => `(${a})`);
  text = rewrite(text, TEXT_CMD, 1, () => " ");                    // prose, not maths: drop it
  text = text.replace(/\\log\s*_\s*\{?\s*(10|2)\s*\}?/g, " log$1 ");
  // 90^\circ is the degree sign, folded before ^{ becomes ^( and \circ is refused by name; the infix
  // f \circ g, composition, is left to that refusal
  text = text.replace(/\^\s*\{?\s*\\circ\s*\}?/g, "°");
  for(let i = text.indexOf("^{"); i >= 0; i = text.indexOf("^{")){
    const end = groupEnd(text, i + 1);
    text = `${text.slice(0, i)}^(${text.slice(i + 2, end - 1)})${text.slice(end)}`;
  }
  text = text.replace(/[{}]/g, c => c === "{" ? "(" : ")");
  // The space this consumes is LaTeX's own name terminator, not an operator: \pi x is πx. A name
  // that is not a function glues to its neighbours, so 2\theta and \theta x are single atoms, and
  // \omega t is the one atom ωt for the same reason; a
  // function name, an operator (\cdot) or a fence (\lfloor) takes a plain space instead, because
  // 2\cos x is 2 · cos x and 2cos was never an atom anyone could mean.
  return text.replace(/\\([A-Za-z]+) ?/g, (all, cmd) => {
    const name = commandOf(cmd);
    return NAME.test(name) && !CALLABLE.has(name) ? `${GLUE}${name}${GLUE}` : ` ${name} `;
  });
}
// x_1, x_{12}, x_i, \omega_0 become the identifier x_1, x_12, ω_0, a SUBSCRIPTED_LETTER. The base is
// bounded so that sum_(k=1) and diff_( are left to their own passes. What follows a subscript is set
// apart, so x_ab is x_a times b and x_{a}b is too, not the name x_{ab}. What this does not read keeps
// its underscore for refuseLeftovers to name.
const BRACED_SUB = String.raw`\([ ${GLUE}]*([${LETTER}0-9]+)[ ${GLUE}]*\)`;   // x_(12): the whole run, the braces being brackets by now
const PADDED_SUB = String.raw`${GLUE}+([${LETTER}]+)(?=${GLUE})`;            // x_ GLUE th GLUE: a command's name, whole, as translateCommands padded it
const BARE_SUB = String.raw`([0-9]+|[${LETTER}])`;                           // x_12, x_i: digits, or one letter, as LaTeX reads it
const SUBSCRIPT = new RegExp(String.raw`${NOT_AFTER_LETTER}(${LETTER_OR_TH})[ ${GLUE}]*_ *(?:${BRACED_SUB}|${PADDED_SUB}|${BARE_SUB})(?=([${WORD}]?))`, "g");
const translateSubscripts = text => text.includes("_")
  ? text.replace(SUBSCRIPT, (_, base, braced, padded, bare, next) => `${base}_${braced ?? padded ?? bare}${next ? " " : ""}`)
  : text;
// e^… is the exponential; a bare e is the constant (a digit before it means scientific notation)
const LETTER_BEFORE_E = new RegExp(`[${LETTER}_.]`);
const BARE_E = new RegExp(`(?<![${WORD}.])e(?![${WORD}])`, "g");
function translateEuler(text){
  let out = "";
  for(let i = 0; i < text.length;){
    const euler = text[i] === "e" && text[i + 1] === "^" && !LETTER_BEFORE_E.test(text[i - 1] || "");
    if(!euler){ out += text[i++]; continue; }
    // one leading minus is part of the exponent: e^-x is exp(-x), as e^{-x} already was. Taken here
    // rather than by widening atomEnd, which would also decide what \sin -x means.
    const k = skipSpaces(text, i + 2), signed = text[k] === "-", from = signed ? k + 1 : k;
    const end = operandEnd(text, from);        // e^sin(x) is exp(sin(x)), not exp(sin) times (x)
    if(end === from) throw new Error("e^ needs an exponent");
    out += !signed && text[k] === "(" ? ` exp${text.slice(k, end)} ` : ` exp(${text.slice(k, end)}) `;
    i = end;
  }
  // a bare e is the constant. The lookbehind refuses a digit, so that 1e3 stays scientific notation;
  // implicitProducts settles the digit-adjacent case, which only it can tell apart.
  return out.replace(BARE_E, "E");
}
// a function written LaTeX style takes the next atom, and a power written on the function
// moves onto its value: sin x → sin(x), sin 2x → sin(2x), cos^2 x → cos(x)^2, cos^2(x) → cos(x)^2.
// The operand is taken whole and the scan resumes after it, so the pass runs again on the operand
// itself: \sqrt{\sin t} holds a bare function of its own, and so may what that one takes, to any
// depth. Each run scans with its own regex, since the runs nest and a shared lastIndex would not.
const FUNCTION_HEAD = `${NOT_IN_NAME}(${FUNCTIONS.join("|")})${NAME_END}`;   // a whole name: ωsin is not sin
function applyFunctions(text){
  const head = new RegExp(FUNCTION_HEAD, "g");
  let out = "", last = 0;
  for(let m = head.exec(text); m; m = head.exec(text)){
    let i = skipSpaces(text, m.index + m[0].length), power = "", name = m[1];
    if(text[i] === "^"){ const end = powerEnd(text, i); power = text.slice(i, end); i = skipSpaces(text, end); }
    // ^{-1} on a function name is the inverse function, not the reciprocal of its value. The rule
    // below (cos^2 x → cos(x)^2) would otherwise plot 1/tan, which is a plausible wrong curve and
    // nothing tells the reader — so an inverse without a name here is refused rather than guessed.
    if(MINUS_ONE.test(power)){
      if(!(name in INVERSE))
        throw new Error(`${name}^{-1} is not supported; the inverses this app has are ${INVERSES_OFFERED}`);
      name = INVERSE[name]; power = "";
    }
    const end = operandEnd(text, i);                                 // an atom, or a call taken whole: \sin deg(30), \sin\sqrt{x}
    if(end === i) continue;                                          // nothing follows: leave it
    const operand = applyFunctions(text.slice(i, end));              // the bare functions inside it, which the scan below steps over
    const arg = text[i] === "(" ? operand : `(${operand})`;
    out += `${text.slice(last, m.index)}${name}${arg}${power}`;
    last = end; head.lastIndex = end;
  }
  return out + text.slice(last);
}
// a postfix sign on its operand becomes a call: x!, 5!, (x + 1)!, sin(x)! → factorial(…), and 30°,
// x°, (x + 1)° → deg(…). The two run at different points of the pipeline: the degree before
// applyFunctions, because \sin 30° is sin(30°) and the call it leaves is what a bare function then
// takes whole; the factorial after, so a call is already written name(args) and a factorial over
// one can take the name with it. Both precede implicitProducts, so the bracket left behind still
// gets its silent product: 3!x is 3! · x. Searching again after each rewrite, as rewrite() does:
// the rewrite moves every position after its own, and each pass removes one sign.
function translatePostfix(text, sign, name){
  for(let m = sign.exec(text); m; m = sign.exec(text)){
    const k = skipSpacesBack(text, m.index - 1);
    const start = operandStart(text, k, m[0]);
    text = `${text.slice(0, start)}${name}(${text.slice(start, k + 1)})${text.slice(m.index + 1)}`;
  }
  return text;
}
const translateDegrees = text => translatePostfix(text, DEGREE, "deg");
const translateFactorials = text => translatePostfix(text, BANG, "factorial");   // the ! of != is left alone

// how far a summand reaches: a term, not a single atom. Σ 1/k² is Σ(1/k²) — × and ÷ bind tighter
// than the sum — while Σ k + 1 is (Σk) + 1, because the sign does not. A silent product still needs
// its brackets: at this point in the pipeline `k x` is two atoms and implicitProducts has not run.
function termEnd(text, i){
  let end = operandEnd(text, i);
  if(end === i) return i;
  for(;;){
    const op = skipSpaces(text, end);
    if(text[op] !== "*" && text[op] !== "/") return end;
    const next = skipSpaces(text, op + 1), after = operandEnd(text, next);
    if(after === next) return end;                   // a dangling operator is not ours to report
    end = after;
  }
}
// the marker and the term after it. Last first, as the series are, so a derivative of a derivative
// has its inner one already a call when the outer looks for its term. Its reach is termEnd, the
// same as a summand's: d/dx x² + 1 is (d/dx x²) + 1. A \sum under a d/dx wants brackets, since the
// series are still written with their subscripts at this point and a term cannot take one.
const DERIV_MARKER = new RegExp(String.raw`${NOT_IN_NAME}diff\s*_\s*\(`, "g");
function translateDerivatives(text){
  for(const m of headsIn(DERIV_MARKER, text)){
    const {args, end} = argsOf(text, m.index + m[0].length - 1);
    const opens = skipSpaces(text, end), closes = termEnd(text, opens);
    if(closes === opens) throw new Error("d/dx needs something to differentiate");
    text = `${text.slice(0, m.index)} diff(${text.slice(opens, closes)}, ${args[0].trim()}) ${text.slice(closes)}`;
  }
  return text;
}

// \sum_{k=1}^{n} <term> → sum(<term>, k, 1, n), and \prod likewise. It runs after
// applyFunctions, so a summand like \sin(kx) is already the call sin(kx) that operandEnd takes
// whole, and the head is a plain name by then because COMMANDS resolved \sum like any other.
// The last one is done first: a rewrite moves every position after its own, so an inner series
// becomes a call before the outer one goes looking for its operand.
const SERIES = new RegExp(String.raw`${NOT_IN_NAME}(?<head>sum|prod)\s*_`, "g");
// the negation of BINDER_CALL, spacing included: \s* outside the lookahead would give the space
// back and match against it, refusing `integral (u, u, 0, 1)` that eachBinder accepts
const BARE_BINDER = new RegExp(String.raw`${NOT_IN_NAME}(${BINDER_NAMES.join("|")})${NAME_END}(?!\s*\()`);
// what the binder passes did not take. A head left over would otherwise reach the compiler as the
// function itself (sum^(5) is NaN, drawn as nothing), and an underscore that is no subscript
// (2_1, xy_1, x_{k=1}, \log_3) would reach it as a name it has never heard of, or as nothing at all.
const SUBSCRIPTED_NAME = new RegExp(String.raw`${NOT_AFTER_LETTER}${SUBSCRIPTED_LETTER}${NAME_END}`, "g");
function refuseLeftovers(text){
  const bare = BARE_BINDER.exec(text);
  if(bare) throw new Error(`${bare[1]} is a function: write ${callShape(bare[1])}, `
    + `or paste ${BINDERS[bare[1]].paste}`);
  if(text.replace(SUBSCRIPTED_NAME, "").includes("_")) throw new Error("a subscript is one letter or digits: x_1, x_{12}, x_i");
  return text;
}
function translateSeries(text){
  for(const {index: at, groups: {head}} of headsIn(SERIES, text)){
    const needs = `\\${head} needs its index and limits: \\${head}_{k=1}^{n}`;
    const {from, to, end} = limitsAt(text, at + head.length, needs);
    const eq = from.indexOf("=");
    if(eq < 0) throw new Error(needs);
    const name = from.slice(0, eq).trim(), first = from.slice(eq + 1).trim();
    const opens = skipSpaces(text, end), closes = termEnd(text, opens);
    if(closes === opens) throw new Error(`\\${head} needs something to ${head === "sum" ? "add" : "multiply"}`);
    text = `${text.slice(0, at)} ${head}(${text.slice(opens, closes)}, ${name}, ${first}, ${to}) ${text.slice(closes)}`;
  }
  return text;
}

// LaTeX's silent products, made explicit; the atoms are the plot variables, the single letters and
// the names the integrals bind, each bounded by NOT_IN_NAME
const DIGIT_THEN_NAME = new RegExp(`(?<![${LETTER}][0-9]*)(\\d)\\s*(?=[a-df-hj-zA-DF-Z${GREEK_LETTERS}(])`, "g");
const DIGIT_THEN_E = new RegExp(`(\\d)([eE])(?![0-9+\\-])([${WORD}]?)`, "g");
const CLOSE_THEN_NAME = new RegExp(`\\)\\s*(?=[${LETTER}0-9(])`, "g");
function implicitProducts(text){
  const atoms = [ATOMS, ...dummiesOf(text)].join("|");
  return text
    // 2x, 3(x+1) — not 1e-3, 0.156i, 1E5, and not the digits that end a name: the lookbehind is
    // what lets log2, log10 and atan2 be called at all, rather than becoming log2*(x) and NaN
    .replace(DIGIT_THEN_NAME, "$1*")
    /* an e after a digit that is not an exponent. translateEuler could not settle this one: its
     * lookbehind refuses a digit, so that 1e3 stays scientific notation, and until the * goes in
     * 2e still looks like a number. So this pass, which is the one creating the gap, says what
     * lands in it — the constant when the e stands alone, and only the * when a name follows,
     * which keeps 2exp(x) a call rather than 2*E*xp(x). */
    .replace(DIGIT_THEN_E, (_, d, e, next) => next ? `${d}*${e}${next}` : `${d}*E`)
    .replace(/(\d)\s+(?=[eiE])/g, "$1*")                            // 2 e, with a space, is a product
    .replace(CLOSE_THEN_NAME, ")*")                                 // (x+1)y, sin(x)cos(y), (x)(y)
    .replace(new RegExp(String.raw`${NOT_IN_NAME}(${atoms})\s*(?=\()`, "g"), "$1*")               // x(y+1), a(y+1)
    .replace(new RegExp(String.raw`${NOT_IN_NAME}(${atoms})\s+(?=[${LETTER}0-9])`, "g"), "$1*");   // x y, pi x, th t, a x, ω t
}

// The passes are ordered, and several of them depend on it. What each one leaves behind for the
// next is noted here, where a pass would be moved, as well as beside the code that relies on it.
function fromLatex(src){
  // GLUE is this pipeline's own; a source carrying one already would be read as a join it never
  // asked for, so it arrives as the space it is indistinguishable from
  let text = translateCases(String(src).replaceAll(GLUE, " "));   // rows split before \\ can be read as a space
  text = stripWrappers(text);                          // \left and \right are gone from here
  text = translateIntegrals(text);
  text = markDerivatives(text);                        // the d/dx heads, before \frac becomes a division
  text = translateCommands(text);                      // braces are brackets: ^{-1} is ^(-1) from here
  text = translateSubscripts(text);                    // x_(12) and ω GLUE _0 are the names x_12 and ω_0 from here
  text = translateDegrees(text);                       // 30° is deg(30) from here, a call a bare function takes whole
  text = translateEuler(text);
  text = applyFunctions(text);                         // a call is written name(args) from here
  text = translateDerivatives(text);                   // its term needs those calls, and precedes the series
  text = translateSeries(text);                        // takes its summand with the same operandEnd
  text = refuseLeftovers(text);                        // the heads and subscripts nothing above took
  text = translateFactorials(text);                    // needs those calls, and must precede the products
  text = text.replaceAll(GLUE, " ");                   // every join is made: a space again from here
  text = implicitProducts(text);
  // the spaces a call was padded with: by now every name before a ( is a function's, the products having their *
  return text.replace(/\s+/g, " ").replace(/\(\s+/g, "(").replace(/\s+([,()^])/g, "$1").replace(/\^\s+/g, "^").trim();
}

Object.assign(WL, {fromLatex, eachBinder, dummiesOf, NAME, LETTER, WORD, NOT_IN_NAME, NAME_END, LETTER_OR_TH, SUBSCRIPTED_LETTER, NOT_AFTER_LETTER,
                   GREEK, GREEK_SYMBOLS, GREEK_VARIANTS, foldVariant, COMMANDS, FUNCTIONS, BINDERS, INVERSE, CALLABLE, callShape});
})();

/* Wavelace · formula — compile a real-valued expression, and print it for the plate
 * reads:   fromLatex, eachBinder, dummiesOf, NAME, LETTER, WORD, NOT_IN_NAME, NAME_END, LETTER_OR_TH, SUBSCRIPTED_LETTER, NOT_AFTER_LETTER,
 *          GREEK_SYMBOLS, GREEK_VARIANTS, foldVariant, COMMANDS
 * exports: VARS, ENV, GLOSS, normalize, readsVars, isFreeName, FREE_DEFAULT, bindable, compile, pretty, prettyTriple, prettyName, dropLhs, namesOf,
 *          evalParam, evalPlane, evalLine
 *
 * Every formula is compiled against the whole variable set (VARS); each renderer feeds what it
 * has, so any formula can be drawn by any renderer. integral, sum, prod and diff are the functions
 * whose first argument is an expression: compile binds it to a function of its variable before the
 * body is built, so the variable named second is a dummy that shadows any plot variable of the same
 * name. The first three are then given a range; diff is given the name again, which outside the
 * binder is whatever the enclosing scope holds, so it differentiates where the plot already is. */
(() => {
"use strict";
const WL = window.Wavelace = window.Wavelace || {};
const {fromLatex, eachBinder, dummiesOf, NAME, LETTER, WORD, NOT_IN_NAME, NAME_END, LETTER_OR_TH, SUBSCRIPTED_LETTER, NOT_AFTER_LETTER,
       GREEK_SYMBOLS, GREEK_VARIANTS, foldVariant, COMMANDS} = WL;

// a numeric integral of f over [a, b]: composite Simpson on PANELS panels, which also says whether the integrand
// had died away by the end, the |f| of the last quarter of the samples at most TAIL of the whole; one sample
// that is not a number settles both, so the rest are not taken
const PANELS = 128, REACH = 40, TAIL = 0.05;
function simpson(f, a, b){
  const h = (b - a) / PANELS;
  let total = 0, all = 0, tail = 0;                  // not `sum`: that is a function of its own below
  for(let i = 0; i <= PANELS; i++){
    const v = f(a + i*h), size = Math.abs(v);
    if(v !== v) return {value: NaN, decayed: false};
    total += (i === 0 || i === PANELS ? 1 : i & 1 ? 4 : 2) * v; all += size;
    if(i >= PANELS * 3/4) tail += size;
  }
  return {value: total * h / 3, decayed: tail <= TAIL * all};
}
// to infinity: the first REACH units, and NaN, a blank point, where the integrand had not died away by then
function toInfinity(f, a){ const {value, decayed} = simpson(f, a, a + REACH); return decayed ? value : NaN; }
function integral(f, a, b){
  if(Number.isNaN(a) || Number.isNaN(b)) return NaN;                   // spares the samples
  if(a > b) return -integral(f, b, a);
  if(a === b) return 0;
  if(a === -Infinity){
    if(b !== Infinity) return toInfinity(u => f(-u), -b);
    const left = toInfinity(u => f(-u), 0);                            // a left half that did not decay decides
    return left !== left ? NaN : left + toInfinity(f, 0);
  }
  return b === Infinity ? toInfinity(f, a) : simpson(f, a, b).value;
}

// Σ and ∏ over the integers in [a, b]. Unlike the integral, whose 128 panels are
// fixed here, a term count is the reader's to choose — so it is capped, and past the cap this
// returns NaN, a hole, rather than freezing the tab. That also settles a sum to infinity.
// A cap is not a speed promise: a thousand terms at 129² points is 16.6 million evaluations a
// frame, and a mesh stays interactive at a few dozen.
const MAX_TERMS = 1000;
function sum(f, a, b){
  const from = Math.ceil(a), to = Math.floor(b);
  if(Number.isNaN(from) || Number.isNaN(to)) return NaN;
  if(to < from) return 0;                                    // the empty sum
  if(to - from >= MAX_TERMS) return NaN;
  let s = 0;
  for(let k = from; k <= to; k++){ const v = f(k); if(v !== v) return NaN; s += v; }
  return s;
}
// the same shape with 1 and ×. Two functions rather than one taking a flag or a combining
// callback: the flag would switch what the function is, and the callback would be a closure call
// per term inside a loop the renderers run 129² times a frame.
function prod(f, a, b){
  const from = Math.ceil(a), to = Math.floor(b);
  if(Number.isNaN(from) || Number.isNaN(to)) return NaN;
  if(to < from) return 1;                                    // the empty product
  if(to - from >= MAX_TERMS) return NaN;
  let p = 1;
  for(let k = from; k <= to; k++){ const v = f(k); if(v !== v) return NaN; p *= v; }
  return p;
}

/* ---------- the special functions ----------
 * Closed forms, so the wave renderer can use them at full ribbon depth: drawn through the integral
 * instead, each point would cost the 128 panels above. Every one is a plotting approximation, and
 * the accuracy each is good to is named beside it — well past a pixel in all cases. */

// Lanczos, g = 7, and the reflection formula below the pole-ridden half; good to about 1e-15
const LANCZOS = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
                 -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
                 1.5056327351493116e-7];
function gamma(x){
  // the poles: Math.sin(PI * n) is not exactly zero at a negative integer, so without this the
  // reflection returns a large finite number and a plot draws a spike where it should draw a hole
  if(x <= 0 && Number.isInteger(x)) return NaN;
  if(x === Infinity) return Infinity;
  if(x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));
  x -= 1;
  let a = LANCZOS[0];
  for(let i = 1; i < LANCZOS.length; i++) a += LANCZOS[i] / (x + i);
  const t = x + LANCZOS.length - 1.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
}
// exact for the integers people actually type, and the gamma continuation between them: (-0.5)! is
// sqrt(pi), so only the negative integers — gamma's poles — are refused. The integers are a table
// rather than a loop because sum() calls this once per term with a growing argument: a Taylor
// polynomial, which is the headline reason sum exists, was quadratic in its own term count.
const FACTORIALS = new Float64Array(171);
FACTORIALS[0] = 1;
for(let i = 1; i <= 170; i++) FACTORIALS[i] = FACTORIALS[i - 1] * i;   // 171! overflows a double
function factorial(n){
  if(Number.isInteger(n)) return n < 0 ? NaN : n > 170 ? Infinity : FACTORIALS[n];
  return gamma(n + 1);
}
// multiplicatively, so that combinations(50, 25) never builds 50! on the way. Exact while the
// answer is under 2^53, an approximation above it, as any double must be: Math.round is a no-op
// on combinations(100, 50) and the value carries the float error it accumulated
function combinations(n, k){
  if(!Number.isInteger(n) || !Number.isInteger(k) || k < 0 || n < 0 || k > n) return NaN;
  k = Math.min(k, n - k);
  let r = 1;
  for(let i = 1; i <= k; i++) r = r * (n - k + i) / i;
  return Math.round(r);
}
// Abramowitz & Stegun 7.1.26: absolute error under 1.5e-7, three orders past a pixel
const ERF = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429];
function erf(x){
  const s = Math.sign(x), a = Math.abs(x), t = 1 / (1 + 0.3275911 * a);
  let poly = 0;
  for(let i = ERF.length - 1; i >= 0; i--) poly = (poly + ERF[i]) * t;
  return s * (1 - poly * Math.exp(-a * a));
}
// J0 and J1 by Abramowitz & Stegun 9.4, good to about 1e-8
function besselJ0(x){
  const a = Math.abs(x);
  if(a < 8){
    const y = x*x;
    return (57568490574 + y*(-13362590354 + y*(651619640.7 + y*(-11214424.18 + y*(77392.33017 + y*-184.9052456)))))
         / (57568490411 + y*(1029532985 + y*(9494680.718 + y*(59272.64853 + y*(267.8532712 + y)))));
  }
  const z = 8/a, y = z*z, xx = a - 0.785398164;
  const p = 1 + y*(-0.1098628627e-2 + y*(0.2734510407e-4 + y*(-0.2073370639e-5 + y*0.2093887211e-6)));
  const q = -0.1562499995e-1 + y*(0.1430488765e-3 + y*(-0.6911147651e-5 + y*(0.7621095161e-6 + y*-0.934935152e-7)));
  return Math.sqrt(0.636619772/a) * (Math.cos(xx)*p - z*Math.sin(xx)*q);
}
function besselJ1(x){
  const a = Math.abs(x);
  if(a < 8){
    const y = x*x;
    const r = x*(72362614232 + y*(-7895059235 + y*(242396853.1 + y*(-2972611.439 + y*(15704.48260 + y*-30.16036606)))));
    return r / (144725228442 + y*(2300535178 + y*(18583304.74 + y*(99447.43394 + y*(376.9991397 + y)))));
  }
  const z = 8/a, y = z*z, xx = a - 2.356194491;
  const p = 1 + y*(0.183105e-2 + y*(-0.3516396496e-4 + y*(0.2457520174e-5 + y*-0.240337019e-6)));
  const q = 0.04687499995 + y*(-0.2002690873e-3 + y*(0.8449199096e-5 + y*(-0.88228987e-6 + y*0.105787412e-6)));
  const j = Math.sqrt(0.636619772/a) * (Math.cos(xx)*p - z*Math.sin(xx)*q);
  return x < 0 ? -j : j;
}
// The order must be exactly 0 or 1. Rounding it instead would answer besselJ(0.5, x) with J1, a
// smooth plausible curve that is not the function asked for, the same lesson as \tan^{-1} and the cotangent.
const besselJ = (n, x) => (n === 0 ? besselJ0(x) : n === 1 ? besselJ1(x) : NaN);

// the derivative at a point, by central difference. The step is the cube root of the machine
// epsilon, which is where a central difference's truncation error (h²) meets its rounding error
// (ε/h), multiplied by the point so that it stays relative once away from the origin. Two
// evaluations, so a diff costs twice what its expression does — and a diff of an integral twice
// its 128 panels.
const RELATIVE_STEP = Math.cbrt(Number.EPSILON);             // ≈ 6.06e-6
function diff(f, at){
  if(Number.isNaN(at)) return NaN;
  const h = RELATIVE_STEP * Math.max(1, Math.abs(at));
  const hi = f(at + h), lo = f(at - h);
  if(hi !== hi || lo !== lo) return NaN;                     // a hole either side is a hole here
  return (hi - lo) / (2 * h);
}

// Gielis's superformula, as its gloss below states it; a and b default to 1
function superformula(th, m, n1, n2, n3, a = 1, b = 1){
  const phase = m * th / 4;                      // m lobes a turn: the pattern of |cos| and |sin| repeats every π/2 of it
  return (Math.abs(Math.cos(phase) / a) ** n2 + Math.abs(Math.sin(phase) / b) ** n3) ** (-1 / n1);
}

const ENV = {
  sin:Math.sin, cos:Math.cos, tan:Math.tan, asin:Math.asin, acos:Math.acos,
  atan:Math.atan, atan2:Math.atan2, sinh:Math.sinh, cosh:Math.cosh, tanh:Math.tanh,
  asinh:Math.asinh, acosh:Math.acosh, atanh:Math.atanh,
  exp:Math.exp, log:Math.log, log2:Math.log2, log10:Math.log10, sqrt:Math.sqrt,
  cbrt:Math.cbrt, abs:Math.abs, sign:Math.sign, floor:Math.floor, ceil:Math.ceil,
  round:Math.round, min:Math.min, max:Math.max, pow:Math.pow, hypot:Math.hypot,
  mod:(a, b) => ((a % b) + b) % b,           // floored modulo: never negative for b > 0, unlike %
  sec:x => 1/Math.cos(x), csc:x => 1/Math.sin(x), cot:x => 1/Math.tan(x),
  gamma, factorial, combinations, erf, besselJ, superformula,
  sinc:x => (x === 0 ? 1 : Math.sin(x) / x),
  deg:x => x * Math.PI / 180,                // what 30° and 30^\circ become (latex.js)
  PI:Math.PI, pi:Math.PI, E:Math.E, tau:Math.PI*2, inf:Infinity, integral, sum, prod, diff,
};
const ENV_KEYS = Object.keys(ENV);
const ENV_VALS = ENV_KEYS.map(k => ENV[k]);
// what a function does, where its name does not say it: the documentation page's gloss beside each
// name, and the app's own reference drawer's. null means the name says it, a decision written down,
// so that a name nobody has thought about is the thing that fails the build (tools/docs.js gates
// it; the drawer, which must never refuse to open over a sentence, reads a missing one as null).
const GLOSS = {
  sin: null, cos: null, tan: null, asin: null, acos: null, atan: null,
  sinh: null, cosh: null, tanh: null, asinh: null, acosh: null, atanh: null,
  exp: null, log2: null, log10: null, sqrt: null, abs: null, min: null, max: null,
  floor: null, ceil: null, round: null,
  atan2: "the angle of (y, x), over the whole turn rather than a half of it",
  log: "the natural logarithm; \\ln reaches it too, and \\log_{10} reaches log10",
  cbrt: "the cube root, which unlike a power of a third is defined for a negative x",
  pow: "pow(a, b) is a^b, for where a power reads better as a call",
  hypot: "the distance, hypot(x, y) = sqrt(x² + y²), without the overflow a squared sum can reach",
  sign: "−1, 0 or 1",
  mod: "the floored modulo, never negative for a positive b, unlike the % operator",
  sec: "1/cos", csc: "1/sin", cot: "1/tan",
  gamma: "the gamma function, carrying its reflection below ½, so gamma(−0.5) is −2√π; a hole at each pole",
  factorial: "exact on the integers to 170!, and continued through gamma between them",
  combinations: "combinations(n, k), exact where the factorials it is written from would have overflowed",
  erf: "the error function, to 1.5e−7",
  besselJ: "besselJ(n, x) for orders 0 and 1; any other order is a hole rather than a guess",
  sinc: "sin(x)/x, and 1 at the origin",
  superformula: "Gielis's superformula (2003), the radius of a star, a flower or a polygon at the angle θ: superformula(θ, m, n₁, n₂, n₃, a, b) is (|cos(mθ/4)/a|^n₂ + |sin(mθ/4)/b|^n₃)^(−1/n₁), m lobes a turn, a small n₁ spiky; a and b may be left out, and are then 1",
  deg: "degrees, as radians: 30° and 30^\\circ both become deg(30)",
  integral: null, sum: null, prod: null, diff: null,          // the binders have a section of their own
  pi: null, PI: null, E: null, tau: null, inf: null,          // as do the constants
};
/* The left-hand side the formula field is already showing, typed back into it. MODES gives each
 * renderer its own — "z =" for surface, "V(x) =" for quantum, "f(r) =" for swarm — and session.js
 * hands it here because it is the only layer that knows which renderer is on show. Whitespace is
 * ignored on both sides so that "V(x)=" and "V( x ) =" are the same head as the label. Anything
 * else before an = is an equation, and refuseAssignment below says so. */
function dropLhs(expr, lhs){
  const want = String(lhs || "").replace(/[\s=]/g, "");
  if(!want) return expr;
  const head = /^\s*([^=]*?)\s*=(?!=)\s*/.exec(expr);
  return head && head[1].replace(/\s/g, "") === want ? expr.slice(head[0].length) : expr;
}

const ALLOWED = new RegExp(`^[0-9${LETTER}_+\\-*/^%().,<>=?:!&|\\s]*$`);   // LETTER: Latin and the Greek glyphs latex.js names
// & and | are in ALLOWED for && and ||, the conditions a ternary is built from. Alone they are
// JavaScript's bitwise operators, so x & 1 quietly answers 1; and a lone | is the bare |x| this
// language declines. It goes in normalize rather than beside ALLOWED in compile because the
// complex renderer takes the other road — session.js hands normalize's output to complex.js's own
// parser and never reaches compile — and this is a rule about the language, not about one path.
/* Three rules about the language rather than about one path, which is why they live in normalize:
 * the complex renderer hands normalize's output to its own parser and never reaches compile, and
 * would otherwise refuse the same three in a stranger's words ("unexpected end of formula" for an
 * empty call). Each is a constant regex and a sentence of its own.
 *
 *   =  the language has no assignment and no names of your own. session.js has already dropped the
 *      head the field was showing, so what is left is a reader writing an equation.
 *   &  alone these are JavaScript's bitwise operators, so x & 1 quietly answers 1; and a lone | is
 *      the bare |x| this language declines. Both are in ALLOWED for && and ||.
 *   () an empty argument list reached the function as undefined, so sin() drew a blank where the
 *      honest answer is that sin takes one. */
const refuse = (re, say) => text => {
  const m = re.exec(text);
  if(m) throw new Error(say(m));
  return text;
};
const refuseAssignment = refuse(/(?<![<>!=])=(?!=)/,
  () => "= is not supported: a formula is one expression, not an equation "
      + "(the renderer writes its own left-hand side)");
// the functions only: a constant with an empty argument list is not missing an argument, it is not
// a call at all, and inf() saying "inf needs an argument" would send a reader to inf(1)
const CALLABLE = ENV_KEYS.filter(k => typeof ENV[k] === "function");
const refuseEmptyCall = refuse(new RegExp(String.raw`${NOT_IN_NAME}(${CALLABLE.join("|")})\s*\(\s*\)`),
  m => `${m[1]} needs an argument: ${m[1]}() has no value to give`);
const refuseBitwise = refuse(/(?<!&)&(?!&)|(?<!\|)\|(?!\|)/, m => m[0] === "|"
  ? "| is not supported: write abs(x), or \\left|x\\right| when pasting"
  : "a single & is not supported: && and || are the ones a condition is built from");

/* A comma outside every bracket is JavaScript's comma operator, which evaluates its left side,
 * throws it away and answers the right: x, y drew y and nothing said so. A scan rather than a
 * regex, because only a counter can tell a call's commas from a loose one — and ALLOWED has no
 * bracket but ( ), no string and no comment, so the count cannot be fooled. */
function refuseLooseComma(text){
  let depth = 0;
  for(const c of text.match(/[(),]/g) || []){
    if(c === "(") depth++;
    else if(c === ")") depth--;
    else if(depth === 0)
      throw new Error("a comma outside brackets is not supported: a formula is one expression");
  }
  return text;
}

const VARS = ["x","y","z","r","th","u","v","t"];
const PROBE = [0.37, 0.2, 0.1, 0.4, 0.37, 0.37, 0.23, 0.11];   // parallel to VARS: a type check sample

// which of the plot variables a source names. Conservative on purpose: a bound dummy called v counts
// as v, because over-reporting costs a caller nothing while under-reporting would have it treat a
// formula as independent of something it reads — the wave renderer asks this to know whether a
// formula is the same function on every ribbon slice. The name is bounded by letters rather than by
// \b, since a digit is a word character and \bz\b cannot see the z in the implicit product 2z; th
// is tried before t so that it is read as one name. Asked of the normalized source, so a pasted
// \theta counts as th; a source too broken to normalize will not compile either, and is read raw.
const NAMED = new RegExp(`${NOT_AFTER_LETTER}(th|x|y|z|r|u|v|t)(?![${LETTER}_])`, "g");   // x_1 and a_x read no x
function readsVars(src){
  let text = String(src);
  try{ text = normalize(text); }catch(_){ /* raw, then: a name in it is still a name */ }
  return new Set(text.match(NAMED));
}

// A name the language does not know becomes a dial when it is one letter that the tables do
// not already claim: not a plot variable, not a name in ENV (E is Euler's number there), and not e,
// which the pipeline reads as that constant. Read off the tables rather than spelt out, so a ninth
// variable or a one-letter constant is excluded the day it arrives. A Greek letter is one letter
// too, the glyph a command became in latex.js (LETTER is its class), so \omega and a pasted ω are
// the one name ω while omega typed in ASCII is a longer name. Anything longer is never a dial: it is
// read as a product of letters (readRunsAsProducts, below) or it keeps its refusal, which is what stops a
// mistyped sni(x), the product sni*(x) to the compiler, from growing a slider. A binder's dummy is bound,
// not free, so sum(a*k, k, 1, 3) frees a alone.
// The order is first appearance, which is the order the rail shows them in.
const RESERVED = new Set([...VARS, "e", ...ENV_KEYS]);
const IDENT = new RegExp(`${NOT_IN_NAME}[${LETTER}_][${WORD}]*`, "g");
// a SUBSCRIPTED_LETTER (latex.js) and nothing longer: x_0 and t_0 are names of their own, a fixed
// point and not the axis, which is what a textbook means by them; the whole name is what RESERVED is asked
const FREE_SHAPE = new RegExp(`^${SUBSCRIPTED_LETTER}$`);
const FREE_DEFAULT = 1;                                    // what a free name is worth until its dial moves
const isFreeName = name => !RESERVED.has(name) && FREE_SHAPE.test(name);

// A run of letters the language does not know (kx, ωt, xy) is the product of its letters when at most
// one of them is free, since that is how a textbook sets them: \sin(kx - \omega t). Two free letters
// keep the refusal, because sni is likelier a mistyped sin than three sliders, and a run before a
// bracket is a call and never split (ta(x) is a mistyped tan). What is known is the caller's language:
// RESERVED here, the complex renderer's own names there, so its re z is not r times e times z. A
// binder's dummy is known too, and th is one letter. The product gets no brackets, as 2x gets none.
// A run that reads as notation keeps its refusal too; the e rule is there because latex.js makes e
// Euler's number only standing alone or before ^, so the e of ex would reach the compiler as a name.
const RUN = new RegExp(`${NOT_IN_NAME}[${LETTER}]{2,}${NAME_END}(?!\\s*\\()`, "g");
const LETTER_OF_RUN = new RegExp(LETTER_OR_TH, "g");
const isCommandWithoutBackslash = run => Object.hasOwn(COMMANDS, run);             // mu, xi, eta
const isDifferential = letters => letters.length === 2 && letters[0] === "d";     // dx, dt
const isNotation = (run, letters) => isCommandWithoutBackslash(run) || isDifferential(letters) || letters.includes("e");
function readRunsAsProducts(text, known){
  const dummies = new Set(dummiesOf(text));
  const isKnown = name => known.has(name) || dummies.has(name);
  return text.replace(RUN, run => {
    const letters = run.match(LETTER_OF_RUN);
    if(isKnown(run) || isNotation(run, letters)) return run;
    const freeLetters = letters.filter(letter => !isKnown(letter));
    return freeLetters.length <= 1 ? letters.join("*") : run;
  });
}

// the names of several compiled parts as one list, each once, in order of first appearance: what
// the session binds for a triple, and what a spec's lines name between them
const namesOf = parts => [...new Set(parts.flatMap(p => p.names))];
function freeNamesOf(text){                                // of the normalized source
  const letters = [...new Set((text.match(IDENT) || []).filter(isFreeName))];
  if(!letters.length) return letters;                      // the common case, and the binder scan is not free
  const dummies = new Set(dummiesOf(text));
  return letters.filter(n => !dummies.has(n));
}

// tolerate pasted maths notation, the plate's own included: the Greek that stands for a command (GREEK_SYMBOLS
// in latex.js: θ π τ Γ Σ Π) and ∫ ∞ ∂ ∏ become their LaTeX commands, so that one reader owns them and \int_0^\pi
// takes π as one limit; the variant glyphs fold to their letter first (GREEK_VARIANTS, beside that table; the
// letters themselves pass as names); ² → ^{2}, ₀ → _{0}, · × → *, − → -, √ → sqrt, then the LaTeX subset and
// silent products (latex.js), then a run of letters as a product, by the names `known` holds (above).
// The ø family is an older spelling of θ, kept for the links that carry it.
const VARIANT_RUN = new RegExp(`[${Object.keys(GREEK_VARIANTS).join("")}]`, "g");
const SYMBOL_RUN = new RegExp(`[${Object.keys(GREEK_SYMBOLS).join("")}]`, "g");
const DIGITS = "0123456789-", SUPER = "⁰¹²³⁴⁵⁶⁷⁸⁹⁻", SUB = "₀₁₂₃₄₅₆₇₈₉₋";   // parallel: a digit and its scripts
const respell = (from, to, s) => [...s].map(c => to[from.indexOf(c)] ?? c).join("");   // each character of `from` as its `to`
const SUPER_RUN = new RegExp(`[${SUPER}]+`, "g"), SUB_RUN = new RegExp(`[${SUB}]+`, "g");
function normalize(src, known = RESERVED){
  return refuseLooseComma(refuseEmptyCall(refuseAssignment(refuseBitwise(readRunsAsProducts(fromLatex(src
    .replace(VARIANT_RUN, foldVariant)
    .replace(/[º˚]/g, "°")                                        // the ordinal and the ring a keyboard types for the degree sign
    .replace(SYMBOL_RUN, c => `\\${GREEK_SYMBOLS[c]} `)
    .replace(/[øØ⌀∅]/g, "\\theta ")
    .replace(/∫/g, "\\int ").replace(/∞/g, "\\infty ").replace(/∂/g, "\\partial ").replace(/∏/g, "\\prod ")
    .replace(SUPER_RUN, run => `^{${respell(SUPER, DIGITS, run)}}`).replace(SUB_RUN, run => `_{${respell(SUB, DIGITS, run)}}`)
    .replace(/[·•×∙]/g, "*")
    .replace(/[−–—]/g, "-")
    .replace(/÷/g, "/")
    .replace(/√/g, "sqrt")
    .replace(/（/g, "(").replace(/）/g, ")")), known)))));
}

// the expression becomes a function of its variable, a name of the formula's own (a plot variable may be
// shadowed: inside the binder it is the dummy)
const bindBinders = body => eachBinder(body, (head, expr, name, from, to) => {
  if(!NAME.test(name) || name in ENV) throw new Error(`${head}'s variable must be a name, like k`);
  // the three with a range are handed it; diff is handed the name itself, which outside the arrow
  // is whatever the enclosing scope holds — the plot's variable, or a binder's dummy further out
  return head === "diff" ? `diff((${name}) => (${expr}), ${name})`
                         : `${head}((${name}) => (${expr}), ${from}, ${to})`;
});

// the sample evaluation, which is where an unknown name first shows. Its own message is
// JavaScript's and session.js puts that on the plate verbatim, so the name is said plainly here
// instead — the name, not the sentence around it, since V8 writes "x is not defined" where
// JavaScriptCore writes "Can't find variable: x". A name on a branch the probe does not take still
// escapes at draw time: nothing short of reading the body would catch that, and the body is not
// ours to read.
const UNKNOWN_NAME = new RegExp(`([${WORD}$]+)(?: is not defined)?$`);   // the whole run, ωsin as much as sni
/* JavaScript's parser is the one that reads the body, and its words are its own: "2 +" comes back
 * as an unexpected ")", the bracket this wrapper added, and the wording differs between engines the
 * way probeValue describes below for a name. The reader typed a formula, so what comes back says
 * that. Every sentence this file writes itself is thrown before here. */
function bodyFunction(body, names = []){
  try { return new Function(...ENV_KEYS, ...names, `"use strict";return (${VARS}) => (${body});`); }
  catch(e){
    if(!(e instanceof SyntaxError)) throw e;
    throw new Error("this is not a complete formula: something is missing, or in the wrong place");
  }
}
function probeValue(fn){
  try{ return fn(...PROBE); }
  catch(e){
    if(!(e instanceof ReferenceError)) throw e;
    throw new Error(`${UNKNOWN_NAME.exec(e.message)?.[1] ?? "that name"} is not a function or a variable here`);
  }
}
// a leading minus becomes "-1*" so that -x^2 means -(x^2): JavaScript refuses a unary minus
// directly before **, and the maths convention is the negation of the power. A minus right
// after ^ (2^-3) is left alone, since ^ is not in the operator class
const UNARY_MINUS = new RegExp(`(^|[(,+\\-*/%<>=?:&|!])(\\s*)-(?=\\s*[${WORD}(.])`, "g");
// The compiled formula with its free names still open: `names`, in order of first appearance, and
// bind(values), the (x, y, z, r, th, u, v, t) => number with each name bound to values[name] or
// FREE_DEFAULT. The pipeline runs once, here. ENV and the free names are bound by calling the
// outer function, and the arrow that comes back closes over them: an evaluation then costs its
// eight arguments and nothing else (spreading ENV into every call, every value of it at 129² calls
// a frame, was two thirds of the old cost), and a dial drag is one call of the outer function
// again: microseconds, and never a second normalize. Throws with a readable message.
function bindable(src){
  const text = normalize(src);
  const body = bindBinders(text).replace(UNARY_MINUS, "$1$2-1*").replace(/\^/g, "**");
  if(!ALLOWED.test(body)) throw new Error("illegal character in formula");
  if(!body.trim()) throw new Error("formula is empty");
  const names = freeNamesOf(text), outer = bodyFunction(body, names);
  const bind = (values = {}) => outer(...ENV_VALS, ...names.map(n => values[n] ?? FREE_DEFAULT));
  // the type check, and an unknown name's refusal, once: neither depends on what the names are bound to
  if(typeof probeValue(bind()) !== "number") throw new Error("formula must return a number");
  return {names, bind, text};                                // text: the normalized source, for a caller that would otherwise normalize again
}
// → (x, y, z, r, th, u, v, t) => number, its free names bound to values (or FREE_DEFAULT)
function compile(src, values){ return bindable(src).bind(values); }

// a parametric formula: u is fed to every slot it could mean, v (a second parameter, for
// shapes) to y and to its own slot
function evalParam(fn, u, t, v = 0){ return fn(u, v, 0, u, u, u, v, t); }
// a height field gets x, y and their polar form; a wave slice gets x and its depth z (also as y)
function evalPlane(fn, x, y, t){ const r = Math.hypot(x, y); return fn(x, y, 0, r, Math.atan2(y, x), r, y, t); }
function evalLine(fn, x, z, t){ return fn(x, z, z, Math.abs(x), x, x, z, t); }

// the formula as it reads on the plate: 3x, θ, π, · for products, superscript powers, ∫ with its limits; what
// it prints pastes back, so a limit is bare only when LaTeX reads it as one (a number, a letter, a symbol)
const PLATE_DIGITS = "0123456789−";                          // the minus is the plate's by the time these print
const script = (table, digits) => respell(PLATE_DIGITS, table, digits);
const ATOM = new RegExp(`^(?:\\d+(?:\\.\\d+)?|[${LETTER}θπ∞])$`);   // a subscripted name is bracketed: LIMIT reads a bare one as a letter
const limit = (mark, table, text) => /^−?\d+$/.test(text) ? script(table, text) : mark + (ATOM.test(text) ? text : `(${text})`);
// ∫ prints its dummy in the differential; Σ and ∏ print theirs in the lower limit, which limit()
// already brackets because k=1 is not an atom — and a bracketed limit is what limitAt reads back.
// d/dx keeps its term in brackets whatever the term is: unbracketed it would reach only as far as
// termEnd when read again, so a printed sum of two things would come back as the derivative of one.
const SIGN = {sum: "Σ", prod: "∏"};
const printBinders = text => eachBinder(text, (head, expr, name, from, to) =>
  head === "diff"       ? `d/d${name} (${expr})`
  : head === "integral" ? `∫${limit("_", SUB, from)}${limit("^", SUPER, to)} ${expr} d${name}`
                        : `${SIGN[head]}${limit("_", SUB, `${name}=${from}`)}${limit("^", SUPER, to)} ${expr}`);
// a name as the plate and the rail show it, and as it pastes back: θ π ∞ for the ones the language
// spells in letters (in a subscript too, x_θ), a digit subscript set low (x_1 is x₁, since normalize
// reads ₁ as _{1}), one letter as written, and a longer one in braces, since x_max would read as x_m times ax
const NAME_GLYPH = {th: "θ", pi: "π", inf: "∞"};
const glyphOf = name => Object.hasOwn(NAME_GLYPH, name) ? NAME_GLYPH[name] : name;
function prettySubscript(sub){
  if(/^\d+$/.test(sub)) return script(SUB, sub);
  return [...sub].length === 1 ? `_${sub}` : `_{${sub}}`;
}
function prettyName(name){
  const [base, sub] = name.split("_");
  return glyphOf(base) + (sub === undefined ? "" : prettySubscript(glyphOf(sub)));
}
function pretty(expr){
  const text = normalize(expr), atoms = [...VARS, "θ", ...dummiesOf(text)].join("|");
  // a whole number before a variable loses its dot (3*x is 3x, 3*th is 3θ); a free name keeps it, a
  // subscripted one included, which by now carries its digits low
  const implicit = new RegExp(`(?<![${WORD}])(\\d+(?:\\.\\d+)?)\\s*\\*\\s*(?=(?:${atoms})(?![${WORD}${SUB}_{])|\\()`, "g");
  return printBinders(text
    .replace(IDENT, prettyName)
    .replace(implicit, "$1")                                    // 3*x reads as 3x
    .replace(/\*/g, " · ").replace(/-/g, "−").replace(/\s+/g, " ")
    .replace(/\^(?:(−?\d+)|\((−?\d+)\))/g, (_, d, e) => script(SUPER, d ?? e)));   // x^2 and the pasted x² alike
}
// three expressions as their plate shows them, one bracket round the three
const prettyTriple = exprs => `(${pretty(exprs.x)},  ${pretty(exprs.y)},  ${pretty(exprs.z)})`;

Object.assign(WL, {VARS, ENV, GLOSS, normalize, readsVars, isFreeName, FREE_DEFAULT, bindable, compile, pretty, prettyTriple, prettyName, dropLhs, namesOf,
                   evalParam, evalPlane, evalLine});
})();

export const {fromLatex, normalize, pretty, prettyName, bindable, compile, readsVars, isFreeName, VARS, ENV, BINDERS, GREEK, FREE_DEFAULT} = window.Wavelace;
