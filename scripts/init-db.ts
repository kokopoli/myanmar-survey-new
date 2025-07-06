import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始初始化数据库...')

  // 创建管理员用户
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@myanmar-survey.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'မြန်မာစစ်တမ်း စီမံခန့်ခွဲသူ',
        role: 'ADMIN'
      }
    })

    console.log('✅ 管理员用户创建成功')
    console.log(`📧 邮箱: ${adminEmail}`)
    console.log(`🔑 密码: ${adminPassword}`)
  } else {
    console.log('ℹ️  管理员用户已存在')
  }

  console.log('🎉 数据库初始化完成!')
}

main()
  .catch((e) => {
    console.error('❌ 数据库初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 