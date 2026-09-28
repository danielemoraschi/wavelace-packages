/*! @wavelace/embed 0.1.0 | MIT | © 2026 Daniele Moraschi | generated from tools/pkg/embed/embed.js */
const TABLES = {"flags":{"playing":true,"spin":false,"ground":true,"trace":false,"particles":true,"fill":true,"deck":true,"formula":true,"title":true,"orbit":true,"pan":true},"hashKeys":{"playing":"play"},"dials":["span","speed","amp","depth","turns","vspan","x0","y0","z0","seeds","sigma","k0"],"views":["iso","top","front","side","fit"],"renderers":["wave","polar","surface","curve","shape","complex","quantum","quantum2d","flow","swarm","bodies","bellman"],"triple":["curve","shape","flow"],"presets":[{"slug":"chirp-wave","name":"Chirp Wave","renderer":"wave"},{"slug":"travelling-ripple","name":"Travelling Ripple","renderer":"wave"},{"slug":"beat-interference","name":"Beat Interference","renderer":"wave"},{"slug":"damped-pulse","name":"Damped Pulse","renderer":"wave"},{"slug":"wave-packet","name":"Wave Packet","renderer":"wave"},{"slug":"square-fourier","name":"Square Fourier","renderer":"wave"},{"slug":"sinc-splash","name":"Sinc Splash","renderer":"wave"},{"slug":"breathing-gauss","name":"Breathing Gauss","renderer":"wave"},{"slug":"standing-wave","name":"Standing Wave","renderer":"wave"},{"slug":"phase-fold","name":"Phase Fold","renderer":"wave"},{"slug":"saw-cascade","name":"Saw Cascade","renderer":"wave"},{"slug":"bessel-ish","name":"Bessel-ish","renderer":"wave"},{"slug":"twin-solitons","name":"Twin Solitons","renderer":"wave"},{"slug":"living-wave","name":"Living Wave","renderer":"wave"},{"slug":"living-wave-cos","name":"Living Wave (cos)","renderer":"wave"},{"slug":"living-wave-tan","name":"Living Wave (tan)","renderer":"wave"},{"slug":"cusp-heart","name":"Cusp Heart","renderer":"wave"},{"slug":"fractal-cosine","name":"Fractal Cosine","renderer":"wave"},{"slug":"am-carrier","name":"AM Carrier","renderer":"wave"},{"slug":"heartbeat","name":"Heartbeat","renderer":"wave"},{"slug":"depth-sheet","name":"Depth Sheet","renderer":"wave"},{"slug":"trefoil-bloom","name":"Trefoil Bloom","renderer":"polar"},{"slug":"polar-mandala","name":"Polar Mandala","renderer":"polar"},{"slug":"fourfold-mandala","name":"Fourfold Mandala","renderer":"polar"},{"slug":"butterfly-curve","name":"Butterfly Curve","renderer":"polar"},{"slug":"breathing-rose","name":"Breathing Rose","renderer":"polar"},{"slug":"pulsing-cardioid","name":"Pulsing Cardioid","renderer":"polar"},{"slug":"lemniscate","name":"Lemniscate","renderer":"polar"},{"slug":"fermat-spiral","name":"Fermat Spiral","renderer":"polar"},{"slug":"cross-ripple","name":"Cross Ripple","renderer":"surface"},{"slug":"egg-carton","name":"Egg Carton","renderer":"surface"},{"slug":"checker-waves","name":"Checker Waves","renderer":"surface"},{"slug":"radial-pond","name":"Radial Pond","renderer":"surface"},{"slug":"ripple-tank","name":"Ripple Tank","renderer":"surface"},{"slug":"spiral-wave","name":"Spiral Wave","renderer":"surface"},{"slug":"monkey-saddle","name":"Monkey Saddle","renderer":"surface"},{"slug":"saddle-swirl","name":"Saddle Swirl","renderer":"surface"},{"slug":"helix","name":"Helix","renderer":"curve"},{"slug":"torus-knot","name":"Torus Knot","renderer":"curve"},{"slug":"living-lissajous","name":"Living Lissajous","renderer":"curve"},{"slug":"lissajous-knot","name":"Lissajous Knot","renderer":"curve"},{"slug":"spherical-spiral","name":"Spherical Spiral","renderer":"curve"},{"slug":"trefoil-knot","name":"Trefoil Knot","renderer":"curve"},{"slug":"spirograph","name":"Spirograph","renderer":"curve"},{"slug":"tornado","name":"Tornado","renderer":"curve"},{"slug":"vivianis-curve","name":"Viviani's Curve","renderer":"curve"},{"slug":"breathing-ring","name":"Breathing Ring","renderer":"curve"},{"slug":"mandelbrot","name":"Mandelbrot","renderer":"complex"},{"slug":"breathing-julia","name":"Breathing Julia","renderer":"complex"},{"slug":"newton-basins","name":"Newton Basins","renderer":"complex"},{"slug":"burning-ship","name":"Burning Ship","renderer":"complex"},{"slug":"z-squared","name":"z squared","renderer":"complex"},{"slug":"simple-pole","name":"Simple Pole","renderer":"complex"},{"slug":"rational-map","name":"Rational Map","renderer":"complex"},{"slug":"complex-exp","name":"Complex Exp","renderer":"complex"},{"slug":"complex-sine","name":"Complex Sine","renderer":"complex"},{"slug":"mobius-turn","name":"Möbius Turn","renderer":"complex"},{"slug":"heart","name":"Heart","renderer":"shape"},{"slug":"breathing-sphere","name":"Breathing Sphere","renderer":"shape"},{"slug":"torus","name":"Torus","renderer":"shape"},{"slug":"twisted-torus","name":"Twisted Torus","renderer":"shape"},{"slug":"mobius-strip","name":"Möbius Strip","renderer":"shape"},{"slug":"klein-bottle","name":"Klein Bottle","renderer":"shape"},{"slug":"seashell","name":"Seashell","renderer":"shape"},{"slug":"alains-curve","name":"Alain's Curve","renderer":"polar"},{"slug":"guitar-string","name":"Guitar String","renderer":"surface"},{"slug":"gaussian-bump","name":"Gaussian Bump","renderer":"surface"},{"slug":"saddle-elliptic","name":"Saddle (elliptic)","renderer":"surface"},{"slug":"free-packet","name":"Free Packet","renderer":"quantum"},{"slug":"tunnelling-barrier","name":"Tunnelling Barrier","renderer":"quantum"},{"slug":"potential-step","name":"Potential Step","renderer":"quantum"},{"slug":"harmonic-well","name":"Harmonic Well","renderer":"quantum"},{"slug":"double-well","name":"Double Well","renderer":"quantum"},{"slug":"double-slit","name":"Double Slit","renderer":"quantum2d"},{"slug":"single-slit","name":"Single Slit","renderer":"quantum2d"},{"slug":"scattering-disc","name":"Scattering Disc","renderer":"quantum2d"},{"slug":"orbiting-packet","name":"Orbiting Packet","renderer":"quantum2d"},{"slug":"free-packet-2d","name":"Free Packet 2D","renderer":"quantum2d"},{"slug":"lorenz-attractor","name":"Lorenz Attractor","renderer":"flow"},{"slug":"rossler-attractor","name":"Rössler Attractor","renderer":"flow"},{"slug":"thomas-attractor","name":"Thomas Attractor","renderer":"flow"},{"slug":"whirlpool","name":"Whirlpool","renderer":"flow"},{"slug":"figure-8","name":"Figure-8","renderer":"bodies"},{"slug":"lagrange-triangle","name":"Lagrange Triangle","renderer":"bodies"},{"slug":"hierarchical-triple","name":"Hierarchical Triple","renderer":"bodies"},{"slug":"sun-and-planets","name":"Sun and Planets","renderer":"bodies"},{"slug":"double-pendulum","name":"Double Pendulum","renderer":"bodies"},{"slug":"triple-pendulum","name":"Triple Pendulum","renderer":"bodies"},{"slug":"gravity-disc","name":"Gravity Disc","renderer":"swarm"},{"slug":"springs","name":"Springs","renderer":"swarm"},{"slug":"molecules","name":"Molecules","renderer":"swarm"},{"slug":"rose-20","name":"Rose 20","renderer":"polar"},{"slug":"cubic-spiral-sink","name":"Cubic Spiral Sink","renderer":"flow"},{"slug":"bellman-3-3","name":"Bellman 3×3","renderer":"bellman"},{"slug":"russell-norvig-4-3","name":"Russell–Norvig 4×3","renderer":"bellman"},{"slug":"cliff-walk","name":"Cliff Walk","renderer":"bellman"},{"slug":"maze","name":"Maze","renderer":"bellman"},{"slug":"laplace-transform","name":"Laplace Transform","renderer":"surface"},{"slug":"huygens-slit","name":"Huygens Slit","renderer":"surface"},{"slug":"huygens-slits","name":"Huygens Slits","renderer":"surface"},{"slug":"drumhead","name":"Drumhead","renderer":"surface"},{"slug":"charged-rod","name":"Charged Rod","renderer":"surface"},{"slug":"chirp-transform","name":"Chirp Transform","renderer":"surface"},{"slug":"heat-kernel","name":"Heat Kernel","renderer":"wave"},{"slug":"uncertainty","name":"Uncertainty","renderer":"wave"},{"slug":"normal-distribution","name":"Normal Distribution","renderer":"wave"},{"slug":"gamma-function","name":"Gamma Function","renderer":"wave"},{"slug":"pendulum-period","name":"Pendulum Period","renderer":"wave"},{"slug":"gaussian-blur","name":"Gaussian Blur","renderer":"wave"},{"slug":"logarithmic-integral","name":"Logarithmic Integral","renderer":"wave"},{"slug":"euler-spiral","name":"Euler Spiral","renderer":"curve"},{"slug":"fresnel-phasor","name":"Fresnel Phasor","renderer":"curve"},{"slug":"antenna-beam","name":"Antenna Beam","renderer":"polar"},{"slug":"kronig-penney","name":"Kronig–Penney","renderer":"quantum"},{"slug":"smooth-step","name":"Smooth Step","renderer":"quantum"},{"slug":"soft-corral","name":"Soft Corral","renderer":"quantum2d"},{"slug":"square-petal","name":"Square Petal","renderer":"polar"},{"slug":"square-orbit","name":"Square Orbit","renderer":"curve"},{"slug":"partial-sums","name":"Partial Sums","renderer":"wave"},{"slug":"taylor-sine","name":"Taylor Sine","renderer":"wave"},{"slug":"viete-product","name":"Viete Product","renderer":"wave"},{"slug":"gamma-poles","name":"Gamma Poles","renderer":"wave"},{"slug":"piecewise","name":"Piecewise","renderer":"wave"},{"slug":"membrane-modes","name":"Membrane Modes","renderer":"surface"},{"slug":"diffraction","name":"Diffraction","renderer":"surface"},{"slug":"diffusion-front","name":"Diffusion Front","renderer":"surface"},{"slug":"gradient-flow","name":"Gradient Flow","renderer":"flow"},{"slug":"chain-rule","name":"Chain Rule","renderer":"wave"},{"slug":"tangent-tube","name":"Tangent Tube","renderer":"shape"},{"slug":"crest-doubling","name":"Crest Doubling","renderer":"wave"},{"slug":"resonance-curve","name":"Resonance Curve","renderer":"wave"},{"slug":"launch-angle","name":"Launch Angle","renderer":"wave"},{"slug":"dispersion","name":"Dispersion","renderer":"wave"},{"slug":"rational-rose","name":"Rational Rose","renderer":"polar"},{"slug":"gielis-supershape","name":"Gielis Supershape","renderer":"polar"},{"slug":"focal-conic","name":"Focal Conic","renderer":"polar"},{"slug":"chladni-plate","name":"Chladni Plate","renderer":"surface"},{"slug":"cusp-catastrophe","name":"Cusp Catastrophe","renderer":"surface"},{"slug":"knot-family","name":"Knot Family","renderer":"curve"},{"slug":"horn-torus","name":"Horn Torus","renderer":"shape"},{"slug":"superellipsoid","name":"Superellipsoid","renderer":"shape"},{"slug":"julia-dials","name":"Julia Dials","renderer":"complex"},{"slug":"multibrot","name":"Multibrot","renderer":"complex"},{"slug":"newton-petals","name":"Newton Petals","renderer":"complex"},{"slug":"barrier-or-well","name":"Barrier or Well","renderer":"quantum"},{"slug":"reflectionless-well","name":"Reflectionless Well","renderer":"quantum"},{"slug":"squeezed-packet","name":"Squeezed Packet","renderer":"quantum"},{"slug":"hopf-bifurcation","name":"Hopf Bifurcation","renderer":"flow"},{"slug":"van-der-pol","name":"Van der Pol","renderer":"flow"},{"slug":"driven-springs","name":"Driven Springs","renderer":"swarm"},{"slug":"rutherford-scattering","name":"Rutherford Scattering","renderer":"bodies"},{"slug":"ring-trap","name":"Ring Trap","renderer":"bodies"},{"slug":"coupled-oscillators","name":"Coupled Oscillators","renderer":"bodies"},{"slug":"bead-string","name":"Bead String","renderer":"bodies"},{"slug":"lagrange-points","name":"Lagrange Points","renderer":"bodies"},{"slug":"roche-lobe","name":"Roche Lobe","renderer":"bodies"},{"slug":"spring-pendulum","name":"Spring Pendulum","renderer":"bodies"},{"slug":"elastic-chaos","name":"Elastic Chaos","renderer":"bodies"},{"slug":"horseshoe-orbit","name":"Horseshoe Orbit","renderer":"bodies"},{"slug":"quadric-family","name":"Quadric Family","renderer":"shape"},{"slug":"paraboloid-family","name":"Paraboloid Family","renderer":"surface"},{"slug":"burgers-vortex","name":"Burgers Vortex","renderer":"flow"},{"slug":"rabi-oscillation","name":"Rabi Oscillation","renderer":"curve"},{"slug":"supershape-urchin","name":"Supershape Urchin","renderer":"shape"},{"slug":"supershape-pagoda","name":"Supershape Pagoda","renderer":"shape"},{"slug":"supershape-flower","name":"Supershape Flower","renderer":"shape"},{"slug":"hypotrochoid-7-13","name":"Hypotrochoid 7/13","renderer":"curve"},{"slug":"hypotrochoid-7-5","name":"Hypotrochoid 7/5","renderer":"curve"},{"slug":"hypotrochoid-3-4","name":"Hypotrochoid 3/4","renderer":"curve"},{"slug":"helicoid-to-catenoid","name":"Helicoid to Catenoid","renderer":"shape"},{"slug":"residue-staircase","name":"Residue Staircase","renderer":"wave"},{"slug":"lyapunov-descent","name":"Lyapunov Descent","renderer":"curve"},{"slug":"kuen-surface","name":"Kuen Surface","renderer":"shape"},{"slug":"aizawa-attractor","name":"Aizawa Attractor","renderer":"flow"},{"slug":"einstein-rosen-bridge","name":"Einstein–Rosen Bridge","renderer":"shape"}]};
/* Wavelace · embed — options into a link to Wavelace's embed page, and an iframe of it
 *
 * The package's module: tools/pkg.js writes TABLES in front of this file, read out of the app (its link
 * flags and their hash keys, the dials, the renderers, the views and every preset by index), so what the
 * link must agree with is never copied by hand. The rest is written here rather than generated, because
 * the app's own codec (encodeHash in js/session.js) is tied to its state; test/embed-pkg.test.js reads
 * every kind of link this writes back through the app's decodeHash and applySnapshot. A preset alone is a
 * whole link, p=<index> plus what differs, which is the form the app already reads. */

