const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');


module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js',
        FANSPEED: './src/js/fan_speed.js',
        CHAIR: './src/js/chair.js',
        BUTTON: './src/js/buttons.js',
        TEMPERATURE: './src/js/temperature.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        libraryTarget: 'var',
        // `library` determines the name of the global variable
        library: '[name]'
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new CopyPlugin([
            {
                from: 'src/icon.*',
                flatten: true
            },
            {
                from: 'src/config.xml',
                flatten: true
            },
            {
                from: 'src/mockups/*',
                to: 'mockups/',
                flatten: true
            },
            {
                from: 'src/images/*',
                to: 'images/',
                flatten: true
            }
        ]),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new MiniCSSExtractPlugin({
            filename: 'app.css',
            path: __dirname + '/dist'
        }),
        new ZipPlugin({
            path: __dirname + '/package',
            filename: 'hvac',
            extension: 'wgt',
            exclude: []
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: "image-webpack-loader",
                        options: {
                            bypassOnDebug: true, // webpack@1.x
                            disable: true, // webpack@2.x and newer
                        },
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
}; 