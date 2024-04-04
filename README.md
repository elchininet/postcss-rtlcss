# PostCSS RTLCSS

[PostCSS] plugin to build Cascading Style Sheets (CSS) with Left-To-Right (LTR) and Right-To-Left (RTL) rules using [RTLCSS]. RTLCSS allows one to flip an entire CSS file with the intention of using the original CSS for one direction and the new generated one for the other. What PostCSS RTLCSS does, is to create a single CSS file with both directions or to create a minimal CSS file only with the flipped rules with the intention of overriding the main one.

[![Deployment Status](https://github.com/elchininet/postcss-rtlcss/actions/workflows/deploy.yaml/badge.svg)](https://github.com/elchininet/postcss-rtlcss/actions/workflows/deploy.yaml)
[![Test](https://github.com/elchininet/postcss-rtlcss/actions/workflows/test.yaml/badge.svg)](https://github.com/elchininet/postcss-rtlcss/actions/workflows/test.yaml)
[![Coverage Status](https://coveralls.io/repos/github/elchininet/postcss-rtlcss/badge.svg?branch=master)](https://coveralls.io/github/elchininet/postcss-rtlcss?branch=master)
[![npm version](https://badge.fury.io/js/postcss-rtlcss.svg)](https://badge.fury.io/js/postcss-rtlcss)
[![downloads](https://img.shields.io/npm/dw/postcss-rtlcss)](https://www.npmjs.com/package/postcss-rtlcss)


[PostCSS]: https://github.com/postcss/postcss
[RTLCSS]: https://rtlcss.com/

Playground Demo
---

https://elchininet.github.io/postcss-rtlcss/


Install
---

#### npm

```bash
## Latest version (postcss@^8.0.0)
npm install postcss-rtlcss --save-dev

## Latest legacy version (postcss@^7.0.0)
npm install postcss-rtlcss@legacy --save-dev
```

#### pnpm

```bash
## Latest version (postcss@^8.0.0)
pnpm add -D postcss-rtlcss

## Latest legacy version (postcss@^7.0.0)
pnpm add -D postcss-rtlcss@legacy
```

#### yarn

```bash
## Latest version (postcss@^8.0.0)
yarn add postcss-rtlcss -D

## Latest legacy version (postcss@^7.0.0)
yarn add postcss-rtlcss@legacy -D
```

Basic usage
---

#### Usage with commonJS

```javascript
const postcss = require('postcss');
const postcssRTLCSS = require('postcss-rtlcss');
const { Mode, Source } = require('postcss-rtlcss/options');

const options = { ... available options ... };
const result = postcss([
    postcssRTLCSS(options)
]).process(cssInput);

const rtlCSS = result.css;
```

##### commonJS with the versions 1.x.x - 2.x.x
```javascript
const { postcssRTLCSS, Mode, Source, Autorename } = require('postcss-rtlcss');
```

#### Usage with ES6 modules

```javascript
import postcss from 'postcss';
import postcssRTLCSS from 'postcss-rtlcss';
import { Mode, Source } from 'postcss-rtlcss/options';

const options = { ... available options ... };
const result = postcss([
    postcssRTLCSS(options)
]).process(cssInput);

const rtlCSS = result.css;
```

##### ES6 modules with the versions 1.x.x - 2.x.x

```javascript
import { postcssRTLCSS, Mode, Source, Autorename } from 'postcss-rtlcss';
```

#### Usage in Webpack with postcss-loader

```javascript
rules: [
    {
        test: /\.css$/,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [
                            postcssRTLCSS(options)
                        ]
                    }
                }
            }
        ]
    }
]
```

Examples
---

#### Input

```css
.test1, .test2 {
    background-color: #FFF;
    background-position: 10px 20px;
    border-radius: 0 2px 0 8px;
    color: #666;
    padding-right: 20px;
    text-align: left;
    transform: translate(-50%, 50%);
    width: 100%;
}

.test3 {
    direction: ltr;
    margin: 1px 2px 3px;
    padding: 10px 20px;
    text-align: center;
}
```

#### Output using the combined mode (default)

This is the recommended method, it will generate more CSS code but each direction will have their specific CSS declarations and there is no need of overriding properties.

```css
.test1, .test2 {
    background-color: #FFF;
    background-position: 10px 20px;
    color: #666;
    width: 100%;
}

[dir="ltr"] .test1, [dir="ltr"] .test2 {
    border-radius: 0 2px 0 8px;
    padding-right: 20px;
    text-align: left;
    transform: translate(-50%, 50%);
}

[dir="rtl"] .test1, [dir="rtl"] .test2 {
    border-radius: 2px 0 8px 0;
    padding-left: 20px;
    text-align: right;
    transform: translate(50%, 50%);
}

.test3 {
    margin: 1px 2px 3px;
    padding: 10px 20px;
    text-align: center;
}

[dir="ltr"] .test3 {
    direction: ltr;
}

[dir="rtl"] .test3 {
    direction: rtl;
}
```

#### Output using the override mode

This is one of the alternative methods to override. It will generate less code because it lets the main rule intact most of the time and generates shorter specific rules to override the properties that are affected by the direction of the text.

```css
.test1, .test2 {
    background-color: #FFF;
    background-position: 10px 20px;
    border-radius: 0 2px 0 8px;
    color: #666;
    padding-right: 20px;
    text-align: left;
    transform: translate(-50%, 50%);
    width: 100%;
}

[dir="rtl"] .test1, [dir="rtl"] .test2 {
    border-radius: 2px 0 8px 0;
    padding-right: 0;
    padding-left: 20px;
    text-align: right;
    transform: translate(50%, 50%);
}

.test3 {
    direction: ltr;
    margin: 1px 2px 3px;
    padding: 10px 20px;
    text-align: center;
}

[dir="rtl"] .test3 {
    direction: rtl;
}
```

#### Output using the diff mode

This is the second alternative method to override. It generates the minimum amount of code because it only outputs the rules that have been flipped and without prefixing them. The intention of this method is to generate a separate stylesheet file that will be loaded on top of the original one to override those rules that need to be flipped in certain direction.

```css
.test1, .test2 {
    border-radius: 2px 0 8px 0;
    padding-right: 0;
    padding-left: 20px;
    text-align: right;
    transform: translate(50%, 50%);
}

.test3 {
    direction: rtl;
}
```

But the two methods to override have a disadvantage:

<details><summary>Disadvantage of the override methods</summary>
<p>

Use these methods carefully. They can override a property that is coming from another class if multiple classes are used at the same time. Take a look at the next `HTML` and `CSS` codes:

```html
<div class="test1 test2">
    This is an example
</div>    
```

```css
.test1 {
    background: #666;
    color: #FFF;
    padding: 20px;
}

.test2 {
    padding-right: 10px;
}
```

Using the `combined` method, the generated code will be the next one:

```css
.test1 {
    background: #666;
    color: #FFF;
    padding: 20px;
}

[dir="ltr"] .test2 {
    padding-right: 10px;
}

[dir="rtl"] .test2 {
    padding-left: 10px;
}
```

So, the `div` will have a padding of `20px 10px 20px 20px` in `LTR` and `20px 20px 20px 10px` in `RTL`. Everything will work as expected here.

However, using the `override` method the generated code will be the next one:

```css
.test1 {
    background: #666;
    color: #FFF;
    padding: 20px;
}

.test2 {
    padding-right: 10px;
}

[dir="rtl"] .test2 {
    padding-right: 0;
    padding-left: 10px;
}
```

And using the `diff` method the generated code will be the next one:

```css
.test2 {
    padding-right: 0;
    padding-left: 10px;
}
```

Now the `div` has a padding of `20px 10px 20px 20px` in `LTR` and `20px 0 20px 10px` in `RTL`, because when the class `test2` is overriden, it is not taken into account that it could be used with `test1` having the same properties. The solution, in this case, is to provide the property that has been inherited:

```css
.test1 {
    background: #666;
    color: #FFF;
    padding: 20px;
}

.test2 {
    padding-left: 20px;
    padding-right: 10px;
}
```

So, using the `override` method the generated code will be:

```css
.test1 {
    background: #666;
    color: #FFF;
    padding: 20px;
}

.test2 {
    padding-left: 20px;
    padding-right: 10px;
}

[dir="rtl"] .test2 {
    padding-right: 20px;
    padding-left: 10px;
}
```

And using the `diff` method the generated code will be:

```css
.test2 {
    padding-right: 20px;
    padding-left: 10px;
}
```

</p>
</details>

Options
---

All the options are optional, and a default value will be used if any of them is omitted or the type or format of them is wrong

| Option             | Type                      | Default         | Description                                                  |
| ------------------ | ------------------------- | --------------- | ------------------------------------------------------------ |
| mode               | `Mode (string)`           | `Mode.combined` | Mode of generating the final CSS rules                       |
| ltrPrefix          | `string` or `string[]`    | `[dir="ltr"]`   | Prefix to use in the left-to-right CSS rules                 |
| rtlPrefix          | `string` or `string[]`    | `[dir="rtl"]`   | Prefix to use in the right-to-left CSS rules                 |
| bothPrefix         | `string` or `string[]`    | `[dir]`         | Prefix to create a new rule that affects both directions when the specificity of the ltr or rtl rules will override its declarations |
| prefixSelectorTransformer | `function` | `null` | Transform function to have more control over the selectors prefixing logic |
| safeBothPrefix     | `boolean`                 | `false`         | Add the `bothPrefix` to those declarations that can be affected by the direction to avoid them being overridden by specificity |
| ignorePrefixedRules| `boolean`                 | true            | Ignores rules that have been prefixed with some of the prefixes contained in `ltrPrefix`, `rtlPrefix`, or `bothPrefix` |
| source             | `Source (string)`         | `Source.ltr`    | The direction from which the final CSS will be generated     |
| processUrls        | `boolean`                 | `false`         | Change the strings in URLs using the string map         |
| processRuleNames   | `boolean`                 | `false`         | Swap two rules containing no directional properties if they match any entry in `stringMap` when the direction changes |
| processKeyFrames   | `boolean`                 | `false`         | Flip keyframe animations                                     |
| processEnv         | `boolean`                 | `true`          | When processEnv is false, it prevents flipping agent-defined environment variables (`safe-area-inset-left` and `safe-area-inset-right`) |
| useCalc            | `boolean`                 | `false`         | Flips `background-position-x` and `transform-origin` properties if they are expressed in length units using [calc](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) |
| stringMap          | `PluginStringMap[]`       | Check below     | An array of strings maps that will be used to make the replacements of the declarations' URLs and to match the names of the rules if `processRuleNames` is `true` |
| greedy             | `boolean`                 | `false`         | When greedy is `true`, the matches of `stringMap` will not take into account word boundaries |
| aliases            | `Record<string, string>`  | `{}`            | A strings map to treat some declarations as others |

---

#### mode

<details><summary>Expand</summary>
<p>

The mode option has been explained in the [Output using the combined mode](#output-using-the-combined-mode-default), the [Output using the override mode](#output-using-the-override-mode), and the [Output using the diff mode](#output-using-the-diff-mode) sections. To avoid using magic strings, the package exposes an object with these values, but it is possible to use strings values anyway:

```javascript
import postcss from 'postcss';
import postcssRTLCSS from 'postcss-rtlcss';
import { Mode } from 'postcss-rtlcss/options';

const input = '... css code ...';
const optionsCombined = { mode: Mode.combined }; // This is the default value
const optionsOverride = { mode: Mode.override };
const optionsDiff = { mode: Mode.diff };

const outputCombined = postcss([
    postcssRTLCSS(optionsCombined)
]).process(input);

const outputOverride = postcss([
    postcssRTLCSS(optionsOverride)
]).process(input);

const outputDiff = postcss([
    postcssRTLCSS(optionsDiff)
]).process(input);
```

</p>

</details>

---

#### ltrPrefix and rtlPrefix

<details><summary>Expand</summary>
<p>

These two options manage the prefix strings for each direction. They can be strings or arrays of strings:

##### input

```css
.test1, .test2 {
    left: 10px;
}

.test3,
.test4 {
    text-align: left;
}
```

##### Using strings

```javascript
const options = {
    ltrPrefix: '.ltr',
    rtlPrefix: '.rtl'
};
```

##### output

```css
.ltr .test1, .ltr .test2 {
    left: 10px;
}

.rtl .test1, .rtl .test2 {
    right: 10px;
}

.ltr .test3,
.ltr .test4 {
    text-align: left;
}

.rtl .test3,
.rtl .test4 {
    text-align: right;
}
```

##### Using arrays of strings

```javascript
const options = {
    ltrPrefix: ['[dir="ltr"]', '.ltr'],
    rtlPrefix: ['[dir="rtl"]', '.rtl']
};
```

##### output

```css
[dir="ltr"] .test1, .ltr .test1, [dir="ltr"] .test2, .ltr .test2 {
    left: 10px;
}

[dir="rtl"] .test1, .rtl .test1, [dir="rtl"] .test2, .rtl .test2 {
    right: 10px;
}

[dir="ltr"] .test3,
.ltr .test3,
[dir="ltr"] .test4,
.ltr .test4 {
    text-align: left;
}

[dir="rtl"] .test3,
.rtl .test3,
[dir="rtl"] .test4,
.rtl .test4 {
    text-align: right;
}
```

</p>

</details>

---

#### bothPrefix

<details><summary>Expand</summary>
<p>

This prefix will be used in some specific cases in which a ltr or rtl rule will override declarations located in the main rule due to [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity). Consider the next example using the option `processUrls` as `true`:

```css
.test1 {
    background: url('icons/ltr/arrow.png');
    background-size: 10px 20px;
    width: 10px;
}
```

The generated CSS would be:

```css
.test1 {
    background-size: 10px 20px;
    width: 10px;
}

[dir="ltr"] .test1 {
    background: url('icons/ltr/arrow.png');
}

[dir="rtl"] .test1 {
    background: url('icons/rtl/arrow.png');
}
```

In the previous case, the `background-size` property has been overridden by the `background` one. Even if we change the order of the rules, the last ones have a higher specificity, so they will rule over the first one.

To solve this, another rule will be created at the end using the `bothPrefix` parameter:

```css
.test1 {
    width: 10px;
}

[dir="ltr"] .test1 {
    background: url('icons/ltr/arrow.png');
}

[dir="rtl"] .test1 {
    background: url('icons/rtl/arrow.png');
}

[dir] {
    background-size: 10px 20px;
}
```

And no matter the direction, the `background-size` property is respected.

</p>

</details>

---

#### prefixSelectorTransformer

<details><summary>Expand</summary>
<p>

This function will be used to transform the selectors and prefixing them at our will. The first parameter will be the prefix that will be used and the second the current selector:

>Notes:
>* If the function doesn‘t return a string, the default prefixing logic will be used.
>* If this function is used, be aware that rules using `html` or `:root` will follow the custom prefixing logic. You should cover these cases.

##### input

```css
.test1 {
    left: 10px;
    padding-right: 5px;
    padding-inline-end: 20px;
}
```

If the `prefixSelectorTransformer` is not sent (default):

##### output 

```css
[dir="ltr"] .test1 {
    left: 10px;
    padding-right: 5px;
}

[dir="rtl"] .test1 {
    right: 10px;
    padding-left: 5px;
}

[dir] .test1 {
    padding-inline-end: 20px;
}
```

Setting a `prefixSelectorTransformer` function

```javascript
const options = {
    prefixSelectorTransformer: function (prefix, selector) {
        if (prefix === '[dir]') {
            return `.container > ${prefix} > ${selector}`;
        }
        return `${selector}${prefix}`;
    }
};
```

##### output 

```css
.test1[dir="ltr"] {
    left: 10px;
    padding-right: 5px;
}

.test1[dir="rtl"] {
    right: 10px;
    padding-left: 5px;
}

.container > [dir] > .test1 {
    padding-inline-end: 20px;
}
```

</p>

</details>

---

#### safeBothPrefix

<details><summary>Expand</summary>
<p>

This option will add the `boxPrefix` option to those declarations that can be flipped, no matter if they are not overridden in the same rule. This avoids them being overridden by [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) of other flipped declarations contained in other rules. For example, let's consider that we have a `div` element with the next rules:

```html
<div class="test1 test2">
    This is an example
</div> 
```

```css
.test1 {
    color: #FFF;
    padding: 4px 10px 4px 20px;
    width: 100%;
}

.test2 {
    padding: 0;
}
```

The expecting result is that the `padding` of the element becomes `0` as it has been reset by `test2`. With `safeBothPrefix` in `false`, the generated CSS will be:

```css
.test1 {
    color: #FFF;
    width: 100%;
}

[dir="ltr"] .test1 {
    padding: 4px 10px 4px 20px;
}

[dir="rtl"] .test1 {
    padding: 4px 20px 4px 10px;
}

.test2 {
    padding: 0;
}
```

The result is that the `padding` properties of `test1` have more specificity than the same property in `tes2`, so it is not reset if both rules are applied at the same time. Let's check the result if `safeBothPrefix` is `true`: 

```css
.test1 {
    color: #FFF;
    width: 100%;
}

[dir="ltr"] .test1 {
    padding: 4px 10px 4px 20px;
}

[dir="rtl"] .test1 {
    padding: 4px 20px 4px 10px;
}

[dir] .test2 {
    padding: 0;
}
```

As `test2` has the same level of specificity as `test1`, now the result is that the `padding` is reset if both rules are used at the same time.

</p>

</details>

---

#### ignorePrefixedRules

<details><summary>Expand</summary>
<p>

This option is to ignore the rules that have been prefixed with one of the prefixes contained in `ltrPrefix`, `rtlPrefix`, or `bothPrefix`:

##### input

```css
[dir="ltr"] test {
    left: 10px;
}

[dir="rtl"] test {
    right: 10px;
}
```

##### ignorePrefixedRules true

```javascript
const options = { ignorePrefixedRules: true }; // This is the default value
```

##### output

```css
[dir="ltr"] test {
    left: 10px;
}

[dir="rtl"] test {
    right: 10px;
}
```

##### ignorePrefixedRules false

```javascript
const options = { ignorePrefixedRules: false };
```

##### output

```css
[dir="ltr"] [dir="ltr"] test {
    left: 10px;
}

[dir="rtl"] [dir="ltr"] test {
    right: 10px;
}

[dir="ltr"] [dir="rtl"] test {
    right: 10px;
}

[dir="rtl"] [dir="rtl"] test {
    left: 10px;
}
```

</p>

</details>

---

#### source

<details><summary>Expand</summary>
<p>

This option manages if the conversion will be from `LTR` to `RTL` or vice versa.

##### input

```css
.test1, .test2 {
    left: 10px;
}
```

##### Using Source.ltr in combined mode

```javascript
import { Mode, Source } from 'postcss-rtlcss/options';

const options = {
    mode: Mode.combined,
    source: Source.ltr // This is the default value
};
```

##### output

```css
[dir="ltr"] .test1, [dir="ltr"] .test2 {
    left: 10px;
}

[dir="rtl"] .test1, [dir="rtl"] .test2 {
    right: 10px;
}
```

##### Using Source.rtl in override mode

```javascript
import { Mode, Source } from 'postcss-rtlcss/options';

const options = {
    mode: Mode.override,
    source: Source.rtl
};
```

##### output

```css
.test1, .test2 {
    left: 10px;
}

[dir="ltr"] .test1, [dir="ltr"] .test2 {
    left: auto;
    right: 10px;
}
```

</p>

</details>

---

#### processUrls

<details><summary>Expand</summary>
<p>

This options manages if the strings of the URLs should be flipped taken into account the string map:

##### input

```css
.test1, .test2 {
    background-image: url("./folder/subfolder/icons/ltr/chevron-left.png");
    left: 10px;
}
```

##### processUrls false

```javascript
const options = { processUrls: false }; // This is the default value
```

##### output

```css
.test1, .test2 {
    background-image: url("./folder/subfolder/icons/ltr/chevron-left.png");
}

[dir="ltr"] .test1, [dir="ltr"] .test2 {
    left: 10px;
}

[dir="rtl"] .test1, [dir="rtl"] .test2 {
    right: 10px;
}
```

##### processUrls true

```javascript
const options = { processUrls: true };
```

##### output

```css
[dir="ltr"] .test1, [dir="ltr"] .test2 {
    background-image: url("./folder/subfolder/icons/ltr/chevron-left.png");
    left: 10px;
}

[dir="rtl"] .test1, [dir="rtl"] .test2 {
    background-image: url("./folder/subfolder/icons/rtl/chevron-right.png");
    right: 10px;
}
```

</p>

</details>

---

#### processRuleNames

<details><summary>Expand</summary>
<p>

If it is `true`, it swaps two rules containing no directional properties if they match any entry in `stringMap` when the direction changes

>Note that this option will not prefix those rules that have been processed already because they had directional properties.

##### input

```css
.test1-ltr {
    color: #FFF;
}

.test2-left::before {
    content: "\f007";
}

.test2-right::before {
    content: "\f010";
}
```

##### processRuleNames true

```javascript
const options = {
    processRuleNames: true
};
```

##### output

```css
/* This selector will not be processed because it doesn't have a counterpart */
.test1-ltr {
    color: #FFF;
}

[dir="ltr"] .test2-left::before {
    content: "\f007";
}

[dir="rtl"] .test2-left::before {
    content: "\f010";
}

[dir="ltr"] .test2-right::before {
    content: "\f010";
}

[dir="rtl"] .test2-right::before {
    content: "\f007";
}
```

</p>

</details>

---

#### processKeyFrames

<details><summary>Expand</summary>
<p>

This option manages if the @keyframes animation rules should be flipped:

##### input

```css
.test1 {
    animation: 5s flip 1s ease-in-out;
    color: #FFF;
}

@keyframes flip {
    from {
        transform: translateX(100px);
    }
    to {
        transform: translateX(0);
    }
}
```

##### processKeyFrames false

```javascript
const options = { processKeyFrames: false }; // This is the default value
```

##### output

```css
.test1 {
    animation: 5s flip 1s ease-in-out;
    color: #FFF;
}

@keyframes flip {
    from {
        transform: translateX(100px);
    }
    to {
        transform: translateX(0);
    }
}
```

##### processKeyFrames true

```javascript
const options = { processKeyFrames: true };
```

##### output

```css
.test1 {
    color: #FFF;
}

[dir="ltr"] .test1 {
    animation: 5s flip-ltr 1s ease-in-out;
}

[dir="rtl"] .test1 {
    animation: 5s flip-rtl 1s ease-in-out;
}

@keyframes flip-ltr {
    from {
        transform: translateX(100px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes flip-rtl {
    from {
        transform: translateX(-100px);
    }
    to {
        transform: translateX(0);
    }
}
```

</p>

</details>

---

#### processEnv

<details><summary>Expand</summary>
<p>

This options manages if the agent-defined environment variables should be flipped:

##### input

```css
body {
    padding:
        env(safe-area-inset-top, 10px)
        env(safe-area-inset-right, 20px)
        env(safe-area-inset-bottom, 30px)
        env(safe-area-inset-left, 40px)
    ;
}

.test1 {
    margin-right: env(safe-area-inset-right, 10px);
    margin-left: env(safe-area-inset-left, 20px);
}
```

##### processEnv true

```javascript
const options = { processEnv: true }; // This is the default value
```

##### output

```css
[dir=\\"ltr\\"] body {
    padding:
        env(safe-area-inset-top, 10px)
        env(safe-area-inset-right, 20px)
        env(safe-area-inset-bottom, 30px)
        env(safe-area-inset-left, 40px)
    ;
}

[dir=\\"rtl\\"] body {
    padding:
        env(safe-area-inset-top, 10px)
        env(safe-area-inset-right, 40px)
        env(safe-area-inset-bottom, 30px)
        env(safe-area-inset-left, 20px);
}

[dir=\\"ltr\\"] .test1 {
    margin-right: env(safe-area-inset-right, 10px);
    margin-left: env(safe-area-inset-left, 20px);
}

[dir=\\"rtl\\"] .test1 {
    margin-left: env(safe-area-inset-left, 10px);
    margin-right: env(safe-area-inset-right, 20px);
}
```

##### processEnv false

```javascript
const options = { processEnv: false };
```

##### output

```css
[dir=\\"ltr\\"] body {
    padding:
        env(safe-area-inset-top, 10px)
        env(safe-area-inset-right, 20px)
        env(safe-area-inset-bottom, 30px)
        env(safe-area-inset-left, 40px)
    ;
}

[dir=\\"rtl\\"] body {
    padding:
        env(safe-area-inset-top, 10px)
        env(safe-area-inset-left, 40px)
        env(safe-area-inset-bottom, 30px)
        env(safe-area-inset-right, 20px);
}

[dir=\\"ltr\\"] .test1 {
    margin-right: env(safe-area-inset-right, 10px);
    margin-left: env(safe-area-inset-left, 20px);
}

[dir=\\"rtl\\"] .test1 {
    margin-left: env(safe-area-inset-right, 10px);
    margin-right: env(safe-area-inset-left, 20px);
}
```

</p>

</details>

---

#### useCalc

<details><summary>Expand</summary>
<p>

When this option is enabled, it flips `background-position-x` and `transform-origin` properties if they are expressed in length units using [calc](https://developer.mozilla.org/en-US/docs/Web/CSS/calc):

##### input

```css
.test {
    background-image: url("./folder/subfolder/icons/ltr/chevron-left.png");
    background-position-x: 5px;
    left: 10px;
    transform-origin: 10px 20px;
    transform: scale(0.5, 0.5);
}
```

##### useCalc false

```javascript
const options = { useCalc: false }; // This is the default value
```

##### output

```css
.test {
    background-image: url("./folder/subfolder/icons/ltr/chevron-left.png");
    background-position-x: 5px;
    transform-origin: 10px 20px;
    transform: scale(0.5, 0.5);
}

[dir="ltr"] .test {
    left: 10px;
}

[dir="rtl"] .test {
    right: 10px;
}
```

##### useCalc true

```javascript
const options = { useCalc: true };
```

##### output

```css
.test {
    background-image: url("./folder/subfolder/icons/ltr/chevron-left.png");
    transform: scale(0.5, 0.5);
}

[dir="ltr"] .test {
    background-position-x: 5px;
    left: 10px;
    transform-origin: 10px 20px;
}

[dir="rtl"] .test {
    background-position-x: calc(100% - 5px);
    right: 10px;
    transform-origin: calc(100% - 10px) 20px;
}
```

</p>

</details>

---

#### stringMap

<details><summary>Expand</summary>
<p>

An array of strings maps that will be used to make the replacements of the declarations' URLs and to match rules selectors names if the `processRuleNames` option is `true`. The name parameter is optional, but if you want to override any of the default string maps, just add your own using the same name.

```javascript
// This is the default string map object
const options = {
    stringMap: [
        {
            name: 'left-right',
            search : ['left', 'Left', 'LEFT'],
            replace : ['right', 'Right', 'RIGHT']
        },
        {
            name: 'ltr-rtl',
            search  : ['ltr', 'Ltr', 'LTR'],
            replace : ['rtl', 'Rtl', 'RTL'],
        }
    ]
};
```

</p>

</details>

---

#### greedy

<details><summary>Expand</summary>
<p>

When `greedy` is `true`, the matches of the `stringMap` will not take into account word boundaries.

##### input

```css
.test1 {
    background: url("icon-left.png");
}

.test2 {
    background: url("icon-ultra.png");
}
```

##### greedy false

```javascript
const options = {
    processUrls: true,
    greedy: false // This is the default value
};
```

##### output

```css
[dir="ltr"] .test1 {
    background: url("icon-left.png");
}

[dir="rtl"] .test1 {
    background: url("icon-right.png");
}

.test2 {
    background: url("icon-ultra.png");
}
```

##### greedy true

```javascript
const options = {
    processUrls: true,
    greedy: true
};
```

##### output

```css
[dir="ltr"] .test1 {
    background: url("icon-left.png");
}

[dir="rtl"] .test1 {
    background: url("icon-right.png");
}

[dir="ltr"] .test2 {
    background: url("icon-ultra.png");
}

[dir="rtl"] .test2 {
    background: url("icon-urtla.png");
}
```

</p>

</details>

---

#### aliases

<details><summary>Expand</summary>
<p>

This property consists of a string map to treat some declarations as others, very useful to flip the values of [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

>Note: This property is not available in the legacy version of the package

##### input

```css
:root {
    --my-padding: 1rem 1rem 1.5rem 1.5rem;
}

.test {
    padding: var(--my-padding);
}
```

##### No aliases string map (default)

##### output

```css
:root {
    --my-padding: 1rem 1rem 1.5rem 1.5rem;
}

.test {
    padding: var(--my-padding);
}
```

##### Set an aliases string map

```javascript
const options = {
    aliases: {
        '--my-padding': 'padding'
    }
};
```

##### output

```css
[dir="ltr"]:root {
    --my-padding: 1rem 1rem 1.5rem 1.5rem;
}

[dir="rtl"]:root {
    --my-padding: 1rem 1.5rem 1.5rem 1rem;
}

.test {
    padding: var(--my-padding);
}
```

</p>

</details>

---

Control Directives
---

Control directives are placed between rules or declarations. They can target a single node or a set of nodes.

>Note: block directives (the ones that start with `begin` and end with `end`) should be placed outside rules to apply the directive to multiple rules or inside a rule to apply the directive to multiple declarations. You should not place the begin of a directive outside a rule and the end inside one (or vice versa) or you will get undesired results.

| Directive                | Description                                                                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `/*rtl:ignore*/`         | Ignores processing of the following rule or declaration                                                           |
| `/*rtl:begin:ignore*/`   | Starts an ignoring block                                                                                          |
| `/*rtl:end:ignore*/`     | Ends an ignoring block                                                                                            |
| `/*rtl:urls*/`           | This directive set the `processUrls` option to `true` in the next declaration or in the declarations of the next rule no mattering the value of the global `processUrls` option  |
| `/*rtl:begin:urls*/`     | Starts a `processUrls` block block                                                                                           |
| `/*rtl:end:urls*/`       | Ends a `processUrls` block block                                                                                             |
| `/*rtl:rules*/`          | This directive set the `processRuleNames` option to `true` in the next rule no mattering the value of the global `processRuleNames` option  |
| `/*rtl:begin:rules*/`    | Starts a `processRuleNames` block block |
| `/*rtl:end:rules*/`      | Ends a `processRuleNames` block block   | 
| `/*rtl:source:{source}*/`| Set the source of a rule or a declaration no mattering the value of the `source` property                         |
| `/*rtl:begin:source:{source}*/` | Starts a source block                                                                                      |
| `/*rtl:end:source*/`     | Ends a source block                                                                                               |
| `/*rtl:raw:{CSS}*/`      | Parses the `CSS` parameter and inserts it in its place. Depending on the `source` parameter the parsed `CSS` will be treated as `rtl` or `ltr` |

---

#### `/*rtl:ignore*/`

<details><summary>Expand</summary>
<p>

This directive ignores processing of the following rule or declaration. In the next block the whole declaration will be ignored.

##### input

```css
/*rtl:ignore*/
.test1, .test2 {
    text-align: left;
    left: 10px;
}
```

##### output

```css
.test1, .test2 {
    text-align: left;
    left: 10px;
}
```

In the next block only the `left` property will be ignored:

##### input

```css
.test3, .test4 {
    text-align: left;
    /*rtl:ignore*/
    left: 10px;
}
```

##### output

```css
.test3, .test4 {
    left: 10px;
}

[dir="ltr"] .test3, [dir="ltr"] .test4 {
    text-align: left;
}

[dir="rtl"] .test3, [dir="rtl"] .test4 {
    text-align: right;
}
```

</p>

</details>

---

#### `/*rtl:begin:ignore*/` and `/*rtl:end:ignore*/`

<details><summary>Expand</summary>
<p>

These directives should be used together, they will provide the beginning and the end for ignoring rules or declarations.

>**Note:** The directives inserted between these blocks will be ignored and maintained in the final output.

Ignoring multiple rules:

##### input

```css
/*rtl:begin:ignore*/
.test1, .test2 {
    left: 10px;
    text-align: left;
}

.test3 {
    padding: 1px 2px 3px 4px;
}
/*rtl:end:ignore*/
```

##### output

```css
.test1, .test2 {
    left: 10px;
    text-align: left;
}

.test3 {
    padding: 1px 2px 3px 4px;
}
```

Ignoring multiple declarations:

##### input

```css
.test1, .test2 {
    left: 10px;
    /*rtl:begin:ignore*/
    margin-left: 4em;
    padding: 1px 2px 3px 4px;
    /*rtl:end:ignore*/
    text-align: left;
}
```

##### output

```css
.test1, .test2 {
    margin-left: 4em;
    padding: 1px 2px 3px 4px;
}

[dir="ltr"] .test1, [dir="ltr"] .test2 {
    left: 10px;
    text-align: left;
}

[dir="rtl"] .test1, [dir="rtl"] .test2 {
    right: 10px;
    text-align: right;
}
```

</p>

</details>

---

#### `/*rtl:urls*/`

<details><summary>Expand</summary>
<p>

This directive set the `processUrls` option to `true` in the next declaration or in the declarations of the next rule no mattering the value of the global `processUrls` option:

##### input

```css
/*rtl:urls*/
.test1 {
    background-image: url("/buttons/button-ltr.png");
}

.test2 {
    /*rtl:urls*/
    background-image: url("/icons/icon-left.png");
}
```

##### output

```css
[dir="ltr"] .test1 {
    background-image: url("/buttons/button-ltr.png");
}

[dir="rtl"] .test1 {
    background-image: url("/buttons/button-rtl.png");
}

[dir="ltr"] .test2 {
    background-image: url("/icons/icon-left.png");
}

[dir="rtl"] .test2 {
    background-image: url("/icons/icon-right.png");
}
```

</p>

</details>

---

#### `/*rtl:begin:urls*/` and `/*rtl:end:urls*/`

<details><summary>Expand</summary>
<p>

These directives should be used together, they will provide the beginning and the end for `processUrls` blocks.

##### input

```css
/*rtl:begin:urls*/
.test1 {
    background-image: url("/buttons/button-ltr.png");
}

.test2 {
    background-image: url("/icons/icon-left.png");
}
/*rtl:end:urls*/

.test3 {
    /*rtl:begin:urls*/
    background-image: url("/images/background-left.png");
    cursor: url("/images/cursor-ltr.png");
    /*rtl:end:urls*/
}
```

##### output

```css
[dir="ltr"] .test1 {
    background-image: url("/buttons/button-ltr.png");
}

[dir="rtl"] .test1 {
    background-image: url("/buttons/button-rtl.png");
}

[dir="ltr"] .test2 {
    background-image: url("/icons/icon-left.png");
}

[dir="rtl"] .test2 {
    background-image: url("/icons/icon-right.png");
}

[dir="ltr"] .test3 {
    background-image: url("/images/background-left.png");
    cursor: url("/images/cursor-ltr.png");
}

[dir="rtl"] .test3 {
    background-image: url("/images/background-right.png");
    cursor: url("/images/cursor-rtl.png");
}
```

</p>

</details>

---

#### `/*rtl:rules*/`

<details><summary>Expand</summary>
<p>

This directive set the `processRuleNames` option to `true` in the next rule no mattering the value of the global `processRuleNames` option:

##### input

```css
/*rtl:rules*/
.test1-ltr {
    background-image: url('/images/test1-l.png');
}

/*rtl:rules*/
.test1-rtl {
    background-image: url('/images/test1-r.png');
}

/*rtl:rules*/
.test2-left::before {
    content: "\f007";
}

.test2-right::before {
    content: "\f010";
}
```

##### output

```css
[dir="ltr"] .test1-ltr {
    background-image: url('/images/test1-l.png');
}

[dir="rtl"] .test1-ltr {
    background-image: url('/images/test1-r.png');
}

[dir="ltr"] .test1-rtl {
    background-image: url('/images/test1-r.png');
}

[dir="rtl"] .test1-rtl {
    background-image: url('/images/test1-l.png');
}

/* These selectors will not be processed because only one of them has the rtl:rules directive */
.test2-left::before {
    content: "\f007";
}

.test2-right::before {
    content: "\f010";
}
```

</p>

</details>

---

#### `/*rtl:begin:rules*/` and `/*rtl:end:rules*/`

<details><summary>Expand</summary>
<p>

These directives should be used together, they will provide the beginning and the end for `processRuleNames` blocks.

##### input

```css
.test1-ltr {
    background-image: url('/images/test1-l.png');
}

.test1-rtl {
    background-image: url('/images/test1-r.png');
}

/*rtl:begin:rules*/
.test2-left::before {
    content: "\f007";
}

.test2-right::before {
    content: "\f010";
}
/*rtl:begin:rules*/
```

##### output

```css
.test1-ltr {
    background-image: url('/images/test1-l.png');
}

.test1-rtl {
    background-image: url('/images/test1-r.png');
}

[dir="ltr"] .test2-left::before {
    content: "\f007";
}

[dir="rtl"] .test2-left::before {
    content: "\f010";
}

[dir="ltr"] .test2-right::before {
    content: "\f010";
}

[dir="rtl"] .test2-right::before {
    content: "\f007";
}
```

</p>

</details>

---

#### `/*rtl:source:{source}*/`

<details><summary>Expand</summary>
<p>

This directive sets the source of a rule or a directive ignoring the value of the `source` property:

##### input

```css
/*rtl:source:rtl*/
.test {
    color: #FFF;
    border-left: 1px solid #666;
    padding: 10px 5px 10px 20px;
    text-align: left;
    width: 100%;
}
```

##### output

```css
.test {
    color: #FFF;
    width: 100%;
}

[dir="ltr"] .test {
    border-right: 1px solid #666;
    padding: 10px 20px 10px 5px;
    text-align: right;
}

[dir="rtl"] .test {
    border-left: 1px solid #666;
    padding: 10px 5px 10px 20px;
    text-align: left;
}
```

</p>

</details>

---

#### `/*rtl:begin:source:{source}*/` and `/*rtl:end:source*/`

<details><summary>Expand</summary>
<p>

These directives should be used together, they will provide the beginning and the end of source blocks for rules or declarations:

##### input

```css
.test {
    color: #FFF;
    border-left: 1px solid #666;
    /*rtl:begin:source:rtl*/
    padding: 10px 5px 10px 20px;
    text-align: left;
    /*rtl:end:source*/
    width: 100%;
}
```

##### output

```css
.test {
    color: #FFF;
    width: 100%;
}

[dir="ltr"] .test {
    border-left: 1px solid #666;
    padding: 10px 20px 10px 5px;
    text-align: right;
}

[dir="rtl"] .test {
    border-right: 1px solid #666;
    padding: 10px 5px 10px 20px;
    text-align: left;
}
```

</p>

</details>

---

#### `/*rtl:raw:{CSS}*/`

<details><summary>Expand</summary>
<p>

Parses the `CSS` parameter and inserts it in its place. Depending on the `source` parameter the parsed CSS will be treated as `rtl` or `ltr`:

##### input

```css
.test1 {
    color: #EFEFEF;
    left: 10px;
    /*rtl:raw:
    height: 50px;
    width: 100px;*/
}

/*rtl:raw:.test2 {
    color: #EFEFEF;
    left: 10px;
    width: 100%;    
}

.test3 {
    transform: translate(10px, 20px);
}
*/
```

##### output

```css
.test1 {
    color: #EFEFEF;
}

[dir="ltr"] .test1 {
    left: 10px;
}

[dir="rtl"] .test1 {
    right: 10px;
    height: 50px;
    width: 100px;
}

[dir="rtl"] .test2 {
    color: #EFEFEF;
    left: 10px;
    width: 100%;    
}

[dir="rtl"] .test3 {
    transform: translate(10px, 20px);
}
```

</p>

</details>

---

Value Directives
---

Value directives are placed anywhere inside the declaration value. They target the containing declaration node.

| Directive                | Description                                                                      |
| ------------------------ | -------------------------------------------------------------------------------- |
| `/*rtl:ignore*/`         | Ignores processing of the declaration                                            |
| `/*rtl:append{value}*/`  | Appends `{value}` to the end of the declaration value                            |
| `/*rtl:insert:{value}*/` | Inserts `{value}` to where the directive is located inside the declaration value |
| `/*rtl:prepend:{value}*/`| Prepends `{value}` to the begining of the declaration value                      |
| `/*rtl:{value}*/`        | Replaces the declaration value with `{value}`                                    |

---

#### `/*rtl:ignore*/`

<details><summary>Expand</summary>
<p>

This directive ignores processing of the current declaration:

##### input

```css
.test1, .test2 {
    text-align: left /*rtl:ignore*/;
    left: 10px;
}
```

##### output

```css
.test1, .test2 {
    text-align: left;
}

[dir="ltr"] .test1, [dir="ltr"] .test2 {
    left: 10px;
}

[dir="rtl"] .test1, [dir="rtl"] .test2 {
    right: 10px;
}
```

</p>

</details>

---

#### `/*rtl:append{value}*/`

<details><summary>Expand</summary>
<p>

This directive appends `{value}` to the end of the declaration value:

##### input

```css
.test1, .test2 {
    padding: 10px /*rtl:append20px*/;
    left: 10px;
}
```

##### output

```css
[dir="ltr"] .test1, [dir="ltr"] .test2 {
    padding: 10px;
    left: 10px;
}

[dir="rtl"] .test1, [dir="rtl"] .test2 {
    padding: 10px 20px;
    right: 10px;
}
```

</p>

</details>

---

#### `/*rtl:insert:{value}*/`

<details><summary>Expand</summary>
<p>

This directive inserts `{value}` to where the directive is located inside the declaration value:

##### input

```css
.test1, .test2 {
    padding: 10px/*rtl:insert 20px*/ 5px;
    left: 10px;
}
```

##### output

```css
[dir="ltr"] .test1, [dir="ltr"] .test2 {
    padding: 10px 5px;
    left: 10px;
}

[dir="rtl"] .test1, [dir="rtl"] .test2 {
    padding: 10px 20px 5px;
    right: 10px;
}
```

</p>

</details>

---

#### `/*rtl:prepend:{value}*/`

<details><summary>Expand</summary>
<p>

This directive prepends `{value}` to the begining of the declaration value:

##### input

```css
.test1, .test2 {
    font-family: Arial, Helvetica/*rtl:prepend:"Droid Arabic Kufi", */;
    left: 10px;
}
```

##### output

```css
[dir="ltr"] .test1, [dir="ltr"] .test2 {
    font-family: Arial, Helvetica;
    left: 10px;
}

[dir="rtl"] .test1, [dir="rtl"] .test2 {
    font-family: "Droid Arabic Kufi", Arial, Helvetica;
    right: 10px;
}
```

</p>

</details>

---

#### `/*rtl:{value}*/`

<details><summary>Expand</summary>
<p>

This directive replaces the declaration value with `{value}`:

##### input

```css
.test1, .test2 {
    font-family: Arial, Helvetica/*rtl:"Droid Arabic Kufi"*/;
    left: 10px;
}
```

##### output

```css
[dir="ltr"] .test1, [dir="ltr"] .test2 {
    font-family: Arial, Helvetica;
    left: 10px;
}

[dir="rtl"] .test1, [dir="rtl"] .test2 {
    font-family: "Droid Arabic Kufi";
    right: 10px;
}
```

</p>

</details>

---

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage
