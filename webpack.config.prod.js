/* eslint-disable no-undef */
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.ts',
	mode: 'production',
	devServer: {
		contentBase: path.join(__dirname, 'build'),
		compress: true,
		port: 3000
	},
	output: {
		path: __dirname + '/build'
	},
	plugins: [
		new HtmlWebpackPlugin(),
		new CopyPlugin([
			{ from: 'src/assets', to: 'build/assets' }
		]),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		]
	}
};