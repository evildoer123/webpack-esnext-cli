const webpackMerge = require('webpack-merge')
const ManifestPlugin = require('webpack-manifest-plugin');
const { createWebpackCompile } = require('../utils/create-webpack-compile')
const { configBabelLoader } = require('../utils/config-babel-loader')
const configSplitChunk = require('../utils/config-split-chunk')
const { getEntry } = require('../utils/get-entries')
const createBaseConfig = require('./base.config')

let config = require('../config/project.config')
let baseConfig = createBaseConfig()

// es5
let legacyConfig = webpackMerge({}, baseConfig, {
  entry: config.legacyEntries,
  output: {
    path: config.outputPath,
    filename: config.legacyFileName,
    chunkFilename: config.legacyChunkFileName,
    publicPath: config.publicPath
  },
  module: {
    rules: [
      // 配置旧版本需要兼容的浏览器
      configBabelLoader([
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
      ])
    ]
  },
  plugins: [
    // 输出资源表
    new ManifestPlugin({
      fileName: 'legacy-assets-manifest.json'
    })
  ],
  optimization: {
    splitChunks: configSplitChunk('legacy'),
    runtimeChunk: {
      name: 'manifest-legacy'
    }
  }
})

module.exports = (prodConfig) => {
  realLegacyConfig = webpackMerge(legacyConfig, prodConfig)

  return createWebpackCompile(realLegacyConfig)
}