const SITE = "https://www.wavelace.com";
// the Embed panel's own sizes (js/ui-embed.js), which the test holds these to: a style as the DOM spells it,
// so a framework takes it as it is, and cssText writes the attribute
const SIZES = {
  "4:3": {aspectRatio: "4/3"},
  "16:9": {aspectRatio: "16/9"},
  "1:1": {aspectRatio: "1/1"},
  fill: {height: "100%"},
};
// the reader's word for a flag whose app name would read wrong here: the embed's formula flag shows the
// formula panel, and formula is the text to draw
const OPTION_OF_FLAG = {playing: "play", formula: "showFormula"};
const FLAG_OF_OPTION = Object.fromEntries(Object.keys(TABLES.flags).map(flag => [OPTION_OF_FLAG[flag] ?? flag, flag]));
const OPTIONS = ["preset", "formula", "formulas", "renderer", "name", "values", "dials", "theme", "view", "zoom", "site",
                 ...Object.keys(FLAG_OF_OPTION)];
const THEMES = ["light", "dark"], ZOOMS = ["click", "always", false];

export const PRESETS = TABLES.presets;
export const RENDERERS = TABLES.renderers;

export function embedUrl(options){
  validate(options);
  const pairs = [...presetPart(options), ...formulaPart(options), ...valuePart(options), ...lookPart(options)];
  return `${siteOf(options)}/embed#${new URLSearchParams(pairs.filter(([, value]) => value !== undefined))}`;
}

