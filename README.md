# 缅甸选举调查问卷系统

这是一个专为缅甸选举民意调查设计的前端应用，包含完整的CMS管理系统。

## 功能特点

### 前端调查问卷
- 📝 多步骤缅甸语调查问卷
- 🎨 响应式设计，支持移动端
- ✅ 实时表单验证
- 🌏 缅甸本土化界面

### CMS管理系统
- 🔐 管理员登录系统
- 📊 数据统计仪表板
- 📋 调查数据查看
- 📥 CSV/JSON数据导出
- 🔍 数据筛选和搜索

## 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **样式**: Tailwind CSS, shadcn/ui
- **数据库**: SQLite (Prisma ORM)
- **认证**: JWT + bcrypt
- **部署**: Vercel (推荐)

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 环境配置

创建 `.env.local` 文件：

```env
# 数据库
DATABASE_URL="file:./dev.db"

# JWT密钥
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 管理员账户
ADMIN_EMAIL="admin@myanmar-survey.com"
ADMIN_PASSWORD="admin123"
```

### 3. 初始化数据库

```bash
# 生成Prisma客户端
pnpm db:generate

# 推送数据库模式
pnpm db:push

# 初始化管理员账户
npx tsx scripts/init-db.ts
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 查看调查问卷
访问 http://localhost:3000/admin 进入CMS管理界面

## 部署到生产环境

### Vercel部署 (推荐)

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署

### 环境变量配置

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
ADMIN_EMAIL="your-admin-email"
ADMIN_PASSWORD="your-secure-password"
```

### 数据库迁移

```bash
# 生产环境数据库迁移
pnpm db:push
```

## 项目结构

```
myanmar-survey/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 调查问卷主页
│   ├── admin/             # CMS管理界面
│   └── api/               # API路由
│       ├── survey/        # 调查数据API
│       └── auth/          # 认证API
├── components/            # UI组件
├── lib/                   # 工具函数
├── prisma/               # 数据库模式
├── scripts/              # 脚本文件
└── public/               # 静态资源
```

## API端点

### 调查数据
- `POST /api/survey` - 提交调查数据
- `GET /api/survey` - 获取调查数据
- `GET /api/survey/export` - 导出数据 (CSV/JSON)

### 认证
- `POST /api/auth/login` - 管理员登录
- `POST /api/auth/logout` - 登出
- `GET /api/auth/me` - 获取当前用户信息

## 数据模型

### SurveyResponse
- 年龄、地区、职业等基本信息
- 选举参与度和投票因素
- 选举预测和期望
- 担忧事项和信心程度
- 时间戳和IP地址

### User
- 管理员账户信息
- 角色权限管理

## 缅甸本土化

- 🌏 完全缅甸语界面
- 📱 移动端优化
- 🎨 符合缅甸文化的设计风格
- 📊 本地化数据格式

## 安全特性

- 🔐 JWT认证
- 🔒 密码加密存储
- 🛡️ CSRF保护
- 📝 输入验证
- 🚫 SQL注入防护

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 发起Pull Request

## 许可证

MIT License

## 支持

如有问题，请提交Issue或联系开发团队。 