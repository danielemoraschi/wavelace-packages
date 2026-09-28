/*! @wavelace/embed/react 0.1.0 | MIT | © 2026 Daniele Moraschi | generated from tools/pkg/embed/react.js */
/* @wavelace/embed/react: a Wavelace plot in a React app
 *
 * The frame is the loader's, embedAttributes, so nothing is decided twice. New props change only the
 * frame's src, which the embed page reads without reloading; another site is another page, so the frame is
 * keyed by the link's origin and a new site gets a fresh one, as embed().update does. The file is published
 * as it is written, with no build between, so it is plain calls rather than JSX. React is an optional peer
 * of the package: this subpath is the only module that imports it. */
import {createElement} from "react";
import {embedAttributes} from "./index.js";

// ref is a prop from React 19, and it is the frame's, not an option of the link
export function Embed({size, className, ref, ...options}){
  const attributes = embedAttributes(options, size);
  return createElement("iframe", {...attributes, key: new URL(attributes.src).origin, className, ref});
}