export function embedHtml(options, size = "4:3"){
  const attributes = Object.entries(markupAttributes(options, size)).map(([name, value]) => `${name}="${value}"`);
  return `<iframe ${attributes.join(" ")}></iframe>`;
}

// the frame's attributes, the same for the HTML a server writes, the element a page makes and a framework's
export function embedAttributes(options, size = "4:3"){
  if(!Object.hasOwn(SIZES, size)) throw new Error(`size is ${oneOf(Object.keys(SIZES))}, not ${size}`);
  const style = {display: "block", width: "100%", ...SIZES[size], border: "0"};
  return {src: embedUrl(options), title: "Wavelace", loading: "lazy", style};
}

export function embed(container, options, size = "4:3"){
  const document = container.ownerDocument;
  let iframe = frameOf(document, options, size), shown = options;
  container.appendChild(iframe);
  return {
    get iframe(){ return iframe; },
    // the embed page lays itself out again for a new link, so only another site needs another frame
    update(next){
      if(siteOf(next) === siteOf(shown)) iframe.src = embedUrl(next);
      else iframe = replaced(iframe, frameOf(document, next, size));
      shown = next;
    },
    remove(){ iframe.remove(); },
  };
}

/* ---------- the link, part by part: [key, value] pairs, a value left undefined when the link says nothing ---------- */
const presetPart = ({preset}) => [["p", preset === undefined ? undefined : String(presetIndex(preset))]];

