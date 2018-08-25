module.exports = {
  port: 3000, // 程序启动要监听的端口号
  session: {
    secret: 'chenmenglindeblog',
    key: 'chenmenglindeblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/chenmenglindeblog' // mongodb 的地址，以 mongodb:// 协议开头，chenmenglindeblog 为 db 名
}
