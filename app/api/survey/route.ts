import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      age, 
      location, 
      cityName, 
      occupation, 
      occupationOther, 
      willVote, 
      votingFactors, 
      winningParty, 
      competitionLevel, 
      competitionOther, 
      interests, 
      expectations, 
      expectationsOther, 
      concerns, 
      concernsOther, 
      confidence, 
      additionalComments 
    } = body

    // 验证必填字段
    if (!age || !location || !occupation || !willVote || !winningParty || 
        !competitionLevel || !interests || !expectations || !concerns || !confidence) {
      return NextResponse.json(
        { error: 'ကျေးဇူးပြု၍ အားလုံးသော လိုအပ်သောအချက်များကို ဖြည့်စွက်ပါ' },
        { status: 400 }
      )
    }

    // 获取客户端信息
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // 保存到数据库
    const surveyResponse = await prisma.surveyResponse.create({
      data: {
        age,
        location,
        cityName: cityName || null,
        occupation,
        occupationOther: occupationOther || null,
        willVote,
        votingFactors: JSON.stringify(votingFactors),
        winningParty,
        competitionLevel,
        competitionOther: competitionOther || null,
        interests: JSON.stringify(interests),
        expectations,
        expectationsOther: expectationsOther || null,
        concerns: JSON.stringify(concerns),
        concernsOther: concernsOther || null,
        confidence,
        additionalComments: additionalComments || null,
        ipAddress,
        userAgent,
      },
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'စစ်တမ်းကောက်ယူမှု အောင်မြင်စွာ ပြီးဆုံးပါပြီ',
        id: surveyResponse.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Survey submission error:', error)
    return NextResponse.json(
      { error: 'စစ်တမ်းကောက်ယူမှုတွင် အမှားရှိနေပါသည်။ ကျေးဇူးပြု၍ ပြန်လည်ကြိုးစားပါ' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const responses = await prisma.surveyResponse.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // 限制返回最近100条记录
    })

    return NextResponse.json({ responses })
  } catch (error) {
    console.error('Error fetching survey responses:', error)
    return NextResponse.json(
      { error: 'ဒေတာရယူရာတွင် အမှားရှိနေပါသည်' },
      { status: 500 }
    )
  }
} 