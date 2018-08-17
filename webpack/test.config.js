const compileModern = require('./compile/modern')
const compileLegacy = require('./compile/legacy')

const testConfig = {
  mode: 'none',
  devtool: '#eval-source-map',
  plugins: [
    // 多线程压缩
    new WebpackParallelUglifyPlugin({
      exclude: /\.min\.js$/,
      // 压缩es6的代码
      uglifyES: {
        mangle: false, // 不压缩变量名
        output: {
          beautify: true, // 格式化
          comments: false // 不保留注释
        },
        compress: {
          warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
          collapse_vars: true, // 内嵌定义了但是只用到一次的变量
          reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
        }
      }
    })
  ]
}

;(async () => {
  // 构建es6
  await compileModern(testConfig)

  // 构建es5
  await compileLegacy(testConfig)

  
})()