import { ui } from '../content/ui.js';

// A broadcast timecode driven by scroll position: sixteen years of work mapped onto
// a sixteen hour recording. Decorative, so it is hidden from assistive technology.
export function Timecode({ clockRef, locale }) {
  return <div className="timecode" aria-hidden="true">
    <span className="rec" />
    <b ref={clockRef}>00:00:00:00</b>
    <span className="timecode-track"><i /></span>
    <span className="timecode-label">{ui[locale].recording}</span>
  </div>;
}
