# web-lib-starter-rollup-babel

[![Greenkeeper badge](https://badges.greenkeeper.io/rollup/rollup-starter-lib.svg)](https://greenkeeper.io/)

This repo contains a bare-bones example of how to create a library using Rollup, including importing a module from `node_modules` and converting it from CommonJS.

We're creating a library called `how-long-till-lunch`, which usefully tells us how long we have to wait until lunch, using the [ms](https://github.com/zeit/ms) package:

```js
console.log('it will be lunchtime in ' + howLongTillLunch());
```

## Getting started

Clone this repository and install its dependencies:

`npm run build` builds the library to `dist`

`npm run dev` builds the library, then keeps rebuilding it whenever the source files change using [rollup-watch](https://github.com/rollup/rollup-watch).

`npm test` builds the library, then tests it.


## License

[MIT](LICENSE).
