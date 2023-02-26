# 青少年在线心理测评系统

项目从心理测评任务作答到结果查看这一实际场景出发，根据不同类型试题之间的作答操作差异展开功能设计，如：单选类试题作答、多选类试题作答、开放题类试题作答等。同时针对整个作答流程设计了一整套的功能模块，如：查看历史任务结果、查看当前任务结果等。

技术栈方面，项目整体采用 [Vue 3.0](https://cn.vuejs.org/) + [Element Plus](https://github.com/element-plus/element-plus) + [axios](https://github.com/axios/axios) 搭建，路由采用 [Vue Router](https://router.vuejs.org/zh/) 的Hash模式开发。

项目兼容移动端展示和操作。

### 项目概览
##### 1. 系统首页
<img alt="系统首页" src="https://psychology-web.oss-cn-beijing.aliyuncs.com/readme/home.png" width="500">

##### 2. 测评任务作答页
<img alt="测评任务作答页" src="https://psychology-web.oss-cn-beijing.aliyuncs.com/readme/question.png" width="500">

##### 3. 测评结果查看页
<img alt="测评结果查看页" src="https://psychology-web.oss-cn-beijing.aliyuncs.com/readme/result.png" width="500">

### 下载依赖

```sh
npm install
```

### 项目启动

```sh
npm run dev
```

### 项目打包

```sh
npm run build
```
