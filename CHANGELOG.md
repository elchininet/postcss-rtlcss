# Changelog

## [1.3.1] - 2020-04-21

- The stringMap feature has been refactored to mimic RTLCSS behaviour

## [1.3.0] - 2020-04-21

- Added autoRename option to rename rule selectors taking into account the string map
- Added greedy option dependant on autoRename

## [1.2.3] - 2020-04-18

- Bug fix: flip animation names if they are surrounded by comas

## [1.2.2] - 2020-04-16

- Bug fix: detect chainable override, e.g. border-bottom-color is overridden by border-bottom but also by border

## [1.2.0 - 1.2.1] - 2020-04-16

- Introduced a new parameter (bothPrefix) to manage styles that can be overridden due to specificity

## [1.1.2] - 2020-04-14

- Avoid duplicating the same declarations in the flipped rules
- Bug fix: avoid adding unset variables when both directions exist in the main rule

## [1.1.1] - 2020-04-13

- Add support for multiple animation names

## [1.1.0] - 2020-04-13

- Implemented an option to flip keyframes animations
- Flip rules inside media-queries

## [1.0.2] - 2020-04-12

- Improve the output formatting
- Refactored multiple utility methods to make them simpler
- Created a CHANGELOG

## [1.0.1] - 2020-04-11

- Refactored the exported module to be a named exported instead of a default one

## [1.0.0] - 2020-04-11

- Created the postcss-rtlcss package
