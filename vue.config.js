const path = require('path')
module.exports = {
  outputDir: 'dist',
  lintOnSave: true,
  productionSourceMap: process.env.NODE_ENV === 'production',
  configureWebpack: {
    resolve: {
      alias: {
        'sass': path.resolve(__dirname, 'src/assets/sass'),
        'img': path.resolve(__dirname, 'src/assets/images'),
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "./src/assets/sass/index.scss"'
      },
      scss: {
        prependData: '@import "./src/assets/sass/index.scss";'
      }
    }
  },
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        // pathRewrite: {
        //   '^/api': ''
        // },
        changeOrigin: true
      }
    }
  }
}
