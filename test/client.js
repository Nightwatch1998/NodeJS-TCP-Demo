const net = require('net')

// 返回net.socket对象
const client = net.createConnection({
  host:'127.0.0.1',
  port:4396
})

client.on('connect',()=>{
  //向服务器发送数据
  client.write('Nodejs技术栈')
  setTimeout(()=>{
    client.write('Javascript')
    client.write('Typescript')
    client.write('Python')
    client.write('Java')
    client.write('C')
  },1000)
})

client.on('data',data=>{
  console.log(data.toString())
})

client.on('error',err=>{
  console.log('服务器异常:',err)
})