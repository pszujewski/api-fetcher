import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

// CommonJS (for Node) and ES module (for bundlers) build.
// (We could have three entries in the configuration array
// instead of two, but it's quicker to generate multiple
// builds from a single configuration where possible, using
// an array for the `output` option, where we can specify
// `file` and `format` for each target)

export default {
	input: 'src/index.js',
	external: (id) => id.indexOf("@babel/runtime") === 0,
	output: { file: pkg.main, format: 'cjs' },
	plugins: [
		resolve(),
		commonjs({
			include: "node_modules/**"
		}),
		babel({
			runtimeHelpers: true,
			exclude: 'node_modules/**', // only transpile our source code
		}),
	],
};
