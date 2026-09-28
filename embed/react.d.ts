/* @wavelace/embed/react: the public API of the React subpath. tools/pkg.js reads the exported names off this
 * file, so a name declared here is exported by react.js and a name missing here is not. React 18 or later is
 * a peer of the package, needed only by this subpath. */
import type {ReactElement, Ref} from "react";
import type {EmbedOptions, Size} from "./index.js";

export interface EmbedProps extends EmbedOptions {
  /** The frame's shape (4:3 unless given). */
  size?: Size;
  className?: string;
  /** The iframe itself, for focus or postMessage. React 19 passes it; React 18 gives a function component no ref. */
  ref?: Ref<HTMLIFrameElement>;
}
/** An iframe of the plot. New props change its link, which the embed reads without reloading; an option it
 *  does not know throws while rendering, in words that say what to change, for an error boundary. */
export function Embed(props: EmbedProps): ReactElement;
