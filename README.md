# eslint-plugin-snippet
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Comment-as-snippet for one-off codemod with ESLint.


https://github.com/user-attachments/assets/28d8f7bb-e5ec-40aa-9125-d18d3da43f61


## Introduction

This plugin is very much inspired by [eslint-plugin-command](https://github.com/antfu/eslint-plugin-command) by [Anthony Fu](https://github.com/antfu). This plugin also serves as a micro-codemod tool triggers by special comments on-demand, reuse the infrastructure of ESLint.

## Installation

Install the `eslint-plugin-snippet` package:

```bash
npm i eslint-plugin-snippet -D
```

In your flat config eslint.config.mjs:

```js
// eslint.config.mjs
import snippet from 'eslint-plugin-snippet/config'

export default [
  // ... your other flat config
  snippet(),
]
```

<details close>
  <summary>Legacy Config</summary>
  <p>While no longer supported, you may still use the legacy .eslintrc.js file:</p>

```js
// .eslintrc.js
module.exports = {
  plugins: [
    'snippet'
  ],
  rules: {
    'snippet/snippet': 'error',
  },
}
```
</details>

## Plugin Configuration

You can configure the plugin by passing an object to the `snippet` function.

```js
// eslint.config.mjs
import snippet from 'eslint-plugin-snippet/config'
import { builtInSnippets } from 'eslint-plugin-snippet/snippets'

export default [
  // ... your other flat config
  snippet({
    commandPrefix: ';',
    separator: '>',
    ignoreIndicator: '_',
    snippets: builtInSnippets,
  }),
]
```

One of the built-in snippets is `function`:

```js
export default {
  name: 'function',
  command: 'f',
  template: `function fn($1) {
  $0
}`,
}
```

For examle, with the above configuration, you can trigger the snippet by `//;f>body>param1, param2`, which will be expanded to:

```js
function fn(param1, param2) {
  body
}
```

`//;f>_>param` will be expanded to:

```js
function fn(param) {

}
```

## Custom Snippets

It's also possible to define your custom snippets.

```js
// eslint.config.mjs
import { builtInSnippets, defineSnippets } from 'eslint-plugin-snippet/snippets'

const snippets = defineSnippets([
  ...builtInSnippets,
  {
    name: 'console.log',
    command: 'c',
    template: 'console.log($0)',
  },
  {
    name: 'function',
    command: 'f',
    template: `function fn($1) {
  $0
}`,
  },
])
```

> As you can see, the index of the snippet-slots starts from 0: `$0`

## Usage

- Command Only: `//;f`
  ```js
  function fn() {

  }
  ```
- Command with slots: `//;f>body>param`
  ```js
  function fn(param) {
    body
  }
  ```
- Ignore: `//;f>_>param`
  ```js
  function fn(param) {

  }
  ```
- Escape character: `//;c>'<test\>\;'`
  ```js
  console.log('<test>;')
  ```
- Commnd nesting: `//;f>;f>>;c>>>test>>test`
  ```js
  function fn() {
    function fn(test) {
      console.log(test)
    }
  }
  ```

## TODOs
- [x] support something like `;>;b>>testb1>>testb2>testa1>;c>>;d>>>testd1`
- [x] support escape character

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/eslint-plugin-snippet?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/eslint-plugin-snippet
[npm-downloads-src]: https://img.shields.io/npm/dm/eslint-plugin-snippet?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/eslint-plugin-snippet