function formulaPart({formula, formulas, renderer, name}){
  if(formula === undefined && formulas === undefined) return [];
  const text = formulas ? [["fx", formulas.x], ["fy", formulas.y], ["fz", formulas.z]] : [["f", formula]];
  return [["m", renderer], ["n", name], ...text];
}

function valuePart({values = {}, dials = {}}){
  const letters = Object.entries(values).map(([name, value]) => `${name}:${value}`);
  return [["let", letters.length ? letters.join(",") : undefined],
          ...TABLES.dials.map(dial => [dial, dials[dial] === undefined ? undefined : String(dials[dial])])];
}

// what the link says only when it differs from what the embed does without it, as the app's own links do
function lookPart(options){
  const flags = Object.entries(FLAG_OF_OPTION).map(([option, flag]) => [TABLES.hashKeys[flag] ?? flag, flagValue(options[option], flag)]);
  return [...flags, ["theme", options.theme], ["zoom", ZOOM_VALUE.get(options.zoom)], ["view", options.view]];
}
const flagValue = (on, flag) => on === undefined || on === TABLES.flags[flag] ? undefined : on ? "1" : "0";
const ZOOM_VALUE = new Map([["always", "always"], [false, "0"]]);   // click, the default, says nothing

const siteOf = options => (options.site ?? SITE).replace(/\/+$/, "");

