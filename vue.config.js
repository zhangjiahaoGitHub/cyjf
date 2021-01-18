// 作为配置文件，直接导出配置对象即可
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'
    outputDir: 'cyjf',
    indexPath:'cyjf.html',
    publicPath:process.env.NODE_ENV === 'production'? './': '/',
    productionSourceMap: false,
    // pages:{ type:Object,Default:undfind } 
    devServer: {
        // port: 8080, // 端口号
        // host: 'localhost',
        // https: false, // https:{type:Boolean}
        // open: false, //配置自动启动浏览器
        proxy: { // http://192.168.88.80:8080/ntyjf-posp-proxy/ http://chuangyijinfu.llyzf.cn/lly-posp-proxy/
            '/apis': {
                target: 'http://chuangyijinfu.llyzf.cn/lly-posp-proxy/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/apis': ''  // rewrite path
                }
            },
        },  // 配置多个代理
    },
    configureWebpack:process.env.NODE_ENV === 'production'? 
      { 
        // externals: {
        //   'vue': 'Vue',
        //   'moment': 'moment',
        //   'axios': 'axios'
        // },
        optimization: {
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                ecma: undefined,
                warnings: false,
                parse: {},
                compress: {
                  drop_console: true,
                  drop_debugger: false,
                  pure_funcs: ['console.log'] // 移除console
                }
              },
            })
          ]
          // plugins: [
          //   new CompressionPlugin({ // gzip压缩配置
          //     test:/\.js$|\.html$|\.css/, // 匹配文件名
          //     threshold:10240, // 对超过10kb的数据进行压缩
          //     deleteOriginalAssets:false //是否删除原文件
          //   })
          // ]
        }
      }
      :{}
}