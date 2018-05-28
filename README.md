# redis2ws
将redis的pubsub服务和网页websocket打通，使网页可以直接订阅和发布到redis服务器上消息。主要思路是使用了socket.io作为中转。
## 用法
```
npm i redis2ws
```
服务端通过一个端口参数即可绑定该端口的ws服务，以及本机的6379的redis服务
```js
var app = require('redis2ws')
app.start(1998)
```
网页端需要引入socket.io的js库，并进行订阅发布等操作即可
```html
<script src="./node_modules/socket.io-client/dist/socket.io.js"></script>
<script>
    const socket = io('http://localhost:1998');

    //服务器上redis如果发布了hello这个channel的消息，这里就可以实时收到
    socket.on("hello",function(data){console.log(data)})
    
    //这里发布的消息，服务器上redis如果有订阅webjs这个channel的也可收到本消息
    socket.emit("webjs","I am from web")
</script>
``` 