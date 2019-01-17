const path = require('path')
const autoprefixer = require('autoprefixer')
const prefixer = require('postcss-prefixer')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const paths = require('./config/paths')

module.exports = {
  mode: 'production',
  target: 'web',
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    dns: 'empty',
    tls: 'empty'
  },
  entry: ['@babel/polyfill', path.resolve('./src/index.js')],
  output: {
    filename: 'bundle.js',
    // filename: `[name].js`,
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules, 'src']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png'
            }
          }
        ]
      },
      // {
      //   test: /\.css$/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: "style-loader",
      //     use: [
      //       'style-loader',
      //       'css-loader'
      //     ]
      //   }),
        
      //   exclude: /\.module\.css$/
      // },
      {
        test: /\.(sa|sc|c|le)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                prefixer({
                  prefix: 'CCW--',
                  ignore: [/#/, 'isvg', 'loaded']
                }),
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9' // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009'
                }),
                require('cssnano')()
              ]
            }
          },
          'less-loader'
        ],
      },
      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract(
      //     Object.assign(
      //       {
      //         fallback: {
      //           loader: require.resolve('style-loader'),
      //           options: {
      //             hmr: false
      //           }
      //         },
      //         use: [
      //           {
      //             loader: require.resolve('css-loader'),
      //           },
      //           {
      //             loader: require.resolve('postcss-loader'),
      //             options: {
      //               // Necessary for external CSS imports to work
      //               // https://github.com/facebookincubator/create-react-app/issues/2677
      //               ident: 'postcss',
      //               plugins: () => [
      //                 prefixer({
      //                   prefix: 'CCW--',
      //                   ignore: [/#/, 'isvg', 'loaded']
      //                 }),
      //                 require('postcss-flexbugs-fixes'),
      //                 autoprefixer({
      //                   browsers: [
      //                     '>1%',
      //                     'last 4 versions',
      //                     'Firefox ESR',
      //                     'not ie < 9' // React doesn't support IE8 anyway
      //                   ],
      //                   flexbox: 'no-2009'
      //                 })
      //               ]
      //             }
      //           }
      //         ]
      //       }
      //     )
      //   )
      //   // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      // },
      // {
      //   test: /\.less$/,
      //   loader: ExtractTextPlugin.extract(
      //     Object.assign(
      //       {
      //         fallback: {
      //           loader: require.resolve('style-loader'),
      //           options: {
      //             hmr: false
      //           }
      //         },
      //         use: [
      //           {
      //             loader: require.resolve('css-loader')
      //           },
      //           {
      //             loader: require.resolve('postcss-loader'),
      //             options: {
      //               // Necessary for external CSS imports to work
      //               // https://github.com/facebookincubator/create-react-app/issues/2677
      //               ident: 'postcss',
      //               plugins: () => [
      //                 prefixer({
      //                   prefix: 'CCW--',
      //                   ignore: [/#/, 'isvg', 'loaded']
      //                 }),
      //                 require('postcss-flexbugs-fixes'),
      //                 autoprefixer({
      //                   browsers: [
      //                     '>1%',
      //                     'last 4 versions',
      //                     'Firefox ESR',
      //                     'not ie < 9' // React doesn't support IE8 anyway
      //                   ],
      //                   flexbox: 'no-2009'
      //                 })
      //               ]
      //             }
      //           },
      //           {
      //             loader: 'less-loader'
      //           }
      //         ]
      //       }
      //     )
      //   )
      //   // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      // },
      // {
      //   test: /\.less$/,
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     'less-loader'
      //   ]
      // },
      {
        test: /\.(jpe?g|png|svg|ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader'
      },
    ]
  },
  plugins: [
    // new ExtractTextPlugin({
    //   filename: "[name].css"
    // }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'bundle.css',
      chunkFilename: '[id].css',
    })
  ]
};