// the attributes as markup spells them: the style as one declaration list, aspectRatio as aspect-ratio
function markupAttributes(options, size){
  const attributes = embedAttributes(options, size);
  return {...attributes, style: cssText(attributes.style)};
}
const cssText = style => Object.entries(style).map(([property, value]) => `${kebab(property)}:${value}`).join(";");
const kebab = property => property.replace(/[A-Z]/g, capital => `-${capital.toLowerCase()}`);

// the new frame, in the old one's place
function replaced(old, fresh){
  old.replaceWith(fresh);
  return fresh;
}

function frameOf(document, options, size){
  const iframe = document.createElement("iframe");
  for(const [name, value] of Object.entries(markupAttributes(options, size))) iframe.setAttribute(name, value);
  return iframe;
}

function presetIndex(preset){
  const index = typeof preset === "number" ? preset : PRESETS.findIndex(p => p.slug === preset);
  if(!Number.isInteger(index) || !PRESETS[index])
    throw new Error(`no preset ${typeof preset === "number" ? "" : "called "}${preset}: PRESETS lists them`);
  return index;
}

/* ---------- what is refused, and why ---------- */
function validate(options){
  if(!options || typeof options !== "object") throw new Error("the options are an object: {preset: \"chirp-wave\"}, say");
  for(const key of Object.keys(options))
    if(!OPTIONS.includes(key)) throw new Error(`no option called ${key}: the options are ${OPTIONS.join(", ")}`);
  validateWhat(options);
  validateNumbers(options);
  validateLooks(options);
}

