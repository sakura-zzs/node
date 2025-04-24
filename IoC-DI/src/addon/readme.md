Nodejs在IO方面拥有极强的能力，但是对CPU密集型任务，会有不足，为了填补这方面的缺点，Nodejs支持c/c++为其编写原生nodejs插件，补充这方面的能力。
## Nodejs c++扩展
- c++编写的代码能够被编译成一个动态链接库(dll),可以被nodejs require引入使用，后缀是.node

- ode文件的原理就是(window dll) (Mac dylib) (Linux so)
- c++扩展编写语法
1. NAN(Native Abstractions for Nodejs) 一次编写，到处编译
  - 因为 Nodejs和V8都更新的很快所有每个版本的方法名也不一样，对我们开发造成了很大的问题例如
  - 50版本 Echo(const Prototype&proto)
  - 00版本 Echo(Object<Prototype>& proto)
  NAN的就是一堆宏判断，判断各种版本的API，用来实现兼容所以他会到处编译
2. N-API(node-api) 无需重新编译
  - 基于C的API
  - c++ 封装 node-addon-api
    N-API 是一个更现代的选择，它提供了一个稳定的、跨版本的 API，使得你的插件可以在不同版本的 Node.js 上运行，而无需修改代码。这大大简化了编写和维护插件的过程。
    对于 C++，你可以使用 node-addon-api，这是 N-API 的一个封装，提供了一个更易于使用的 C++ API。这将使你的代码更易于阅读和维护。
## 使用场景
- 使用C++编写的Nodejs库如node-sass node-jieba 等
- CPU密集型应用
- 代码保护
## 需要安装的依赖
```shell
npm install --global --production windows-build-tools #管理员运行
#如果安装过python 以及c++开发软件就不需要装这个了
npm install node-gyp -g #全局安装
npm install node-addon-api -D #装到项目里
```


