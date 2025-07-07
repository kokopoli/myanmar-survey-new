import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'အီးမေးလ်နှင့် စကားဝှက်ကို ဖြည့်စွက်ပါ' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်' },
        { status: 401 }
      )
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်' },
        { status: 401 }
      )
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    // 设置cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'အကောင့်ဝင်ရောက်မှု အောင်မြင်ပါသည်',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      { status: 200 }
    )

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'အကောင့်ဝင်ရောက်မှုတွင် အမှားရှိနေပါသည်' },
      { status: 500 }
    )
  }
} 