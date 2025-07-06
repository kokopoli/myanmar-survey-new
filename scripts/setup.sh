#!/bin/bash

echo "🚀 缅甸调查问卷系统 - 快速设置脚本"
echo "=================================="

# 检查Node.js版本
echo "📋 检查Node.js版本..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js版本过低，需要18+，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js版本: $(node -v)"

# 检查pnpm
echo "📋 检查pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "📦 安装pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm版本: $(pnpm --version)"

# 安装依赖
echo "📦 安装项目依赖..."
pnpm install

# 创建环境变量文件
echo "⚙️  创建环境变量文件..."
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
# 数据库配置
DATABASE_URL="file:./dev.db"

# JWT密钥 (生产环境请使用强密钥)
JWT_SECRET="myanmar-survey-jwt-secret-$(openssl rand -hex 16)"

# 管理员账户
ADMIN_EMAIL="admin@myanmar-survey.com"
ADMIN_PASSWORD="admin123"
EOF
    echo "✅ 创建了 .env.local 文件"
else
    echo "ℹ️  .env.local 文件已存在"
fi

# 生成Prisma客户端
echo "🗄️  生成Prisma客户端..."
pnpm db:generate

# 创建数据库
echo "🗄️  创建数据库..."
pnpm db:push

# 初始化管理员账户
echo "👤 初始化管理员账户..."
npx tsx scripts/init-db.ts

echo ""
echo "🎉 设置完成！"
echo "=================================="
echo "📱 启动开发服务器: pnpm dev"
echo "🌐 调查问卷: http://localhost:3000"
echo "🔧 CMS管理: http://localhost:3000/admin"
echo "📧 管理员邮箱: admin@myanmar-survey.com"
echo "🔑 管理员密码: admin123"
echo ""
echo "⚠️  注意: 生产环境部署前请更改默认密码！" 