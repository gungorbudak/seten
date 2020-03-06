var development = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var path = require("path");

var plugins = [];

if (!development) {
    plugins = plugins.concat([
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: false,
        //     sourcemap: false
        // }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]);
}

var config = {
    mode: development ? 'development': 'production',
    context: __dirname,
    entry: "./assets/js/src/index.js",
    output: {
        path: path.join(__dirname, '/assets/js/build'),
        publicPath: development ? '/assets/js/build/': '/seten/assets/js/build/',
        filename: development ? 'bundle.js': 'bundle.min.js'
    },
    module: {
        rules: [
            {
                test : /\.jsx?$/,
                loader : 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        modules: ["node_modules"],
        extensions: ['.js', '.jsx']
    },
    optimization: {
      minimize: development ? false: true
    },
    plugins: plugins
};

module.exports = config;
