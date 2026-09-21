/**
 * Chrome for an action inside a table row: bare icon + label, no capsule.
 *
 * Pair it with `size="sm" look="text"` on the `Button`. `look="text"` is what
 * drops the border, background and shadow; this kills what is left —
 *
 * - `px-0`: that padding existed to give the outline room, and there is no
 *   outline any more. Spacing between actions comes from the cell's `space-x-*`.
 * - `hover:bg-transparent`: `variant="ghost"` carries `hover:bg-foreground/5`,
 *   which paints the capsule back on hover.
 * - `hover:underline`: the only affordance left once every box is gone.
 *
 * One constant rather than the string in ten templates: a tweak here would
 * otherwise be ten edits, and the one that gets missed is the row that looks
 * wrong. Toolbar and modal buttons are *not* this — a capsule is right there;
 * this is only for actions sitting in a table cell.
 */
export const ACTION_BUTTON_CLASS = 'px-0 hover:bg-transparent hover:underline'
