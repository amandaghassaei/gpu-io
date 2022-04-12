const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		'webgl-compute': './src/index.ts',
		'webgl-compute.min': './src/index.ts',
	  },
	performance: {
		hints: false,
	},
	optimization: {
		minimizer: [new TerserPlugin({
			// sourceMap: true,
			include: /\.min\.js$/,
			terserOptions: {
				output: {
					comments: false,
					beautify: false,
				},
				mangle: true,
				compress: true
			},
		})],
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.glsl$/,
				use: {
					loader: 'webpack-glsl-minify',
					options: {
					  output: 'source',
					//   esModule: false,
					  stripVersion: false,
					//   preserveDefines: false,
					//   preserveUniforms: false,
					//   preserveVariables: false,
					  disableMangle: true,
					//   includesOnly: false,
					}
				  }
			},
		],
	},
	resolve: {
		extensions: [ '.ts', '.js' ],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		library: 'WebGLCompute',
		libraryTarget: "umd",
		clean: true,
	},
};