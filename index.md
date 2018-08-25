# 0 对应文件及文件夹的用处：

1. models: 存放操作数据库的文件
2. public: 存放静态文件，如样式、图片等
3. routes: 存放路由文件
4. views: 存放模板文件
5. index.js: 程序主文件
6. package.json: 存储项目名、描述、作者、依赖等等信息

> 遵循了 MVC（模型(model)－视图(view)－控制器(controller/route)） 的开发模式。

# 1 创建项目

运行 ```npm init```

运行以下命令安装所需模块
```
npm i config-lite connect-flash connect-mongo ejs express express-session marked moment mongolass objectid-to-timestamp sha1 winston express-winston --save
npm i https://github.com:utatti/express-formidable.git --save # 从 GitHub 安装 express-formidable
```
对应模块的用处：
1. express: web 框架
2. express-session: session 中间件
3. connect-mongo: 将 session 存储于 mongodb，结合 express-session 使用
4.0connect-flash: 页面通知的中间件，基于 session 实现
5. ejs: 模板
6. express-formidable: 接收表单及文件上传的中间件
7. config-lite: 读取配置文件
8. marked: markdown 解析
9. moment: 时间格式化
10. mongolass: mongodb 驱动
11. objectid-to-timestamp: 根据 ObjectId 生成时间戳
12. sha1: sha1 加密，用于密码加密
13. winston: 日志
14. express-winston: express 的 winston 日志中间件

## 1.1 [ESLint](http://eslint.cn)
ESLint 是一个代码规范和语法错误检查工具。使用 ESLint 可以规范我们的代码书写，可以在编写代码期间就能发现一些低级错误。

ESLint 需要结合编辑器或 IDE 使用，如：
* Sublime Text 需要装两个插件：SublimeLinter + SublimeLinter-contrib-eslint
* VS Code 需要装一个插件：ESLint
> Sublime Text 安装插件通过 ctrl+shift+p 调出 Package Control，输入 install 选择 Install Package 回车。输入对应插件名搜索，回车安装。VS Code 安装插件需要点击左侧『扩展』页

全局安装 eslint：```npm i eslint -g```
运行：```eslint --init```
初始化 eslint 配置，依次选择：

-> Use a popular style guide
-> Standard
-> JSON

> 注意：如果 Windows 用户使用其他命令行工具无法上下切换选项，切换回 cmd。

eslint 会创建一个 .eslintrc.json 的配置文件，同时自动安装并添加相关的模块到 devDependencies。这里我们使用 Standard 规范，其主要特点是不加分号。

## 1.2 EditorConfig
EditorConfig 是一个保持缩进风格的一致的工具，当多人共同开发一个项目的时候，往往会出现每个人用不同编辑器的情况，而且有的人用 tab 缩进，有的人用 2 个空格缩进，有的人用 4 个空格缩进，EditorConfig 就是为了解决这个问题而诞生。

EditorConfig 需要结合编辑器或 IDE 使用，如：

Sublime Text 需要装一个插件：EditorConfig
VS Code 需要装一个插件：EditorConfig for VS Code
在 myblog 目录下新建 .editorconfig 的文件，添加如下内容：
```
# editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
tab_width = 2

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```
这里我们使用 2 个空格缩进，tab 长度也是 2 个空格。trim_trailing_whitespace 用来删除每一行最后多余的空格，insert_final_newline 用来在代码最后插入一个空的换行。

## 1.3 config-lite
不管是小项目还是大项目，将配置与代码分离是一个非常好的做法。我们通常将配置写到一个配置文件里，如 config.js 或 config.json ，并放到项目的根目录下。但实际开发时我们会有许多环境，如本地开发环境、测试环境和线上环境等，不同环境的配置不同（如：MongoDB 的地址），我们不可能每次部署时都要去修改引用 config.test.js 或者 config.production.js。config-lite 模块正是你需要的。

