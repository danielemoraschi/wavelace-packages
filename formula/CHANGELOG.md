# Changelog

What changed in @wavelace/formula, newest first. Wavelace's own changes, the app's and the site's, are at https://www.wavelace.com/changelog.

## 0.4.0

15 October 2026

- Added `CHANGELOG.md`, what changed in each version, and the release notes made from it.

## 0.3.0

14 October 2026

- Changed `pretty` to print a formula as mathematics by default: `|x|`, `45°`, `√x`, `n!` and `sin t`. `pretty(src, "plain")` prints it as the formula box takes it, which pastes back.
- Fixed a minus after `/` or `%`, which `compile` read as dividing by −1 first: `1/-2` gave −2 rather than −0.5.
- Fixed `\pi`, `\theta` or `\infty` written without braces after `^`: a sum's limit read as a different formula or was refused, and `e^\pi x` was e to the πx rather than e^π times x.
- Fixed a factorial in a pasted sum or derivative, as in `\sum_{k=0}^{5} x^k/k!`, which was taken of the whole sum rather than of `k`.
- Fixed a plain plate that could not be pasted back, such as a sum to `∞`, and left out the brackets no plate needs.
- Fixed a name misspelt on a branch a formula rarely takes, which `compile` accepted and which evaluated to nothing there; it is refused by name.
- Fixed a very large `\binom` running for minutes, and one just under the largest number evaluating to nothing.

## 0.2.2

30 September 2026

- Added pasted `≥`, `≤` and `≠`, the commands `\ge`, `\le` and `\neq` for a condition, and square brackets, which group as round ones do.

## 0.2.1

29 September 2026

- Fixed a pasted `√`, and functions written without brackets inside others: `√2x`, `sin √x`, `e^√x` and `e^-\theta` now compile.

## 0.2.0

28 September 2026

- Added React components at `@wavelace/formula/react`: `useFormula`, `<FormulaField>` and `<Plate>`.

## 0.1.1

27 September 2026

- Changed the README to examples that run as written, each value checked by the package's tests.

## 0.1.0

27 September 2026

- Added the formula layer of Wavelace: `compile`, `bindable`, `normalize`, `fromLatex`, `pretty`, `prettyName`, `readsVars` and `isFreeName`, with the tables `VARS`, `ENV`, `BINDERS`, `GREEK` and `FREE_DEFAULT`.
