# 缅甸调查问卷系统部署指南

## 本地开发环境设置

### 1. 安装依赖

```bash
# 安装 pnpm (如果还没有安装)
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 2. 环境变量配置

创建 `.env.local` 文件：

```env
# 数据库配置
DATABASE_URL="file:./dev.db"

# JWT密钥 (生产环境请使用强密钥)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 管理员账户
ADMIN_EMAIL="admin@myanmar-survey.com"
ADMIN_PASSWORD="admin123"
```

### 3. 数据库初始化

```bash
# 生成 Prisma 客户端
pnpm db:generate

# 创建数据库表
pnpm db:push

# 初始化管理员账户
npx tsx scripts/init-db.ts
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问地址：
- 调查问卷: http://localhost:3000
- CMS管理: http://localhost:3000/admin

## 生产环境部署

### 方案一：Vercel部署 (推荐)

#### 1. 准备代码仓库

```bash
# 初始化Git仓库
git init
git add .
git commit -m "Initial commit"

# 推送到GitHub
git remote add origin https://github.com/your-username/myanmar-survey.git
git push -u origin main
```

#### 2. Vercel部署

1. 访问 [Vercel](https://vercel.com)
2. 使用GitHub账户登录
3. 点击 "New Project"
4. 导入你的GitHub仓库
5. 配置环境变量：

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
ADMIN_EMAIL="your-admin-email"
ADMIN_PASSWORD="your-secure-password"
```

6. 选择新加坡区域 (sin1) 以获得更好的缅甸访问速度
7. 点击 "Deploy"

#### 3. 数据库设置

对于生产环境，推荐使用以下数据库：

**选项A: PlanetScale (推荐)**
```env
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/database?sslaccept=strict"
```

**选项B: Supabase**
```env
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

**选项C: Railway**
```env
DATABASE_URL="postgresql://postgres:[password]@[host]:[port]/[database]"
```

#### 4. 数据库迁移

```bash
# 在Vercel部署后，运行数据库迁移
pnpm db:push
```

### 方案二：传统服务器部署

#### 1. 服务器要求

- Node.js 18+
- pnpm
- 数据库 (PostgreSQL/MySQL)

#### 2. 部署步骤

```bash
# 克隆代码
git clone https://github.com/your-username/myanmar-survey.git
cd myanmar-survey

# 安装依赖
pnpm install

# 构建项目
pnpm build

# 设置环境变量
export DATABASE_URL="your-database-url"
export JWT_SECRET="your-jwt-secret"
export ADMIN_EMAIL="your-admin-email"
export ADMIN_PASSWORD="your-admin-password"

# 运行数据库迁移
pnpm db:push

# 启动生产服务器
pnpm start
```

#### 3. 使用PM2管理进程

```bash
# 安装PM2
npm install -g pm2

# 创建PM2配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'myanmar-survey',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      DATABASE_URL: 'your-database-url',
      JWT_SECRET: 'your-jwt-secret',
      ADMIN_EMAIL: 'your-admin-email',
      ADMIN_PASSWORD: 'your-admin-password'
    }
  }]
}
EOF

# 启动应用
pm2 start ecosystem.config.js

# 设置开机自启
pm2 startup
pm2 save
```

## 域名和SSL配置

### 1. 域名设置

1. 购买域名 (推荐: .mm 或 .com)
2. 在DNS提供商处添加记录：
   - A记录: @ → Vercel IP
   - CNAME记录: www → your-app.vercel.app

### 2. SSL证书

- Vercel自动提供SSL证书
- 传统服务器可使用Let's Encrypt

## 性能优化

### 1. CDN配置

```bash
# 在Vercel中启用CDN
# 选择新加坡区域以获得更好的缅甸访问速度
```

### 2. 数据库优化

```sql
-- 添加索引以提高查询性能
CREATE INDEX idx_survey_created_at ON survey_responses(created_at);
CREATE INDEX idx_survey_location ON survey_responses(location);
CREATE INDEX idx_survey_age ON survey_responses(age);
```

### 3. 缓存策略

```typescript
// 在API路由中添加缓存头
export async function GET() {
  const response = NextResponse.json(data)
  response.headers.set('Cache-Control', 'public, max-age=300')
  return response
}
```

## 监控和维护

### 1. 日志监控

```bash
# 查看Vercel日志
vercel logs

# 查看PM2日志
pm2 logs myanmar-survey
```

### 2. 数据库备份

```bash
# 定期备份数据库
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### 3. 性能监控

- 使用Vercel Analytics
- 设置Uptime监控
- 配置错误告警

## 安全配置

### 1. 环境变量安全

```bash
# 使用强密码
openssl rand -base64 32  # 生成JWT密钥
```

### 2. 数据库安全

```sql
-- 限制数据库用户权限
GRANT SELECT, INSERT ON survey_responses TO app_user;
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
```

### 3. API安全

```typescript
// 添加速率限制
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
})
```

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查DATABASE_URL格式
   - 确认数据库服务运行正常
   - 检查防火墙设置

2. **JWT认证失败**
   - 确认JWT_SECRET设置正确
   - 检查token过期时间

3. **构建失败**
   - 检查Node.js版本 (需要18+)
   - 确认所有依赖安装完成
   - 查看构建日志

### 调试命令

```bash
# 检查环境变量
echo $DATABASE_URL

# 测试数据库连接
npx prisma db pull

# 查看应用日志
pm2 logs myanmar-survey --lines 100
```

## 更新部署

### 1. 代码更新

```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
pnpm install

# 重新构建
pnpm build

# 重启应用
pm2 restart myanmar-survey
```

### 2. 数据库迁移

```bash
# 运行数据库迁移
pnpm db:push

# 检查迁移状态
npx prisma migrate status
```

## 联系支持

如遇到部署问题，请：

1. 查看项目文档
2. 检查GitHub Issues
3. 联系开发团队

---

**注意**: 生产环境部署前请务必：
- 更改默认密码
- 使用强JWT密钥
- 配置HTTPS
- 设置监控告警
- 定期备份数据 