[config-lite](https://www.npmjs.com/package/config-lite) 是一个轻量的读取配置文件的模块。config-lite 会根据环境变量（NODE_ENV）的不同加载 config 目录下不同的配置文件。如果不设置 NODE_ENV，则读取默认的 default 配置文件，如果设置了 NODE_ENV，则会合并指定的配置文件和 default 配置文件作为配置，config-lite 支持 .js、.json、.node、.yml、.yaml 后缀的文件。

如果程序以 NODE_ENV=test node app 启动，则 config-lite 会依次降级查找 config/test.js、config/test.json、config/test.node、config/test.yml、config/test.yaml 并合并 default 配置; 如果程序以 NODE_ENV=production node app 启动，则 config-lite 会依次降级查找 config/production.js、config/production.json、config/production.node、config/production.yml、config/production.yaml 并合并 default 配置。

config-lite 还支持冒泡查找配置，即从传入的路径开始，从该目录不断往上一级目录查找 config 目录，直到找到或者到达根目录为止。

在根目录下创建config 目录，在该目录下新建 default.js，添加如下代码：
```
module.exports = {
  port: 3000,
  session: {
    secret: 'chenmenglindeblog',
    key: 'chenmenglindeblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/chenmenglindeblog'
```
配置释义：
* port: 程序启动要监听的端口号
* session: express-session 的配置信息，后面介绍
* mongodb: mongodb 的地址，以 mongodb:// 协议开头，chenmenglindeblog 为 db 名

# 2 功能与路由设计
在开发博客之前，我们首先需要明确博客要实现哪些功能。由于本教程面向初学者，所以只实现了博客最基本的功能，
功能及路由设计如下：
1. 注册
  1. 注册页：GET /signup
  2. 注册（包含上传头像）：POST /signup
2. 登录
  1. 登录页：GET /signin
  2. 登录：POST /signin
3. 登出：GET /signout
4. 查看文章
  1. 主页：GET /posts
  2. 个人主页：GET /posts?author=xxx
  3. 查看一篇文章（包含留言）：GET /posts/:postId
5. 发表文章
  1. 发表文章页：GET /posts/create
  2. 发表文章：POST /posts/create
6. 修改文章
  1. 修改文章页：GET /posts/:postId/edit
  2. 修改文章：POST /posts/:postId/edit
7. 删除文章：GET /posts/:postId/remove
8. 留言
  1. 创建留言：POST /comments
  2. 删除留言：GET /comments/:commentId/remove
由于我们博客页面是后端渲染的，所以只通过简单的 <a>(GET) 和 <form>(POST) 与后端进行交互，如果使用 jQuery 或者其他前端框架（如 Angular、Vue、React 等等）可通过 Ajax 与后端交互，则 api 的设计应尽量遵循 Restful 风格。

## 2.1 Restful
Restful 是一种 api 的设计风格，提出了一组 api 的设计原则和约束条件。
Restful 风格的设计
```
DELETE /posts/:postId
```
可以看出，Restful 风格的 api 更直观且优雅。

> 更多阅读：
> 1. [http://www.ruanyifeng.com/blog/2011/09/restful]()
> 2. [http://www.ruanyifeng.com/blog/2014/05/restful_api.html]()
> 3. [http://developer.51cto.com/art/200908/141825.htm]()
> 4. [http://blog.jobbole.com/41233/]()

## 2.2 会话
由于 HTTP 协议是无状态的协议，所以服务端需要记录用户的状态时，就需要用某种机制来识别具体的用户，这个机制就是会话（Session）。

cookie 与 session 的区别
1. cookie 存储在浏览器（有大小限制），session 存储在服务端（没有大小限制）
2. 通常 session 的实现是基于 cookie 的，session id 存储于 cookie 中
3. session 更安全，cookie 可以直接在浏览器查看甚至编辑
> 参考：[https://www.zhihu.com/question/19786827]()

我们通过引入 express-session 中间件实现对会话的支持：
```
app.use(session(options))
```
session 中间件会在 req 上添加 session 对象，即 req.session 初始值为 {}，当我们登录后设置 req.session.user = 用户信息，返回浏览器的头信息中会带上 set-cookie 将 session id 写到浏览器 cookie 中，那么该用户下次请求时，通过带上来的 cookie 中的 session id 我们就可以查找到该用户，并将用户信息保存到 req.session.user。

## 2.3 页面通知
[connect-flash](https://www.npmjs.com/package/connect-flash) 是基于 session 实现的，它的原理很简单：设置初始值 req.session.flash={}，通过 req.flash(name, value) 设置这个对象下的字段和值，通过 req.flash(name) 获取这个对象下的值，同时删除这个字段，实现了只显示一次刷新后消失的功能。

express-session、connect-mongo 和 connect-flash 的区别与联系
1. ```express-session```: 会话（session）支持中间件
2. ```connect-mongo```: 将 session 存储于 mongodb，需结合 express-session 使用，我们也可以将 session 存储于 redis，如 [connect-redis](https://www.npmjs.com/package/connect-redis)
3. ```connect-flash```: 基于 session 实现的用于通知功能的中间件，需结合 express-session 使用

## 2.4 权限控制
如何实现页面的权限控制呢？我们可以把用户状态的检查封装成一个中间件，在每个需要权限控制的路由加载该中间件，即可实现页面的权限控制。(./middlewares/)

## 2.5 路由
路由按```./routes/```设计

## 2.6 修改根目录下的index.js
```
const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')

const app = express()

// 设置模板目录
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎为 ejs
app.set('view engine', 'ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))
// session 中间件
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}))
// flash 中间件，用来显示通知
app.use(flash())

// 路由
routes(app)

// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})
```
> 注意：中间件的加载顺序很重要。如上面设置静态文件目录的中间件应该放到 routes(app) 之前加载，这样静态文件的请求就不会落到业务逻辑的路由里；flash 中间件应该放到 session 中间件之后加载，因为 flash 是基于 session 实现的。

运行 supervisor index 启动博客，

到此博客的基础框架搭建就完成了

# 3 前端页面的设计
我们使用 jQuery + Semantic-UI 实现前端页面的设计。

## 3.1 组件
前面提到过，我们可以将模板拆分成一些组件，然后使用 ejs 的 include 方法将组件组合起来进行渲染。
|—。/               根目录
  |- public         静态文件
    |- css          css样式文件
    |- ing          静态图片文件
  |- views          组件(根目录下为不可复用组件和第三方组件)
    |- components   可复用组件

## 3.2 app.locals 和 res.locals

express 中有两个对象可用于模板的渲染：```app.locals``` 和 ```res.locals```。我们从 express 源码一探究竟：
从 ```express/lib/application.js``` 和 ```express/lib/response.js``` 可以看出在调用 ```res.render``` 的时候，express 合并（merge）了 3 处的结果后传入要渲染的模板，优先级：```res.render``` 传入的对象> ```res.locals``` 对象 > ```app.locals``` 对象，所以 ```app.locals``` 和 ```res.locals``` 几乎没有区别，都用来渲染模板，使用上的区别在于：```app.locals``` 上通常挂载常量信息（如博客名、描述、作者这种不会变的信息），```res.locals``` 上通常挂载变量信息，即每次请求可能的值都不一样（如请求者信息，```res.locals.user``` = ```req.session.user```）。

# 4 数据库操作
我们使用 [Mongolass](https://github.com/mongolass/mongolass) 这个模块操作 mongodb 进行增删改查。在根目录下新建 lib 目录，

## 4.1 为什么使用 Mongolass
早期我使用官方的 [mongodb](https://www.npmjs.com/package/mongodb)（也叫 node-mongodb-native）库，后来也陆续尝试使用了许多其他 mongodb 的驱动库，[Mongoose](https://www.npmjs.com/package/mongoose) 是比较优秀的一个，使用 Mongoose 的时间也比较长。比较这两者，各有优缺点。

### node-mongodb-native:
优点：
1. 简单。参照文档即可上手，没有 Mongoose 的 Schema 那些对新手不友好的东西。
2. 强大。毕竟是官方库，包含了所有且最新的 api，其他大部分的库都是在这个库的基础上改造的，包括 Mongoose。
3. 文档健全。
缺点：
1. 起初只支持 callback，(现在支持 Promise 了，和 co 一起使用好很多。)
2. 不支持文档校验。Mongoose 通过 Schema 支持文档校验，虽说 mongodb 是 no schema 的，但在生产环境中使用 Schema 有两点好处。一是对文档做校验，防止非正常情况下写入错误的数据到数据库，二是可以简化一些代码，如类型为 ObjectId 的字段查询或更新时可通过对应的字符串操作，不用每次包装成 ObjectId 对象。

### Mongoose:
优点：
1. 封装了数据库的操作，给人的感觉是同步的，其实内部是异步的。如 mongoose 与 MongoDB 建立连接：
```
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')
const BlogModel = mongoose.model('Blog', { title: String, content: String })
BlogModel.find()
```
2. 支持 Promise。这个也无需多说，Promise 是未来趋势，可结合 co 使用，也可结合 async/await 使用。
3. 支持文档校验。如上所述。
缺点（个人观点）：
1. 功能多，复杂。Mongoose 功能很强大，包括静态方法，实例方法，虚拟属性，hook 函数等等，混用带来的后果是逻辑复杂，代码难以维护。
2. 较弱的 plugin 系统。如：```schema.pre('save'```, ```function(next) {})``` 和 ```schema.post('find', function(next) {})```，只支持异步 next()，灵活性大打折扣。
3. 其他：对新手来说难以理解的 Schema、Model、Entity 之间的关系；容易混淆的 toJSON 和 toObject，以及有带有虚拟属性的情况；用和不用 exec 的情况以及直接用 then 的情况；返回的结果是 Mongoose 包装后的对象，在此对象上修改结果却无效等等。
### Mongolass
Mongolass 保持了与 mongodb 一样的 api，又借鉴了许多 Mongoose 的优点，同时又保持了精简。
1. 支持 Promise。
2. 官方一致的 api。
3. 简单。参考 Mongolass 的 readme 即可上手，比 Mongoose 精简的多，本身代码也不多。
4. 可选的 Schema。Mongolass 中的 Schema （基于 [another-json-schema](https://www.npmjs.com/package/another-json-schema)）是可选的，并且只用来做文档校验。如果定义了 schema 并关联到某个 model，则插入、更新和覆盖等操作都会校验文档是否满足 schema，同时 schema 也会尝试格式化该字段，类似于 Mongoose，如定义了一个字段为 ObjectId 类型，也可以用 ObjectId 的字符串无缝使用一样。如果没有 schema，则用法跟原生 mongodb 库一样。
5. 简单却强大的插件系统。可以定义全局插件（对所有 model 生效），也可以定义某个 model 上的插件（只对该 model 生效）。Mongolass 插件的设计思路借鉴了中间件的概念（类似于 Koa），通过定义 beforeXXX 和 afterXXX （XXX为操作符首字母大写，如：afterFind）函数实现，函数返回 yieldable 的对象即可，所以每个插件内可以做一些其他的 IO 操作。不同的插件顺序会有不同的结果，而且每个插件的输入输出都是 plain object，而非类 Mongoose 包装后的对象，没有虚拟属性，无需调用 toJSON 或 toObject。Mongolass 中的 .populate()就是一个内置的插件。
6. 详细的错误信息。用过 Mongoose 的人一定遇到过这样的错： CastError: Cast to ObjectId failed for value "xxx" at path "_id" 只知道一个期望是 ObjectId 的字段传入了非期望的值，通常很难定位出错的代码，即使定位到也得不到错误现场。得益于 [another-json-schema](https://www.npmjs.com/package/another-json-schema)，使用 Mongolass 在查询或者更新时，某个字段不匹配它定义的 schema 时（还没落到 mongodb）会给出详细的错误信息，
缺点：
schema 功能较弱，缺少如 required、default 功能。
 扩展阅读：[从零开始写一个 Node.js 的 MongoDB 驱动库](https://zhuanlan.zhihu.com/p/24308524)

# 5 功能实现

# 5.1 注册与文件上传
我们使用 [express-formidable](https://github.com/utatti/express-formidable) 处理 form 表单（包括文件上传）。

# 5.2 日志功能
日志分为正常请求的日志和错误请求的日志，我们希望实现这两种日志都打印到终端并写入文件。
我们使用 [winston](https://www.npmjs.com/package/winston) 和 [express-winston](https://www.npmjs.com/package/express-winston) 记录日志。

新建 logs 目录存放日志文件，修改 index.js，下引入所需模块：
```
const winston = require('winston')
const expressWinston = require('express-winston')
```
加入
···
// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}))
// 路由
routes(app)
// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}))
···
> 注意：记录正常请求日志的中间件要放到 routes(app) 之前，记录错误请求日志的中间件要放到 routes(app) 之后。

# 6 其它

## 6.1 .gitignore
如果我们想把项目托管到 git 服务器上（如: GitHub），而不想把线上配置、本地调试的 logs 以及 node_modules 添加到 git 的版本控制中，这个时候就需要 .gitignore 文件了，git 会读取 .gitignore 并忽略这些文件。在 myblog 下新建 .gitignore 文件，添加如下配置：
.gitignore
···
config/*
!config/default.*
npm-debug.log
node_modules
coverage
···
需要注意的是，通过设置：
···
config/*
!config/default.*
···
这样只有 config/default.js 会加入 git 的版本控制，而 config 目录下的其他配置文件则会被忽略，因为把线上配置加入到 git 是一个不安全的行为，通常你需要本地或者线上环境手动创建 config/production.js，然后添加一些线上的配置（如：mongodb 配置）即可覆盖相应的 default 配置。
然后在 public/img 目录下创建 .gitignore：
···
# Ignore everything in this directory
*
# Except this file
!.gitignore
···
这样 git 会忽略 public/img 目录下所有上传的头像，而不忽略 public/img 目录。同理，在 logs 目录下创建 .gitignore 忽略日志文件：
···
# Ignore everything in this directory
*
# Except this file
!.gitignore
···

## 6.2 测试
[mocha](https://www.npmjs.com/package/mocha) 和 [suptertest](https://www.npmjs.com/package/supertest) 是常用的测试组合，通常用来测试 restful 的 api 接口，这里我们也可以用来测试我们的博客应用。 在 根目录 下新建 test 文件夹存放测试文件，以注册为例讲解 mocha 和 supertest 的用法。首先安装所需模块：
```
npm i mocha supertest --save-dev
```
修改 package.json，将：
···
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
}
···
修改为
···
"scripts": {
  "test": "mocha test"
}
···
指定执行 test 目录的测试。修改 index.js，将：
···
// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})
···
修改为
···
if (module.parent) {
  // 被 require，则导出 app
  module.exports = app
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`)
  })
}
···
这样做可以实现：直接启动 index.js 则会监听端口启动程序，如果 index.js 被 require 了，则导出 app，通常用于测试。

找一张图片用于测试上传头像，放到 test 目录下，如 avatar.png。新建 test/signup.js，详情请查看相关文件
此时编辑器会报语法错误（如：describe 未定义等等），修改 .eslintrc.json 如下：
···
{
  "extends": "standard",
  "globals": {
    "describe": true,
    "beforeEach": true,
    "afterEach": true,
    "after": true,
    "it": true
  }
}
··
这样，eslint 会忽略 globals 中变量未定义的警告。运行 npm test 看看效果吧
这样，eslint 会忽略 globals 中变量未定义的警告。运行 npm test 看看效果吧，其余的测试请读者自行完成。

### 测试覆盖率
我们写测试肯定想覆盖所有的情况（包括各种出错的情况及正确时的情况），但光靠想需要写哪些测试是不行的，总也会有疏漏，最简单的办法就是可以直观的看出测试是否覆盖了所有的代码，这就是测试覆盖率，即被测试覆盖到的代码行数占总代码行数的比例。
> 注意：即使测试覆盖率达到 100% 也不能说明你的测试覆盖了所有的情况，只能说明基本覆盖了所有的情况。

[istanbul](https://www.npmjs.com/package/istanbul) 是一个常用的生成测试覆盖率的库，它会将测试的结果报告生成 html 页面，并放到项目根目录的 coverage 目录下。首先安装 istanbul:
```
npm i istanbul --save-dev
```
配置 istanbul 很简单，将 package.json 中：
```
"scripts": {
  "test": "mocha test"
}
```
修改为：
```
"scripts": {
  "test": "istanbul cover _mocha"
}
> Windows 下需要改成 istanbul cover node_modules/mocha/bin/_mocha。
```
即可将 istanbul 和 mocha 结合使用，运行 npm test 测试完成后
打开 ./coverage/Icov-report/index.html 可查看覆盖结果
红色的行表示测试没有覆盖到
