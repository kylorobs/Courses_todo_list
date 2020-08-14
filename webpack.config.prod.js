const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'none',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
      },
    plugins: [
        new CleanPlugin.CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            hash: false,
            title: 'Course To Do - Drag n Drop',
            filename: './index.html',
            // Load a custom template (lodash by default)
            template: './src/temp.html'
          }),
        new MiniCssExtractPlugin(),
        new OptimizeCssAssetsPlugin({
            cssProcessorPluginOptions: {
              preset: ['default', { discardComments: { removeAll: true } }],
            },
          })
    ]
};