const PADDING = 'padding';
const MARGIN = 'margin';
const ANIMATION = 'animation';
const BORDER_WIDTH = 'border-width';
const BACKGROUND_CLIP = 'background-clip';

export const aliases = {
  '--small-padding': PADDING,
  '--large-padding': PADDING,
  '--custom-margin': MARGIN,
  '--small-margin': MARGIN,
  '--large-margin': MARGIN
};

export const propsAliases = {
  'view-timeline': ANIMATION,
  'custom-border-width': BORDER_WIDTH,
  'custom-clip-background': BACKGROUND_CLIP,
  'custom-padding': PADDING
};