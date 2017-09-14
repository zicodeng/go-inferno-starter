const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const entries = {
	index: "./client/assets/entries/index.tsx",
	app: "./client/assets/entries/app.tsx" 
};

var config = Object.keys(entries).map(function(entry) {
	return {
		entry: entries[entry],
	
		output: {
			path: __dirname + "/client/public/dist",
			publicPath: "/client/public/dist",
			filename: entry + "-bundle.min.js"
		},
	
		devtool: "source-map",
	
		resolve: {
			extensions: [".js", ".json", ".ts", ".tsx", ".scss", ".css"],
			modules: ["node_modules", "./client/assets"]
		},
	
		module: {
			rules: [
				{	
					test: /\.ts$|\.tsx$/,
					exclude: /node_modules/,
					use: [
						{
							loader: "babel-loader",
							options: {
                                presets: ["es2015", "stage-2"],
                                plugins: [
									["babel-plugin-inferno", { "imports": true }],
									"transform-decorators-legacy"
								],
								sourceMap: true
							}
                        },
                        {
                            loader: "ts-loader"
                        }
					]
				},
				{	
					test: /\.css$|\.scss$/,
					exclude: /node_modules\/(?!bootstrap\/).*/,
					use: ExtractTextPlugin.extract({
						use: [
							{
								loader: "css-loader",
								options: {
									sourceMap: true,
									minimize: true
								}
							},
							{	
								loader: "sass-loader",
								options: {
									includePaths: [
										__dirname + "/client/assets/stylesheets/sass",
										__dirname + "/node_modules/compass-mixins/lib"
									],
									sourceMap: true
								}
							}
						],
						fallback: "style-loader"
					})
				}
			]
        },
        
		devServer: {
			contentBase: __dirname + "/client/public/dist",
			inline: true,
			port: 8080
		},
	
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				minimize: true,
				sourceMap: true
			}),
	
			new webpack.optimize.CommonsChunkPlugin({
                name: "commons",
                filename: "commons.min.js"
			}),
	
			new webpack.DefinePlugin({
				"process.env": {
					"NODE_ENV": JSON.stringify("production")
				}
			}),
	
			new webpack.ProvidePlugin({
				$: "jquery",
				jQuery: "jquery",
				"window.jQuery": "jquery"
			}), 

			new HtmlWebpackPlugin({
				title: "Webpack Example",
				filename: entry + ".html",
				template: "./client/assets/templates/" + entry + ".ejs",
				chunks: ["commons", "main"]
			}),
	
			new ExtractTextPlugin({
				filename: entry + "-style.min.css",
				disable: process.env.NODE_ENV === "development"
			})
		]
	};
});

module.exports = config;