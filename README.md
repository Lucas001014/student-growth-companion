# 班级荣誉皮肤系统

> 面向初中/小学（12-15岁）的班级管理游戏化激励平台

## 🎯 项目简介

教师通过授予**皮肤**、**称号**、**积分**奖励学生；学生消耗积分抽取**盲盒**；家长通过学生账号切换家长模式确认作业完成并上传选择题；系统包含教师端、学生/家长端、超级管理员后台、教室智能屏幕终端四个入口。

## 📂 项目结构

```
class-honor-skin/
├── server/          # 后端服务 (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── index.ts            # 入口
│   │   ├── config/             # 数据库/Redis/积分规则配置
│   │   ├── middleware/         # JWT认证、错误处理
│   │   ├── models/             # 18张表的数据模型 (Sequelize)
│   │   ├── controllers/        # 业务控制器
│   │   ├── services/           # 业务逻辑层
│   │   ├── routes/             # 路由
│   │   ├── utils/              # 工具、数据库同步
│   │   └── types/              # TypeScript类型定义
│   ├── package.json
│   └── tsconfig.json
├── web/             # 前端网页 (Vue 3 + TypeScript + Vite)
│   ├── src/
│   │   ├── router/             # 路由（教师/学生/家长/管理员）
│   │   ├── stores/             # Pinia状态管理
│   │   ├── api/                # API请求封装
│   │   ├── layouts/            # 三种身份的侧边栏布局
│   │   ├── components/         # 公共组件（皮肤卡片、身份标识、排行榜、盲盒动画等）
│   │   ├── views/              # 业务页面
│   │   │   ├── login/
│   │   │   ├── teacher/        # 教师端 8个核心页面
│   │   │   ├── student/        # 学生端 7个页面 + 家长模式 3个页面
│   │   │   └── admin/          # 管理员端 5个页面
│   │   └── styles/
│   ├── package.json
│   └── vite.config.ts
├── miniapp/         # 微信小程序端 (原生 WXML/WXSS/JS)
│   ├── pages/                  # 全部 20 个页面
│   ├── utils/                  # API封装、工具、认证
│   ├── app.js / app.json / app.wxss
│   └── project.config.json
└── screen/          # 教室智能大屏幕终端 (纯HTML + Socket.IO)
    ├── index.html              # 全屏展示页面
    ├── css/screen.css          # 科技感大屏样式
    └── js/                     # socket连接、排行榜、动态、动画
```

## 🚀 快速启动

### 1. 后端服务

```bash
cd server
npm install
# 启动 MySQL 和 Redis
# 同步数据库并初始化数据
npx ts-node src/utils/syncDB.ts
# 开发启动
npm run dev
# 生产构建
npm run build && npm start
```

服务将运行在 `http://localhost:3000`

**默认账号**
- 超级管理员: `admin` / `admin123` (手机号: 13800000000)
- 教师: 首次登录后由管理员创建
- 学生: 学号 + 班级验证码（由教师下发）

### 2. 前端网页

```bash
cd web
npm install
npm run dev
```

访问 `http://localhost:5173`

### 3. 微信小程序

1. 打开 **微信开发者工具**
2. 导入项目 → 选择 `miniapp` 目录
3. AppID 选择「测试号」即可
4. `utils/api.js` 中的 BASE 地址替换为你的后端地址
5. 在项目配置里关闭「不校验合法域名」即可本地调试

### 4. 教室智能大屏

1. 在教室的大屏电脑打开 `screen/index.html`
2. 默认以「演示模式」运行，每 15 秒模拟新事件
3. 若后端服务已启动，自动连接 Socket.IO 进行实时数据同步
4. 支持 URL 参数：`?classId=1&deviceCode=SCREEN-001`

## 📊 核心数据库表 (18张)

| 表名 | 说明 |
|------|------|
| users | 用户（教师/管理员） |
| classes | 班级 |
| teacher_classes | 教师-班级关联 |
| students | 学生 |
| skins | 皮肤库 |
| titles | 称号库 |
| identity_badges | 身份标识模板 |
| student_skins | 学生-皮肤持有 |
| student_titles | 学生-称号持有 |
| student_identities | 学生-身份标识 |
| points_records | 积分记录 |
| blind_boxes | 盲盒活动 |
| blind_box_items | 盲盒内容物（含概率） |
| blind_box_draws | 盲盒抽取记录 |
| requests | 申请记录（皮肤/称号/作业确认） |
| homework_uploads | 选择题上传 |
| announcements | 公告 |
| screen_devices | 教室屏幕设备 |

