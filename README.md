# 项目运行说明

- **本项目为学习项目,以美团外卖为参照搭建商家后台管理系统**
- **项目正在进行中,有兴趣的朋友可以一同参与进来**

## 安装依赖

    ```
    yarn || npm install
    ```

## 启动服务器

    ```
    yarn server || npm run server
    ```

## 启动项目

    ```
    yarn start || npm start
    ```

## 项目目录结构说明

    ```
    ------ 服务器 -------

    server => 后台服务器 (自己搭的)
      - public => 服务器静态资源
      - src => 服务器源码
        - config => 服务器配置文件
        - models => 数据库字段配置
        - routers => 接口路由
        - utils => 工具

    ------ 前端页面 -------

    src => 前端页面源码文件夹
      - api => 请求接口
      - assets => 放置图片,全局sass样式
      - components => 组件
      - data => 放置用于遍历的静态数据
      - router => 路由
      - store => vuex 全局状态管理
      - typings => 放置 ts 的 interface 等
      - utils => 工具
      - views => 路由组件
    ```
