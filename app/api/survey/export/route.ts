import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // 构建查询条件
    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const responses = await prisma.surveyResponse.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    if (format === 'csv') {
      // 生成CSV格式
      const headers = [
        'ID',
        'Age',
        'Location',
        'City Name',
        'Occupation',
        'Occupation Other',
        'Will Vote',
        'Voting Factors',
        'Winning Party',
        'Competition Level',
        'Competition Other',
        'Interests',
        'Expectations',
        'Expectations Other',
        'Concerns',
        'Concerns Other',
        'Confidence',
        'Additional Comments',
        'IP Address',
        'Created At'
      ]

      const csvData = responses.map(response => [
        response.id,
        response.age,
        response.location,
        response.cityName || '',
        response.occupation,
        response.occupationOther || '',
        response.willVote,
        response.votingFactors,
        response.winningParty,
        response.competitionLevel,
        response.competitionOther || '',
        response.interests,
        response.expectations,
        response.expectationsOther || '',
        response.concerns,
        response.concernsOther || '',
        response.confidence,
        response.additionalComments || '',
        response.ipAddress || '',
        response.createdAt.toISOString()
      ])

      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="myanmar-survey-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // 默认返回JSON格式
    return NextResponse.json({ 
      responses,
      total: responses.length,
      exportDate: new Date().toISOString()
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'ဒေတာထုတ်ယူရာတွင် အမှားရှိနေပါသည်' },
      { status: 500 }
    )
  }
} 