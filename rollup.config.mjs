import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";

export default [
	{
		input: 'src/index.ts',
		output: [
			{
				file: 'dist/gpu-io.js',
				sourcemap: true,
				format: 'umd',
				name: 'GPUIO',
			},
			{
				file: 'dist/gpu-io.min.js',
				sourcemap: true,
				format: 'umd',
				name: 'GPUIO',
				plugins: [terser()],
			},
			
		],
		plugins: [
			resolve({
				browser: true,
			}),
			commonjs(),
			typescript({
				sourceMap: true,
				inlineSources: true,
			}),
		],
	},
	{
		input: "./dist/index.d.ts",
		output: [{ file: "dist/gpu-io.d.ts", format: "es" }],
		plugins: [
			dts(),
			del({ hook: "buildEnd", targets: ["./dist/*.d.ts", "./dist/*/"] }),
		],
	},
];