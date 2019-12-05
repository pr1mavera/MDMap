---
title: http & http2 & http3 队首阻塞问题
date: 2019-08-13
---

现在有三个请求

<span style="font-size:10px;background-color:#ff3232;color:#fff;"> req1 </span>、<span style="font-size:10px;background-color:#00c26c;color:#fff;"> req2 </span>、<span style="font-size:10px;background-color:#ffc200;color:#fff;"> req3 </span>

比较三种协议

#### HTTP1
+ 一个接一个传输响应，串行传输：<span style="font-size:10px;background-color:#ff3232;color:#fff;"> req1 </span> -> <span style="font-size:10px;background-color:#00c26c;color:#fff;"> req2 </span> -> <span style="font-size:10px;background-color:#ffc200;color:#fff;"> req3 </span>
+ 存在问题：若当 <span style="font-size:10px;background-color:#00c26c;color:#fff;"> req2 </span> 请求丢失，则需等待 <span style="font-size:10px;background-color:#00c26c;color:#fff;"> req2 </span> 处理完成，才能处理后面的请求

#### HTTP2
+ 将三个请求拆成小块：
    + <span style="font-size:10px;background-color:#ff3232;color:#fff;">req1_1</span> <span style="font-size:10px;background-color:#ff3232;color:#fff;">req1_2</span> <span style="font-size:10px;background-color:#ff3232;color:#fff;">req1_3</span> ...
    + <span style="font-size:10px;background-color:#00c26c;color:#fff;">req2_1</span> <span style="font-size:10px;background-color:#00c26c;color:#fff;">req2_2</span> <span style="font-size:10px;background-color:#00c26c;color:#fff;">req2_3</span> ...
    + <span style="font-size:10px;background-color:#ffc200;color:#fff;">req3_1</span> <span style="font-size:10px;background-color:#ffc200;color:#fff;">req3_2</span> <span style="font-size:10px;background-color:#ffc200;color:#fff;">req3_3</span> ...
+ 再以流的方式，包装成一个个 **数据包** 传输
    + (<span style="font-size:10px;background-color:#ff3232;color:#fff;">req1_1</span> <span style="font-size:10px;background-color:#00c26c;color:#fff;">req2_1</span> <span style="font-size:10px;background-color:#00c26c;color:#fff;">req2_2</span>) -> (<span style="font-size:10px;background-color:#ff3232;color:#fff;">req1_2</span> <span style="font-size:10px;background-color:#00c26c;color:#fff;">req2_3</span> <span style="font-size:10px;background-color:#ffc200;color:#fff;">req3_1</span>) -> (<span style="font-size:10px;background-color:#ff3232;color:#fff;">req1_3</span> <span style="font-size:10px;background-color:#ffc200;color:#fff;">req3_2</span> <span style="font-size:10px;background-color:#ffc200;color:#fff;">req3_3</span>)
+ 存在问题：在 tcp 层面以流的方式传输，说到底依然是串行的，需要一个数据包一个数据包的发送，因此当数据包中的某一个数据帧(比如 <span style="font-size:10px;background-color:#00c26c;color:#fff;">req2_3</span>)丢失了，则整个数据包(<span style="font-size:10px;background-color:#ff3232;color:#fff;">req1_2</span> <span style="font-size:10px;background-color:#00c26c;color:#fff;">req2_3</span> <span style="font-size:10px;background-color:#ffc200;color:#fff;">req3_1</span>)需要重新发送，并且后面的数据包需要等待处理结果

#### HTTP3
+ 基于 udp 的传输层协议，意味着在发送 **数据包** 中的 **数据帧** 时是无序的，传输过来的数据包会存在内存中，当一个数据包中的所有数据帧都传输完成之后在合并组装起来
+ 因此当某一个 **数据帧** 丢失的时候，只需重新发送该数据帧即可，并不会影响后续的传输
+ 基本完全解决了队首阻塞问题
