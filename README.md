# PostCSS RTLCSS

[PostCSS] plugin to build Cascading Style Sheets (CSS) with Left-To-Right (LTR) and Right-To-Left (RTL) rules using [RTLCSS]

[![Build Status](https://travis-ci.com/elchininet/postcss-rtlcss.svg?branch=master)](https://travis-ci.com/elchininet/postcss-rtlcss) &nbsp; [![Coverage Status](https://coveralls.io/repos/github/elchininet/postcss-rtlcss/badge.svg?branch=master)](https://coveralls.io/github/elchininet/postcss-rtlcss?branch=master)

[PostCSS]: https://github.com/postcss/postcss
[RTLCSS]: https://rtlcss.com/

Install
---

#### npm

```bash
nmp install postcss-rtlcss --save-dev
```

#### yarn

```bash
yarn add postcss-rtlcss -d
```

Basic usage
---

#### Usage with commonJS

```bash
const postcss = require('postcss');
const { postcssRTLCSS } = require('postcss-rtlcss');

const options = { ... available options ... };
const result = postcss([
    postcssRTLCSS(options)
]).process(cssInput);

const rtlCSS = result.css;
```

#### Usage with ES6 modules

```bash
import postcss from 'postcss';
import { postcssRTLCSS } from 'postcss-rtlcss';

const options = { ... available options ... };
const result = postcss([
    postcssRTLCSS(options)
]).process(cssInput);

const rtlCSS = result.css;
```

#### Usage in Webpack with postcss-loader

```bash
rules: [
    {
        test: /\.css$/,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    plugins: () => [ require('postcss-rtlcss')(options) ]
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

This is the recommended method, it will generate more CSS code but each direction will have their specific CSS declarations and there is not need to override properties.

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

This is the alternative method, it will generate less code because it lets the main rule intact and generates a shorter specific rule to override the properties that are affected by the direction of the text.

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
    padding-right: unset;
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

But this method has a disadvantage:

<details><summary>Disadvantage of the override method</summary>
<p>

Use this method carefully. It can override a property that is coming from another class if multiple classes are used at the same time. Take a look at the next `HTML` and `CSS` codes:

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

Using the combined method, the generated code will be the next one:

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

So, the `div` will have a padding of `20px 10px 20px 20px` in `LTR` and `20px 20px 20px 10px` in `RTL`.

However, using the override method the generated code will be the next one:

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
    padding-right: unset;
    padding-left: 10px;
}
```

Now the `div` has a padding of `20px 10px 20px 20px` in `LTR` and `20px 0 20px 10px` in `RTL`, because the override of the class `test2` doesn't take into account that this class could be used with `test1` having the same properties. The solution, in this case, is to provide the property that has been inherited:

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

So, the generated code will be:

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

</p>
</details>

Options
---

All the options are optional, and a default value will be used, if any of them is omitted or de type or format of them is wrong

| Option             | Type                      | Default         | Description                                                  |
| ------------------ | ------------------------- | --------------- | ------------------------------------------------------------ |
| mode               | `Mode (string)`           | `Mode.combined` | Mode of generating the final CSS rules                       |
| ltrPrefix          | `string` or `string[]`    | `[dir="ltr"]`   | Prefix to use in the left-to-right CSS rules                 |
| rtlPrefix          | `string` or `string[]`    | `[dir="rtl"]`   | Prefix to use in the right-to-left CSS rules                 |
| source             | `Source (string)`         | `Source.ltr`    | The direction from which the final CSS will be generated     |
| processUrls        | `boolean`                 | `false`         | Change the strings using the string map also in URLs         |
| useCalc            | `boolean`                 | `false`         | Flips `background-position`, `background-position-x` and `transform-origin` properties if they are expressed in length units using [calc](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) |
| stringMap          | `PluginStringMap (array)` | Check below     | An array of strings maps that will be used to make the replacements|

---

#### mode

<details><summary>Expand</summary>
<p>

The mode option has been explained in the [Output using the combined mode](#output-using-the-combined-mode-default) and [Output using the override mode](#output-using-the-override-mode) sections. To avoid using magic strings, the package exposes an object with these values, but it is possible to using strings values:

```javascript
import postcss from 'postcss';
import { postcssRTLCSS, Mode } from 'postcss-trlcss';

const input = '... css code ...';
const optionsCombined = { mode: Mode.combined }; // This is the default value
const optionsOverride = { mode: Mode.override };

const outputCombined = postcss([
    postcssRTLCSS(optionsCombined)
]).process(input);

const outputOverride = postcss([
    postcssRTLCSS(optionsOverride)
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
import { Mode, Source } from 'postcss-rtlcss';

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
import { Mode, Source } from 'postcss-rtlcss';

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
    left: unset;
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

#### useCalc

<details><summary>Expand</summary>
<p>

This options, when it is enabled, flips `background-position`, `background-position-x` and `transform-origin` properties if they are expressed in length units using [calc](https://developer.mozilla.org/en-US/docs/Web/CSS/calc):

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

This options provides an array of strings maps that will be used to make the replacements:

```javascript
// This is the default string map object
const options = {
    stringMap: [
        {
            search : ['left', 'Left', 'LEFT'],
            replace : ['right', 'Right', 'RIGHT']
        },
        {
            search  : ['ltr', 'Ltr', 'LTR'],
            replace : ['rtl', 'Rtl', 'RTL'],
        }
    ]
};
```

</p>

</details>

---

Control Directives
---

Control directives are placed between rules or declaration. They can target a single node or a set of nodes.

| Directive                | Description                                                             |
| ------------------------ | ----------------------------------------------------------------------- |
| `/*rtl:ignore*/`         | Ignores processing of the following rule or declaration                 |
| `/*rtl:begin:ignore*/`   | Starts an ignoring block that will ignore any rule or declaration       |
| `/*rtl:end:ignore*/`     | Ends an ignoring block                                                  |

Value Directives
---

Value directives are placed any where inside the declaration value. They target the containing declaration node.

| Directive                | Description                                                                      |
| ------------------------ | -------------------------------------------------------------------------------- |
| `/*rtl:ignore*/`         | Ignores processing of the declaration                                            |
| `/*rtl:append{value}*/`  | Appends `{value}` to the end of the declaration value                            |
| `/*rtl:insert:{value}*/` | Inserts `{value}` to where the directive is located inside the declaration value |
| `/*rtl:prepend:{value}*/`| Prepends `{value}` to the begining of the declaration value                      |
| `/*rtl:{value}*/`        | Replaces the declaration value with `{value}`                                    |

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage
