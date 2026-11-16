export const DEFAULT_LABEL = 'Drop your files or folders here';
export const DEFAULT_DRAG_ACTIVE_LABEL = 'Release to upload';
export const DEFAULT_DRAG_REJECT_LABEL = "These files aren't supported";
// Reads "or click to browse or choose a folder", the last part a link.
export const BROWSE_HINT = 'click to browse files';
export const FOLDER_HINT_JOINER = ' or ';
export const CHOOSE_FOLDER_LABEL = 'choose a folder';

// Makes the native picker choose a folder, and everything inside it, instead
// of files. Spread onto the input, since React's types don't include it.
export const FOLDER_INPUT_ATTRIBUTES = { webkitdirectory: '' };

// Relative sizes, so the content scales with the container. The padding is
// relative to the drop area's width, the gap and the badge's height to its
// height, and the icon and halo to the badge.
export const DROP_AREA_PADDING = '5% 4%';
export const DROP_AREA_GAP = '5%';
export const ICON_BADGE_HEIGHT = '32%';
export const ICON_SIZE = '46%';
export const HALO_INSET = '-15%';

// Layout values with no theme equivalent (in px).
export const DOT_SIZE = 1;

// Gap between background dots (in theme spacing units).
export const DOT_GRID_SPACING = 2.5;
