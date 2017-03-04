const path = require('path');

const source = path.resolve(__dirname, 'src');
module.exports = {
	entry: path.resolve(source, 'index.js'),
	devtool: 'source-map',
	output: {
		filename: 'vuec.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'vuec',
		libraryTarget: 'umd',
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		],
	},
};
