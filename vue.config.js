const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    client: {
      webSocketURL: {
        hostname: 'de12-159-196-132-16.ngrok-free.app',  // ngrok 提供的外部域名
        pathname: '/ws',  // WebSocket 的路径
        port: 443,        // 443 是 HTTPS 的标准端口
        protocol: 'wss'   // 使用安全的 WebSocket 协议
      }
    },
    proxy: {
      "/": {
        target: "http://localhost:8080",
        ws: false,  // 禁用 WebSocket 代理
        changeOrigin: true
      }
    },
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8090, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    // disableHostCheck: true,
    https: false,
    allowedHosts: 'all'
  },
  transpileDependencies: true
})
