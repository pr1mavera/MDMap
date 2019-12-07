---
title: http2 与 http3
date: 2019-08-13
---

## HTTP2 协议分析

与 HTTP 比较：
+ 相同：没有修改 HTTP 的语义，没有改变 HTTP 方法、状态码、URL 和 标头字段等核心概念
+ 不同：
    1. 引入了一个新的二进制分帧层，修改了数据格式化规则，实现了多路复用
    2. 修改了在客户端与服务器之间传输的方式（http 是文本，http2 是二进制数据）
    3. 无法与之前的 http/1.x 服务器和客户端向后兼容
+ 特点：
    1. 使用二进制传输，更高效，更紧凑
    2. 对报头（header）压缩，降低开销
    3. 多路复用，一个网络连接实现并行请求
    4. 服务器主动推送，减少请求的延迟
    5. 默认使用加密

### 分帧层

基于 二进制分帧层 的 HTTP2 协议，是在 **传输层** 与 **应用层** 之间做了一层 二进制帧（Binary Framing）
+ HTTP: 明文 ---tcp---> 数据传输
+ HTTPS: 明文 ---SSL加密---> 密文 ---tcp---> 数据传输
+ HTTP2: 明文 ---二进制分帧层---> 二进制数据 ---SSL加密---> 密文 ---tcp---> 数据传输

包装了数据的请求和响应：
<table>
    <tr>
        <td colspan="1">HTTP/1.1</td>
        <td colspan="1">HTTP/2</td>
    </tr>
    <tr>
        <td colspan="1">请求（响应）行</td>
        <td colspan="1" rowspan="2">头帧 HEADERS frame</td>
    </tr>
    <tr>
        <td colspan="1">请求（响应）头</td>
    </tr>
    <tr>
        <td colspan="1">请求（响应）体</td>
        <td colspan="1">数据帧 DATA frame</td>
    </tr>
</table>

### 多路复用

部分解决了 http/1.1 的队首阻塞问题：
+ HTTP : 串行的，下一个请求需要等待上一个请求完成
+ HTTP2 : 并行的，将请求和响应拆成 **多个数据包** 交错发送

### 服务器推送

当客户端请求网站首页时，首页 page.html，其中有资源一 script.js，资源二 style.css
+ HTTP : 需将首页 page.html 请求至客户端并解析完毕，才知道需要相应资源 script.js 、 style.css
+ HTTP2 : 在请求了首页 page.html 之后，服务端通过将首页转换成二进制之后捕获到了资源 script.js 、 style.css，则会直接将资源推送至客户端

### 伪头字段

HTTP2 伪头：HTTP2 中内置的特殊的，以 `:` 开头的key，作用是代替 请求行、响应行 的信息
+ `:method` : 目标URL模式部分（请求）（GET）
+ `:scheme` : 目标URL模式部分（请求）（HTTP/1.1）
+ `:authority` : 目标URL认证部分（请求）（/test）
+ `:path` : 目标URL的路径和查询部分（请求）（Host: www.google.com.cn）
+ `:status` : 响应头中的HTTP状态码部分（响应）
![http2伪头](/blog/img/cs/http2.jpg)

## HTTP3

+ 运行在 QUIC 之上的 HTTP 协议被称为 HTTP/3 (HTTP-over-QUIC)，QUIC 是一个跨层协议(一部分在传输层上，一部分在应用层上)
+ QUIC 协议(Quick UDP Internet Connection)基于 UDP，正是看中了 UDP 的速度与效率。同时 QUIC 也整合了 TCP、TLS 和 HTTP/2 的优点，并加以优化。
+ 特点：
    1. 减少了握手的延迟(1-RTT 或 0-RTT)
    2. 多路复用，并且没有 TCP 的阻塞问题
    3. 连接迁移，(主要是在客户端)当由 Wifi 转移到 4G 时，连接不 会被断开
+ HTTP/3 与 HTTP/1.1 和 HTTP/2 没有直接的关系，也不是 http/2 的扩展
+ HTTP/3将会是一个全新的WEB协议
+ HTTP/3目前处于制订和测试阶段