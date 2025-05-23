# Changelog

## [5.7.1] - 2025-05-18

- Solve an issue related to multiple nested at-rules with rules in the middle.

## [5.7.0] - 2025-04-08

- Add an option to use the `OnceExit` visitor to execute the plugin instead of the default `Once`.

## [5.6.1] - 2025-04-07

- Check that a rule has a `selectors` property before accessing it and in this way avoid an issue with Tailwind.

## [5.6.0] - 2024-12-13

- Add new directives to freeze rules and declarations `/*rtl:freeze*/`, `/*rtl:begin:freeze*/` and `/*rtl:end:freeze*/`
- Remove references to the legacy package

## [5.5.1] - 2024-11-24

- Small refactor to avoid a circular dependency between two parsers

## [5.5.0] - 2024-09-28

- Support for nested at-rules

## [5.4.0] - 2024-09-01

- Update `RTLCSS` to version `4.3.0`

## [5.3.1] - 2024-07-29

- Update `RTLCSS` to version `4.2.0`

## [5.3.0] - 2024-05-22

- Support specifying processors during processing CSS declarations
- Fix `raw` directive with universal selectors

## [5.2.0] - 2024-05-16

- Add support for prefixes in `::view-transition` rules

## [5.1.2] - 2024-04-16

- Remove preinstall script

## [5.1.1] - 2024-04-11

- Fix: make aliases affect both-prefixed and safe-prefixed declarations

## [5.1.0] - 2023-12-30

- New directives to set the option `processRuleNames`: `/*rtl:rules*/`, `/*rtl:begin:rules*/`, and `/*rtl:end:rules*/`

## [5.0.0] - 2023-12-30

- Breaking change: removed `autoRename` option and `/*rtl:rename*/`, `/*rtl:begin:rename*/`, and `/*rtl:end:rename*/` directives
- Fixed a bug: `/*rtl:begin:urls*/` and `/*rtl:end:urls*/` (previously `/*rtl:begin:rename*/` and `/*rtl:end:rename*/`) blocks didn't change the URL names inside rules if started outside
- New option: `processRuleNames`, if this option is `true`, rules with no directional properties that match any entry in the `stringMap` will be swapped when the direction changes
- New directives: `/*rtl:urls*/`, `/*rtl:begin:urls*/`, and `/*rtl:end:urls*/` have replaced `/*rtl:rename*/`, `/*rtl:begin:rename*/`, and `/*rtl:end:rename*/` and they only take effect in declarations' URLs


## [4.0.9] - 2023-11-10

- Update RTLCSS to version 4.1.1

## [4.0.8] - 2023-09-15

- Fix `margin-block` and `padding-block` properties not taken into account for the `safeBothPrefix` option.

## [4.0.7] - 2023-08-12

- Fix ESM types

## [4.0.6] - 2023-05-03

- Update RTLCSS to version 4.1.0

## [4.0.5] - 2023-04-21

- Fixed an error related to empty atRules

## [4.0.4] - 2023-04-08

- Fixed unwanted removal of empty rules

## [4.0.3] - 2023-03-04

- Fixed a bug releated to overriden properties

## [4.0.2] - 2023-02-11

- Fixed a bug related to overriden properties

## [4.0.0] - 2022-09-15

- Upgrade RTLCSS to major version 4.0.0. This version brings these changes:
    * Support flipping `justify-content`, `justify-items` and `justify-self`
    * Support flipping length background position without using `calc`
- Update dependencies

## [3.7.2] - 2022-07-24

- Fix a Vite 3 warning

## [3.7.1 / 1.8.1] - 2022-07-24

- Improve the overriding logic to avoid edge cases with multiple overrides

## [3.7.0 / 1.8.0] - 2022-07-21

- Add an option to have more control over the selector prefixing logic (`prefixSelectorTransformer`)

## [3.6.4] - 2022-07-20

- Apply the safe prefix to logical declarations overridden by physical ones

## [3.6.3] - 2022-04-17

- Fix a bug with `safeBothPrefix` and `processKeyFrames` options in `diff` mode

## [3.6.2] - 2022-04-12

- Fix a bug with the cleaning method and @charset rules

## [3.6.1] - 2022-04-09

- Improved the cleaning process

## [3.6.0] - 2022-04-09

- Added a new diff mode to output only flipped rules with the intention of using them in a separate stylesheet file to override the main stylesheet

## [3.5.4] - 2022-03-26

- Build the package bundle using rollup and created an ESM version of the package

## [3.5.3] - 2022-03-11

- Fixed a bug that was removing rules without declarations but with atRules

## [3.5.2] - 2022-01-26

- Move inside the both-rules-prefix, rules which override previous flipped rules

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