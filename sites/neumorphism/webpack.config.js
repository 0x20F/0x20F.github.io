const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CssPlugin = require('mini-css-extract-plugin');


module.exports = {
    entry: {
        index: [
            path.resolve(__dirname, 'src/js/index.js'),
            path.resolve(__dirname, 'src/styles/index.scss')
        ]
    },
    
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },

    devServer: {
        historyApiFallback: true
    },

    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                'style-loader',
                CssPlugin.loader,
                'css-loader',
                'sass-loader'
            ]
        }]
    },

    plugins: [
        new HtmlPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html'
        }),

        new CssPlugin({
            filename: 'main.css'
        })
    ]
};