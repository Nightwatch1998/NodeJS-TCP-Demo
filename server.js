const net = require('net')
const schedule = require('node-schedule')
const {getCurrentData} = require("./utils/getData")

// 当前连接客户端数量
let clientIndex = 0

// 返回net.server对象
const server = net.createServer()
const port = 8142

// 监听端口
server.listen(port,()=>{
    console.log('TCP server running on : 127.0.0.1.8142')
})

// 启动TCP服务器端
const tcpServerStarter = ()=>{
    try {
        // 当一个新的连接建立触发
        server.on('connection',(socket)=>{
            console.log("someone connected")
            // 接收到客户端数据响应逻辑
            socket.on('data',(buffer)=>{
                console.log(buffer.toString())
            })

            // 创建一个定时器,定时发送数据
            const rule = new schedule.RecurrenceRule()
            // rule.minute = [0,10,20,30,40,50]
            rule.second = [0,10,20,30,40,50]
            const job = schedule.scheduleJob(rule,async ()=>{
                // 从数据库查询最新数据
                let line = await getCurrentData()
                console.log(line)
                socket.write(line)
            })
            
            // 客户端非法中断
            socket.on('error',(err)=>{
                socket.destroy()
            })
        })

        // 服务器关闭时触发
        server.on("close",()=>{
            console.log("TCP server is closed!")
        })

    } catch (error) {
        console.log(error)
    }
}
tcpServerStarter()