## 🔌 API 接口 (共 24+)

- **POST /api/auth/login** - 登录
- **POST /api/auth/mode/switch** - 切换家长模式
- **POST /api/auth/change-password** - 修改密码
- **GET/POST /api/class/students** - 学生管理（教师/管理员）
- **POST /api/honor/points**、**/honor/skin/grant**、**/honor/title/grant** - 荣誉发放
- **POST /api/request/submit**、**/request/:id/approve** - 申请/审批
- **POST /api/homework/confirm**、**/homework/upload** - 家长作业确认与上传
- **GET /api/homework/public** - 公开选择题
- **POST /api/blindbox/create**、**GET /api/blindbox/list**、**POST /api/blindbox/draw** - 盲盒系统
- **GET /api/ranking/class** - 排行榜（Redis ZSET 高性能）
- **WS /socket.io** - 教室屏幕实时推送

## 🎨 功能亮点

1. **三级身份体系**：学生 / 教师 / 管理员，各自独立页面流
2. **家长模式**：学生账号一键切换，独立的作业确认、上传、历史三个子页面
3. **盲盒系统**：四档稀有度（N/R/SR/SSR），概率权重配置，开箱动画
4. **皮肤/称号/身份标识**：三层游戏化激励，积分自动扣减，历史可追溯
5. **实时同步**：Socket.IO 实时推送至教室大屏与所有在线学生端
6. **教室智能大屏**：全屏轮播，排行榜 + 荣誉动态 + 皮肤墙 + 盲盒动态 + 公告
7. **多端一致**：网页端 + 微信小程序共用后端 API，数据天然同步
8. **游戏化元素**：稀有度色彩、徽章动画、Toast 弹窗、滚动时间线

## 📈 技术栈

- **后端**: Node.js + Express + TypeScript
- **数据库**: MySQL (主库) + Redis (缓存/排行榜/Session)
- **ORM**: Sequelize v6
- **实时通信**: Socket.IO v4
- **前端框架**: Vue 3 + Pinia + Vue Router
- **UI 组件库**: Element Plus
- **构建工具**: Vite
- **小程序**: 微信原生开发 (WXML/WXSS/JS)
- **大屏**: 原生 HTML + CSS + JS + Socket.IO

## 🔐 权限控制

| 接口 | admin | teacher | student | parent |
|------|-------|---------|---------|--------|
| 学生 CRUD | ✅ | ✅ (本班) | ❌ | ❌ |
| 积分/皮肤/称号发放 | ✅ | ✅ (本班) | ❌ | ❌ |
| 申请提交 | ❌ | ❌ | ✅ | ❌ |
| 申请审批 | ✅ | ✅ (本班) | ❌ | ❌ |
| 作业确认/上传 | ❌ | ❌ | ❌ | ✅ |
| 公开作业查看 | ❌ | ❌ | ✅ | ❌ |
| 盲盒抽取 | ❌ | ❌ | ✅ | ❌ |
| 排行榜 | ✅ | ✅ | ✅ | ❌ |
| 系统配置 | ✅ | ❌ | ❌ | ❌ |

## 📝 开发说明

- 后端使用 **Sequelize** 自动同步表结构，首次运行 `syncDB.ts` 可自动建表并初始化管理员账号
- **积分规则**：默认上限 9999，家长确认作业通过奖励 10 分/次，审批有效期 7 天
- **盲盒概率**：使用 DECIMAL(5,2)，创建时校验所有概率项之和必须为 100
- **Redis 缓存**：排行榜使用 Redis ZSET 实现高性能排序与快速读取
- **乐观锁**：盲盒抽取使用数据库原子操作，防止积分超扣
- **Socket.IO 事件**：`honor_event`、`blindbox_event`、`ranking_update`、`announcement`、`points_update`

## 🔧 自定义与扩展

- 修改 `server/src/config/index.ts` 调整积分规则与上传目录
- 在 `web/src/api/` 扩展自定义接口调用
- 小程序端通过修改 `miniapp/utils/api.js` 的 `BASE` 常量切换后端

## 📄 License

内部项目 - 仅供教学与班级管理使用