// a preset, a formula with its renderer, or both
function validateWhat(options){
  const drawn = options.formula !== undefined || options.formulas !== undefined;
  if(options.preset === undefined && !drawn) throw new Error("say what to show: a preset, or a formula with its renderer");
  if(options.preset !== undefined) presetIndex(options.preset);
  if(drawn) validateFormula(options);
  else for(const key of ["renderer", "name"])
    if(options[key] !== undefined) throw new Error(`${key} goes with a formula: a preset brings its own`);
}

function validateFormula({formula, formulas, renderer}){
  if(formula !== undefined && formulas !== undefined) throw new Error("formula or formulas, not both: formulas is the three a curve or shape draws");
  if(renderer === undefined) throw new Error(`a formula needs its renderer: renderer is one of ${oneOf(RENDERERS)}`);
  if(!RENDERERS.includes(renderer)) throw new Error(`no renderer called ${renderer}: renderer is one of ${oneOf(RENDERERS)}`);
  const triple = TABLES.triple.includes(renderer);
  if(triple && formulas === undefined) throw new Error(`${renderer} draws three formulas: pass formulas: {x, y, z}`);
  if(!triple && formula === undefined) throw new Error(`${renderer} draws one formula: pass formula`);
  for(const text of triple ? [formulas.x, formulas.y, formulas.z] : [formula])
    if(typeof text !== "string") throw new Error(`a formula is text, not ${text}`);
}

function validateNumbers({values = {}, dials = {}}){
  for(const [name, value] of Object.entries(values)){
    if(/[:,]/.test(name)) throw new Error(`values names a letter, not ${name}`);
    if(!Number.isFinite(value)) throw new Error(`values.${name} is a number, not ${value}`);
  }
  for(const [dial, value] of Object.entries(dials)){
    if(!TABLES.dials.includes(dial)) throw new Error(`no dial called ${dial}: dials are ${TABLES.dials.join(", ")}`);
    if(!Number.isFinite(value)) throw new Error(`dials.${dial} is a number, not ${value}`);
  }
}

function validateLooks({theme, view, zoom, site, ...flags}){
  if(theme !== undefined && !THEMES.includes(theme)) throw new Error(`theme is light or dark, not ${theme}`);
  if(view !== undefined && !TABLES.views.includes(view)) throw new Error(`no view called ${view}: view is one of ${oneOf(TABLES.views)}`);
  if(zoom !== undefined && !ZOOMS.includes(zoom)) throw new Error(`zoom is click, always or false, not ${zoom}`);
  for(const option of Object.keys(FLAG_OF_OPTION))
    if(flags[option] !== undefined && typeof flags[option] !== "boolean") throw new Error(`${option} is true or false, not ${flags[option]}`);
  if(site !== undefined && !/^https?:\/\/\S+$/.test(site)) throw new Error(`site is an address, as in ${SITE}, not ${site}`);
}

// a, b, c or d
const oneOf = items => items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;

