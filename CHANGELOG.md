# Changelog

## [3.5.1] - 2021-12-14

- Fix a bug in the cleanRuleRawsBefore utility method

## [3.5.0] - 2021-11-18

- Upgraded the RTLCSS library to version 3.5.0 to support object-position

## [3.4.1] - 2021-09-22

- Upgraded the RTLCSS library to the version 3.3.0 to support the processEnv option

## [3.4.0] - 2021-09-22

- Added support for RTLCSS processEnv option

## [3.3.5] - 2021-08-25

- Support for nested at-rules

## [3.3.4] - 2021-05-23

- Added a new option to support declarations aliases

## [3.3.3 / 1.7.2] - 2021-05-23

- Added a new option to ignore rules already prefixed

## [3.3.2 / 1.6.9] - 2021-05-12

- Fix a bug with :root and html rules

## [3.3.1 / 1.6.8] - 2021-05-03

- Fix multiple declarations overriding order

## [3.3.0 / 1.6.7] - 2021-03-14

- Implemented `/*rtl:source:{source}*/`, `/*rtl:begin:source:{source}*/`, and `/*rtl:end:source*/`

## [3.2.0 / 1.6.6] - 2021-03-13

- Add basic support for nested rules (SCSS)

## [3.0.1 / 1.6.5] - 2021-02-19

- In the override method change the `unset` value to override properties by the intial value of them to support the override method in Internet Explorer

## [3.0.0] - 2021-01-29

- Export the plugin as the default module to increase its compatibility
- Export the options helpers in a separated options module
- Get rid of the dist folder to publish the package

## [2.0.0] - 2020-12-16

- Updated packages to the latest versions and solved vulnerabilities
- Some minor changes in the README file
- Updated postcss package to version 8
- Created a vendor utility because it has been removed from postcss

## [1.6.1] - 2020-08-18

- Updated multiple packages
- Solve dependencies vulnerabilities

## [1.6.0] - 2020-05-21

- Implemented the safeBothPrefix option
- Fixed minor bugs

## [1.5.0] - 2020-04-30

- Implemented RTL raw control directives for rules and declarations

## [1.4.0] - 2020-04-24

- Implemented RTL rename control directives for rules and declarations

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
