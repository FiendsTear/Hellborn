/* eslint-disable no-undef */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.ts',
	mode: 'development',
	devServer: {
		contentBase: path.join(__dirname, 'build'),
		compress: true,
		port: 3000
	},
	output: {
		path: __dirname + '/build'
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Hellborn',
			template: 'src/index.html'
		}),
		new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: './assets' }
      ],
		})
	],
	resolve: {
    extensions: [".ts", ".js"]
  },
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