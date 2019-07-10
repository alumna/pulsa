import commonjs 		from 'rollup-plugin-commonjs';
import nodeResolve 		from 'rollup-plugin-node-resolve';
import { terser } 		from 'rollup-plugin-terser';

export default {
	input: 'src/index.js',

	external: [ 'fs', 'path', 'stream', 'util' ],

	output: {
		file: 'dist/pulsa.cjs.js',
		format: 'cjs'
	},

	plugins: [

		nodeResolve( {
			preferBuiltins: true
		} ),

		commonjs(),

		terser()

	]
};