const path = require('path')

module.exports = {
  outputDir: 'dist',
  publicPath: '/',
  configureWebpack: {
    resolve: {
      alias: {
        img: path.resolve(__dirname, 'src/assets/images')
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
      },
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#91d5ff',
            'link-color': '#91d5ff',
            'border-radius-base': '4px'
          },
          javascriptEnabled: true
        }
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
