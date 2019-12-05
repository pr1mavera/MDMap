---
title: HTTPS
date: 2019-08-13
---

基于 SSL 的 HTTP 协议，是在 **传输层** 之上做了一层 SSL 加密
+ HTTP: 明文 ---tcp---> 数据传输
+ HTTPS: 明文 ---SSL加密---> 密文 ---tcp---> 数据传输

## SSL / TLS 协议（一种安全协议）

传输层安全性协议（TLS） ，及其前身安全套接层（SSL） ，TLS 是 SSL 的一部分

+ 目的：为互联网通信提供安全和数据完整性保障
+ HTTPS 协议的安全性由 SSL 协议实现
+ SSH 协议的安全性由 SSL 协议实现
+ SSL 的四个子协议
    1. 握手协议（TLS 握手协议）
    2. 密钥配置切换协议
    3. 应用数据协议（补充协议）
    4. 报警协议（补充协议）
+ 协议使用场景
    1. TLS 适用于对称密钥
    2. 对称密钥可通过安全密钥交换算法共享
    3. 如果请求被截获，密钥交换可能会被欺骗（中间人攻击）
    4. 使用数字签名（证书）进行身份验证
    5. 证书签发机构和信任链

## 握手过程（TLS 握手过程）

1. 客户端 ----<span style="font-size:10px;border-bottom:1px solid #67cc86;">客户端支持的 SSL/TLS最高协议版本号、加密算法集合、压缩方法集合 及 客户端随机数等</span>---> 服务器端
2. 客户端 <---<span style="font-size:10px;border-bottom:1px solid #67cc86;">选定双方都支持的 SSL/TLS协议版本、加密算法、压缩算法 及 服务器端随机数，返回给客户端</span>---- 服务器端
3. <span style="opacity: 0.3;">客户端 <---<span style="font-size:10px;border-bottom:1px solid #67cc86;">发送服务端证书，以及非对称算法的公钥和算法（可选）</span>---- 服务器端 </span>
4. <span style="opacity: 0.3;">客户端 <---<span style="font-size:10px;border-bottom:1px solid #67cc86;">若选择双向验证，则请求客户端证书（可选）</span>---- 服务器端 </span>
5. 客户端 <---<span style="font-size:10px;border-bottom:1px solid #67cc86;">通知客户端初始协商结束</span>---- 服务器端
6. <span style="opacity: 0.3;">客户端 ----<span style="font-size:10px;border-bottom:1px solid #67cc86;">若选择双向验证，发送证书给服务器端，同时若上述没有第3步，则向服务器端请求相关证书（可选）</span>---> 服务器端 </span>
7. 客户端 ----<span style="font-size:10px;border-bottom:1px solid #67cc86;">对 客户端公钥及密钥种子生成的 *预主密钥* 进行非对称加密，发送至服务端</span>---> 服务器端（密钥交换）
8. <span style="opacity: 0.3;">客户端 ----<span style="font-size:10px;border-bottom:1px solid #67cc86;">若选择双向验证，用客户端私钥生成数字签名，发送给服务器端（可选）</span>---> 服务器端（密钥交换）</span>
9. 客户端 ----<span style="font-size:10px;border-bottom:1px solid #67cc86;">通讯双方基于共享信息（双方随机数(hello过程中传递的) + *预主密钥*） 生成主密钥</span>---- 服务器端（密钥交换）
10. 客户端 ----<span style="font-size:10px;border-bottom:1px solid #67cc86;">客户端通知服务器端已切换至加密模式（密钥配置切换协议）</span>---> 服务器端
11. 客户端 ----<span style="font-size:10px;border-bottom:1px solid #67cc86;">客户端已做好加密通讯准备</span>---> 服务器端
12. 客户端 <---<span style="font-size:10px;border-bottom:1px solid #67cc86;">服务器端通知客户端已切换至加密模式（密钥配置切换协议）</span>---- 服务器端
13. 客户端 <---<span style="font-size:10px;border-bottom:1px solid #67cc86;">服务器端已做好加密通讯准备</span>---- 服务器端
14. 客户端 <---<span style="font-size:10px;border-bottom:1px solid #67cc86;">双方数据通信，传输的内容使用主密钥进行对称加密</span>---> 服务器端
15. 客户端 <---<span style="font-size:10px;border-bottom:1px solid #67cc86;">通讯结束后，任何一方发出断开 SSL 连接的消息</span>---> 服务器端

更详细的描述：[一文弄懂HTTPS（II）-TLS/SSL协议握手](https://ayase.moe/2018/11/15/https-tls/)

::: tip HTTPS 中，协议 连接 & 断开 顺序
+ 连接: tcp - SSL（TLS） - HTTP
+ 断开: HTTP - SSL（TLS） - tcp
:::