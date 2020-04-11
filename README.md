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

Basic usage
---

#### Using postcss JavaScript API

```bash
const postcss = require('postcss');
const postcssRTLCSS = require('postcss-rtlcss');

postcss(
    [ postcssRTLCSS(options) ]
).process(cssInput)
```

#### Using postcss-loader in Webpack

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

Options
---

All the options are optional and a default value will be used if any of them is omitted

| Option             | Type                      | Default         | Description                                                  |
| ------------------ | ------------------------- | --------------- | ------------------------------------------------------------ |
| mode               | `Mode (string)`           | `Mode.combined` | Mode of generating the final CSS rules                       |
| ltrPrefix          | `string` or `string[]`    | `[dir="ltr"]`   | Prefix to use in the left-to-right CSS rules                 |
| rtlPrefix          | `string` or `string[]`    | `[dir="rtl"]`   | Prefix to use in the right-to-left CSS rules                 |
| source             | `Source (string)`         | `Source.ltr`    | The direction from which the final CSS will be generated     |
| processUrls        | `boolean`                 | `false`         | Change the strings map also in URLs                          |
| useCalc            | `boolean`                 | `false`         | Flips `background-position`, `background-position-x` and `transform-origin` properties if they are expressed in length units using [calc](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) |
| stringMap          | `PluginStringMap (array)` | -               | An array of strings maps that will be used to make the replacements|

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
